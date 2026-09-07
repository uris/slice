import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SSEConnection } from './SSEConnection';

type Listener = (event: MessageEvent | Event) => void;

class MockEventSource {
	static readonly CONNECTING = 0;
	static readonly OPEN = 1;
	static readonly CLOSED = 2;

	readyState = MockEventSource.CONNECTING;
	url: string;
	withCredentials: boolean;
	private readonly listeners = new Map<string, Listener[]>();

	constructor(url: string, options?: EventSourceInit) {
		this.url = url;
		this.withCredentials = options?.withCredentials ?? false;
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

	// test helper - not part of the real EventSource API
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

beforeEach(() => {
	vi.stubGlobal('EventSource', MockEventSource);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('SSEConnection', () => {
	it('opens a connection and reports connected state', () => {
		const onOpenCallback = vi.fn();
		const connection = new SSEConnection({ url: '/events', onOpenCallback });
		const raw = connection.connection as unknown as MockEventSource;

		expect(connection.connected).toBe(false);
		raw.dispatch('open', new Event('open'));

		expect(connection.connected).toBe(true);
		expect(onOpenCallback).toHaveBeenCalledTimes(1);
	});

	it('parses JSON message payloads in standard mode, and falls back to raw strings', () => {
		const onMessageCallback = vi.fn();
		const connection = new SSEConnection<{ ok: boolean }>({
			url: '/events',
			onMessageCallback,
		});
		const raw = connection.connection as unknown as MockEventSource;

		raw.dispatch('message', messageEvent('{"ok":true}'));
		expect(onMessageCallback).toHaveBeenLastCalledWith({ ok: true });

		raw.dispatch('message', messageEvent('not-json'));
		expect(onMessageCallback).toHaveBeenLastCalledWith('not-json');
	});

	it('routes built-in events through the unified callback', () => {
		const onMessageCallback = vi.fn();
		const connection = new SSEConnection({
			url: '/events',
			unifiedOnMessage: true,
			onMessageCallback,
		});
		const raw = connection.connection as unknown as MockEventSource;

		raw.dispatch('open', new Event('open'));
		raw.dispatch('message', messageEvent('hello'));
		raw.dispatch('error', new Event('error'));

		expect(onMessageCallback).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'open' }),
		);
		expect(onMessageCallback).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'message', data: 'hello' }),
		);
		expect(onMessageCallback).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'error' }),
		);
	});

	it('supports custom events with a per-event handler', () => {
		const customHandler = vi.fn();
		const onMessageCallback = vi.fn();
		const connection = new SSEConnection<unknown, { progress: number }>({
			url: '/events',
			unifiedOnMessage: true,
			onMessageCallback,
			customEvents: [{ name: 'progress', handler: customHandler }],
		});
		const raw = connection.connection as unknown as MockEventSource;

		raw.dispatch('progress', messageEvent('42'));

		expect(customHandler).toHaveBeenCalledWith(42);
		expect(onMessageCallback).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'progress', data: 42 }),
		);
	});

	it('self-closes when the configured close message is received', () => {
		const onCloseCallback = vi.fn();
		const connection = new SSEConnection({
			url: '/events',
			connectionClose: { message: 'eos' },
			onCloseCallback,
		});
		const raw = connection.connection as unknown as MockEventSource;

		raw.dispatch('message', messageEvent('eos'));

		expect(onCloseCallback).toHaveBeenCalledTimes(1);
		expect(connection.connection).toBeNull();
	});

	it('self-closes from a matching custom close event', () => {
		const onCloseCallback = vi.fn();
		const connection = new SSEConnection<unknown, { close: string }>({
			url: '/events',
			customEvents: [{ name: 'close' }],
			connectionClose: { event: 'close' },
			onCloseCallback,
		});
		const raw = connection.connection as unknown as MockEventSource;

		raw.dispatch('close', messageEvent(''));

		expect(onCloseCallback).toHaveBeenCalledTimes(1);
		expect(connection.connection).toBeNull();
	});

	it('closes cleanly and is idempotent', () => {
		const connection = new SSEConnection({ url: '/events' });

		connection.close();
		expect(connection.connection).toBeNull();
		expect(connection.connected).toBe(false);

		// calling close again should be a no-op, not throw
		expect(() => connection.close()).not.toThrow();
	});
});
