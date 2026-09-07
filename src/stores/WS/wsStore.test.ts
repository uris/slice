import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	useConnectionClose,
	useConnectionMessage,
	useIsConnected,
	useLastWSMessage,
	useWSActions,
	useWSStore,
} from './wsStore';

type Listener = (event: Event) => void;

class MockWebSocket {
	static readonly CONNECTING = 0;
	static readonly OPEN = 1;
	static readonly CLOSING = 2;
	static readonly CLOSED = 3;

	readyState = MockWebSocket.CONNECTING;
	url: string;
	private readonly listeners = new Map<string, Listener[]>();

	constructor(url: string) {
		this.url = url;
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

	send() {}

	close() {
		this.readyState = MockWebSocket.CLOSED;
	}

	dispatch(type: string, event: Event) {
		if (type === 'open') this.readyState = MockWebSocket.OPEN;
		for (const listener of this.listeners.get(type) ?? []) {
			listener(event);
		}
	}
}

function messageEvent(data: unknown) {
	return { data } as MessageEvent;
}

function rawSocketOf(name: string) {
	const entry = useWSStore.getState().connections.find((c) => c.name === name);
	return entry?.connection.connection as unknown as MockWebSocket;
}

beforeEach(() => {
	vi.stubGlobal('WebSocket', MockWebSocket);
	useWSStore.setState({ connections: [], message: null, closedConnection: null });
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('wsStore', () => {
	it('addConnection() registers a connection reachable by name', () => {
		useWSStore.getState().actions.addConnection('feed', { url: 'wss://x' });

		expect(useWSStore.getState().connections).toHaveLength(1);
		expect(useWSStore.getState().connections[0].name).toBe('feed');
	});

	it('addConnection() with an existing name closes the old one and replaces it', () => {
		useWSStore.getState().actions.addConnection('feed', { url: 'wss://x' });
		const first = rawSocketOf('feed');

		useWSStore.getState().actions.addConnection('feed', { url: 'wss://y' });

		expect(first.readyState).toBe(MockWebSocket.CLOSED);
		expect(useWSStore.getState().connections).toHaveLength(1);
		expect(rawSocketOf('feed').url).toBe('wss://y');
	});

	it('removeConnection() closes and removes a tracked connection', () => {
		useWSStore.getState().actions.addConnection('feed', { url: 'wss://x' });
		const raw = rawSocketOf('feed');

		useWSStore.getState().actions.removeConnection('feed');

		expect(raw.readyState).toBe(MockWebSocket.CLOSED);
		expect(useWSStore.getState().connections).toHaveLength(0);
	});

	it('removeConnection() on an unknown name is a no-op', () => {
		expect(() =>
			useWSStore.getState().actions.removeConnection('missing'),
		).not.toThrow();
	});

	it('updates message state and forwards to the caller onMessageCallback', () => {
		const onMessageCallback = vi.fn();
		useWSStore.getState().actions.addConnection('feed', {
			url: 'wss://x',
			onMessageCallback,
		});
		const raw = rawSocketOf('feed');
		raw.dispatch('open', new Event('open'));

		raw.dispatch('message', messageEvent('hello'));

		expect(useWSStore.getState().message).toEqual(
			expect.objectContaining({ type: 'message', data: 'hello' }),
		);
		expect(onMessageCallback).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'message', data: 'hello' }),
		);
		expect(useLastWSMessage()).toEqual(useWSStore.getState().message);
	});

	it('marks the connection closed on a close event', () => {
		useWSStore.getState().actions.addConnection('feed', { url: 'wss://x' });
		const raw = rawSocketOf('feed');
		raw.dispatch('open', new Event('open'));

		raw.dispatch(
			'close',
			{ wasClean: true, code: 1000, reason: '' } as CloseEvent,
		);

		expect(useWSStore.getState().closedConnection).toBe('feed');
	});

	it('exposes atomic selector hooks for connection state and messages', () => {
		useWSStore.getState().actions.addConnection('feed', { url: 'wss://x' });
		const raw = rawSocketOf('feed');
		raw.dispatch('open', new Event('open'));
		raw.dispatch('message', messageEvent('hi'));

		const { result: connected } = renderHook(() => useIsConnected('feed'));
		const { result: connectedGlobal } = renderHook(() => useIsConnected());
		const { result: message } = renderHook(() => useConnectionMessage('feed'));
		const { result: unknownMessage } = renderHook(() =>
			useConnectionMessage('other'),
		);
		const { result: closed } = renderHook(() => useConnectionClose());

		expect(connected.current).toBe(true);
		expect(connectedGlobal.current).toBe(true);
		expect(message.current).toEqual(
			expect.objectContaining({ type: 'message', data: 'hi' }),
		);
		expect(unknownMessage.current).toBeNull();
		expect(closed.current).toBeNull();
	});

	it('useWSActions exposes the same actions object as the store', () => {
		expect(useWSActions).toBe(useWSStore.getState().actions);
	});
});
