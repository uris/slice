/**
 * Options for constructing a {@link BrowserChannel}.
 */
export interface ChannelConfig<T> {
	name: string;
	onMessageCallback: (message: T) => void;
	onErrorCallback: (event: MessageEvent) => void;
}

/**
 * A typed wrapper around the native `BroadcastChannel` API for posting and
 * receiving messages between same-origin browsing contexts (tabs, windows,
 * iframes, workers).
 */
export class BrowserChannel<T> {
	public readonly name!: string;
	public readonly channel!: BroadcastChannel;
	private readonly onMessageCallback!: (message: T) => void;
	private readonly onErrorCallback!: (event: MessageEvent) => void;

	/**
	 * Open the underlying `BroadcastChannel` and attach listeners.
	 */
	constructor(options: ChannelConfig<T>) {
		this.name = options.name;
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
		this.onMessageCallback(data as T);
	};

	private onError = (event: MessageEvent) => {
		this.onErrorCallback(event);
	};

	/**
	 * Post a message to every other same-origin context listening on this
	 * channel.
	 */
	public post(message: T): void {
		this.channel.postMessage(message);
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
