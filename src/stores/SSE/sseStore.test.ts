import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	useConnectionClose,
	useConnectionMessage,
	useIsConnected,
	useLastSSEMessage,
	useMessage,
	useSSE,
	useSSEActions,
	useSSEStore,
} from './sseStore';

type Listener = (event: MessageEvent | Event) => void;

class MockEventSource {
	static readonly CONNECTING = 0;
	static readonly OPEN = 1;
	static readonly CLOSED = 2;

	readyState = MockEventSource.CONNECTING;
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

	close() {
		this.readyState = MockEventSource.CLOSED;
	}

	dispatch(type: string, event: Event | MessageEvent) {
		if (type === 'open') this.readyState = MockEventSource.OPEN;
		for (const listener of this.listeners.get(type) ?? []) {
			listener(event);
		}
	}
}

function messageEvent(data: string) {
	return { data } as MessageEvent;
}

function rawSourceOf(name: string) {
	const entry = useSSEStore.getState().connections.find((c) => c.name === name);
	return entry?.connection.connection as unknown as MockEventSource;
}

beforeEach(() => {
	vi.stubGlobal('EventSource', MockEventSource);
	useSSEStore.setState({
		connections: [],
		message: null,
		closedConnection: null,
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('sseStore', () => {
	it('addConnection() registers a connection reachable by name', () => {
		useSSEStore.getState().actions.addConnection('feed', { url: '/events' });

		expect(useSSEStore.getState().connections).toHaveLength(1);
		expect(useSSEStore.getState().connections[0].name).toBe('feed');
	});

	it('addConnection() with an existing name closes the old one and replaces it', () => {
		useSSEStore.getState().actions.addConnection('feed', { url: '/events' });
		const first = rawSourceOf('feed');

		useSSEStore.getState().actions.addConnection('feed', { url: '/events-2' });

		expect(first.readyState).toBe(MockEventSource.CLOSED);
		expect(useSSEStore.getState().connections).toHaveLength(1);
		expect(rawSourceOf('feed').url).toBe('/events-2');
	});

	it('removeConnection() closes and removes a tracked connection', () => {
		useSSEStore.getState().actions.addConnection('feed', { url: '/events' });
		const raw = rawSourceOf('feed');

		useSSEStore.getState().actions.removeConnection('feed');

		expect(raw.readyState).toBe(MockEventSource.CLOSED);
		expect(useSSEStore.getState().connections).toHaveLength(0);
	});

	it('removeConnection() on an unknown name is a no-op', () => {
		expect(() =>
			useSSEStore.getState().actions.removeConnection('missing'),
		).not.toThrow();
	});

	it('updates message state and forwards to the caller onMessageCallback', () => {
		const onMessageCallback = vi.fn();
		useSSEStore.getState().actions.addConnection('feed', {
			url: '/events',
			onMessageCallback,
		});
		const raw = rawSourceOf('feed');

		raw.dispatch('message', messageEvent('hello'));

		expect(useSSEStore.getState().message).toEqual(
			expect.objectContaining({ type: 'message', data: 'hello' }),
		);
		expect(onMessageCallback).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'message', data: 'hello' }),
		);
		expect(useLastSSEMessage()).toEqual(useSSEStore.getState().message);
	});

	it('marks the connection closed and removes it on a close message', () => {
		useSSEStore.getState().actions.addConnection('feed', {
			url: '/events',
			connectionClose: { message: 'eos' },
		});

		const raw = rawSourceOf('feed');
		raw.dispatch('message', messageEvent('eos'));

		expect(useSSEStore.getState().closedConnection).toBe('feed');
		expect(useSSEStore.getState().connections).toHaveLength(0);
	});

	it('exposes atomic selector hooks for connection state and messages', () => {
		useSSEStore.getState().actions.addConnection('feed', { url: '/events' });
		const raw = rawSourceOf('feed');
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

	it('useSSEActions exposes the same actions object as the store', () => {
		expect(useSSEActions).toBe(useSSEStore.getState().actions);
	});

	it('useSSE() returns the live actions object from a component', () => {
		const { result } = renderHook(() => useSSE());
		expect(result.current).toBe(useSSEStore.getState().actions);
	});

	// useMessage's four public overloads have no signature for "type omitted,
	// connection given" (the zero-arg overload accepts no connection at all) -
	// this cast reaches that combination anyway, since the runtime
	// implementation supports it even though the public type surface doesn't
	// expose it
	const untypedUseMessage = useMessage as (type?: string, connection?: string) => unknown;

	describe('useMessage()', () => {
		it('returns null when a connection filter names an untracked connection', () => {
			useSSEStore.setState({
				connections: [],
				message: { type: 'message', data: 'hi', event: messageEvent('hi') },
			});

			const { result } = renderHook(() => untypedUseMessage(undefined, 'missing'));
			expect(result.current).toBeNull();
		});

		it('returns the raw message when no type filter is given and the connection matches', () => {
			const message = { type: 'message', data: 'hi', event: messageEvent('hi') } as const;
			// useMessage's connection filter only checks connections[].name, so a
			// minimal stand-in entry is enough - no real EventSource needed
			useSSEStore.setState({
				connections: [{ name: 'feed', connection: {} as never }],
				message,
			});

			const { result } = renderHook(() => untypedUseMessage(undefined, 'feed'));
			expect(result.current).toEqual(message);
		});

		it('returns the raw message when neither type nor connection is provided', () => {
			const message = { type: 'message', data: 'hi', event: messageEvent('hi') } as const;
			useSSEStore.setState({ connections: [], message });

			const { result } = renderHook(() => useMessage());
			expect(result.current).toEqual(message);
		});

		it('returns null when the message type does not match the requested type', () => {
			useSSEStore.setState({
				connections: [],
				message: { type: 'open', event: new Event('open') },
			});

			const { result } = renderHook(() => useMessage('message'));
			expect(result.current).toBeNull();
		});

		it.each(['open', 'error', 'close'] as const)('returns the underlying event for a %s message', (type) => {
			const event = new Event(type);
			useSSEStore.setState({ connections: [], message: { type, event } as never });

			const { result } = renderHook(() => useMessage(type));
			expect(result.current).toBe(event);
		});

		it('returns the underlying data for a message-type payload', () => {
			useSSEStore.setState({
				connections: [],
				message: { type: 'message', data: 'payload', event: messageEvent('payload') },
			});

			const { result } = renderHook(() => useMessage('message'));
			expect(result.current).toBe('payload');
		});

		it('returns null for an open/error/close message that is missing its event (defensive fallback)', () => {
			useSSEStore.setState({
				connections: [],
				message: { type: 'open' } as never,
			});

			const { result } = renderHook(() => useMessage('open'));
			expect(result.current).toBeNull();
		});

		it('returns null for a message-type payload that is missing its data (defensive fallback)', () => {
			useSSEStore.setState({
				connections: [],
				message: { type: 'message', event: messageEvent('x') } as never,
			});

			const { result } = renderHook(() => useMessage('message'));
			expect(result.current).toBeNull();
		});
	});
});
