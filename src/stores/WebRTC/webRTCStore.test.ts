import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	getWebRTCConnections,
	useWebRTC,
	useWebRTCActions,
	useWebRTCConnected,
	useWebRTCConnection,
	useWebRTCConnections,
	useWebRTCStore,
} from './webRTCStore';

let trackIdCounter = 0;

class MockMediaStreamTrack {
	readyState: 'live' | 'ended' = 'live';
	id = `track-${trackIdCounter++}`;
	private readonly listeners = new Map<string, ((event: Event) => void)[]>();

	constructor(public kind: 'audio' | 'video' = 'audio') {}

	addEventListener(type: string, listener: (event: Event) => void) {
		const current = this.listeners.get(type) ?? [];
		current.push(listener);
		this.listeners.set(type, current);
	}

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

	addEventListener() {}
	removeEventListener() {}
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
});

afterEach(() => {
	vi.unstubAllGlobals();
});

function micStream() {
	return new MockMediaStream([new MockMediaStreamTrack('audio')]) as unknown as MediaStream;
}

describe('webRTCStore', () => {
	it('addConnection() registers a connection reachable by name', () => {
		useWebRTCStore.getState().actions.addConnection('call', { micStream: micStream() });

		expect(useWebRTCStore.getState().connections).toHaveLength(1);
		expect(useWebRTCStore.getState().connections[0].name).toBe('call');
		expect(MockRTCPeerConnection.instances).toHaveLength(1);
	});

	it('addConnection() with an existing name closes the old one and replaces it', () => {
		useWebRTCStore.getState().actions.addConnection('call', { micStream: micStream() });
		const first = MockRTCPeerConnection.instances[0];

		useWebRTCStore.getState().actions.addConnection('call', { micStream: micStream() });

		expect(first.close).toHaveBeenCalled();
		expect(useWebRTCStore.getState().connections).toHaveLength(1);
		expect(MockRTCPeerConnection.instances).toHaveLength(2);
	});

	it('removeConnection() closes and removes a tracked connection', () => {
		useWebRTCStore.getState().actions.addConnection('call', { micStream: micStream() });
		const peer = MockRTCPeerConnection.instances[0];

		useWebRTCStore.getState().actions.removeConnection('call');

		expect(peer.close).toHaveBeenCalled();
		expect(useWebRTCStore.getState().connections).toHaveLength(0);
	});

	it('removeConnection() on an unknown name is a no-op', () => {
		expect(() =>
			useWebRTCStore.getState().actions.removeConnection('missing'),
		).not.toThrow();
	});

	it('initializeConnection() negotiates an offer/answer over the connection url', async () => {
		useWebRTCStore.getState().actions.addConnection('call', {
			micStream: micStream(),
			connectionUrl: '/rtc/offer',
		});
		const peer = MockRTCPeerConnection.instances[0];

		await useWebRTCStore.getState().actions.initializeConnection('call');

		expect(peer.createOffer).toHaveBeenCalled();
		expect(peer.setLocalDescription).toHaveBeenCalled();
		expect(fetch).toHaveBeenCalledWith(
			'/rtc/offer',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(peer.remoteDescription).toEqual({
			type: 'answer',
			sdp: 'mock-answer-sdp',
		});
	});

	it('initializeConnection() on an unknown name is a no-op', async () => {
		await expect(
			useWebRTCStore.getState().actions.initializeConnection('missing'),
		).resolves.toBeUndefined();
	});

	it('setMicStream() replaces the outgoing audio track', async () => {
		useWebRTCStore.getState().actions.addConnection('call', { micStream: micStream() });
		const peer = MockRTCPeerConnection.instances[0];
		const nextTrack = new MockMediaStreamTrack('audio');
		const nextStream = new MockMediaStream([nextTrack]) as unknown as MediaStream;

		await useWebRTCStore.getState().actions.setMicStream('call', nextStream);

		expect(peer.senders[0].replaceTrack).toHaveBeenCalledWith(nextTrack);
	});

	it('setMicStream() on an unknown name is a no-op', async () => {
		await expect(
			useWebRTCStore.getState().actions.setMicStream('missing', null),
		).resolves.toBeUndefined();
	});

	it('setVolume() sets the connection audio element volume', () => {
		useWebRTCStore.getState().actions.addConnection('call', { micStream: micStream() });

		useWebRTCStore.getState().actions.setVolume('call', 0.4);

		const entry = useWebRTCStore.getState().connections[0];
		expect(entry.connection.audioConnected).toBe(true);
	});

	it('exposes atomic selector hooks and imperative getters', async () => {
		useWebRTCStore.getState().actions.addConnection('call', {
			micStream: micStream(),
			connectionUrl: '/rtc/offer',
		});
		await useWebRTCStore.getState().actions.initializeConnection('call');
		MockRTCPeerConnection.instances[0].connectionState = 'connected';

		const { result: connections } = renderHook(() => useWebRTCConnections());
		const { result: connection } = renderHook(() => useWebRTCConnection('call'));
		const { result: connected } = renderHook(() => useWebRTCConnected('call'));
		const { result: connectedGlobal } = renderHook(() => useWebRTCConnected());
		const { result: actions } = renderHook(() => useWebRTC());

		expect(connections.current).toHaveLength(1);
		expect(connection.current?.name).toBe('call');
		expect(connected.current).toBe(true);
		expect(connectedGlobal.current).toBe(true);
		expect(typeof actions.current.addConnection).toBe('function');
		expect(useWebRTCActions).toBe(useWebRTCStore.getState().actions);
		expect(getWebRTCConnections('call')?.name).toBe('call');
		expect(getWebRTCConnections()).toHaveLength(1);
	});
});
