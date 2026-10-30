import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WebRTCConnection } from './WebRTCConnection';

let trackIdCounter = 0;

class MockMediaStreamTrack {
	readyState: 'live' | 'ended' = 'live';
	enabled = true;
	id = `track-${trackIdCounter++}`;
	private readonly listeners = new Map<string, ((event: Event) => void)[]>();

	constructor(public kind: 'audio' | 'video' = 'audio') {}

	addEventListener(type: string, listener: (event: Event) => void) {
		const current = this.listeners.get(type) ?? [];
		current.push(listener);
		this.listeners.set(type, current);
	}

	removeEventListener() {}

	dispatchEvent(type: string) {
		for (const listener of this.listeners.get(type) ?? []) {
			listener(new Event(type));
		}
	}

	stop() {
		this.readyState = 'ended';
	}
}

class MockMediaStream {
	id = `stream-${trackIdCounter++}`;
	private tracks: MockMediaStreamTrack[];

	constructor(tracks: MockMediaStreamTrack[] = []) {
		this.tracks = [...tracks];
	}

	getTracks() {
		return this.tracks;
	}
	getAudioTracks() {
		return this.tracks.filter((t) => t.kind === 'audio');
	}
	getVideoTracks() {
		return this.tracks.filter((t) => t.kind === 'video');
	}
	addTrack(track: MockMediaStreamTrack) {
		this.tracks.push(track);
	}
	removeTrack(track: MockMediaStreamTrack) {
		this.tracks = this.tracks.filter((t) => t !== track);
	}
}

class MockRTCRtpSender {
	replaceTrack = vi.fn(async (track: MockMediaStreamTrack | null) => {
		this.track = track;
	});
	constructor(public track: MockMediaStreamTrack | null) {}
}

class MockRTCDataChannel {
	readyState: 'connecting' | 'open' | 'closed' = 'open';
	send = vi.fn();
	private readonly listeners = new Map<string, ((event: Event) => void)[]>();

	constructor(public label: string) {}

	addEventListener(type: string, listener: (event: Event) => void) {
		const current = this.listeners.get(type) ?? [];
		current.push(listener);
		this.listeners.set(type, current);
	}

	dispatch(type: string, event: Event) {
		for (const listener of this.listeners.get(type) ?? []) {
			listener(event);
		}
	}
}

class MockRTCPeerConnection {
	static instances: MockRTCPeerConnection[] = [];

	connectionState: RTCPeerConnectionState = 'new';
	iceGatheringState: RTCIceGatheringState = 'complete';
	remoteDescription: RTCSessionDescriptionInit | null = null;
	localDescription: RTCSessionDescriptionInit | null = null;
	ontrack: ((event: unknown) => void) | null = null;
	senders: MockRTCRtpSender[] = [];
	dataChannels: MockRTCDataChannel[] = [];
	private readonly listeners = new Map<string, (() => void)[]>();

	createOffer = vi.fn(async () => ({ type: 'offer', sdp: 'mock-offer-sdp' }));
	setLocalDescription = vi.fn(async (desc: RTCSessionDescriptionInit) => {
		this.localDescription = desc;
	});
	setRemoteDescription = vi.fn(async (desc: RTCSessionDescriptionInit) => {
		this.remoteDescription = desc;
	});
	close = vi.fn(() => {
		this.connectionState = 'closed';
	});

	constructor() {
		MockRTCPeerConnection.instances.push(this);
	}

	addTrack(track: MockMediaStreamTrack, _stream: MockMediaStream) {
		const sender = new MockRTCRtpSender(track);
		this.senders.push(sender);
		return sender;
	}

	removeTrack(sender: MockRTCRtpSender) {
		this.senders = this.senders.filter((s) => s !== sender);
	}

	createDataChannel(label: string) {
		const channel = new MockRTCDataChannel(label);
		this.dataChannels.push(channel);
		return channel;
	}

	addEventListener(type: string, listener: () => void) {
		const current = this.listeners.get(type) ?? [];
		current.push(listener);
		this.listeners.set(type, current);
	}

	removeEventListener(type: string, listener: () => void) {
		this.listeners.set(
			type,
			(this.listeners.get(type) ?? []).filter((entry) => entry !== listener),
		);
	}

	emitIceGatheringStateChange() {
		for (const listener of this.listeners.get('icegatheringstatechange') ?? []) {
			listener();
		}
	}
}

beforeEach(() => {
	trackIdCounter = 0;
	MockRTCPeerConnection.instances = [];
	vi.stubGlobal('RTCPeerConnection', MockRTCPeerConnection);
	vi.stubGlobal('MediaStream', MockMediaStream);
	vi.stubGlobal(
		'fetch',
		vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			statusText: 'OK',
			text: async () => 'mock-answer-sdp',
		}),
	);
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.useRealTimers();
});

function micStream() {
	return new MockMediaStream([new MockMediaStreamTrack('audio')]) as unknown as MediaStream;
}

function peer() {
	return MockRTCPeerConnection.instances[0];
}

describe('WebRTCConnection', () => {
	it('throws when constructed outside a browser environment', () => {
		const originalDocument = globalThis.document;
		// @ts-expect-error - simulate a non-browser environment
		delete globalThis.document;

		expect(() => new WebRTCConnection({ micStream: micStream() })).toThrow('RTC needs a valid browser environment');

		globalThis.document = originalDocument;
	});

	it('throws when neither a mic stream nor a mic track is provided', () => {
		expect(
			() =>
				new WebRTCConnection({
					micStream: new MockMediaStream([]) as unknown as MediaStream,
				}),
		).toThrow('WebRTCConnection requires a microphone stream or track');
	});

	it('accepts a mic track option directly', () => {
		const track = new MockMediaStreamTrack('audio') as unknown as MediaStreamTrack;
		const connection = new WebRTCConnection({ micTrack: track });

		expect(connection.audioConnected).toBe(true);
	});

	it('sets the initial volume when provided', () => {
		const connection = new WebRTCConnection({ micStream: micStream(), volume: 0.4 });
		const audioElement = (connection as unknown as { audioElement: HTMLAudioElement }).audioElement;

		expect(audioElement.volume).toBe(0.4);
		expect(connection.connected).toBe(false);
	});

	it('sets up requested data channels', () => {
		new WebRTCConnection({ micStream: micStream(), dataChannels: ['chat', 'control'] });

		expect(peer().dataChannels.map((channel) => channel.label)).toEqual(['chat', 'control']);
	});

	it('accepts a single data channel name as a string', () => {
		new WebRTCConnection({ micStream: micStream(), dataChannels: 'chat' });

		expect(peer().dataChannels.map((channel) => channel.label)).toEqual(['chat']);
	});

	describe('initialize / negotiate', () => {
		it('throws when there is no connection url', async () => {
			const connection = new WebRTCConnection({ micStream: micStream() });

			await expect(connection.initialize()).rejects.toThrow('Peer connection url not provided');
		});

		it('negotiates an offer/answer and sets the remote description', async () => {
			const connection = new WebRTCConnection({
				micStream: micStream(),
				connectionUrl: '/rtc/offer',
			});

			await connection.initialize();

			expect(peer().createOffer).toHaveBeenCalled();
			expect(peer().setLocalDescription).toHaveBeenCalled();
			expect(fetch).toHaveBeenCalledWith('/rtc/offer', expect.objectContaining({ method: 'POST' }));
			expect(peer().remoteDescription).toEqual({ type: 'answer', sdp: 'mock-answer-sdp' });
		});

		it('sends an authorization header when a bearer token is provided', async () => {
			const connection = new WebRTCConnection({
				micStream: micStream(),
				connectionUrl: '/rtc/offer',
			});

			await connection.initialize(undefined, 'my-token');

			expect(fetch).toHaveBeenCalledWith(
				'/rtc/offer',
				expect.objectContaining({
					headers: expect.objectContaining({ Authorization: 'Bearer my-token' }),
				}),
			);
		});

		it('throws when the sdp response is not ok', async () => {
			vi.stubGlobal(
				'fetch',
				vi.fn().mockResolvedValue({ ok: false, status: 500, statusText: 'Server Error' }),
			);
			const connection = new WebRTCConnection({
				micStream: micStream(),
				connectionUrl: '/rtc/offer',
			});

			await expect(connection.initialize()).rejects.toThrow(/Status: 500/);
		});

		it('waits for ICE gathering to complete before sending the offer', async () => {
			const connection = new WebRTCConnection({
				micStream: micStream(),
				connectionUrl: '/rtc/offer',
			});
			peer().iceGatheringState = 'gathering';

			const initializePromise = connection.initialize();
			// fetch should not have been called until gathering completes
			await Promise.resolve();
			await Promise.resolve();
			expect(fetch).not.toHaveBeenCalled();

			peer().iceGatheringState = 'complete';
			peer().emitIceGatheringStateChange();

			await initializePromise;
			expect(fetch).toHaveBeenCalled();
		});

		it('rejects if ICE gathering times out', async () => {
			vi.useFakeTimers();
			const connection = new WebRTCConnection({
				micStream: micStream(),
				connectionUrl: '/rtc/offer',
			});
			peer().iceGatheringState = 'gathering';

			const initializePromise = connection.initialize();
			const assertion = expect(initializePromise).rejects.toThrow('ICE gathering timed out');
			await vi.advanceTimersByTimeAsync(5000);
			await assertion;
		});
	});

	describe('screen share', () => {
		function withDisplayMedia(track: MockMediaStreamTrack | null) {
			vi.stubGlobal('navigator', {
				mediaDevices: {
					getDisplayMedia: vi.fn().mockResolvedValue(new MockMediaStream(track ? [track] : [])),
				},
			});
		}

		it('throws when getDisplayMedia is not supported', async () => {
			vi.stubGlobal('navigator', {});
			const connection = new WebRTCConnection({ micStream: micStream() });

			await expect(connection.startScreenShare()).rejects.toThrow('Screen share is not supported in this browser');
		});

		it('throws when no video track is returned', async () => {
			withDisplayMedia(null);
			const connection = new WebRTCConnection({ micStream: micStream() });

			await expect(connection.startScreenShare()).rejects.toThrow('No screen share video track was provided');
		});

		it('starts a screen share and adds a track to the peer connection', async () => {
			withDisplayMedia(new MockMediaStreamTrack('video'));
			const connection = new WebRTCConnection({ micStream: micStream() });

			await connection.startScreenShare();

			expect(peer().senders).toHaveLength(2);
			expect(connection.videoConnected).toBe(true);
		});

		it('is a no-op when a screen share is already active', async () => {
			withDisplayMedia(new MockMediaStreamTrack('video'));
			const connection = new WebRTCConnection({ micStream: micStream() });

			await connection.startScreenShare();
			const sendersAfterFirstShare = peer().senders.length;
			await connection.startScreenShare();

			expect(peer().senders).toHaveLength(sendersAfterFirstShare);
		});

		it('renegotiates when starting a screen share on an already-connected peer', async () => {
			withDisplayMedia(new MockMediaStreamTrack('video'));
			const connection = new WebRTCConnection({
				micStream: micStream(),
				connectionUrl: '/rtc/offer',
			});
			await connection.initialize();
			(peer().createOffer as ReturnType<typeof vi.fn>).mockClear();

			await connection.startScreenShare();

			expect(peer().createOffer).toHaveBeenCalled();
		});

		it('stops the screen share track and removes it from the connection', async () => {
			const track = new MockMediaStreamTrack('video');
			withDisplayMedia(track);
			const connection = new WebRTCConnection({ micStream: micStream() });
			await connection.startScreenShare();
			const sendersAfterShare = peer().senders.length;

			await connection.stopScreenShare();

			expect(peer().senders).toHaveLength(sendersAfterShare - 1);
			expect(track.readyState).toBe('ended');
		});

		it('stops the screen share without stopping the track when requested', async () => {
			const track = new MockMediaStreamTrack('video');
			withDisplayMedia(track);
			const connection = new WebRTCConnection({ micStream: micStream() });
			await connection.startScreenShare();

			await connection.stopScreenShare(false);

			expect(track.readyState).toBe('live');
		});

		it('is a no-op to stop a screen share that was never started', async () => {
			const connection = new WebRTCConnection({ micStream: micStream() });

			await expect(connection.stopScreenShare()).resolves.toBeUndefined();
		});
	});

	describe('data channels', () => {
		it('sends a JSON-serialized payload over a named open channel', () => {
			const connection = new WebRTCConnection({ micStream: micStream(), dataChannels: 'chat' });

			connection.sendMessage('chat', { hello: 'world' });

			expect(peer().dataChannels[0].send).toHaveBeenCalledWith(JSON.stringify({ hello: 'world' }));
		});

		it('throws when the named channel does not exist', () => {
			const connection = new WebRTCConnection({ micStream: micStream() });

			expect(() => connection.sendMessage('missing', 'data')).toThrow('Data channel "missing" not found');
		});

		it('throws when the named channel is not open', () => {
			const connection = new WebRTCConnection({ micStream: micStream(), dataChannels: 'chat' });
			peer().dataChannels[0].readyState = 'connecting';

			expect(() => connection.sendMessage('chat', 'data')).toThrow(/is not open/);
		});

		it('invokes onDataChannelEvent for message/open/close/error events', () => {
			const onDataChannelEvent = vi.fn();
			const connection = new WebRTCConnection({
				micStream: micStream(),
				dataChannels: 'chat',
				onDataChannelEvent,
			});
			const channel = peer().dataChannels[0];
			const messageEvent = new MessageEvent('message', { data: 'hi' });

			channel.dispatch('message', messageEvent);
			channel.dispatch('open', new Event('open'));
			channel.dispatch('close', new Event('close'));
			channel.dispatch('error', new Event('error'));

			expect(onDataChannelEvent).toHaveBeenCalledWith('chat', 'message', messageEvent);
			expect(onDataChannelEvent).toHaveBeenCalledWith('chat', 'open', expect.any(Event));
			expect(onDataChannelEvent).toHaveBeenCalledWith('chat', 'close', expect.any(Event));
			expect(onDataChannelEvent).toHaveBeenCalledWith('chat', 'error', expect.any(Event));
			expect(connection.dataConnected).toBe(true);
		});
	});

	describe('audio controls', () => {
		it('mutes/unmutes all audio playback via the audio element', () => {
			const connection = new WebRTCConnection({ micStream: micStream() });
			const audioElement = (connection as unknown as { audioElement: HTMLAudioElement }).audioElement;

			connection.muteAllAudio(true);
			expect(audioElement.muted).toBe(true);
			connection.muteAllAudio(false);
			expect(audioElement.muted).toBe(false);
		});

		it('clamps the volume between 0 and 1', () => {
			const connection = new WebRTCConnection({ micStream: micStream() });
			const audioElement = (connection as unknown as { audioElement: HTMLAudioElement }).audioElement;

			connection.setVolume(2);
			expect(audioElement.volume).toBe(1);
			connection.setVolume(-1);
			expect(audioElement.volume).toBe(0);
		});

		it('throws muting an unknown remote audio track', () => {
			const connection = new WebRTCConnection({ micStream: micStream() });

			expect(() => connection.muteAudioTrack('missing', true)).toThrow('Audio track "missing" not found');
		});

		it('mutes a known remote audio track via onTrack', () => {
			const connection = new WebRTCConnection({ micStream: micStream() });
			const remoteTrack = new MockMediaStreamTrack('audio');
			const remoteStream = new MockMediaStream([remoteTrack]);
			peer().ontrack?.({ track: remoteTrack, streams: [remoteStream] });

			connection.muteAudioTrack(remoteTrack.id, true);

			expect(remoteTrack.enabled).toBe(false);
		});
	});

	describe('onTrack', () => {
		it('ignores track events with no stream', () => {
			const onRemoteVideoStream = vi.fn();
			const onRemoteAudioStream = vi.fn();
			new WebRTCConnection({ micStream: micStream(), onRemoteVideoStream, onRemoteAudioStream });

			peer().ontrack?.({ track: new MockMediaStreamTrack('video'), streams: [] });

			expect(onRemoteVideoStream).not.toHaveBeenCalled();
			expect(onRemoteAudioStream).not.toHaveBeenCalled();
		});

		it('adds a new remote video stream and notifies once per stream id', () => {
			const onRemoteVideoStream = vi.fn();
			new WebRTCConnection({ micStream: micStream(), onRemoteVideoStream });
			const videoTrack = new MockMediaStreamTrack('video');
			const videoStream = new MockMediaStream([videoTrack]);

			peer().ontrack?.({ track: videoTrack, streams: [videoStream] });
			peer().ontrack?.({ track: videoTrack, streams: [videoStream] });

			expect(onRemoteVideoStream).toHaveBeenCalledTimes(1);
		});

		it('adds a new remote audio track and notifies once per track id', () => {
			const onRemoteAudioStream = vi.fn();
			const connection = new WebRTCConnection({ micStream: micStream(), onRemoteAudioStream });
			const audioTrack = new MockMediaStreamTrack('audio');
			const audioStream = new MockMediaStream([audioTrack]);

			peer().ontrack?.({ track: audioTrack, streams: [audioStream] });
			peer().ontrack?.({ track: audioTrack, streams: [audioStream] });

			expect(onRemoteAudioStream).toHaveBeenCalledTimes(1);
			expect(connection.audioConnected).toBe(true);
		});
	});

	describe('replaceAudioTrack / setOutgoingAudioStream', () => {
		it('replaces the track on the existing sender', async () => {
			const connection = new WebRTCConnection({ micStream: micStream() });
			const nextTrack = new MockMediaStreamTrack('audio') as unknown as MediaStreamTrack;

			await connection.replaceAudioTrack(nextTrack);

			expect(peer().senders[0].replaceTrack).toHaveBeenCalledWith(nextTrack);
		});

		it('does not renegotiate when a sender already exists (replaceTrack is renegotiation-free)', async () => {
			const connection = new WebRTCConnection({
				micStream: micStream(),
				connectionUrl: '/rtc/offer',
			});
			await connection.initialize();
			(peer().createOffer as ReturnType<typeof vi.fn>).mockClear();

			await connection.replaceAudioTrack(new MockMediaStreamTrack('audio') as unknown as MediaStreamTrack);

			expect(peer().createOffer).not.toHaveBeenCalled();
		});

		it('sets the outgoing audio stream from the first audio track', async () => {
			const connection = new WebRTCConnection({ micStream: micStream() });
			const nextStream = new MockMediaStream([new MockMediaStreamTrack('audio')]) as unknown as MediaStream;

			await connection.setOutgoingAudioStream(nextStream);

			expect(peer().senders[0].replaceTrack).toHaveBeenCalled();
		});

		it('clears the outgoing audio stream when passed null', async () => {
			const connection = new WebRTCConnection({ micStream: micStream() });

			await connection.setOutgoingAudioStream(null);

			expect(peer().senders[0].replaceTrack).toHaveBeenCalledWith(null);
		});
	});

	describe('close', () => {
		it('tears down senders, tracks, and the peer connection', () => {
			const connection = new WebRTCConnection({ micStream: micStream(), dataChannels: 'chat' });

			connection.close();

			expect(peer().senders).toHaveLength(0);
			expect(peer().close).toHaveBeenCalled();
		});

		it('clears any pending ICE gathering timer', async () => {
			vi.useFakeTimers();
			const connection = new WebRTCConnection({
				micStream: micStream(),
				connectionUrl: '/rtc/offer',
			});
			peer().iceGatheringState = 'gathering';
			const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
			const initializePromise = connection.initialize();
			initializePromise.catch(() => {});
			// flush the microtasks for createOffer/setLocalDescription so the ICE
			// gathering timer has actually been scheduled before closing
			await Promise.resolve();
			await Promise.resolve();

			connection.close();

			expect(clearTimeoutSpy).toHaveBeenCalled();
			expect(peer().close).toHaveBeenCalled();
		});

		it('removes the screen share sender on close when active', async () => {
			vi.stubGlobal('navigator', {
				mediaDevices: {
					getDisplayMedia: vi.fn().mockResolvedValue(new MockMediaStream([new MockMediaStreamTrack('video')])),
				},
			});
			const connection = new WebRTCConnection({ micStream: micStream() });
			await connection.startScreenShare();

			connection.close();

			expect(peer().senders).toHaveLength(0);
		});
	});

	describe('createIncomingAudioSource', () => {
		it('creates a media stream source from the unified receiver audio stream', () => {
			const connection = new WebRTCConnection({ micStream: micStream() });
			const createMediaStreamSource = vi.fn().mockReturnValue('source-node');
			const audioContext = { createMediaStreamSource } as unknown as AudioContext;

			const source = connection.createIncomingAudioSource(audioContext);

			expect(createMediaStreamSource).toHaveBeenCalled();
			expect(source).toBe('source-node');
		});
	});
});
