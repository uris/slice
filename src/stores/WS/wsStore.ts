import { create } from 'zustand';
import { type UnifiedMessageEvent, WSConnection } from '../../utils';
import type { WSStore, WSStoreConnectionOptions } from './_types';

export const useWSStore = create<WSStore>((set, get) => ({
	connections: [],
	message: null,
	closedConnection: null,
	actions: {
		addConnection: (name: string, options: WSStoreConnectionOptions) => {
			const existingConnection = get().connections.find((c) => c.name === name);
			existingConnection?.connection.close({
				code: 1000,
				reason: 'Connection replaced',
			});

			const userOnMessageCallback = options.onMessageCallback;
			const connection = new WSConnection({
				...options,
				unifiedMessages: true,
				onMessageCallback: (message) => {
					set({
						message: message as UnifiedMessageEvent<unknown>,
					});

					userOnMessageCallback?.(message as UnifiedMessageEvent<unknown>);

					if (message.type === 'close') {
						set({ closedConnection: name });
					}
				},
			});

			const nextConnection = { name, connection };
			set((state) => ({
				connections: [...state.connections.filter((connection) => connection.name !== name), nextConnection],
			}));

			return nextConnection;
		},
		removeConnection: (name: string) => {
			const existingConnection = get().connections.find((c) => c.name === name);
			if (!existingConnection) return;

			existingConnection.connection.close({
				code: 1000,
				reason: 'Connection removed',
			});
			set((state) => ({
				connections: state.connections.filter((connection) => connection.name !== name),
			}));
		},
	},
}));

// reactive hook exports for React components
export const useWS = () => useWSStore((state) => state.actions);
export const useConnectionClose = () => useWSStore((state) => state.closedConnection);
export const useConnectionMessage = (connection: string) =>
	useWSStore((state) => (state.connections.some((entry) => entry.name === connection) ? state.message : null));
export const useIsConnected = (connection?: string) =>
	useWSStore((state) => {
		if (connection) {
			return state.connections.find((entry) => entry.name === connection)?.connection.connected ?? false;
		}

		return state.connections.some((entry) => entry.connection.connected);
	});

// reactive hook exports for reading the latest unified message state
export function useMessage(): UnifiedMessageEvent<unknown> | null;
export function useMessage<T = unknown>(type: 'message', connection?: string): T | string | Blob | ArrayBuffer | null;
export function useMessage(
	type: 'open' | 'error' | 'close',
	connection?: string,
): Event | ErrorEvent | CloseEvent | null;
export function useMessage<T = unknown>(type: string, connection?: string): T | string | Blob | ArrayBuffer | null;
export function useMessage<T = unknown>(type?: string, connection?: string) {
	return useWSStore((state) => {
		const sourceMessage = connection && !state.connections.some((c) => c.name === connection) ? null : state.message;
		if (!type) return sourceMessage;
		if (sourceMessage?.type !== type) return null;

		if (type === 'open' || type === 'error' || type === 'close') {
			return 'event' in sourceMessage ? sourceMessage.event : null;
		}

		return 'data' in sourceMessage ? (sourceMessage.data as T | string | Blob | ArrayBuffer) : null;
	});
}

// direct singleton access for non-React code
export const useWSActions = useWSStore.getState().actions;
export const useLastWSMessage = () => useWSStore.getState().message;
