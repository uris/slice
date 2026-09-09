import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	useMicMuted,
	useMicrophoneStore,
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
});
