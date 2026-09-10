'use client';

import type { RefObject } from 'react';
import { useEffect } from 'react';
import { create } from 'zustand';
import type { DropDownOption } from '../../components/DropDown';
import type { MicOption, UseMicrophoneReturn } from '../../hooks';
import type { MicrophoneStore, MicrophoneStoreActions, MicrophoneStoreState } from './_types';

const emptyMicStreamRef = { current: null } as RefObject<MediaStream | null>;
const emptyMicTrackRef = {
	current: null,
} as RefObject<MediaStreamTrack | null>;

// default empty state for the store
function createEmptyState(): MicrophoneStoreState {
	return {
		micStream: emptyMicStreamRef,
		processedMicStream: emptyMicStreamRef,
		micTrack: emptyMicTrackRef,
		currentDeviceId: null,
		isActive: false,
		inputVolume: 1,
		muted: true,
		isSupported: false,
		isRequesting: false,
		error: null,
		microphones: [],
		micOptions: [],
	};
}

// create the state for the store based on the microphone object
function toStoreState(microphone: UseMicrophoneReturn | null): MicrophoneStoreState {
	if (!microphone) return createEmptyState();

	return {
		micStream: microphone.micStream,
		processedMicStream: microphone.processedMicStream,
		micTrack: microphone.micTrack,
		currentDeviceId: microphone.currentDeviceId,
		isActive: microphone.isActive,
		inputVolume: microphone.inputVolume,
		muted: microphone.muted,
		isSupported: microphone.isSupported,
		isRequesting: microphone.isRequesting,
		error: microphone.error,
		microphones: microphone.microphones,
		micOptions: microphone.micOptions,
	};
}

// create the actions for the store based on the microphone object
function createBoundActions(
	microphone: UseMicrophoneReturn | null,
	clearState: () => void,
): Omit<MicrophoneStoreActions, 'sync' | 'clear'> {
	return {
		requestMicrophone: async () => microphone?.requestMicrophone() ?? null,
		stopMicrophone: () => {
			microphone?.stopMicrophone();
			if (!microphone) clearState();
		},
		muteMic: () => microphone?.muteMic() ?? false,
		unmuteMic: () => microphone?.unmuteMic() ?? false,
		toggleMute: () => microphone?.toggleMute(),
		setInputVolume: (volume: number) => microphone?.setInputVolume(volume) ?? 1,
		refreshMicrophones: async () => microphone?.refreshMicrophones() ?? [],
		setMicrophone: async (deviceId: string | DropDownOption<MicOption>) => {
			await microphone?.setMicrophone(deviceId);
		},
	};
}

/**
 * Store factory that creates the store state based on a sync or a clear
 */
export const useMicrophoneStore = create<MicrophoneStore>((set) => {
	const clearState = () => {
		set((state) => ({
			...createEmptyState(),
			actions: {
				...state.actions,
				...createBoundActions(null, clearState),
			},
		}));
	};

	return {
		...createEmptyState(),
		actions: {
			sync: (microphone: UseMicrophoneReturn | null) => {
				set((state) => ({
					...toStoreState(microphone),
					actions: {
						...state.actions,
						...createBoundActions(microphone, clearState),
					},
				}));
			},
			clear: clearState,
			...createBoundActions(null, clearState),
		},
	};
});

/**
 * Bind the value of useMicrophone hook to the useMicrophoneStore. Use this to update the store with a new mic object.
 */
export function useSyncMicrophoneStore(microphone: UseMicrophoneReturn | null) {
	const sync = useMicrophoneStore((state) => state.actions.sync);
	const hasMicrophone = microphone !== null;
	const micStream = microphone?.micStream ?? emptyMicStreamRef;
	const processedMicStream = microphone?.processedMicStream ?? emptyMicStreamRef;
	const micTrack = microphone?.micTrack ?? emptyMicTrackRef;
	const currentDeviceId = microphone?.currentDeviceId ?? null;
	const isActive = microphone?.isActive ?? false;
	const inputVolume = microphone?.inputVolume ?? 1;
	const muted = microphone?.muted ?? true;
	const isSupported = microphone?.isSupported ?? false;
	const isRequesting = microphone?.isRequesting ?? false;
	const error = microphone?.error ?? null;
	const microphones = microphone?.microphones ?? [];
	const micOptions = microphone?.micOptions ?? [];
	const requestMicrophone = microphone?.requestMicrophone;
	const stopMicrophone = microphone?.stopMicrophone;
	const muteMic = microphone?.muteMic;
	const unmuteMic = microphone?.unmuteMic;
	const toggleMute = microphone?.toggleMute;
	const setInputVolume = microphone?.setInputVolume;
	const refreshMicrophones = microphone?.refreshMicrophones;
	const setMicrophone = microphone?.setMicrophone;

	useEffect(() => {
		if (!hasMicrophone) {
			sync(null);
			return;
		}

		sync({
			micStream,
			processedMicStream,
			micTrack,
			currentDeviceId,
			isActive,
			inputVolume,
			muted,
			isSupported,
			isRequesting,
			error,
			microphones,
			micOptions,
			requestMicrophone: requestMicrophone ?? (async () => null),
			stopMicrophone: stopMicrophone ?? (() => null),
			muteMic: muteMic ?? (() => false),
			unmuteMic: unmuteMic ?? (() => false),
			toggleMute: toggleMute ?? (() => null),
			setInputVolume: setInputVolume ?? (() => 1),
			refreshMicrophones: refreshMicrophones ?? (async () => []),
			setMicrophone: setMicrophone ?? (async () => {}),
		});
	}, [
		sync,
		hasMicrophone,
		micStream,
		processedMicStream,
		micTrack,
		currentDeviceId,
		isActive,
		inputVolume,
		muted,
		isSupported,
		isRequesting,
		error,
		microphones,
		micOptions,
		requestMicrophone,
		stopMicrophone,
		muteMic,
		unmuteMic,
		toggleMute,
		setInputVolume,
		refreshMicrophones,
		setMicrophone,
	]);
}

// atomic hook exports for use in React components
export const useMicStream = () => useMicrophoneStore((state) => state.micStream);
export const useProcessedMicStream = () => useMicrophoneStore((state) => state.processedMicStream);
export const useMicTrack = () => useMicrophoneStore((state) => state.micTrack);
export const useCurrentMicDeviceId = () => useMicrophoneStore((state) => state.currentDeviceId);
export const useCurrentMicDeviceLabel = () =>
	useMicrophoneStore((state) => {
		const liveTrackLabel = state.micTrack.current?.label;
		if (liveTrackLabel) return liveTrackLabel;

		const currentDeviceId = state.currentDeviceId;
		if (!currentDeviceId) return null;
		return state.microphones.find((device) => device.deviceId === currentDeviceId)?.label ?? null;
	});
export const useMicActive = () => useMicrophoneStore((state) => state.isActive);
export const useMicInputVolume = () => useMicrophoneStore((state) => state.inputVolume);
export const useMicMuted = () => useMicrophoneStore((state) => state.muted);
export const useMicSupported = () => useMicrophoneStore((state) => state.isSupported);
export const useMicRequesting = () => useMicrophoneStore((state) => state.isRequesting);
export const useMicError = () => useMicrophoneStore((state) => state.error);
export const useMicrophones = () => useMicrophoneStore((state) => state.microphones);
export const useMicOptions = () => useMicrophoneStore((state) => state.micOptions);
export const useMicrophoneStoreActions = () => useMicrophoneStore((state) => state.actions);

// non-reactive imperative exports for use outside the React context
export const microphoneActions = {
	sync: (microphone: UseMicrophoneReturn | null) => useMicrophoneStore.getState().actions.sync(microphone),
	clear: () => useMicrophoneStore.getState().actions.clear(),
	requestMicrophone: () => useMicrophoneStore.getState().actions.requestMicrophone(),
	stopMicrophone: () => useMicrophoneStore.getState().actions.stopMicrophone(),
	muteMic: () => useMicrophoneStore.getState().actions.muteMic(),
	unmuteMic: () => useMicrophoneStore.getState().actions.unmuteMic(),
	toggleMute: () => useMicrophoneStore.getState().actions.toggleMute(),
	setInputVolume: (volume: number) => useMicrophoneStore.getState().actions.setInputVolume(volume),
	refreshMicrophones: () => useMicrophoneStore.getState().actions.refreshMicrophones(),
	setMicrophone: (deviceId: string | DropDownOption<MicOption>) =>
		useMicrophoneStore.getState().actions.setMicrophone(deviceId),
} satisfies MicrophoneStoreActions;
export const getMicrophoneState = () => useMicrophoneStore.getState();
export const getCurrentMicDeviceLabel = () => {
	const state = useMicrophoneStore.getState();
	const liveTrackLabel = state.micTrack.current?.label;
	if (liveTrackLabel) return liveTrackLabel;

	const currentDeviceId = state.currentDeviceId;
	if (!currentDeviceId) return null;
	return state.microphones.find((device) => device.deviceId === currentDeviceId)?.label ?? null;
};
