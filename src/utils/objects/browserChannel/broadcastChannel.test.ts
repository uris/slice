import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BrowserChannel } from './broadcastChannel';

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

beforeEach(() => {
	MockBroadcastChannel.instances = [];
	vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

function latestChannel() {
	return MockBroadcastChannel.instances[MockBroadcastChannel.instances.length - 1];
}

describe('BrowserChannel', () => {
	it('throws when BroadcastChannel is not supported in this environment', () => {
		vi.stubGlobal('BroadcastChannel', undefined);
		expect(
			() =>
				new BrowserChannel({
					name: 'test-channel',
					onMessageCallback: vi.fn(),
					onErrorCallback: vi.fn(),
				}),
		).toThrow(TypeError);
	});

	it('opens a channel with the given name and attaches listeners', () => {
		new BrowserChannel({
			name: 'test-channel',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});
		const channel = latestChannel();

		expect(channel.name).toBe('test-channel');
	});

	it('routes incoming messages to onMessageCallback', () => {
		const onMessageCallback = vi.fn();
		new BrowserChannel<{ ok: boolean }>({
			name: 'test-channel',
			onMessageCallback,
			onErrorCallback: vi.fn(),
		});
		const channel = latestChannel();

		channel.dispatch('message', messageEvent({ ok: true }));

		expect(onMessageCallback).toHaveBeenCalledWith({ ok: true });
	});

	it('routes messageerror events to onErrorCallback', () => {
		const onErrorCallback = vi.fn();
		new BrowserChannel({
			name: 'test-channel',
			onMessageCallback: vi.fn(),
			onErrorCallback,
		});
		const channel = latestChannel();
		const event = messageEvent(undefined);

		channel.dispatch('messageerror', event);

		expect(onErrorCallback).toHaveBeenCalledWith(event);
	});

	it('posts messages through the underlying channel', () => {
		const browserChannel = new BrowserChannel<{ a: number }>({
			name: 'test-channel',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});
		const channel = latestChannel();

		browserChannel.post({ a: 1 });

		expect(channel.posted).toEqual([{ a: 1 }]);
	});

	it('closes the underlying channel and removes its listeners', () => {
		const onMessageCallback = vi.fn();
		const browserChannel = new BrowserChannel<{ ok: boolean }>({
			name: 'test-channel',
			onMessageCallback,
			onErrorCallback: vi.fn(),
		});
		const channel = latestChannel();

		browserChannel.close();

		expect(channel.closed).toBe(true);

		channel.dispatch('message', messageEvent({ ok: true }));
		expect(onMessageCallback).not.toHaveBeenCalled();
	});
});
