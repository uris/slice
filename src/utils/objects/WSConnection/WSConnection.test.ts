import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WSConnection } from './WSConnection';

type Listener = (event: Event) => void;

class MockWebSocket {
	static readonly CONNECTING = 0;
	static readonly OPEN = 1;
	static readonly CLOSING = 2;
	static readonly CLOSED = 3;
	static instances: MockWebSocket[] = [];

	readyState = MockWebSocket.CONNECTING;
	url: string;
	sent: unknown[] = [];
	private readonly listeners = new Map<string, Listener[]>();

	constructor(url: string) {
		this.url = url;
		MockWebSocket.instances.push(this);
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

	send(data: unknown) {
		this.sent.push(data);
	}

	close(_code?: number, _reason?: string) {
		this.readyState = MockWebSocket.CLOSED;
	}

	// test helper - not part of the real WebSocket API
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

function closeEvent(wasClean: boolean) {
	return { wasClean, code: wasClean ? 1000 : 1006, reason: '' } as CloseEvent;
}

beforeEach(() => {
	MockWebSocket.instances = [];
	vi.stubGlobal('WebSocket', MockWebSocket);
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

function latestSocket() {
	return MockWebSocket.instances[MockWebSocket.instances.length - 1];
}

describe('WSConnection', () => {
	it('throws when WebSocket is not supported in this environment', () => {
		vi.stubGlobal('WebSocket', undefined);
		expect(() => new WSConnection({ url: 'wss://example.com' })).toThrow(
			TypeError,
		);
	});

	it('opens a connection and reports connected state', () => {
		const onOpenCallback = vi.fn();
		const connection = new WSConnection({
			url: 'wss://example.com',
			keepAlive: false,
			onOpenCallback,
		});
		const socket = latestSocket();

		expect(connection.connected).toBe(false);
		socket.dispatch('open', new Event('open'));

		expect(connection.connected).toBe(true);
		expect(onOpenCallback).toHaveBeenCalledTimes(1);
	});

	it('parses JSON, raw string, and binary message payloads in standard mode', () => {
		const onMessageCallback = vi.fn();
		const connection = new WSConnection<{ ok: boolean }>({
			url: 'wss://example.com',
			keepAlive: false,
			onMessageCallback,
		});
		const socket = latestSocket();
		socket.dispatch('open', new Event('open'));

		socket.dispatch('message', messageEvent('{"ok":true}'));
		expect(onMessageCallback).toHaveBeenLastCalledWith({ ok: true });

		socket.dispatch('message', messageEvent('not-json'));
		expect(onMessageCallback).toHaveBeenLastCalledWith('not-json');

		const blob = new Blob(['binary-data']);
		socket.dispatch('message', messageEvent(blob));
		expect(onMessageCallback).toHaveBeenLastCalledWith(blob);
		void connection;
	});

	it('emits an error and drops the message for unsupported payload types', () => {
		const onMessageCallback = vi.fn();
		const onErrorCallback = vi.fn();
		new WSConnection({
			url: 'wss://example.com',
			keepAlive: false,
			onMessageCallback,
			onErrorCallback,
		});
		const socket = latestSocket();
		socket.dispatch('open', new Event('open'));

		socket.dispatch('message', messageEvent(42));

		expect(onErrorCallback).toHaveBeenCalledTimes(1);
		expect(onMessageCallback).not.toHaveBeenCalled();
	});

	it('routes lifecycle events through the unified callback', () => {
		const onMessageCallback = vi.fn();
		new WSConnection({
			url: 'wss://example.com',
			keepAlive: false,
			unifiedMessages: true,
			onMessageCallback,
		});
		const socket = latestSocket();

		socket.dispatch('open', new Event('open'));
		socket.dispatch('message', messageEvent('hi'));
		socket.dispatch('close', closeEvent(true));

		expect(onMessageCallback).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'open' }),
		);
		expect(onMessageCallback).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'message', data: 'hi' }),
		);
		expect(onMessageCallback).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'close' }),
		);
	});

	it('sends a token after opening, and closes when token resolution yields nothing', () => {
		const connection = new WSConnection({
			url: 'wss://example.com',
			keepAlive: false,
			autoReconnect: false,
			token: async () => '',
		});
		const socket = latestSocket();
		socket.dispatch('open', new Event('open'));

		return Promise.resolve().then(() => {
			expect(socket.readyState).toBe(MockWebSocket.CLOSED);
			void connection;
		});
	});

	it('sends a string token immediately on open', async () => {
		new WSConnection({
			url: 'wss://example.com',
			keepAlive: false,
			token: 'abc123',
		});
		const socket = latestSocket();
		socket.dispatch('open', new Event('open'));
		await Promise.resolve();

		expect(socket.sent).toContain(JSON.stringify({ token: 'abc123' }));
	});

	it('emits an error and closes when token resolution throws', async () => {
		const onErrorCallback = vi.fn();
		new WSConnection({
			url: 'wss://example.com',
			keepAlive: false,
			autoReconnect: false,
			onErrorCallback,
			token: async () => {
				throw new Error('nope');
			},
		});
		const socket = latestSocket();
		socket.dispatch('open', new Event('open'));
		await Promise.resolve();
		await Promise.resolve();

		expect(onErrorCallback).toHaveBeenCalledTimes(1);
		expect(socket.readyState).toBe(MockWebSocket.CLOSED);
	});

	it('sends periodic pings while keep-alive is enabled', () => {
		new WSConnection({
			url: 'wss://example.com',
			keepAlive: true,
			keepAliveInterval: 1000,
		});
		const socket = latestSocket();
		socket.dispatch('open', new Event('open'));

		vi.advanceTimersByTime(3000);

		expect(socket.sent.filter((message) => message === 'ping').length).toBe(3);
	});

	it('sends string payloads as-is and objects as JSON', () => {
		const connection = new WSConnection({
			url: 'wss://example.com',
			keepAlive: false,
		});
		const socket = latestSocket();
		socket.dispatch('open', new Event('open'));

		connection.send('raw-string');
		connection.send({ a: 1 });

		expect(socket.sent).toContain('raw-string');
		expect(socket.sent).toContain(JSON.stringify({ a: 1 }));
	});

	it('reconnects after a non-clean close when autoReconnect is enabled', () => {
		new WSConnection({
			url: 'wss://example.com',
			keepAlive: false,
			autoReconnect: true,
			reconnectInterval: 500,
			reconnectFalloff: false,
		});
		const first = latestSocket();
		first.dispatch('open', new Event('open'));
		first.readyState = MockWebSocket.CLOSED;
		first.dispatch('close', closeEvent(false));

		expect(MockWebSocket.instances.length).toBe(1);
		vi.advanceTimersByTime(500);
		expect(MockWebSocket.instances.length).toBe(2);
	});

	it('does not reconnect after a manual close', () => {
		const connection = new WSConnection({
			url: 'wss://example.com',
			keepAlive: false,
			autoReconnect: true,
			reconnectInterval: 500,
		});
		const first = latestSocket();
		first.dispatch('open', new Event('open'));

		connection.close({ code: 1000, reason: 'bye' });
		first.dispatch('close', closeEvent(false));

		vi.advanceTimersByTime(5000);
		expect(MockWebSocket.instances.length).toBe(1);
	});

	it('stops reconnecting once reconnectAttempts is exhausted', () => {
		new WSConnection({
			url: 'wss://example.com',
			keepAlive: false,
			autoReconnect: true,
			reconnectInterval: 100,
			reconnectFalloff: false,
			reconnectAttempts: 2,
		});

		// the initial connection opens successfully, then drops - this is the
		// only time `onOpen` resets the attempt counter to 0
		const first = latestSocket();
		first.dispatch('open', new Event('open'));
		first.readyState = MockWebSocket.CLOSED;
		first.dispatch('close', closeEvent(false));

		// every reconnect attempt after this fails without ever opening, so the
		// attempt counter keeps climbing instead of getting reset
		for (let attempt = 0; attempt < 3; attempt++) {
			vi.advanceTimersByTime(100);
			const socket = latestSocket();
			socket.readyState = MockWebSocket.CLOSED;
			socket.dispatch('close', closeEvent(false));
		}

		// initial connection + 2 allowed reconnects = 3 sockets, no more after that
		expect(MockWebSocket.instances.length).toBe(3);
	});

	it('normalizes a plain Event into an ErrorEvent', () => {
		const onErrorCallback = vi.fn();
		new WSConnection({
			url: 'wss://example.com',
			keepAlive: false,
			onErrorCallback,
		});
		const socket = latestSocket();

		socket.dispatch('error', new Event('error'));

		expect(onErrorCallback).toHaveBeenCalledTimes(1);
		expect(onErrorCallback.mock.calls[0][0]).toBeInstanceOf(ErrorEvent);
	});

	it('does not close an already-closed socket again', () => {
		const connection = new WSConnection({
			url: 'wss://example.com',
			keepAlive: false,
		});
		const socket = latestSocket();
		socket.readyState = MockWebSocket.CLOSED;

		expect(() =>
			connection.close({ code: 1000, reason: 'already closed' }),
		).not.toThrow();
	});
});
