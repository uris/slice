import { create } from 'zustand';
import { WebRTCConnection } from '../../utils';
import type { WebRTCStore, WebRTCStoreConnectionOptions } from './_types';

export const useWebRTCStore = create<WebRTCStore>((set, get) => ({
	connections: [],
	actions: {
		addConnection: (name: string, options: WebRTCStoreConnectionOptions) => {
			const existingConnection = get().connections.find((c) => c.name === name);
			existingConnection?.connection.close();

			const connection = new WebRTCConnection(options);
			const nextConnection = { name, connection };

			set((state) => ({
				connections: [...state.connections.filter((connection) => connection.name !== name), nextConnection],
			}));

			return nextConnection;
		},
		initializeConnection: async (name: string, offerOptions?: RTCOfferOptions, bearerToken?: string) => {
			const connection = get().connections.find((c) => c.name === name)?.connection;
			if (!connection) return;

			await connection.initialize(offerOptions, bearerToken);
		},
		removeConnection: (name: string) => {
			const existingConnection = get().connections.find((c) => c.name === name);
			if (!existingConnection) return;

			existingConnection.connection.close();
			set((state) => ({
				connections: state.connections.filter((connection) => connection.name !== name),
			}));
		},
		setMicStream: async (name: string, stream: MediaStream | null) => {
			const connection = get().connections.find((c) => c.name === name)?.connection;
			if (!connection) return;

			await connection.setOutgoingAudioStream(stream);
		},
		setVolume: (name: string, volume: number) => {
			const connection = get().connections.find((c) => c.name === name)?.connection;
			if (!connection) return;

			connection.setVolume(volume);
		},
	},
}));

export const useWebRTC = () => useWebRTCStore((state) => state.actions);
export const useWebRTCConnections = () => useWebRTCStore((state) => state.connections);
export const useWebRTCConnection = (name: string) =>
	useWebRTCStore((state) => state.connections.find((connection) => connection.name === name) ?? null);
export const useWebRTCConnected = (name?: string) =>
	useWebRTCStore((state) => {
		if (name) {
			return state.connections.find((entry) => entry.name === name)?.connection.connected ?? false;
		}

		return state.connections.some((entry) => entry.connection.connected);
	});

export const useWebRTCActions = useWebRTCStore.getState().actions;
export function getWebRTCConnections(): ReturnType<typeof useWebRTCStore.getState>['connections'];
export function getWebRTCConnections(
	name: string,
): ReturnType<typeof useWebRTCStore.getState>['connections'][number] | null;
export function getWebRTCConnections(name?: string) {
	const connections = useWebRTCStore.getState().connections;
	if (!name) return connections;
	return connections.find((connection) => connection.name === name) ?? null;
}
