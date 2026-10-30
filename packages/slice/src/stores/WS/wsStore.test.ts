import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	useConnectionClose,
	useConnectionMessage,
	useIsConnected,
	useLastWSMessage,
	useMessage,
	useWS,
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
	useWSStore.setState({
		connections: [],
		message: null,
		closedConnection: null,
	});
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

		raw.dispatch('close', {
			wasClean: true,
			code: 1000,
			reason: '',
		} as CloseEvent);

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
		const { result: unknownConnected } = renderHook(() => useIsConnected('missing'));

		expect(connected.current).toBe(true);
		expect(connectedGlobal.current).toBe(true);
		expect(message.current).toEqual(
			expect.objectContaining({ type: 'message', data: 'hi' }),
		);
		expect(unknownMessage.current).toBeNull();
		expect(closed.current).toBeNull();
		expect(unknownConnected.current).toBe(false);
	});

	it('useWSActions exposes the same actions object as the store', () => {
		expect(useWSActions).toBe(useWSStore.getState().actions);
	});

	it('useWS() returns the live actions object from a component', () => {
		const { result } = renderHook(() => useWS());
		expect(result.current).toBe(useWSStore.getState().actions);
	});

	// useMessage's four public overloads have no signature for "type omitted,
	// connection given" (the zero-arg overload accepts no connection at all) -
	// this cast reaches that combination anyway, since the runtime
	// implementation supports it even though the public type surface doesn't
	// expose it
	const untypedUseMessage = useMessage as (type?: string, connection?: string) => unknown;

	describe('useMessage()', () => {
		it('returns null when a connection filter names an untracked connection', () => {
			useWSStore.setState({
				connections: [],
				message: { type: 'message', data: 'hi', event: messageEvent('hi') },
			});

			const { result } = renderHook(() => untypedUseMessage(undefined, 'missing'));
			expect(result.current).toBeNull();
		});

		it('returns the raw message when no type filter is given and the connection matches', () => {
			const message = { type: 'message', data: 'hi', event: messageEvent('hi') } as const;
			// useMessage's connection filter only checks connections[].name, so a
			// minimal stand-in entry is enough - no real WebSocket needed
			useWSStore.setState({
				connections: [{ name: 'feed', connection: {} as never }],
				message,
			});

			const { result } = renderHook(() => untypedUseMessage(undefined, 'feed'));
			expect(result.current).toEqual(message);
		});

		it('returns the raw message when neither type nor connection is provided', () => {
			const message = { type: 'message', data: 'hi', event: messageEvent('hi') } as const;
			useWSStore.setState({ connections: [], message });

			const { result } = renderHook(() => useMessage());
			expect(result.current).toEqual(message);
		});

		it('returns null when the message type does not match the requested type', () => {
			useWSStore.setState({
				connections: [],
				message: { type: 'open', event: new Event('open') },
			});

			const { result } = renderHook(() => useMessage('message'));
			expect(result.current).toBeNull();
		});

		it.each(['open', 'error', 'close'] as const)('returns the underlying event for a %s message', (type) => {
			const event = new Event(type);
			useWSStore.setState({ connections: [], message: { type, event } as never });

			const { result } = renderHook(() => useMessage(type));
			expect(result.current).toBe(event);
		});

		it('returns the underlying data for a message-type payload', () => {
			useWSStore.setState({
				connections: [],
				message: { type: 'message', data: 'payload', event: messageEvent('payload') },
			});

			const { result } = renderHook(() => useMessage('message'));
			expect(result.current).toBe('payload');
		});

		it('returns null for an open/error/close message that is missing its event (defensive fallback)', () => {
			useWSStore.setState({
				connections: [],
				message: { type: 'open' } as never,
			});

			const { result } = renderHook(() => useMessage('open'));
			expect(result.current).toBeNull();
		});

		it('returns null for a message-type payload that is missing its data (defensive fallback)', () => {
			useWSStore.setState({
				connections: [],
				message: { type: 'message', event: messageEvent('x') } as never,
			});

			const { result } = renderHook(() => useMessage('message'));
			expect(result.current).toBeNull();
		});
	});
});
