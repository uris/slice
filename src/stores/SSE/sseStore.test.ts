import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	useConnectionClose,
	useConnectionMessage,
	useIsConnected,
	useLastSSEMessage,
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

		expect(connected.current).toBe(true);
		expect(connectedGlobal.current).toBe(true);
		expect(message.current).toEqual(
			expect.objectContaining({ type: 'message', data: 'hi' }),
		);
		expect(unknownMessage.current).toBeNull();
		expect(closed.current).toBeNull();
	});

	it('useSSEActions exposes the same actions object as the store', () => {
		expect(useSSEActions).toBe(useSSEStore.getState().actions);
	});
});
