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

	constructor(private readonly deviceId = 'device-1') {}

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
		return { deviceId: this.deviceId };
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
	static instances: MockAudioContext[] = [];
	createMediaStreamSource = vi.fn(() => new MockAudioNode());
	createGain = vi.fn(() => new MockGainNode());
	createMediaStreamDestination = vi.fn(() => ({
		...new MockAudioNode(),
		stream: new MockMediaStream(),
	}));
	close = vi.fn().mockResolvedValue(undefined);

	constructor() {
		MockAudioContext.instances.push(this);
	}
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
let deviceChangeHandler: (() => void) | undefined;

function setMediaDevices(value: unknown) {
	Object.defineProperty(navigator, 'mediaDevices', {
		configurable: true,
		value,
	});
}

beforeEach(() => {
	deviceChangeHandler = undefined;
	MockAudioContext.instances = [];
	getUserMedia = vi.fn().mockResolvedValue(new MockMediaStream());
	enumerateDevices = vi.fn().mockResolvedValue([mockDevice('device-1')]);
	setMediaDevices({
		getUserMedia,
		enumerateDevices,
		addEventListener: vi.fn((event: string, handler: () => void) => {
			if (event === 'devicechange') deviceChangeHandler = handler;
		}),
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

	it('setInputVolume() falls back to 1 for a non-finite value', async () => {
		const { result } = renderHook(() => useMicrophone(false, undefined, true));
		await waitFor(() => expect(result.current.isActive).toBe(true));

		act(() => {
			result.current.setInputVolume(Number.NaN);
		});
		expect(result.current.inputVolume).toBe(1);
	});

	it('toggleMute() is a safe no-op when there is no active microphone track', () => {
		const { result } = renderHook(() => useMicrophone(true, undefined, false));
		expect(() => result.current.toggleMute()).not.toThrow();
	});

	describe('prioritizeDefaultMicrophone (exercised through refreshMicrophones)', () => {
		it('moves a "default" device to the front when it is not already first', async () => {
			enumerateDevices.mockResolvedValue([mockDevice('device-1'), mockDevice('default')]);
			const { result } = renderHook(() => useMicrophone(true, undefined, false));

			await waitFor(() => expect(result.current.micOptions).toHaveLength(2));
			expect(result.current.micOptions[0]?.value?.id).toBe('default');
		});

		it('leaves the list alone when "default" is already first', async () => {
			enumerateDevices.mockResolvedValue([mockDevice('default'), mockDevice('device-1')]);
			const { result } = renderHook(() => useMicrophone(true, undefined, false));

			await waitFor(() => expect(result.current.micOptions).toHaveLength(2));
			expect(result.current.micOptions[0]?.value?.id).toBe('default');
		});

		it('reprioritizes the active device to the front when there is no "default" device', async () => {
			getUserMedia.mockImplementation((constraints?: MediaStreamConstraints) => {
				const audio = constraints?.audio as { deviceId?: { exact?: string } } | undefined;
				const deviceId = audio?.deviceId?.exact ?? 'device-1';
				return Promise.resolve(new MockMediaStream([new MockMediaStreamTrack(deviceId)]));
			});
			enumerateDevices.mockResolvedValue([mockDevice('device-1'), mockDevice('device-2')]);

			const { result } = renderHook(() => useMicrophone(false, undefined, false));
			await waitFor(() => expect(result.current.micOptions.length).toBe(2));

			await act(async () => {
				await result.current.setMicrophone('device-2');
			});

			await waitFor(() => expect(result.current.micOptions[0]?.value?.id).toBe('device-2'));
		});
	});

	describe('audio processing setup', () => {
		it('falls back to the raw stream when no AudioContext constructor is available', async () => {
			vi.stubGlobal('AudioContext', undefined);
			const { result } = renderHook(() => useMicrophone(false, undefined, true));

			await waitFor(() => expect(result.current.isActive).toBe(true));
			expect(result.current.processedMicStream.current).toBe(result.current.micStream.current);
		});

		it('closes the previous AudioContext before creating a new one for a second request', async () => {
			// the default beforeEach mock resolves to the SAME MockMediaStream
			// instance on every call, so the second setMicrophone() below would see
			// the first call's already-`.stop()`-ed track and hang forever waiting
			// for a live/unmuted state that can never happen - give each call a
			// fresh stream/track instead, matching what a real second getUserMedia()
			// call actually returns
			getUserMedia.mockImplementation(() => Promise.resolve(new MockMediaStream()));
			const { result } = renderHook(() => useMicrophone(false, undefined, false));
			await waitFor(() => expect(result.current.micOptions.length).toBeGreaterThan(0));

			await act(async () => {
				await result.current.setMicrophone('device-1');
			});
			expect(MockAudioContext.instances).toHaveLength(1);

			await act(async () => {
				await result.current.setMicrophone('device-1');
			});
			expect(MockAudioContext.instances).toHaveLength(2);
			expect(MockAudioContext.instances[0]?.close).toHaveBeenCalled();
		});
	});

	it('waits for a live-but-muted track to report unmute before marking active', async () => {
		const track = new MockMediaStreamTrack();
		track.muted = true;
		getUserMedia.mockResolvedValue(new MockMediaStream([track]));
		// isRequesting flips true synchronously, well before the hook's chain of
		// awaits (waitForPaint's rAF, getUserMedia, setupAudioProcessing, ...)
		// actually reaches waitForTrackToBecomeActive and registers the 'unmute'
		// listener - so isRequesting can't be used to time the dispatch. Spy on
        // addEventListener instead and wait for that specific registration.
		const addEventListenerSpy = vi.spyOn(track, 'addEventListener');

		const { result } = renderHook(() => useMicrophone(false, undefined, false));
		await waitFor(() => expect(result.current.micOptions.length).toBeGreaterThan(0));

		let pending: Promise<MediaStream | null>;
		act(() => {
			pending = result.current.requestMicrophone();
		});

		await waitFor(() => expect(result.current.isRequesting).toBe(true));
		await waitFor(() =>
			expect(addEventListenerSpy).toHaveBeenCalledWith('unmute', expect.any(Function), expect.anything()),
		);

		track.dispatch('unmute');

		await act(async () => {
			await pending;
		});

		expect(result.current.isActive).toBe(true);
	});

	describe('requestMicrophone() failure handling', () => {
		it('fails when the granted stream has no audio track', async () => {
			getUserMedia.mockResolvedValueOnce(new MockMediaStream([]));
			const { result } = renderHook(() => useMicrophone(true, undefined, false));

			await expect(
				act(async () => {
					await result.current.requestMicrophone();
				}),
			).rejects.toThrow('Failed to access microphone');
		});

		it('surfaces a permission-denied message for NotAllowedError', async () => {
			// a plain Error with `.name` set, not a DOMException - jsdom's own
			// DOMException implementation doesn't subclass the global Error, so
			// `error instanceof Error` (what the source checks here) is false for
			// one, even though it's true in a real browser
			const permissionError = new Error('not allowed');
			permissionError.name = 'NotAllowedError';
			getUserMedia.mockRejectedValueOnce(permissionError);
			const { result } = renderHook(() => useMicrophone(true, undefined, false));

			await expect(
				act(async () => {
					await result.current.requestMicrophone();
				}),
			).rejects.toThrow('Permission to access the microphone was denied');
		});

		it('retries with generic constraints on OverconstrainedError', async () => {
			getUserMedia
				.mockRejectedValueOnce(new DOMException('nope', 'OverconstrainedError'))
				.mockResolvedValueOnce(new MockMediaStream());
			const { result } = renderHook(() => useMicrophone(true, 'device-9', false));

			await act(async () => {
				await result.current.requestMicrophone();
			});

			expect(getUserMedia).toHaveBeenCalledTimes(2);
			expect(result.current.isActive).toBe(true);
		});
	});

	it('setMicrophone() surfaces an error when the stream request fails', async () => {
		getUserMedia.mockRejectedValueOnce(new Error('device busy'));
		const { result } = renderHook(() => useMicrophone(false, undefined, false));
		await waitFor(() => expect(result.current.micOptions.length).toBeGreaterThan(0));

		await act(async () => {
			await result.current.setMicrophone('device-1');
		});

		expect(result.current.isActive).toBe(false);
		expect(result.current.error?.message).toBe('device busy');
	});

	describe('device-change effect', () => {
		it('does nothing when there is no selected device to check', async () => {
			const { result } = renderHook(() => useMicrophone(false, undefined, false));
			await waitFor(() => expect(result.current.micOptions.length).toBeGreaterThan(0));
			expect(deviceChangeHandler).toBeDefined();

			act(() => {
				deviceChangeHandler?.();
			});

			await waitFor(() => expect(enumerateDevices.mock.calls.length).toBeGreaterThanOrEqual(2));
			expect(getUserMedia).not.toHaveBeenCalled();
		});

		it('leaves the current device alone when it is still present', async () => {
			const { result } = renderHook(() => useMicrophone(false, 'device-1', false));
			await waitFor(() => expect(result.current.micOptions.length).toBeGreaterThan(0));

			act(() => {
				deviceChangeHandler?.();
			});

			await waitFor(() => expect(enumerateDevices.mock.calls.length).toBeGreaterThanOrEqual(2));
			expect(getUserMedia).not.toHaveBeenCalled();
		});

		it('re-requests the microphone when the selected device disappears', async () => {
			const { result } = renderHook(() => useMicrophone(false, 'device-1', false));
			await waitFor(() => expect(result.current.micOptions.length).toBeGreaterThan(0));

			enumerateDevices.mockResolvedValue([mockDevice('device-2')]);
			act(() => {
				deviceChangeHandler?.();
			});

			await waitFor(() => expect(getUserMedia).toHaveBeenCalled());
		});
	});
});
