import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MessageType } from '../../utils';
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

// wire-format helper: real senders always deliver the { content, type, origin }
// envelope that BrowserChannel.post() wraps outgoing data messages in
function dataEvent(content: unknown, origin = 'test-origin') {
	return { data: { content, type: MessageType.Data, origin } } as MessageEvent;
}

// a raw `messageerror` event, the shape BrowserChannel.onError expects to receive
// straight from the native BroadcastChannel - not pre-wrapped, since BrowserChannel
// itself builds the { content, type: Error, origin } envelope from this
function rawErrorEvent() {
	return { type: 'messageerror', origin: '', lastEventId: '', data: null } as MessageEvent;
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
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' });

		expect(Object.keys(getBrowserChannels() ?? {})).toEqual(['chat']);
	});

	it('addChannel() with an existing name closes the old one and replaces it', () => {
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' });
		const first = rawChannelOf('chat');

		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' });

		expect(first.closed).toBe(true);
		expect(Object.keys(getBrowserChannels() ?? {})).toEqual(['chat']);
		expect(rawChannelOf('chat')).not.toBe(first);
	});

	it('removeChannel() closes and removes a tracked channel, clearing back to null when empty', () => {
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' });
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
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' }, false);

		expect(Object.keys(getBrowserChannels() ?? {})).toEqual(['chat']);
	});

	it('addChannel() with replace: false and an existing channel leaves it completely untouched', () => {
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat', origin: 'original' });
		const first = rawChannelOf('chat');
		const firstOrigin = useBrowserChannelsStore.getState().channels?.chat?.origin;

		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat', origin: 'attempted-replacement' }, false);

		expect(first.closed).toBe(false);
		expect(rawChannelOf('chat')).toBe(first);
		expect(useBrowserChannelsStore.getState().channels?.chat?.origin).toBe(firstOrigin);
	});

	it('addChannel() with replace: true (the default) still closes and replaces an existing channel', () => {
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' });
		const first = rawChannelOf('chat');

		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' }, true);

		expect(first.closed).toBe(true);
		expect(rawChannelOf('chat')).not.toBe(first);
	});

	it('addChannels() with replace: false only creates channels that do not already exist', () => {
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' });
		const existingChat = rawChannelOf('chat');

		useBrowserChannelsStore.getState().actions.addChannels([{ name: 'chat' }, { name: 'notifications' }], false);

		expect(rawChannelOf('chat')).toBe(existingChat);
		expect(Object.keys(getBrowserChannels() ?? {}).sort()).toEqual(['chat', 'notifications']);
	});

	it("removeChannel() clears that channel's recorded message", () => {
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' });
		rawChannelOf('chat').dispatch('message', dataEvent('hi'));
		expect(getMessage('chat')?.content).toBe('hi');

		useBrowserChannelsStore.getState().actions.removeChannel('chat');

		expect(getMessage('chat')).toBeNull();
		expect(useBrowserChannelsStore.getState().messages).toBeNull();
	});

	it("addChannel() with an existing name clears that name's previously recorded message", () => {
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' });
		rawChannelOf('chat').dispatch('message', dataEvent('old message'));
		expect(getMessage('chat')?.content).toBe('old message');

		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' });

		// the new channel instance hasn't received anything yet, so the stale
		// message from the replaced instance must not leak through
		expect(getMessage('chat')).toBeNull();
	});

	it('addChannels() registers multiple channels at once', () => {
		useBrowserChannelsStore.getState().actions.addChannels([{ name: 'chat' }, { name: 'notifications' }]);

		expect(Object.keys(getBrowserChannels() ?? {}).sort()).toEqual(['chat', 'notifications']);
	});

	it('removeChannels() closes every channel and resets state to null', () => {
		useBrowserChannelsStore.getState().actions.addChannels([{ name: 'chat' }, { name: 'notifications' }]);
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

		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' });

		expect(useBrowserChannelsStore.getState().actions.isActiveChannel('chat')).toBe(true);
	});

	it('post() sends a message through the named channel, wrapped as BrowserChannel.post() would', () => {
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat', origin: 'my-tab' });
		const sender = useBrowserChannelsStore.getState().channels?.chat;

		const sent = useBrowserChannelsStore.getState().actions.post('chat', { text: 'hi' });

		expect(sent).toBe(true);
		expect(rawChannelOf('chat').posted).toEqual([
			{ content: { text: 'hi' }, type: MessageType.Data, origin: sender?.origin },
		]);
	});

	it('post() on an unregistered channel name returns false and posts nothing', () => {
		expect(useBrowserChannelsStore.getState().actions.post('missing', { text: 'hi' })).toBe(false);
	});

	it('updates message state (as the { content, type, origin } envelope) when a message arrives', () => {
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' });
		const raw = rawChannelOf('chat');

		raw.dispatch('message', dataEvent({ text: 'hi' }, 'sender-a'));

		expect(getLastBrowserChannelMessage()).toEqual({
			content: { text: 'hi' },
			type: MessageType.Data,
			origin: 'sender-a',
		});
		expect(getMessage('chat')).toEqual({
			content: { text: 'hi' },
			type: MessageType.Data,
			origin: 'sender-a',
		});
	});

	it('treats a messageerror as just another message: it updates the same message state, as type: Error', () => {
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat', origin: 'my-tab' });
		const sender = useBrowserChannelsStore.getState().channels?.chat;
		const raw = rawChannelOf('chat');

		raw.dispatch('messageerror', rawErrorEvent());

		const message = getMessage('chat');
		expect(message?.type).toBe(MessageType.Error);
		expect(message?.origin).toBe(sender?.origin);
		expect(typeof message?.content).toBe('string');
	});

	it('useMessage() scopes messages strictly to the named channel, not any other channel', () => {
		type UserMessage = { id: string };
		type ChatMessage = { text: string };

		useBrowserChannelsStore.getState().actions.addChannels([{ name: 'user' }, { name: 'chat' }]);

		rawChannelOf('user').dispatch('message', dataEvent({ id: 'u1' }, 'user-tab'));

		const { result: userMessage } = renderHook(() => useMessage<UserMessage>('user'));
		const { result: chatMessage } = renderHook(() => useMessage<ChatMessage>('chat'));

		expect(userMessage.current).toEqual({ content: { id: 'u1' }, type: MessageType.Data, origin: 'user-tab' });
		// 'chat' has not received anything - it must not see the 'user' channel's message
		expect(chatMessage.current).toBeNull();

		act(() => {
			rawChannelOf('chat').dispatch('message', dataEvent({ text: 'hello' }, 'chat-tab'));
		});

		const { result: chatMessageAfter } = renderHook(() => useMessage<ChatMessage>('chat'));
		expect(chatMessageAfter.current).toEqual({ content: { text: 'hello' }, type: MessageType.Data, origin: 'chat-tab' });
		// 'user' keeps its own last message, unaffected by 'chat' receiving one
		expect(getMessage<UserMessage>('user')).toEqual({ content: { id: 'u1' }, type: MessageType.Data, origin: 'user-tab' });
	});

	it('useMessage(name, type) / getMessage(name, type) narrow to one MessageType, one shared slot per channel', () => {
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' });
		const raw = rawChannelOf('chat');

		raw.dispatch('message', dataEvent('a data message'));

		expect(getMessage('chat', MessageType.Data)?.content).toBe('a data message');
		expect(getMessage('chat', MessageType.Error)).toBeNull();

		// an error arrives after - it's just another message, so it overwrites
		// the same slot rather than being tracked separately
		raw.dispatch('messageerror', rawErrorEvent());

		expect(getMessage('chat')?.type).toBe(MessageType.Error);
		expect(getMessage('chat', MessageType.Error)).not.toBeNull();
		// the data message is no longer retrievable - there's only one slot
		expect(getMessage('chat', MessageType.Data)).toBeNull();

		const { result: filteredToError } = renderHook(() => useMessage('chat', MessageType.Error));
		const { result: filteredToData } = renderHook(() => useMessage('chat', MessageType.Data));
		expect(filteredToError.current?.type).toBe(MessageType.Error);
		expect(filteredToData.current).toBeNull();
	});

	it('useMessage() and getMessage() return null for a channel that has not received anything yet', () => {
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' });

		const { result } = renderHook(() => useMessage('chat'));

		expect(result.current).toBeNull();
		expect(getMessage('chat')).toBeNull();
	});

	it("carries the sending BrowserChannel instance's real origin end-to-end through the store", () => {
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat', origin: 'my-tab' });
		const sender = useBrowserChannelsStore.getState().channels?.chat;

		// simulate a message actually posted by this same BrowserChannel instance
		// arriving back over the (mocked) wire, the way a real BroadcastChannel would
		rawChannelOf('chat').dispatch('message', dataEvent({ text: 'hi' }, sender?.origin ?? ''));

		expect(sender?.origin.startsWith('my-tab.')).toBe(true);
		expect(getMessage<{ text: string }>('chat')?.origin).toBe(sender?.origin);
	});

	it('exposes atomic selector hooks for channel state', () => {
		useBrowserChannelsStore.getState().actions.addChannel({ name: 'chat' });

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
