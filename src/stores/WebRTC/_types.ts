import type { WebRTCConnection, WebRTCConnectionOptions } from '../../utils';

export type WebRTCStoreConnectionOptions = WebRTCConnectionOptions;

export interface WebRTCStoreConnection {
	name: string;
	connection: WebRTCConnection;
}

export interface WebRTCStore {
	connections: WebRTCStoreConnection[];
	actions: {
		addConnection: (name: string, options: WebRTCStoreConnectionOptions) => WebRTCStoreConnection;
		initializeConnection: (name: string, offerOptions?: RTCOfferOptions, bearerToken?: string) => Promise<void>;
		removeConnection: (name: string) => void;
		setMicStream: (name: string, stream: MediaStream | null) => Promise<void>;
		setVolume: (name: string, volume: number) => void;
	};
}
