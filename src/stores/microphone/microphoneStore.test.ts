import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	getCurrentMicDeviceLabel,
	getMicrophoneState,
	microphoneActions,
	useCurrentMicDeviceLabel,
	useMicMuted,
	useMicrophoneStore,
	useMicrophones,
	useMicStream,
	useSyncMicrophoneStore,
} from './microphoneStore';

function fakeMicrophone(overrides: Partial<Record<string, unknown>> = {}) {
	return {
		micStream: { current: null },
		processedMicStream: { current: null },
		micTrack: { current: null },
		currentDeviceId: 'device-1',
		isActive: true,
		inputVolume: 0.5,
		muted: false,
		isSupported: true,
		isRequesting: false,
		error: null,
		microphones: [],
		micOptions: [],
		requestMicrophone: vi.fn().mockResolvedValue('stream'),
		stopMicrophone: vi.fn(),
		muteMic: vi.fn().mockReturnValue(true),
		unmuteMic: vi.fn().mockReturnValue(false),
		toggleMute: vi.fn(),
		setInputVolume: vi.fn().mockReturnValue(0.7),
		refreshMicrophones: vi.fn().mockResolvedValue([]),
		setMicrophone: vi.fn().mockResolvedValue(undefined),
		...overrides,
	} as unknown as import('../../hooks').UseMicrophoneReturn;
}

beforeEach(() => {
	useMicrophoneStore.getState().actions.clear();
});

describe('microphoneStore', () => {
	it('sync() mirrors the microphone hook state into the store', () => {
		const mic = fakeMicrophone({ currentDeviceId: 'device-2' });
		useMicrophoneStore.getState().actions.sync(mic);

		expect(useMicrophoneStore.getState().currentDeviceId).toBe('device-2');
		expect(useMicrophoneStore.getState().isActive).toBe(true);
		expect(useMicrophoneStore.getState().inputVolume).toBe(0.5);
	});

	it('sync() binds actions that delegate to the microphone hook', async () => {
		const mic = fakeMicrophone();
		useMicrophoneStore.getState().actions.sync(mic);

		await useMicrophoneStore.getState().actions.requestMicrophone();
		useMicrophoneStore.getState().actions.stopMicrophone();
		useMicrophoneStore.getState().actions.toggleMute();
		useMicrophoneStore.getState().actions.setInputVolume(0.9);

		expect(mic.requestMicrophone).toHaveBeenCalled();
		expect(mic.stopMicrophone).toHaveBeenCalled();
		expect(mic.toggleMute).toHaveBeenCalled();
		expect(mic.setInputVolume).toHaveBeenCalledWith(0.9);
	});

	it('sync(null) and clear() reset to the empty default state', () => {
		useMicrophoneStore.getState().actions.sync(fakeMicrophone());
		useMicrophoneStore.getState().actions.sync(null);

		expect(useMicrophoneStore.getState().currentDeviceId).toBeNull();
		expect(useMicrophoneStore.getState().isActive).toBe(false);
		expect(useMicrophoneStore.getState().muted).toBe(true);
	});

	it('unbound actions are safe no-ops before sync()', async () => {
		expect(
			await useMicrophoneStore.getState().actions.requestMicrophone(),
		).toBeNull();
		expect(useMicrophoneStore.getState().actions.muteMic()).toBe(false);
		expect(useMicrophoneStore.getState().actions.setInputVolume(1)).toBe(1);
		expect(
			await useMicrophoneStore.getState().actions.refreshMicrophones(),
		).toEqual([]);
	});

	it('useSyncMicrophoneStore() syncs a hook return value into the store on mount', () => {
		const mic = fakeMicrophone({ currentDeviceId: 'device-3' });
		renderHook(() => useSyncMicrophoneStore(mic));

		expect(useMicrophoneStore.getState().currentDeviceId).toBe('device-3');
	});

	it('useSyncMicrophoneStore(null) clears the store', () => {
		useMicrophoneStore.getState().actions.sync(fakeMicrophone());
		renderHook(() => useSyncMicrophoneStore(null));

		expect(useMicrophoneStore.getState().isActive).toBe(false);
	});

	it('exposes atomic selector hooks', () => {
		useMicrophoneStore.getState().actions.sync(fakeMicrophone({ muted: true }));
		const { result } = renderHook(() => useMicMuted());
		expect(result.current).toBe(true);
	});

	it('sync() also binds unmuteMic and setMicrophone', async () => {
		const mic = fakeMicrophone();
		useMicrophoneStore.getState().actions.sync(mic);

		useMicrophoneStore.getState().actions.unmuteMic();
		await useMicrophoneStore.getState().actions.setMicrophone('device-9');

		expect(mic.unmuteMic).toHaveBeenCalled();
		expect(mic.setMicrophone).toHaveBeenCalledWith('device-9');
	});

	it('stopMicrophone() with no bound microphone clears the store (the unbound no-op branch)', () => {
		useMicrophoneStore.getState().actions.sync(fakeMicrophone());
		useMicrophoneStore.getState().actions.sync(null);

		// actions are now the unbound (null-microphone) variant - stopMicrophone's
		// `if (!microphone) clearState()` guard is what's under test here
		expect(() => useMicrophoneStore.getState().actions.stopMicrophone()).not.toThrow();
		expect(useMicrophoneStore.getState().isActive).toBe(false);
	});

	it('useSyncMicrophoneStore falls back to safe no-op actions for any missing hook methods', async () => {
		const partialMic = fakeMicrophone({
			requestMicrophone: undefined,
			stopMicrophone: undefined,
			muteMic: undefined,
			unmuteMic: undefined,
			toggleMute: undefined,
			setInputVolume: undefined,
			refreshMicrophones: undefined,
			setMicrophone: undefined,
		});
		renderHook(() => useSyncMicrophoneStore(partialMic));

		expect(await useMicrophoneStore.getState().actions.requestMicrophone()).toBeNull();
		expect(() => useMicrophoneStore.getState().actions.stopMicrophone()).not.toThrow();
		expect(useMicrophoneStore.getState().actions.muteMic()).toBe(false);
		expect(useMicrophoneStore.getState().actions.unmuteMic()).toBe(false);
		expect(() => useMicrophoneStore.getState().actions.toggleMute()).not.toThrow();
		expect(useMicrophoneStore.getState().actions.setInputVolume(0.5)).toBe(1);
		expect(await useMicrophoneStore.getState().actions.refreshMicrophones()).toEqual([]);
		await expect(useMicrophoneStore.getState().actions.setMicrophone('x')).resolves.toBeUndefined();
	});

	it('exposes the remaining atomic selector hooks (micStream, microphones)', () => {
		const fakeStream = { current: 'stream' } as unknown as import('react').RefObject<MediaStream | null>;
		useMicrophoneStore.getState().actions.sync(
			fakeMicrophone({
				micStream: fakeStream,
				microphones: [{ deviceId: 'device-1', label: 'Built-in Mic' }] as unknown as MediaDeviceInfo[],
			}),
		);

		expect(renderHook(() => useMicStream()).result.current).toBe(fakeStream);
		expect(renderHook(() => useMicrophones()).result.current).toHaveLength(1);
	});

	describe('useCurrentMicDeviceLabel / getCurrentMicDeviceLabel', () => {
		it('prefers the live track label when present', () => {
			useMicrophoneStore.getState().actions.sync(
				fakeMicrophone({
					micTrack: { current: { label: 'Live Track' } } as unknown as import('react').RefObject<MediaStreamTrack | null>,
				}),
			);

			expect(renderHook(() => useCurrentMicDeviceLabel()).result.current).toBe('Live Track');
			expect(getCurrentMicDeviceLabel()).toBe('Live Track');
		});

		it('falls back to null when there is no live track and no current device', () => {
			useMicrophoneStore.getState().actions.sync(fakeMicrophone({ currentDeviceId: null }));

			expect(renderHook(() => useCurrentMicDeviceLabel()).result.current).toBeNull();
			expect(getCurrentMicDeviceLabel()).toBeNull();
		});

		it('resolves the device label from the microphones list by id when there is no live track', () => {
			useMicrophoneStore.getState().actions.sync(
				fakeMicrophone({
					currentDeviceId: 'device-1',
					microphones: [{ deviceId: 'device-1', label: 'Built-in Mic' }] as unknown as MediaDeviceInfo[],
				}),
			);

			expect(renderHook(() => useCurrentMicDeviceLabel()).result.current).toBe('Built-in Mic');
			expect(getCurrentMicDeviceLabel()).toBe('Built-in Mic');
		});

		it('returns null when the current device id has no matching microphone', () => {
			useMicrophoneStore.getState().actions.sync(
				fakeMicrophone({ currentDeviceId: 'missing-device', microphones: [] }),
			);

			expect(renderHook(() => useCurrentMicDeviceLabel()).result.current).toBeNull();
			expect(getCurrentMicDeviceLabel()).toBeNull();
		});
	});

	it('getMicrophoneState() returns the current store snapshot', () => {
		useMicrophoneStore.getState().actions.sync(fakeMicrophone({ currentDeviceId: 'device-7' }));
		expect(getMicrophoneState().currentDeviceId).toBe('device-7');
	});

	describe('microphoneActions (non-reactive imperative wrappers)', () => {
		it('delegates every action straight through to the store', async () => {
			const mic = fakeMicrophone();
			microphoneActions.sync(mic);
			expect(useMicrophoneStore.getState().currentDeviceId).toBe(mic.currentDeviceId);

			await microphoneActions.requestMicrophone();
			microphoneActions.stopMicrophone();
			microphoneActions.muteMic();
			microphoneActions.unmuteMic();
			microphoneActions.toggleMute();
			microphoneActions.setInputVolume(0.3);
			await microphoneActions.refreshMicrophones();
			await microphoneActions.setMicrophone('device-x');

			expect(mic.requestMicrophone).toHaveBeenCalled();
			expect(mic.stopMicrophone).toHaveBeenCalled();
			expect(mic.muteMic).toHaveBeenCalled();
			expect(mic.unmuteMic).toHaveBeenCalled();
			expect(mic.toggleMute).toHaveBeenCalled();
			expect(mic.setInputVolume).toHaveBeenCalledWith(0.3);
			expect(mic.refreshMicrophones).toHaveBeenCalled();
			expect(mic.setMicrophone).toHaveBeenCalledWith('device-x');

			microphoneActions.clear();
			expect(useMicrophoneStore.getState().isActive).toBe(false);
		});
	});
});
