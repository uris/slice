import type { SSEConnection, SSEConnectionOptions, SSEEventMap, SSEUnifiedMessage } from '../../utils';

export type SSEStoreConnectionOptions = Omit<SSEConnectionOptions<unknown, SSEEventMap>, 'unifiedOnMessage'> & {
	onMessageCallback?: (message: SSEUnifiedMessage<unknown, SSEEventMap>) => void;
};

export interface SSEStoreConnection {
	name: string;
	connection: SSEConnection<unknown, SSEEventMap>;
}

export interface SSEStore {
	connections: SSEStoreConnection[];
	message: SSEUnifiedMessage<unknown, SSEEventMap> | null;
	closedConnection: string | null;
	actions: {
		addConnection: (name: string, options: SSEStoreConnectionOptions) => SSEStoreConnection;
		removeConnection: (name: string) => void;
	};
}
