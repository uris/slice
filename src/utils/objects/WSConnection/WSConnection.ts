type WSRawData = string | Blob | ArrayBuffer;
type WSParsedData<TMessage> = TMessage | WSRawData;

export type UnifiedMessageEvent<TMessage> =
	| {
			type: 'message';
			data: WSParsedData<TMessage>;
			event: MessageEvent;
	  }
	| {
			type: 'open';
			event: Event;
	  }
	| {
			type: 'close';
			event: CloseEvent;
	  }
	| {
			type: 'error';
			event: ErrorEvent;
	  };

type WSStandardMessageCallback<TMessage> = (data: WSParsedData<TMessage>) => void;

type WSUnifiedMessageCallback<TMessage> = (message: UnifiedMessageEvent<TMessage>) => void;

interface WSConnectionOptionsBase {
	url: string;
	autoReconnect?: boolean;
	reconnectInterval?: number;
	reconnectAttempts?: number;
	reconnectFalloff?: boolean;
	keepAlive?: boolean;
	keepAliveInterval?: number;
	token?: string | (() => Promise<string>);
	onOpenCallback?: (event: Event) => void;
	onCloseCallback?: (event: CloseEvent) => void;
	onErrorCallback?: (error: ErrorEvent) => void;
}

interface WSConnectionUnifiedOptions<TMessage = unknown> extends WSConnectionOptionsBase {
	unifiedMessages: true;
	onMessageCallback?: WSUnifiedMessageCallback<TMessage>;
}

interface WSConnectionStandardOptions<TMessage = unknown> extends WSConnectionOptionsBase {
	unifiedMessages?: false;
	onMessageCallback?: WSStandardMessageCallback<TMessage>;
}

export type WSConnectionOptions<TMessage = unknown> =
	| WSConnectionStandardOptions<TMessage>
	| WSConnectionUnifiedOptions<TMessage>;

/**
 * Manage a WebSocket connection with optional unified events, retries, and keep-alive pings.
 */
export class WSConnection<TMessage = unknown> {
	private readonly url: string;
	private readonly autoReconnect: boolean;
	private readonly reconnectInterval: number;
	private readonly reconnectAttempts: number;
	private readonly reconnectFalloff: boolean;
	private readonly keepAlive: boolean;
	private readonly keepAliveInterval: number;
	private readonly unifiedMessages: boolean;
	private readonly token: string | (() => Promise<string>);
	private readonly onMessageCallback?: WSStandardMessageCallback<TMessage> | WSUnifiedMessageCallback<TMessage>;
	private readonly onOpenCallback?: (event: Event) => void;
	private readonly onCloseCallback?: (event: CloseEvent) => void;
	private readonly onErrorCallback?: (error: ErrorEvent) => void;
	private socket: WebSocket | null = null;
	private keepAliveTimer: ReturnType<typeof setInterval> | null = null;
	private reconnectIntervalTimer: ReturnType<typeof setTimeout> | null = null;
	private reconnectAttemptsCount = 0;
	private manuallyClosed = false;

	/**
	 * Report whether the underlying socket is currently open.
	 */
	public get connected() {
		return this.socket?.readyState === WebSocket.OPEN;
	}

	/**
	 * Expose the underlying WebSocket instance.
	 */
	public get connection() {
		return this.socket;
	}

	/**
	 * Initialize the socket connection and configure its runtime options.
	 */
	constructor(options: WSConnectionOptions<TMessage>) {
		// set base props
		this.url = options.url;
		this.autoReconnect = options.autoReconnect ?? true;
		this.reconnectInterval = options.reconnectInterval ?? 1000;
		this.reconnectAttempts = options.reconnectAttempts ?? 5;
		this.reconnectFalloff = options.reconnectFalloff ?? true;
		this.keepAlive = options.keepAlive ?? true;
		this.keepAliveInterval = options.keepAliveInterval ?? 30000;
		this.unifiedMessages = options.unifiedMessages ?? false;
		this.token = options.token ?? '';
		this.onMessageCallback = options.onMessageCallback;
		this.onOpenCallback = options.onOpenCallback;
		this.onCloseCallback = options.onCloseCallback;
		this.onErrorCallback = options.onErrorCallback;

		// warn for SSR
		if (typeof WebSocket === 'undefined') {
			throw new TypeError('WebSocket is not supported in this environment.');
		}

		// connect socket
		this.connect();
	}

	/**
	 * Send a string or JSON-serializable payload through the socket.
	 */
	public send(message: unknown) {
		const data = typeof message === 'string' ? message : JSON.stringify(message);
		this.socket?.send(data);
	}

	/**
	 * Close the socket intentionally and stop any reconnect attempts.
	 */
	public close(closeEvent: { code: number; reason: string }) {
		this.manuallyClosed = true;
		this.clearReconnectTimer();
		this.reconnectAttemptsCount = 0;
		this.closeSocket(closeEvent);
	}

	/**
	 * Emit parsed message data when standard callback mode is enabled.
	 */
	private emitParsedMessage(data: WSParsedData<TMessage>) {
		if (this.unifiedMessages) return;
		const callback = this.onMessageCallback as WSStandardMessageCallback<TMessage> | undefined;
		callback?.(data);
	}

	/**
	 * Emit a unified event object when unified callback mode is enabled.
	 */
	private emitUnifiedMessage(message: UnifiedMessageEvent<TMessage>) {
		if (!this.unifiedMessages) return;
		const callback = this.onMessageCallback as WSUnifiedMessageCallback<TMessage> | undefined;
		callback?.(message);
	}

	/**
	 * Forward an error event through both direct and unified callbacks.
	 */
	private emitErrorEvent(error: ErrorEvent) {
		this.onErrorCallback?.(error);
		this.emitUnifiedMessage({ type: 'error', event: error });
	}

	/**
	 * Parse incoming message data, falling back to raw socket payloads when needed.
	 */
	private parseEventData(rawData: unknown) {
		if (rawData instanceof Blob || rawData instanceof ArrayBuffer || typeof rawData === 'string') {
			if (typeof rawData !== 'string') return rawData;

			try {
				return JSON.parse(rawData) as TMessage;
			} catch {
				return rawData;
			}
		}

		this.emitErrorEvent(
			new ErrorEvent('parse error', {
				message: 'Unsupported websocket message data format',
			}),
		);
		return undefined;
	}

	/**
	 * Initialize connection state after the socket opens.
	 */
	private readonly onOpen = async (event: Event) => {
		this.clearReconnectTimer();
		this.reconnectAttemptsCount = 0;
		this.manuallyClosed = false;
		this.onOpenCallback?.(event);
		this.emitUnifiedMessage({ type: 'open', event });

		if (this.token) {
			try {
				const token = typeof this.token === 'string' ? this.token : await this.token();
				if (token) {
					this.send({ token });
				} else {
					this.closeSocket({
						code: 1000,
						reason: 'Access token not provided',
					});
					return;
				}
			} catch (error) {
				const errorEvent = new ErrorEvent('token error', {
					message: 'Failed to resolve access token',
					error,
				});
				this.emitErrorEvent(errorEvent);
				this.closeSocket({
					code: 1011,
					reason: 'Access token resolution failed',
				});
				return;
			}
		}

		if (this.keepAlive) this.setKeepAlive();
	};

	/**
	 * Parse and emit each incoming socket message.
	 */
	private readonly onMessage = (event: MessageEvent) => {
		const data = this.parseEventData(event.data);
		if (data === undefined) return;
		this.emitParsedMessage(data);
		this.emitUnifiedMessage({ type: 'message', data, event });
	};

	/**
	 * Clean up the socket and trigger reconnect logic after unexpected closes.
	 */
	private readonly onClose = (event: CloseEvent) => {
		this.onCloseCallback?.(event);
		this.emitUnifiedMessage({ type: 'close', event });
		this.closeSocket(event);
		if (this.shouldReconnect(event)) this.reconnect();
	};

	/**
	 * Normalize socket errors before forwarding them to consumers.
	 */
	private readonly onError = (event: Event) => {
		const error =
			event instanceof ErrorEvent
				? event
				: new ErrorEvent('websocket error', {
						message: 'WebSocket connection error',
					});
		this.emitErrorEvent(error);
	};

	/**
	 * Attach the connection lifecycle listeners to the current socket.
	 */
	private attachEventListeners() {
		if (!this.socket) return;
		this.socket.addEventListener('open', this.onOpen);
		this.socket.addEventListener('message', this.onMessage);
		this.socket.addEventListener('close', this.onClose);
		this.socket.addEventListener('error', this.onError);
	}

	/**
	 * Start periodic ping messages to keep the socket active.
	 */
	private setKeepAlive() {
		if (!this.socket || !this.keepAlive) return;
		if (this.keepAliveTimer) clearInterval(this.keepAliveTimer);
		this.keepAliveTimer = setInterval(() => {
			if (this.socket?.readyState === WebSocket.OPEN) {
				this.socket.send('ping');
			}
		}, this.keepAliveInterval);
	}

	/**
	 * Stop the active keep-alive timer if one is running.
	 */
	private clearKeepAliveTimer() {
		if (!this.keepAliveTimer) return;
		clearInterval(this.keepAliveTimer);
		this.keepAliveTimer = null;
	}

	/**
	 * Stop the active reconnect timer if one is running.
	 */
	private clearReconnectTimer() {
		if (!this.reconnectIntervalTimer) return;
		clearTimeout(this.reconnectIntervalTimer);
		this.reconnectIntervalTimer = null;
	}

	/**
	 * Detach all lifecycle listeners from the current socket.
	 */
	private detachEventListeners() {
		if (!this.socket) return;
		this.socket.removeEventListener('open', this.onOpen);
		this.socket.removeEventListener('message', this.onMessage);
		this.socket.removeEventListener('close', this.onClose);
		this.socket.removeEventListener('error', this.onError);
	}

	/**
	 * Open a new socket connection when one is not already active.
	 */
	private connect() {
		if (this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING) {
			return;
		}
		this.socket = new WebSocket(this.url);
		this.attachEventListeners();
	}

	/**
	 * Schedule the next reconnect attempt when reconnects are allowed.
	 */
	private reconnect() {
		if (!this.autoReconnect || this.manuallyClosed) return;
		if (this.reconnectIntervalTimer) return;

		const nextAttempt = this.reconnectAttemptsCount + 1;
		if (nextAttempt > this.reconnectAttempts) {
			return;
		}

		this.reconnectAttemptsCount = nextAttempt;
		const delay = this.getReconnectDelay(nextAttempt);
		this.reconnectIntervalTimer = setTimeout(() => {
			this.reconnectIntervalTimer = null;
			if (this.manuallyClosed) return;
			this.connect();
		}, delay);
	}

	/**
	 * Calculate the reconnect delay, optionally using exponential backoff.
	 */
	private getReconnectDelay(attempt: number) {
		if (!this.reconnectFalloff) return this.reconnectInterval;
		return this.reconnectInterval * 2 ** (attempt - 1);
	}

	/**
	 * Decide whether a close event should trigger a reconnect attempt.
	 */
	private shouldReconnect(event: CloseEvent) {
		if (this.socket?.readyState === WebSocket.CONNECTING || this.socket?.readyState === WebSocket.OPEN) return false;
		return this.autoReconnect && !this.manuallyClosed && !event.wasClean;
	}

	/**
	 * Close the current socket instance and release its timers and listeners.
	 */
	private closeSocket(closeEvent: { code: number; reason: string }) {
		if (!this.socket) return;
		this.clearKeepAliveTimer();
		this.detachEventListeners();
		if (this.socket.readyState !== WebSocket.CLOSED && this.socket.readyState !== WebSocket.CLOSING) {
			this.socket.close(closeEvent.code || 1000, closeEvent.reason || 'Clean shutdown');
		}
		this.socket = null;
		this.keepAliveTimer = null;
	}
}
