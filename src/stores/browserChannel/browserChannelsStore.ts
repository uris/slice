import { create } from 'zustand';
import { BrowserChannel, type BrowserChannelMessage, type MessageType } from '../../utils';
import type { BrowserChannelConfig, BrowserChannelsStore } from './_types';

export const useBrowserChannelsStore = create<BrowserChannelsStore>((set, get) => ({
	channels: null,
	message: null,
	messages: null,
	actions: {
		addChannel: (config: BrowserChannelConfig<any>, replace = true) => {
			const existingChannel = get().channels?.[config.name];
			if (existingChannel && !replace) return;

			existingChannel?.close();

			// the store treats every message the same way, data or error - it
			// always wires its own callbacks, so callers never supply one
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
				},
				onErrorCallback: () => {},
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
		addChannels: (configs: BrowserChannelConfig<any>[], replace = true) => {
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
		// looks up the live BrowserChannel by name and posts through it directly -
		// this is what lets a caller send a message without ever touching the
		// underlying BrowserChannel instance themselves. Mirrors removeChannel's
		// pattern: returns false (and does nothing) if the name isn't registered.
		post: <T = any>(channelName: string, message: T) => {
			const channel = get().channels?.[channelName];
			if (!channel) return false;

			channel.post(message);
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
 * Returns the latest message on one named channel, typed as `T`, optionally
 * narrowed to one `MessageType`. Data and error messages share the same slot
 * per channel - errors aren't tracked separately - so `useMessage(name)`
 * always reflects whichever arrived most recently, while
 * `useMessage(name, type)` returns `null` if the latest message doesn't
 * match that type. Unlike the shared `message` field, this is scoped
 * strictly to the named channel and never reflects any other channel's
 * messages.
 */
export function useMessage<T = unknown>(channelName: string): BrowserChannelMessage<T> | null;
export function useMessage<T = unknown>(channelName: string, type: MessageType): BrowserChannelMessage<T> | null;
export function useMessage<T = unknown>(channelName: string, type?: MessageType) {
	return useBrowserChannelsStore((state) => {
		const message = state.messages?.[channelName] as BrowserChannelMessage<T> | undefined;
		if (!message) return null;
		if (type && message.type !== type) return null;
		return message;
	});
}

// non-reactive imperative exports for use outside the React context
export const browserChannelActions = useBrowserChannelsStore.getState().actions;
export const getBrowserChannels = () => useBrowserChannelsStore.getState().channels;
export const getLastBrowserChannelMessage = () => useBrowserChannelsStore.getState().message;

/**
 * Imperative, non-reactive counterpart to `useMessage`: snapshot-reads the
 * latest message envelope for one named channel, typed as `T`, optionally
 * narrowed to one `MessageType`.
 */
export function getMessage<T = unknown>(channelName: string): BrowserChannelMessage<T> | null;
export function getMessage<T = unknown>(channelName: string, type: MessageType): BrowserChannelMessage<T> | null;
export function getMessage<T = unknown>(channelName: string, type?: MessageType) {
	const message = useBrowserChannelsStore.getState().messages?.[channelName] as BrowserChannelMessage<T> | undefined;
	if (!message) return null;
	if (type && message.type !== type) return null;
	return message;
}
