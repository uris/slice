import { act, renderHook, waitFor } from '@testing-library/react';
import type { RefObject } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMicrophoneStore } from '../../stores/microphone/microphoneStore';
import { useVolumeStore } from '../../stores/volume/volumeStore';
import { useWebRTCStore } from '../../stores/WebRTC/webRTCStore';
import { useBindWebRTC } from './useBindWebRTC';

let trackIdCounter = 0;

class MockMediaStreamTrack {
	readyState: 'live' | 'ended' = 'live';
	id = `track-${trackIdCounter++}`;

	constructor(public kind: 'audio' | 'video' = 'audio') {}

	addEventListener() {}
	removeEventListener() {}
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

class MockRTCPeerConnection {
	static instances: MockRTCPeerConnection[] = [];

	connectionState: RTCPeerConnectionState = 'new';
	iceGatheringState: RTCIceGatheringState = 'complete';
	remoteDescription: RTCSessionDescriptionInit | null = null;
	localDescription: RTCSessionDescriptionInit | null = null;
	ontrack: ((event: unknown) => void) | null = null;
	senders: MockRTCRtpSender[] = [];

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
		return { label, readyState: 'open', addEventListener: () => {}, send: vi.fn() };
	}

	addEventListener() {}
	removeEventListener() {}
}

function micStream() {
	return new MockMediaStream([new MockMediaStreamTrack('audio')]) as unknown as MediaStream;
}

function micStreamRef(stream: MediaStream | null): RefObject<MediaStream | null> {
	return { current: stream };
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
	useWebRTCStore.setState({ connections: [] });
	useMicrophoneStore.setState({ processedMicStream: micStreamRef(micStream()) });
	useVolumeStore.setState({ volume: 1 });
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('useBindWebRTC', () => {
	it('starts unbound with no connection', () => {
		const { result } = renderHook(() => useBindWebRTC({ connectionName: 'call' }));

		expect(result.current.bound).toBe(false);
		expect(result.current.connection).toBeNull();
		expect(result.current.error).toBeNull();
	});

	it('bind() fails with no processed microphone stream', async () => {
		useMicrophoneStore.setState({ processedMicStream: micStreamRef(null) });
		const { result } = renderHook(() => useBindWebRTC({ connectionName: 'call' }));

		let bindResult: unknown;
		await act(async () => {
			bindResult = await result.current.bind();
		});

		expect(bindResult).toBeNull();
		expect(result.current.error?.message).toBe('No processed microphone stream available');
		expect(result.current.bound).toBe(false);
	});

	it('bind() succeeds, registers the connection, and initializes it', async () => {
		const { result } = renderHook(() => useBindWebRTC({ connectionName: 'call', connectionUrl: '/rtc/offer' }));

		await act(async () => {
			await result.current.bind();
		});

		await waitFor(() => expect(result.current.bound).toBe(true));
		expect(result.current.connection).not.toBeNull();
		expect(result.current.error).toBeNull();
		expect(useWebRTCStore.getState().connections).toHaveLength(1);
		expect(MockRTCPeerConnection.instances[0].setRemoteDescription).toHaveBeenCalled();
	});

	it('bind() fails when a connection with that name already exists', async () => {
		useWebRTCStore.getState().actions.addConnection('call', { micStream: micStream() });
		const { result } = renderHook(() => useBindWebRTC({ connectionName: 'call' }));

		let bindResult: unknown;
		await act(async () => {
			bindResult = await result.current.bind();
		});

		expect(result.current.error?.message).toBe('WebRTC connection "call" already exists');
		// the pre-existing connection is returned, but ownership is not claimed
		expect(bindResult).not.toBeNull();
		expect(result.current.bound).toBe(false);
	});

	it('bind() rolls back and reports an error when initialization fails', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
		const { result } = renderHook(() => useBindWebRTC({ connectionName: 'call', connectionUrl: '/rtc/offer' }));

		await act(async () => {
			await result.current.bind();
		});

		expect(result.current.error?.message).toBe('network down');
		expect(result.current.bound).toBe(false);
		expect(useWebRTCStore.getState().connections).toHaveLength(0);
	});

	it('unbind() removes an owned connection and resets state', async () => {
		const { result } = renderHook(() => useBindWebRTC({ connectionName: 'call', connectionUrl: '/rtc/offer' }));

		await act(async () => {
			await result.current.bind();
		});
		await waitFor(() => expect(result.current.bound).toBe(true));

		act(() => {
			result.current.unbind();
		});

		expect(result.current.bound).toBe(false);
		expect(useWebRTCStore.getState().connections).toHaveLength(0);
	});

	it('unbind() on a connection the hook does not own is a no-op for the store', async () => {
		useWebRTCStore.getState().actions.addConnection('call', { micStream: micStream() });
		const { result } = renderHook(() => useBindWebRTC({ connectionName: 'call' }));

		act(() => {
			result.current.unbind();
		});

		// the hook never claimed ownership (bind() was never called), so the
		// pre-existing connection must be left alone
		expect(useWebRTCStore.getState().connections).toHaveLength(1);
	});

	it('removes an owned connection on unmount', async () => {
		const { result, unmount } = renderHook(() => useBindWebRTC({ connectionName: 'call', connectionUrl: '/rtc/offer' }));

		await act(async () => {
			await result.current.bind();
		});
		await waitFor(() => expect(result.current.bound).toBe(true));

		unmount();

		expect(useWebRTCStore.getState().connections).toHaveLength(0);
	});

	it('does not touch the store on unmount when never bound', () => {
		useWebRTCStore.getState().actions.addConnection('call', { micStream: micStream() });
		const { unmount } = renderHook(() => useBindWebRTC({ connectionName: 'call' }));

		unmount();

		expect(useWebRTCStore.getState().connections).toHaveLength(1);
	});

	it('propagates mic stream changes to the bound connection once bound', async () => {
		const { result, rerender } = renderHook(() => useBindWebRTC({ connectionName: 'call', connectionUrl: '/rtc/offer' }));

		await act(async () => {
			await result.current.bind();
		});
		await waitFor(() => expect(result.current.bound).toBe(true));
		const peer = MockRTCPeerConnection.instances[0];

		const nextTrack = new MockMediaStreamTrack('audio');
		act(() => {
			useMicrophoneStore.setState({
				processedMicStream: micStreamRef(new MockMediaStream([nextTrack]) as unknown as MediaStream),
			});
		});
		rerender();

		await waitFor(() => expect(peer.senders[0]?.replaceTrack).toHaveBeenCalledWith(nextTrack));
	});

	it('propagates volume changes to the bound connection once bound', async () => {
		const { result, rerender } = renderHook(() => useBindWebRTC({ connectionName: 'call', connectionUrl: '/rtc/offer' }));

		await act(async () => {
			await result.current.bind();
		});
		await waitFor(() => expect(result.current.bound).toBe(true));

		act(() => {
			useVolumeStore.setState({ volume: 0.3 });
		});
		rerender();

		const connection = useWebRTCStore.getState().connections[0]?.connection;
		expect(connection?.audioConnected).toBe(true);
	});

	it('surfaces an error if updating the mic stream fails while bound', async () => {
		const { result, rerender } = renderHook(() => useBindWebRTC({ connectionName: 'call', connectionUrl: '/rtc/offer' }));

		await act(async () => {
			await result.current.bind();
		});
		await waitFor(() => expect(result.current.bound).toBe(true));

		const connection = useWebRTCStore.getState().connections[0]?.connection;
		if (!connection) throw new Error('expected a bound connection');
		vi.spyOn(connection, 'setOutgoingAudioStream').mockRejectedValue(new Error('replace failed'));

		act(() => {
			useMicrophoneStore.setState({ processedMicStream: micStreamRef(micStream()) });
		});
		rerender();

		await waitFor(() => expect(result.current.error?.message).toBe('replace failed'));
	});
});
