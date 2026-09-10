import { create } from 'zustand';
import { SSEConnection, type SSEEventMap, type SSEUnifiedMessage } from '../../utils';
import type { SSEStore, SSEStoreConnectionOptions } from './_types';

export const useSSEStore = create<SSEStore>((set, get) => ({
	connections: [],
	message: null,
	closedConnection: null,
	actions: {
		addConnection: (name: string, options: SSEStoreConnectionOptions) => {
			const existingConnection = get().connections.find((c) => c.name === name);
			existingConnection?.connection.close();

			const userOnMessageCallback = options.onMessageCallback;
			const connection = new SSEConnection({
				...options,
				unifiedOnMessage: true,
				onMessageCallback: (message) => {
					set({ message });
					userOnMessageCallback?.(message);
					if (message.type === 'close') {
						set({ closedConnection: name });
						get().actions.removeConnection(name);
					}
				},
			});

			set((state) => ({
				connections: [...state.connections.filter((connection) => connection.name !== name), { name, connection }],
			}));

			return { name, connection };
		},
		removeConnection: (name: string) => {
			const existingConnection = get().connections.find((c) => c.name === name);
			if (!existingConnection) return;

			existingConnection.connection.close();
			set((state) => ({
				connections: state.connections.filter((connection) => connection.name !== name),
			}));
		},
	},
}));

// atomic hook exports for use in React components
export const useSSE = () => useSSEStore((state) => state.actions);
export const useConnectionClose = () => useSSEStore((state) => state.closedConnection);
export const useConnectionMessage = (connection: string) =>
	useSSEStore((state) => (state.connections.some((entry) => entry.name === connection) ? state.message : null));
export const useIsConnected = (connection?: string) =>
	useSSEStore((state) => {
		if (connection) {
			return state.connections.find((entry) => entry.name === connection)?.connection.connected ?? false;
		}

		return state.connections.some((entry) => entry.connection.connected);
	});

// reactive hook exports for reading the latest unified message state
export function useMessage(): SSEUnifiedMessage<unknown, SSEEventMap> | null;
export function useMessage<T = unknown>(type: 'message', connection?: string): T | string | null;
export function useMessage(type: 'open' | 'error' | 'close', connection?: string): Event | null;
export function useMessage<T = unknown>(type: string, connection?: string): T | string | null;
export function useMessage<T = unknown>(type?: string, connection?: string) {
	return useSSEStore((state) => {
		const sourceMessage = connection && !state.connections.some((c) => c.name === connection) ? null : state.message;
		if (!type) return sourceMessage;
		if (sourceMessage?.type !== type) return null;

		if (type === 'open' || type === 'error' || type === 'close') {
			return 'event' in sourceMessage ? sourceMessage.event : null;
		}

		return 'data' in sourceMessage ? (sourceMessage.data as T | string) : null;
	});
}

// non-reactive imperative exports for use outside the React context
export const useSSEActions = useSSEStore.getState().actions;
export const useLastSSEMessage = () => useSSEStore.getState().message;
