import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMicrophone } from './useMicrophone';

type Listener = (event: Event) => void;

class MockMediaStreamTrack {
	kind = 'audio';
	label = 'Mock Mic';
	enabled = true;
	readyState: 'live' | 'ended' = 'live';
	muted = false;
	private readonly listeners = new Map<string, Listener[]>();

	addEventListener(type: string, listener: Listener) {
		const current = this.listeners.get(type) ?? [];
		current.push(listener);
		this.listeners.set(type, current);
	}

	removeEventListener(type: string, listener: Listener) {
		const current = this.listeners.get(type) ?? [];
		this.listeners.set(
			type,
			current.filter((existing) => existing !== listener),
		);
	}

	dispatch(type: string) {
		for (const listener of this.listeners.get(type) ?? [])
			listener(new Event(type));
	}

	stop() {
		this.readyState = 'ended';
	}

	getSettings() {
		return { deviceId: 'device-1' };
	}
}

class MockMediaStream {
	private readonly tracks: MockMediaStreamTrack[];

	constructor(tracks: MockMediaStreamTrack[] = [new MockMediaStreamTrack()]) {
		this.tracks = tracks;
	}

	getTracks() {
		return this.tracks;
	}

	getAudioTracks() {
		return this.tracks;
	}
}

class MockAudioNode {
	connect = vi.fn();
	disconnect = vi.fn();
}

class MockGainNode extends MockAudioNode {
	gain = { value: 1 };
}

class MockAudioContext {
	createMediaStreamSource = vi.fn(() => new MockAudioNode());
	createGain = vi.fn(() => new MockGainNode());
	createMediaStreamDestination = vi.fn(() => ({
		...new MockAudioNode(),
		stream: new MockMediaStream(),
	}));
	close = vi.fn().mockResolvedValue(undefined);
}

function mockDevice(deviceId: string, label = `Mic ${deviceId}`) {
	return {
		deviceId,
		kind: 'audioinput',
		label,
		groupId: 'g',
	} as MediaDeviceInfo;
}

let getUserMedia: ReturnType<typeof vi.fn>;
let enumerateDevices: ReturnType<typeof vi.fn>;

function setMediaDevices(value: unknown) {
	Object.defineProperty(navigator, 'mediaDevices', {
		configurable: true,
		value,
	});
}

beforeEach(() => {
	getUserMedia = vi.fn().mockResolvedValue(new MockMediaStream());
	enumerateDevices = vi.fn().mockResolvedValue([mockDevice('device-1')]);
	setMediaDevices({
		getUserMedia,
		enumerateDevices,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	});
	vi.stubGlobal('AudioContext', MockAudioContext);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('useMicrophone', () => {
	it('reports media support based on navigator.mediaDevices', () => {
		const { result } = renderHook(() => useMicrophone(true, undefined, false));
		expect(result.current.isSupported).toBe(true);
	});

	it('with autoRequest=false only refreshes the device list on mount', async () => {
		const { result } = renderHook(() => useMicrophone(true, undefined, false));

		await waitFor(() => expect(result.current.micOptions).toHaveLength(1));
		expect(getUserMedia).not.toHaveBeenCalled();
		expect(result.current.isActive).toBe(false);
	});

	it('with autoRequest=true requests the microphone and starts muted by default', async () => {
		const { result } = renderHook(() => useMicrophone(true, undefined, true));

		await waitFor(() => expect(result.current.isActive).toBe(true));
		expect(getUserMedia).toHaveBeenCalled();
		expect(result.current.muted).toBe(true);
	});

	it('muteMic()/unmuteMic() toggle the live track and muted state', async () => {
		const { result } = renderHook(() => useMicrophone(false, undefined, true));
		await waitFor(() => expect(result.current.isActive).toBe(true));
		expect(result.current.muted).toBe(false);

		act(() => {
			result.current.muteMic();
		});
		expect(result.current.muted).toBe(true);

		act(() => {
			result.current.unmuteMic();
		});
		expect(result.current.muted).toBe(false);
	});

	it('toggleMute() flips based on the current muted state', async () => {
		const { result } = renderHook(() => useMicrophone(false, undefined, true));
		await waitFor(() => expect(result.current.isActive).toBe(true));

		act(() => {
			result.current.toggleMute();
		});
		expect(result.current.muted).toBe(true);
	});

	it('setInputVolume() clamps and applies the gain value', async () => {
		const { result } = renderHook(() => useMicrophone(false, undefined, true));
		await waitFor(() => expect(result.current.isActive).toBe(true));

		act(() => {
			result.current.setInputVolume(5);
		});
		expect(result.current.inputVolume).toBe(1);

		act(() => {
			result.current.setInputVolume(-2);
		});
		expect(result.current.inputVolume).toBe(0);
	});

	it('requestMicrophone() reports an error when unsupported', async () => {
		setMediaDevices(undefined);
		const { result } = renderHook(() => useMicrophone(true, undefined, false));
		expect(result.current.isSupported).toBe(false);

		let stream: MediaStream | null = null;
		await act(async () => {
			stream = await result.current.requestMicrophone();
		});

		expect(stream).toBeNull();
		expect(result.current.error?.message).toBe(
			`Microphone access isn't supported`,
		);
	});

	it('stopMicrophone() stops tracks and clears active state', async () => {
		const { result } = renderHook(() => useMicrophone(false, undefined, true));
		await waitFor(() => expect(result.current.isActive).toBe(true));

		act(() => {
			result.current.stopMicrophone();
		});

		expect(result.current.isActive).toBe(false);
		expect(result.current.micStream.current).toBeNull();
	});

	it('setMicrophone() requests a stream for the given device', async () => {
		const { result } = renderHook(() => useMicrophone(false, undefined, false));
		await waitFor(() =>
			expect(result.current.micOptions.length).toBeGreaterThan(0),
		);

		await act(async () => {
			await result.current.setMicrophone('device-1');
		});

		expect(getUserMedia).toHaveBeenCalled();
		expect(result.current.isActive).toBe(true);
	});
});
