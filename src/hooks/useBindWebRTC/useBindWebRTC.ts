'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getWebRTCConnections, useWebRTC, useWebRTCConnection } from '../../stores/WebRTC';
import type { WebRTCStoreConnectionOptions } from '../../stores/WebRTC';
import { useProcessedMicStream } from '../../stores/microphone';
import { useVolume } from '../../stores/volume';
import type { WebRTCConnection } from '../../utils';

export type UseBindWebRTCOptions = {
	connectionName: string;
	offerOptions?: RTCOfferOptions;
	bearerToken?: string;
} & Omit<WebRTCStoreConnectionOptions, 'micStream' | 'micTrack' | 'volume'>;

export type UseBindWebRTCReturn = {
	connection: WebRTCConnection | null;
	error: Error | null;
	bind: () => Promise<WebRTCConnection | null>;
	unbind: () => void;
	bound: boolean;
};

export function useBindWebRTC(options: UseBindWebRTCOptions): UseBindWebRTCReturn {
	const {
		connectionName,
		offerOptions,
		bearerToken,
		connectionUrl,
		audioElement,
		autoPlayAudio,
		dataChannels,
		videoTrack,
		onRemoteVideoStream,
		onRemoteAudioStream,
		onDataChannelEvent,
	} = options;
	const processedMicStream = useProcessedMicStream();
	const volume = useVolume();
	const { addConnection, initializeConnection, removeConnection, setMicStream, setVolume } = useWebRTC();
	const connectionEntry = useWebRTCConnection(connectionName);
	const [error, setError] = useState<Error | null>(null);
	const [bound, setBound] = useState(false);
	const ownsConnectionRef = useRef(false);

	const unbind = useCallback(() => {
		if (ownsConnectionRef.current) {
			removeConnection(connectionName);
		}
		ownsConnectionRef.current = false;
		setBound(false);
		setError(null);
	}, [connectionName, removeConnection]);

	const bind = useCallback(async () => {
		setError(null);

		const existingConnection = getWebRTCConnections().find((connection) => connection.name === connectionName);
		if (existingConnection) {
			const nextError = new Error(`WebRTC connection "${connectionName}" already exists`);
			setError(nextError);
			return existingConnection.connection;
		}

		const micStream = processedMicStream.current;
		if (!micStream) {
			const nextError = new Error('No processed microphone stream available');
			setError(nextError);
			return null;
		}

		try {
			addConnection(connectionName, {
				connectionUrl,
				audioElement,
				autoPlayAudio,
				dataChannels,
				micStream,
				videoTrack,
				volume,
				onRemoteVideoStream,
				onRemoteAudioStream,
				onDataChannelEvent,
			});
			ownsConnectionRef.current = true;
			await initializeConnection(connectionName, offerOptions, bearerToken);
			setBound(true);

			return getWebRTCConnections().find((connection) => connection.name === connectionName)?.connection ?? null;
		} catch (bindError) {
			if (ownsConnectionRef.current) {
				removeConnection(connectionName);
			}
			ownsConnectionRef.current = false;
			setBound(false);
			const nextError = bindError instanceof Error ? bindError : new Error('Failed to bind WebRTC connection');
			setError(nextError);
			return null;
		}
	}, [
		addConnection,
		audioElement,
		autoPlayAudio,
		bearerToken,
		connectionName,
		connectionUrl,
		dataChannels,
		initializeConnection,
		onDataChannelEvent,
		onRemoteAudioStream,
		onRemoteVideoStream,
		offerOptions,
		processedMicStream,
		removeConnection,
		videoTrack,
		volume,
	]);

	useEffect(() => {
		if (!bound || !ownsConnectionRef.current) return;

		void setMicStream(connectionName, processedMicStream.current).catch((streamError) => {
			setError(streamError instanceof Error ? streamError : new Error('Failed to update WebRTC microphone stream'));
		});
	}, [bound, connectionName, processedMicStream, setMicStream]);

	useEffect(() => {
		if (!bound || !ownsConnectionRef.current) return;

		setVolume(connectionName, volume);
	}, [bound, connectionName, setVolume, volume]);

	useEffect(() => {
		return () => {
			if (!ownsConnectionRef.current) return;
			removeConnection(connectionName);
			ownsConnectionRef.current = false;
		};
	}, [connectionName, removeConnection]);

	return {
		connection: connectionEntry?.connection ?? null,
		error,
		bind,
		unbind,
		bound,
	};
}
