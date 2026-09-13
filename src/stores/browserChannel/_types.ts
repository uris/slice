import type { BrowserChannel, ChannelConfig } from '../../utils';

export interface BrowserChannelsStore {
	channels: Record<string, BrowserChannel<any>> | null;
	message: any;
	messages: Record<string, unknown> | null;
	actions: {
		addChannel: (config: ChannelConfig<any>, replace?: boolean) => void;
		removeChannel: (channelName: string) => boolean;
		addChannels: (configs: ChannelConfig<any>[], replace?: boolean) => void;
		removeChannels: () => boolean;
		isActiveChannel: (channelName: string) => boolean;
	};
}
