'use client';

import type { RefObject } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DropDownOption } from '../../components/DropDown';

export type MicOption = { id: string };

export type UseMicrophoneReturn = {
	micStream: RefObject<MediaStream | null>;
	processedMicStream: RefObject<MediaStream | null>;
	micTrack: RefObject<MediaStreamTrack | null>;
	currentDeviceId: string | null;
	isActive: boolean;
	inputVolume: number;
	muted: boolean;
	isSupported: boolean;
	isRequesting: boolean;
	error: Error | null;
	microphones: MediaDeviceInfo[];
	micOptions: DropDownOption<MicOption>[];
	requestMicrophone: () => Promise<MediaStream | null>;
	stopMicrophone: () => void;
	muteMic: () => boolean;
	unmuteMic: () => boolean;
	toggleMute: () => void;
	setInputVolume: (volume: number) => number;
	refreshMicrophones: () => Promise<MediaDeviceInfo[]>;
	setMicrophone: (deviceId: string | DropDownOption<MicOption>) => Promise<void>;
};

function prioritizeDefaultMicrophone(devices: MediaDeviceInfo[], activeDeviceId?: string) {
	const microphones = devices.filter((device) => device.deviceId !== '');
	const defaultIndex = microphones.findIndex((device) => device.deviceId === 'default');
	if (defaultIndex > 0) {
		const [defaultDevice] = microphones.splice(defaultIndex, 1);
		microphones.unshift(defaultDevice);
		return microphones;
	}
	if (defaultIndex === 0) return microphones;

	if (!activeDeviceId) return microphones;
	const activeIndex = microphones.findIndex((device) => device.deviceId === activeDeviceId);
	if (activeIndex > 0) {
		const [activeDevice] = microphones.splice(activeIndex, 1);
		microphones.unshift(activeDevice);
	}
	return microphones;
}

function hasUsableMicrophoneLabels(devices: MediaDeviceInfo[]) {
	return devices.some((device) => device.label.trim() !== '');
}

export function useMicrophone(startMuted = true, microphoneDeviceId?: string, autoRequest = true): UseMicrophoneReturn {
	const micStream = useRef<MediaStream | null>(null);
	const processedMicStream = useRef<MediaStream | null>(null);
	const micTrack = useRef<MediaStreamTrack | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
	const gainNodeRef = useRef<GainNode | null>(null);
	const destinationNodeRef = useRef<MediaStreamAudioDestinationNode | null>(null);
	const inputVolumeRef = useRef<number>(1);
	const mutedRef = useRef<boolean>(startMuted);
	const mountedRef = useRef<boolean>(true);
	const initializedRef = useRef<boolean>(false);
	const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
	const [micOptions, setMicOptions] = useState<DropDownOption<MicOption>[]>([]);
	const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
	const [isActive, setIsActive] = useState<boolean>(false);
	const [inputVolume, setInputVolumeState] = useState<number>(1);
	const [muted, setMuted] = useState<boolean>(startMuted);
	const [isRequesting, setIsRequesting] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const normalizeInputVolume = useCallback((volume: number) => {
		if (!Number.isFinite(volume)) return 1;
		return Math.min(1, Math.max(0, volume));
	}, []);

	const resetAudioProcessing = useCallback(() => {
		sourceNodeRef.current?.disconnect();
		gainNodeRef.current?.disconnect();
		destinationNodeRef.current?.disconnect();
		audioContextRef.current?.close().catch(() => null);
		sourceNodeRef.current = null;
		gainNodeRef.current = null;
		destinationNodeRef.current = null;
		audioContextRef.current = null;
		processedMicStream.current = null;
	}, []);

	const setupAudioProcessing = useCallback(
		(stream: MediaStream) => {
			resetAudioProcessing();
			const AudioContextCtor =
				globalThis.AudioContext ??
				(
					globalThis as typeof globalThis & {
						webkitAudioContext?: typeof AudioContext;
					}
				).webkitAudioContext;
			if (!AudioContextCtor) {
				processedMicStream.current = stream;
				return stream;
			}

			const context = new AudioContextCtor();
			const source = context.createMediaStreamSource(stream);
			const gain = context.createGain();
			const destination = context.createMediaStreamDestination();

			gain.gain.value = normalizeInputVolume(inputVolumeRef.current);
			source.connect(gain);
			gain.connect(destination);

			audioContextRef.current = context;
			sourceNodeRef.current = source;
			gainNodeRef.current = gain;
			destinationNodeRef.current = destination;
			processedMicStream.current = destination.stream;
			return destination.stream;
		},
		[normalizeInputVolume, resetAudioProcessing],
	);

	// use this to account for connection lags of external mics, etc. and provide accurate isRequesting state
	const waitForPaint = useCallback(async () => {
		await new Promise<void>((resolve) => {
			requestAnimationFrame(() => resolve());
		});
	}, []);

	// device mount can happen before the device actually becomes active, so we wait for the live state
	const waitForTrackToBecomeActive = useCallback(async (track: MediaStreamTrack) => {
		if (track.readyState === 'live' && !track.muted) return;

		await new Promise<void>((resolve) => {
			const handleUnmute = () => {
				track.removeEventListener('unmute', handleUnmute);
				resolve();
			};

			track.addEventListener('unmute', handleUnmute, { once: true });
		});
	}, []);

	// kill the mic stream entirely
	const stopMicStream = useCallback(() => {
		resetAudioProcessing();
		const tracks = micStream.current?.getTracks();
		for (const track of tracks ?? []) {
			track.stop();
		}
		micStream.current = null;
		micTrack.current = null;
		processedMicStream.current = null;
		setCurrentDeviceId(null);
		setIsActive(false);
	}, [resetAudioProcessing]);

	// determine whether the browser can access media devices at all
	const hasMediaSupport = useMemo(() => {
		if (typeof navigator === 'undefined') return false;
		return Boolean(navigator.mediaDevices?.getUserMedia);
	}, []);

	// get mic audio track
	const getMicTrack = useCallback(() => {
		if (!micStream.current) throw new Error('No microphone stream found');
		const audioTrack = micStream.current.getAudioTracks()[0];
		if (!audioTrack) throw new Error('No audio track found');
		return audioTrack;
	}, []);

	// determine whether there is already a live microphone stream
	const hasActiveStream = useCallback(() => {
		if (!micStream.current || !micTrack.current) return false;
		return micTrack.current.readyState === 'live';
	}, []);

	// disable the live microphone track
	const muteMic = useCallback(() => {
		const audioTrack = getMicTrack();
		audioTrack.enabled = false;
		mutedRef.current = true;
		setMuted(true);
		return true;
	}, [getMicTrack]);

	// enable the live microphone track
	const unmuteMic = useCallback(() => {
		const audioTrack = getMicTrack();
		audioTrack.enabled = true;
		mutedRef.current = false;
		setMuted(false);
		return true;
	}, [getMicTrack]);

	const setInputVolume = useCallback(
		(volume: number) => {
			const nextVolume = normalizeInputVolume(volume);
			inputVolumeRef.current = nextVolume;
			setInputVolumeState(nextVolume);
			if (gainNodeRef.current) {
				gainNodeRef.current.gain.value = nextVolume;
			}
			return nextVolume;
		},
		[normalizeInputVolume],
	);

	// constraint to microphone and specific device if any
	const constraints = useCallback(
		(deviceId?: string, usePreferredDevice = true) => {
			const id = usePreferredDevice ? (deviceId ?? microphoneDeviceId ?? undefined) : deviceId;
			return {
				audio: {
					deviceId: id ? { exact: id } : undefined,
				},
			};
		},
		[microphoneDeviceId],
	);

	// shared request path so the hook can explicitly switch to the default device when needed
	const requestStream = useCallback(
		async (deviceId?: string, usePreferredDevice = true) => {
			micStream.current = await navigator.mediaDevices.getUserMedia(constraints(deviceId, usePreferredDevice));
			setupAudioProcessing(micStream.current);
			micTrack.current = getMicTrack();
			setCurrentDeviceId(micTrack.current.getSettings().deviceId ?? null);
			micTrack.current.enabled = !mutedRef.current;
			if (!mutedRef.current) {
				await waitForTrackToBecomeActive(micTrack.current);
			}
			setIsActive(Boolean(micTrack.current.readyState === 'live'));
			return micStream.current;
		},
		[constraints, getMicTrack, setupAudioProcessing, waitForTrackToBecomeActive],
	);

	// get a list of available microphones
	const refreshMicrophones = useCallback(async () => {
		if (!hasMediaSupport) return [];
		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const currentDeviceId = micTrack.current?.getSettings().deviceId;
			const availableInputs = devices.filter((device) => device.kind === 'audioinput' && device.deviceId !== '');
			const shouldExposeOptions =
				hasUsableMicrophoneLabels(availableInputs) || Boolean(currentDeviceId) || hasActiveStream();
			const mics = shouldExposeOptions ? prioritizeDefaultMicrophone(availableInputs, currentDeviceId) : [];
			const options: DropDownOption<MicOption>[] = mics.map((mic) => ({
				value: { id: mic.deviceId },
				label: mic.label,
			}));
			setMicrophones(mics);
			setMicOptions(options);
			return mics;
		} catch {
			setMicrophones([]);
			setMicOptions([]);
			return [];
		}
	}, [hasActiveStream, hasMediaSupport]);

	// request a media stream and fall back to generic constraints if needed
	const requestMicrophone = useCallback(async () => {
		if (hasActiveStream()) {
			setIsActive(true);
			setError(null);
			return micStream.current;
		}

		setIsRequesting(true);
		await waitForPaint();

		if (!hasMediaSupport) {
			const nextError = new Error(`Microphone access isn't supported`);
			setError(nextError);
			setCurrentDeviceId(null);
			setIsActive(false);
			if (mountedRef.current) setIsRequesting(false);
			return null;
		}

		setError(null);
		stopMicStream();

		try {
			const stream = await requestStream();
			await refreshMicrophones();
			return stream;
		} catch (error) {
			const shouldRetry =
				(error instanceof DOMException && error.name === 'OverconstrainedError') ||
				(error instanceof DOMException && error.name === 'NotFoundError');
			if (!shouldRetry) {
				let nextError = new Error('Failed to access microphone');
				if (error instanceof Error) {
					if (error.message.toLowerCase().includes('denied permission') || error.name === 'NotAllowedError') {
						nextError = new Error('Permission to access the microphone was denied');
					}
				}
				setError(nextError);
				setCurrentDeviceId(null);
				setIsActive(false);
				throw nextError;
			}
			const stream = await requestStream(undefined, false);
			await refreshMicrophones();
			return stream;
		} finally {
			setIsRequesting(false);
		}
	}, [hasActiveStream, hasMediaSupport, refreshMicrophones, requestStream, stopMicStream, waitForPaint]);

	// switch microphones
	const setMicrophone = useCallback(
		async (deviceId: string | DropDownOption<MicOption>) => {
			setIsRequesting(true);
			await waitForPaint(); // make sure isRequesting registers
			const id = typeof deviceId === 'string' ? deviceId : deviceId.value?.id;
			try {
				setError(null);
				stopMicStream();
				await requestStream(id, false);
				await refreshMicrophones();
			} catch (err) {
				setCurrentDeviceId(null);
				setIsActive(false);
				setError(err instanceof Error ? err : new Error('Error switching microphone'));
			} finally {
				setIsRequesting(false);
			}
		},
		[refreshMicrophones, requestStream, stopMicStream, waitForPaint],
	);

	// toggle mic mute on/off
	const toggleMute = useCallback(() => {
		try {
			if (muted) unmuteMic();
			else muteMic();
		} catch {
			return;
		}
	}, [muted, unmuteMic, muteMic]);

	// get microphone stream on mount
	useEffect(() => {
		mountedRef.current = true;
		if (!hasMediaSupport) return;
		if (initializedRef.current) return;
		initializedRef.current = true;
		if (!autoRequest) {
			void refreshMicrophones();
			return () => {
				mountedRef.current = false;
				stopMicStream();
			};
		}
		void requestMicrophone()
			.then(() => {
				if (startMuted) muteMic();
			})
			.catch(() => null);
		return () => {
			mountedRef.current = false;
			stopMicStream();
		};
	}, [autoRequest, hasMediaSupport, refreshMicrophones, requestMicrophone, startMuted, muteMic, stopMicStream]);

	// keep microphone devices fresh as hardware becomes available/unavailable
	useEffect(() => {
		if (!hasMediaSupport || !navigator.mediaDevices?.addEventListener) return;
		void refreshMicrophones();

		const handleDeviceChange = () => {
			void refreshMicrophones().then((nextMicrophones) => {
				const currentDeviceId = micTrack.current?.getSettings().deviceId;
				const selectedDeviceId = microphoneDeviceId ?? currentDeviceId;
				if (!selectedDeviceId) return;
				const stillAvailable = nextMicrophones.some((mic) => mic.deviceId === selectedDeviceId);
				if (stillAvailable) return;
				void requestMicrophone();
			});
		};

		navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

		return () => {
			navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
		};
	}, [hasMediaSupport, microphoneDeviceId, refreshMicrophones, requestMicrophone]);

	return {
		micStream,
		processedMicStream,
		micTrack,
		currentDeviceId,
		isActive,
		inputVolume,
		muted,
		isSupported: hasMediaSupport,
		isRequesting,
		error,
		microphones,
		micOptions,
		requestMicrophone,
		stopMicrophone: stopMicStream,
		muteMic,
		unmuteMic,
		toggleMute,
		setInputVolume,
		refreshMicrophones,
		setMicrophone,
	};
}
