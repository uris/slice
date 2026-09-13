import { create } from 'zustand';
import { BrowserChannel, type ChannelConfig } from '../../utils';
import type { BrowserChannelsStore } from './_types';

export const useBrowserChannelsStore = create<BrowserChannelsStore>((set, get) => ({
	channels: null,
	message: null,
	messages: null,
	actions: {
		addChannel: (config: ChannelConfig<any>, replace = true) => {
			const existingChannel = get().channels?.[config.name];
			if (existingChannel && !replace) return;

			existingChannel?.close();

			const userOnMessageCallback = config.onMessageCallback;
			const channel = new BrowserChannel({
				...config,
				onMessageCallback: (message) => {
					set((state) => ({
						message,
						messages: {
							...state.messages,
							[config.name]: message,
						},
					}));
					userOnMessageCallback(message);
				},
			});

			set((state) => {
				const nextMessages = { ...state.messages };
				delete nextMessages[config.name];

				return {
					channels: {
						...state.channels,
						[config.name]: channel,
					},
					// a new channel instance hasn't received anything yet - clear out
					// whatever the previous instance under this name last recorded
					messages: Object.keys(nextMessages).length > 0 ? nextMessages : null,
				};
			});
		},
		removeChannel: (channelName: string) => {
			const existingChannel = get().channels?.[channelName];
			if (!existingChannel) return false;

			existingChannel.close();

			set((state) => {
				const remainingChannels = { ...state.channels };
				delete remainingChannels[channelName];

				const remainingMessages = { ...state.messages };
				delete remainingMessages[channelName];

				return {
					channels: Object.keys(remainingChannels).length > 0 ? remainingChannels : null,
					messages: Object.keys(remainingMessages).length > 0 ? remainingMessages : null,
				};
			});

			return true;
		},
		addChannels: (configs: ChannelConfig<any>[], replace = true) => {
			for (const config of configs) {
				get().actions.addChannel(config, replace);
			}
		},
		removeChannels: () => {
			const existingChannels = get().channels;
			if (!existingChannels || Object.keys(existingChannels).length === 0) return false;

			for (const channel of Object.values(existingChannels)) {
				channel.close();
			}

			set({ channels: null, messages: null });
			return true;
		},
		isActiveChannel: (channelName: string) => Boolean(get().channels?.[channelName]),
	},
}));

// atomic hook exports for use in React components
export const useBrowserChannels = () => useBrowserChannelsStore((state) => state.channels);
export const useBrowserChannelActions = () => useBrowserChannelsStore((state) => state.actions);
export const useIsActiveChannel = (channelName: string) =>
	useBrowserChannelsStore((state) => Boolean(state.channels?.[channelName]));

/**
 * Returns the latest message received on one named channel, typed as `T`.
 * Unlike the shared `message` field, this is scoped strictly to the channel
 * named `channelName` and never reflects messages from any other channel.
 */
export const useMessage = <T = unknown>(channelName: string): T | null =>
	useBrowserChannelsStore((state) => (state.messages?.[channelName] as T | undefined) ?? null);

// non-reactive imperative exports for use outside the React context
export const browserChannelActions = useBrowserChannelsStore.getState().actions;
export const getBrowserChannels = () => useBrowserChannelsStore.getState().channels;
export const getLastBrowserChannelMessage = () => useBrowserChannelsStore.getState().message;

/**
 * Imperative, non-reactive counterpart to `useMessage`: snapshot-reads the
 * latest message for one named channel, typed as `T`.
 */
export const getMessage = <T = unknown>(channelName: string): T | null =>
	(useBrowserChannelsStore.getState().messages?.[channelName] as T | undefined) ?? null;
