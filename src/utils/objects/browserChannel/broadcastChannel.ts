export enum MessageType {
	Data = 'data',
	Error = 'error',
}

/**
 * Options for constructing a {@link BrowserChannel}.
 */
export interface ChannelConfig<T> {
	name: string;
	/**
	 * Optional human-readable label for this channel instance. The instance's
	 * actual {@link BrowserChannel.origin} is always unique - it is always
	 * this label joined with a generated UUID by a `.`, e.g. `'tab-1.<uuid>'`,
	 * or just `.<uuid>` (with an empty label) when none is given. The `.` is
	 * always present, so `origin.split('.')` reliably splits into
	 * `[label, uuid]`.
	 */
	origin?: string;
	onMessageCallback: (message: BrowserChannelMessage<T>) => void;
	onErrorCallback: (event: MessageEvent) => void;
}

/**
 * The envelope every {@link BrowserChannel} sends and receives. `origin`
 * identifies which channel instance posted the message, so a receiver can
 * tell messages from different senders on the same channel name apart.
 */
export type BrowserChannelMessage<T> = {
	content: T | string;
	type: MessageType;
	origin: string;
};

/**
 * Pulls the useful fields off a `messageerror` event into a JSON string.
 * `JSON.stringify(event)` alone won't work here - `MessageEvent`'s properties
 * are getters on the prototype, not own-enumerable, so the default
 * serializer drops all of them and produces `"{}"`. This reads them
 * explicitly instead, so a consumer relying on the unified message stream
 * gets something to actually diagnose. Note `event.origin` here is the DOM
 * event's own `origin` field (the sending window/worker's origin), which is
 * unrelated to a {@link BrowserChannel}'s own `origin` identifier.
 */
function serializeMessageEvent(event: MessageEvent): string {
	return JSON.stringify({
		type: event.type,
		origin: event.origin,
		lastEventId: event.lastEventId,
		data: event.data ?? null,
	});
}

/**
 * A typed wrapper around the native `BroadcastChannel` API for posting and
 * receiving messages between same-origin browsing contexts (tabs, windows,
 * iframes, workers).
 */
export class BrowserChannel<T> {
	public readonly name!: string;
	/**
	 * Unique identifier for this channel instance, attached as `origin` to
	 * every message it posts. Always unique per instance, even across
	 * instances created with the same `name` or `origin` label.
	 */
	public readonly origin!: string;
	public readonly channel!: BroadcastChannel;
	private readonly onMessageCallback!: (message: BrowserChannelMessage<T>) => void;
	private readonly onErrorCallback!: (event: MessageEvent) => void;

	/**
	 * Open the underlying `BroadcastChannel` and attach listeners.
	 */
	constructor(options: ChannelConfig<T>) {
		this.name = options.name;
		this.origin = `${options.origin ?? ''}.${crypto.randomUUID()}`;
		this.onMessageCallback = options.onMessageCallback;
		this.onErrorCallback = options.onErrorCallback;

		// warn for SSR / unsupported environments
		if (typeof BroadcastChannel === 'undefined') {
			throw new TypeError('BroadcastChannel is not supported in this environment.');
		}

		this.channel = new BroadcastChannel(options.name);
		this.attachListeners();
	}

	private attachListeners() {
		this.channel.addEventListener('message', this.onMessage);
		this.channel.addEventListener('messageerror', this.onError);
	}

	private cleanUpListeners() {
		this.channel.removeEventListener('message', this.onMessage);
		this.channel.removeEventListener('messageerror', this.onError);
	}

	private onMessage = (event: MessageEvent) => {
		const { data } = event;
		this.onMessageCallback(data as BrowserChannelMessage<T>);
	};

	private onError = (event: MessageEvent) => {
		this.onErrorCallback(event);
		this.onMessageCallback({
			content: serializeMessageEvent(event),
			origin: this.origin,
			type: MessageType.Error,
		} satisfies BrowserChannelMessage<T>);
	};

	/**
	 * Post a message to every other same-origin context listening on this
	 * channel. The message is wrapped with this instance's `origin` before
	 * being sent.
	 */
	public post(message: T): void {
		this.channel.postMessage({
			content: message,
			origin: this.origin,
			type: MessageType.Data,
		} satisfies BrowserChannelMessage<T>);
		return;
	}

	/**
	 * Close the channel and remove its listeners. The instance should not be
	 * reused after calling this.
	 */
	public close() {
		this.channel.close();
		this.cleanUpListeners();
	}
}
