import type { UnifiedMessageEvent, WSConnection, WSConnectionOptions } from '../../utils';

export type WSStoreConnectionOptions = Omit<WSConnectionOptions<unknown>, 'unifiedMessages'> & {
	onMessageCallback?: (message: UnifiedMessageEvent<unknown>) => void;
};

export interface WSStoreConnection {
	name: string;
	connection: WSConnection<unknown>;
}

export interface WSStore {
	connections: WSStoreConnection[];
	message: UnifiedMessageEvent<unknown> | null;
	closedConnection: string | null;
	actions: {
		addConnection: (name: string, options: WSStoreConnectionOptions) => WSStoreConnection;
		removeConnection: (name: string) => void;
	};
}
