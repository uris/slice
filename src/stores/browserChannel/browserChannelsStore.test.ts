import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	browserChannelActions,
	getBrowserChannels,
	getLastBrowserChannelMessage,
	getMessage,
	useBrowserChannelActions,
	useBrowserChannelsStore,
	useIsActiveChannel,
	useMessage,
} from './browserChannelsStore';

type Listener = (event: MessageEvent) => void;

class MockBroadcastChannel {
	static instances: MockBroadcastChannel[] = [];

	name: string;
	closed = false;
	posted: unknown[] = [];
	private readonly listeners = new Map<string, Listener[]>();

	constructor(name: string) {
		this.name = name;
		MockBroadcastChannel.instances.push(this);
	}

	addEventListener(type: string, listener: Listener) {
		const current = this.listeners.get(type) ?? [];
		current.push(listener);
		this.listeners.set(type, current);
	}

	removeEventListener(type: string, listener: Listener) {
		const current = this.listeners.get(type) ?? [];
		this.listeners.set(
			type,
			current.filter((existing) => existing !== listener),
		);
	}

	postMessage(data: unknown) {
		this.posted.push(data);
	}

	close() {
		this.closed = true;
	}

	// test helper - not part of the real BroadcastChannel API
	dispatch(type: string, event: MessageEvent) {
		for (const listener of this.listeners.get(type) ?? []) {
			listener(event);
		}
	}
}

function messageEvent(data: unknown) {
	return { data } as MessageEvent;
}

function rawChannelOf(name: string) {
	const channel = useBrowserChannelsStore.getState().channels?.[name];
	return channel?.channel as unknown as MockBroadcastChannel;
}

beforeEach(() => {
	MockBroadcastChannel.instances = [];
	vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);
	useBrowserChannelsStore.setState({
		channels: null,
		message: null,
		messages: null,
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('browserChannelsStore', () => {
	it('addChannel() registers a channel reachable by name', () => {
		useBrowserChannelsStore.getState().actions.addChannel({
			name: 'chat',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});

		expect(Object.keys(getBrowserChannels() ?? {})).toEqual(['chat']);
	});

	it('addChannel() with an existing name closes the old one and replaces it', () => {
		useBrowserChannelsStore.getState().actions.addChannel({
			name: 'chat',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});
		const first = rawChannelOf('chat');

		useBrowserChannelsStore.getState().actions.addChannel({
			name: 'chat',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});

		expect(first.closed).toBe(true);
		expect(Object.keys(getBrowserChannels() ?? {})).toEqual(['chat']);
		expect(rawChannelOf('chat')).not.toBe(first);
	});

	it('removeChannel() closes and removes a tracked channel, clearing back to null when empty', () => {
		useBrowserChannelsStore.getState().actions.addChannel({
			name: 'chat',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});
		const raw = rawChannelOf('chat');

		const removed = useBrowserChannelsStore.getState().actions.removeChannel('chat');

		expect(removed).toBe(true);
		expect(raw.closed).toBe(true);
		expect(getBrowserChannels()).toBeNull();
	});

	it('removeChannel() on an unknown name returns false and is a no-op', () => {
		expect(useBrowserChannelsStore.getState().actions.removeChannel('missing')).toBe(false);
	});

	it('addChannel() with replace: false and no existing channel creates it normally', () => {
		useBrowserChannelsStore.getState().actions.addChannel(
			{ name: 'chat', onMessageCallback: vi.fn(), onErrorCallback: vi.fn() },
			false,
		);

		expect(Object.keys(getBrowserChannels() ?? {})).toEqual(['chat']);
	});

	it('addChannel() with replace: false and an existing channel leaves it untouched', () => {
		useBrowserChannelsStore.getState().actions.addChannel({
			name: 'chat',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});
		const first = rawChannelOf('chat');
		rawChannelOf('chat').dispatch('message', messageEvent('first'));

		const newOnMessageCallback = vi.fn();
		useBrowserChannelsStore.getState().actions.addChannel(
			{ name: 'chat', onMessageCallback: newOnMessageCallback, onErrorCallback: vi.fn() },
			false,
		);

		expect(first.closed).toBe(false);
		expect(rawChannelOf('chat')).toBe(first);
		expect(getMessage('chat')).toBe('first');

		// confirm the new config was never wired up - messages still reach the original callback
		rawChannelOf('chat').dispatch('message', messageEvent('second'));
		expect(newOnMessageCallback).not.toHaveBeenCalled();
	});

	it('addChannel() with replace: true (the default) still closes and replaces an existing channel', () => {
		useBrowserChannelsStore.getState().actions.addChannel({
			name: 'chat',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});
		const first = rawChannelOf('chat');

		useBrowserChannelsStore.getState().actions.addChannel(
			{ name: 'chat', onMessageCallback: vi.fn(), onErrorCallback: vi.fn() },
			true,
		);

		expect(first.closed).toBe(true);
		expect(rawChannelOf('chat')).not.toBe(first);
	});

	it('addChannels() with replace: false only creates channels that do not already exist', () => {
		useBrowserChannelsStore.getState().actions.addChannel({
			name: 'chat',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});
		const existingChat = rawChannelOf('chat');

		useBrowserChannelsStore.getState().actions.addChannels(
			[
				{ name: 'chat', onMessageCallback: vi.fn(), onErrorCallback: vi.fn() },
				{ name: 'notifications', onMessageCallback: vi.fn(), onErrorCallback: vi.fn() },
			],
			false,
		);

		expect(rawChannelOf('chat')).toBe(existingChat);
		expect(Object.keys(getBrowserChannels() ?? {}).sort()).toEqual(['chat', 'notifications']);
	});

	it("removeChannel() clears that channel's recorded message", () => {
		useBrowserChannelsStore.getState().actions.addChannel({
			name: 'chat',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});
		rawChannelOf('chat').dispatch('message', messageEvent('hi'));
		expect(getMessage('chat')).toBe('hi');

		useBrowserChannelsStore.getState().actions.removeChannel('chat');

		expect(getMessage('chat')).toBeNull();
		expect(useBrowserChannelsStore.getState().messages).toBeNull();
	});

	it('addChannel() with an existing name clears that name\'s previously recorded message', () => {
		useBrowserChannelsStore.getState().actions.addChannel({
			name: 'chat',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});
		rawChannelOf('chat').dispatch('message', messageEvent('old message'));
		expect(getMessage('chat')).toBe('old message');

		useBrowserChannelsStore.getState().actions.addChannel({
			name: 'chat',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});

		// the new channel instance hasn't received anything yet, so the stale
		// message from the replaced instance must not leak through
		expect(getMessage('chat')).toBeNull();
	});

	it('addChannels() registers multiple channels at once', () => {
		useBrowserChannelsStore.getState().actions.addChannels([
			{ name: 'chat', onMessageCallback: vi.fn(), onErrorCallback: vi.fn() },
			{ name: 'notifications', onMessageCallback: vi.fn(), onErrorCallback: vi.fn() },
		]);

		expect(Object.keys(getBrowserChannels() ?? {}).sort()).toEqual(['chat', 'notifications']);
	});

	it('removeChannels() closes every channel and resets state to null', () => {
		useBrowserChannelsStore.getState().actions.addChannels([
			{ name: 'chat', onMessageCallback: vi.fn(), onErrorCallback: vi.fn() },
			{ name: 'notifications', onMessageCallback: vi.fn(), onErrorCallback: vi.fn() },
		]);
		const chat = rawChannelOf('chat');
		const notifications = rawChannelOf('notifications');

		const removed = useBrowserChannelsStore.getState().actions.removeChannels();

		expect(removed).toBe(true);
		expect(chat.closed).toBe(true);
		expect(notifications.closed).toBe(true);
		expect(getBrowserChannels()).toBeNull();
		expect(useBrowserChannelsStore.getState().messages).toBeNull();
	});

	it('removeChannels() on an empty store returns false', () => {
		expect(useBrowserChannelsStore.getState().actions.removeChannels()).toBe(false);
	});

	it('isActiveChannel() reflects whether a channel is currently tracked', () => {
		expect(useBrowserChannelsStore.getState().actions.isActiveChannel('chat')).toBe(false);

		useBrowserChannelsStore.getState().actions.addChannel({
			name: 'chat',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});

		expect(useBrowserChannelsStore.getState().actions.isActiveChannel('chat')).toBe(true);
	});

	it('updates message state and forwards to the caller onMessageCallback', () => {
		const onMessageCallback = vi.fn();
		useBrowserChannelsStore.getState().actions.addChannel({
			name: 'chat',
			onMessageCallback,
			onErrorCallback: vi.fn(),
		});
		const raw = rawChannelOf('chat');

		raw.dispatch('message', messageEvent({ text: 'hi' }));

		expect(getLastBrowserChannelMessage()).toEqual({ text: 'hi' });
		expect(onMessageCallback).toHaveBeenCalledWith({ text: 'hi' });
	});

	it('routes messageerror events to the caller onErrorCallback', () => {
		const onErrorCallback = vi.fn();
		useBrowserChannelsStore.getState().actions.addChannel({
			name: 'chat',
			onMessageCallback: vi.fn(),
			onErrorCallback,
		});
		const raw = rawChannelOf('chat');
		const event = messageEvent(undefined);

		raw.dispatch('messageerror', event);

		expect(onErrorCallback).toHaveBeenCalledWith(event);
	});

	it('useMessage() scopes messages strictly to the named channel, not any other channel', () => {
		type UserMessage = { id: string };
		type ChatMessage = { text: string };

		useBrowserChannelsStore.getState().actions.addChannels([
			{ name: 'user', onMessageCallback: vi.fn(), onErrorCallback: vi.fn() },
			{ name: 'chat', onMessageCallback: vi.fn(), onErrorCallback: vi.fn() },
		]);

		rawChannelOf('user').dispatch('message', messageEvent({ id: 'u1' }));

		const { result: userMessage } = renderHook(() => useMessage<UserMessage>('user'));
		const { result: chatMessage } = renderHook(() => useMessage<ChatMessage>('chat'));

		expect(userMessage.current).toEqual({ id: 'u1' });
		// 'chat' has not received anything - it must not see the 'user' channel's message
		expect(chatMessage.current).toBeNull();

		act(() => {
			rawChannelOf('chat').dispatch('message', messageEvent({ text: 'hello' }));
		});

		const { result: chatMessageAfter } = renderHook(() => useMessage<ChatMessage>('chat'));
		expect(chatMessageAfter.current).toEqual({ text: 'hello' });
		// 'user' keeps its own last message, unaffected by 'chat' receiving one
		expect(getMessage<UserMessage>('user')).toEqual({ id: 'u1' });
	});

	it('useMessage() and getMessage() return null for a channel that has not received anything yet', () => {
		useBrowserChannelsStore.getState().actions.addChannel({
			name: 'chat',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});

		const { result } = renderHook(() => useMessage('chat'));

		expect(result.current).toBeNull();
		expect(getMessage('chat')).toBeNull();
	});

	it('exposes atomic selector hooks for channel state', () => {
		useBrowserChannelsStore.getState().actions.addChannel({
			name: 'chat',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});

		const { result: active } = renderHook(() => useIsActiveChannel('chat'));
		const { result: inactive } = renderHook(() => useIsActiveChannel('other'));

		expect(active.current).toBe(true);
		expect(inactive.current).toBe(false);
	});

	it('useBrowserChannelActions / browserChannelActions expose the same actions object as the store', () => {
		const { result } = renderHook(() => useBrowserChannelActions());
		expect(result.current).toBe(useBrowserChannelsStore.getState().actions);
		expect(browserChannelActions).toBe(useBrowserChannelsStore.getState().actions);
	});
});
