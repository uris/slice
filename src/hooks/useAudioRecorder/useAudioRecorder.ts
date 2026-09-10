'use client';

import type { RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

type UseStreamToMp3Return = {
	audioBlob: RefObject<Blob | null>;
	error: Error | null;
	isRecording: boolean;
	recordingSizeMb: number;
	mimeType: string | null;
	resetRecording: () => void;
	startRecording: () => void;
	stopRecording: () => Promise<Blob | null>;
};

type AudioRecorderSource =
	| MediaStream
	| MediaStreamTrack
	| RefObject<MediaStream | MediaStreamTrack | null>
	| null
	| undefined;

/**
 * Get supported audio mime type - perfer mpeg
 */
const getSupportedAudioMimeType = (): string | null => {
	if (typeof MediaRecorder === 'undefined') return null;

	const mimeTypes = [
		'audio/mpeg',
		'audio/mp4',
		'audio/webm;codecs=opus',
		'audio/webm',
		'audio/ogg;codecs=opus',
		'audio/ogg',
	];

	for (const mimeType of mimeTypes) {
		if (MediaRecorder.isTypeSupported(mimeType)) {
			return mimeType;
		}
	}

	return null;
};

/**
 * Create a reliable stream from a track or stream
 */
const resolveAudioSource = (audioStream: AudioRecorderSource) => {
	if (!audioStream) return null;
	if (typeof audioStream === 'object' && 'current' in audioStream) {
		return audioStream.current;
	}
	return audioStream;
};

const toMediaStream = (audioStream: AudioRecorderSource): MediaStream | null => {
	const source = resolveAudioSource(audioStream);
	if (!source) return null;
	if (typeof MediaStream === 'undefined') return null;
	if (source instanceof MediaStream) return source;
	return new MediaStream([source]);
};

export function useAudioRecorder(audioStream: AudioRecorderSource): UseStreamToMp3Return {
	const audioBlob = useRef<Blob | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const recordedChunksRef = useRef<BlobPart[]>([]);
	const stopResolveRef = useRef<((blob: Blob | null) => void) | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [recordingSizeMb, setRecordingSizeMb] = useState<number>(0);
	const [mimeType, setMimeType] = useState<string | null>(null);

	// clean up recording state
	const resetRecording = useCallback(() => {
		audioBlob.current = null;
		recordedChunksRef.current = [];
		setRecordingSizeMb(0);
		setError(null);
	}, []);

	// start recording a stream
	const startRecording = useCallback(() => {
		try {
			// check can record
			if (typeof MediaRecorder === 'undefined') {
				throw new TypeError('MediaRecorder is not supported in this browser');
			}

			// exit if already recording
			if (mediaRecorderRef.current?.state === 'recording') return;

			// create a stream from stream / track
			const stream = toMediaStream(audioStream);
			if (!stream) {
				throw new Error('No audio stream or track provided');
			}

			// clear previous recording
			resetRecording();

			// set the blob mime type
			const nextMimeType = getSupportedAudioMimeType();
			setMimeType(nextMimeType);

			// create the media recorder
			const mediaRecorder = nextMimeType
				? new MediaRecorder(stream, { mimeType: nextMimeType })
				: new MediaRecorder(stream);

			// set media recorder event listeners
			mediaRecorder.ondataavailable = (event: BlobEvent) => {
				if (event.data.size > 0) {
					recordedChunksRef.current.push(event.data);
					setRecordingSizeMb((size) => size + event.data.size / 1024 / 1024);
				}
			};

			mediaRecorder.onerror = () => {
				setError(new Error('Audio recording failed'));
				setIsRecording(false);
			};

			mediaRecorder.onstop = () => {
				const nextBlob = new Blob(recordedChunksRef.current, {
					type: mediaRecorder.mimeType || nextMimeType || 'audio/webm',
				});
				audioBlob.current = nextBlob;
				setIsRecording(false);
				stopResolveRef.current?.(nextBlob);
				stopResolveRef.current = null;
			};

			// start recording
			mediaRecorderRef.current = mediaRecorder;
			mediaRecorder.start(250);
			setIsRecording(true);
		} catch (error) {
			setError(error instanceof Error ? error : new Error('Unknown error'));
			setIsRecording(false);
		}
	}, [audioStream, resetRecording]);

	// stop an active recording
	const stopRecording = useCallback(async (): Promise<Blob | null> => {
		try {
			const mediaRecorder = mediaRecorderRef.current;

			if (!mediaRecorder || mediaRecorder.state === 'inactive') {
				setIsRecording(false);
				return audioBlob.current;
			}

			return new Promise<Blob | null>((resolve) => {
				stopResolveRef.current = resolve;
				mediaRecorder.stop();
			});
		} catch (error) {
			setError(error instanceof Error ? error : new Error('Unknown error'));
			setIsRecording(false);
			return null;
		}
	}, []);

	// setup media recoridng on unmount with unmount cleanup
	useEffect(() => {
		return () => {
			if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
				mediaRecorderRef.current.stop();
			}
			mediaRecorderRef.current = null;
			stopResolveRef.current = null;
		};
	}, []);

	return {
		audioBlob,
		error,
		isRecording,
		recordingSizeMb,
		mimeType,
		resetRecording,
		startRecording,
		stopRecording,
	};
}
