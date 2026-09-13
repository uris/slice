import type { BrowserChannel, BrowserChannelMessage, ChannelConfig } from '../../utils';

/**
 * What the store's own `addChannel` / `addChannels` accept: a regular
 * {@link ChannelConfig} minus its callbacks. The store always supplies its
 * own `onMessageCallback` / `onErrorCallback` internally - since every
 * `BrowserChannel` message (data or error) now flows through one unified
 * callback, there's nothing left for a caller-supplied callback to do here.
 * Reach for `useMessage` / `getMessage` to read what a channel receives, or
 * use `BrowserChannel` directly when you need full control over callbacks.
 */
export type BrowserChannelConfig<T> = Omit<ChannelConfig<T>, 'onMessageCallback' | 'onErrorCallback'>;

export interface BrowserChannelsStore {
	channels: Record<string, BrowserChannel<any>> | null;
	message: any;
	messages: Record<string, BrowserChannelMessage<unknown>> | null;
	actions: {
		addChannel: (config: BrowserChannelConfig<any>, replace?: boolean) => void;
		removeChannel: (channelName: string) => boolean;
		addChannels: (configs: BrowserChannelConfig<any>[], replace?: boolean) => void;
		removeChannels: () => boolean;
		isActiveChannel: (channelName: string) => boolean;
		post: <T>(channelName: string, message: T) => boolean;
	};
}
