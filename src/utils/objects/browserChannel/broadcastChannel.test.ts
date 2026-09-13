import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BrowserChannel, MessageType } from './broadcastChannel';

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

	it('generates a unique origin per instance, always with a "." separator, even with no label', () => {
		const first = new BrowserChannel({
			name: 'test-channel',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});
		const second = new BrowserChannel({
			name: 'test-channel',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});

		expect(first.origin).not.toBe(second.origin);
		// no label given, so origin is just '.' + a generated UUID
		expect(first.origin.startsWith('.')).toBe(true);

		const [label, uuid] = first.origin.split('.');
		expect(label).toBe('');
		expect(uuid.length).toBeGreaterThan(0);
	});

	it('prefixes the generated origin with the optional origin label, still splittable on "."', () => {
		const channel = new BrowserChannel({
			name: 'test-channel',
			origin: 'tab-1',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});

		expect(channel.origin.startsWith('tab-1.')).toBe(true);

		const [label, uuid] = channel.origin.split('.');
		expect(label).toBe('tab-1');
		expect(uuid.length).toBeGreaterThan(0);
	});

	it('routes incoming messages to onMessageCallback', () => {
		const onMessageCallback = vi.fn();
		new BrowserChannel<{ ok: boolean }>({
			name: 'test-channel',
			onMessageCallback,
			onErrorCallback: vi.fn(),
		});
		const channel = latestChannel();

		channel.dispatch('message', messageEvent({ content: { ok: true }, type: MessageType.Data, origin: 'other.uuid' }));

		expect(onMessageCallback).toHaveBeenCalledWith({
			content: { ok: true },
			type: MessageType.Data,
			origin: 'other.uuid',
		});
	});

	it('routes messageerror events to both onErrorCallback and onMessageCallback, as a type: Error message', () => {
		const onErrorCallback = vi.fn();
		const onMessageCallback = vi.fn();
		const channel = new BrowserChannel({
			name: 'test-channel',
			origin: 'my-tab',
			onMessageCallback,
			onErrorCallback,
		});
		const rawChannel = latestChannel();
		const event = {
			type: 'messageerror',
			origin: 'https://example.com',
			lastEventId: '42',
			data: null,
		} as MessageEvent;

		rawChannel.dispatch('messageerror', event);

		// the raw event still reaches the low-level onErrorCallback, unchanged
		expect(onErrorCallback).toHaveBeenCalledWith(event);

		// and it also flows through the unified onMessageCallback as a { type: Error } message
		expect(onMessageCallback).toHaveBeenCalledTimes(1);
		const [message] = onMessageCallback.mock.calls[0];
		expect(message.type).toBe(MessageType.Error);
		expect(message.origin).toBe(channel.origin);

		// content is a JSON string carrying the event's own fields, since those
		// live on the prototype and JSON.stringify(event) alone would drop them
		expect(typeof message.content).toBe('string');
		expect(JSON.parse(message.content)).toEqual({
			type: 'messageerror',
			origin: 'https://example.com',
			lastEventId: '42',
			data: null,
		});
	});

	it("posts messages wrapped with this instance's origin and type: Data", () => {
		const browserChannel = new BrowserChannel<{ a: number }>({
			name: 'test-channel',
			origin: 'sender',
			onMessageCallback: vi.fn(),
			onErrorCallback: vi.fn(),
		});
		const channel = latestChannel();

		browserChannel.post({ a: 1 });

		expect(channel.posted).toEqual([{ content: { a: 1 }, type: MessageType.Data, origin: browserChannel.origin }]);
		expect(browserChannel.origin.startsWith('sender.')).toBe(true);
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

		channel.dispatch('message', messageEvent({ content: { ok: true }, type: MessageType.Data, origin: 'x' }));
		expect(onMessageCallback).not.toHaveBeenCalled();
	});
});
