/**
 * Maps each custom SSE event name to the payload type that event emits.
 */
export type SSEEventMap = Record<string, unknown>;

/**
 * Parsed SSE payloads can still be raw strings when the event data is not JSON.
 */
type SSEParsedData<T> = T | string;

/**
 * Restricts custom event names to string keys so they can be used with
 * `addEventListener`.
 */
type SSEEventName<TCustomEvents extends SSEEventMap> = Extract<keyof TCustomEvents, string>;

/**
 * Built-in EventSource events represented in unified callback mode.
 */
export type SSEUnifiedBuiltInMessage<TMessage> =
	| {
			type: 'message';
			data: SSEParsedData<TMessage>;
			event: MessageEvent;
	  }
	| {
			type: 'error';
			event: Event;
	  }
	| {
			type: 'open';
			event: Event;
	  }
	| {
			type: 'close';
			event: Event;
	  };

export interface SSEConnectionCloseOption<TCustomEvents extends SSEEventMap = Record<string, never>> {
	event?: SSEEventName<TCustomEvents>;
	message?: string;
}

/**
 * A custom event in unified callback mode. The `type` determines the shape of
 * `data`.
 */
export type SSEUnifiedCustomMessage<
	TCustomEvents extends SSEEventMap,
	TName extends SSEEventName<TCustomEvents> = SSEEventName<TCustomEvents>,
> = {
	type: TName;
	data: SSEParsedData<TCustomEvents[TName]>;
	event: MessageEvent;
};

/**
 * All messages that can flow through the single unified callback.
 */
export type SSEUnifiedMessage<TMessage, TCustomEvents extends SSEEventMap> =
	| SSEUnifiedBuiltInMessage<TMessage>
	| SSEUnifiedCustomMessage<TCustomEvents>;

/**
 * Callback signature for standard mode, where only the default `message`
 * event is routed to `onMessageCallback`.
 */
type SSEStandardMessageCallback<TMessage> = (data: SSEParsedData<TMessage>) => void;

/**
 * Callback signature for unified mode, where built-in and custom events are
 * all routed through a discriminated object.
 */
type SSEUnifiedMessageCallback<TMessage, TCustomEvents extends SSEEventMap> = (
	message: SSEUnifiedMessage<TMessage, TCustomEvents>,
) => void;

/**
 * Declares one custom SSE event. `name` selects a key from the event map, and
 * `handler` is typed to that event's payload when provided.
 */
export interface SSECustomEvent<
	TCustomEvents extends SSEEventMap,
	TName extends SSEEventName<TCustomEvents> = SSEEventName<TCustomEvents>,
> {
	name: TName;
	handler?: (data: TCustomEvents[TName]) => void;
}

/**
 * Options shared by both standard and unified message modes.
 */
interface SSEConnectionOptionsBase<TCustomEvents extends SSEEventMap = Record<string, never>> {
	url?: string;
	options?: EventSourceInit;
	connectionClose?: SSEConnectionCloseOption<TCustomEvents>;
	onErrorCallback?: (event: Event) => void;
	onOpenCallback?: (event: Event) => void;
	onCloseCallback?: (event: Event) => void;
	customEvents?: SSECustomEvent<TCustomEvents> | SSECustomEvent<TCustomEvents>[];
}

/**
 * Options for unified mode. When enabled, every built-in and custom event is
 * emitted through `onMessageCallback`.
 */
interface SSEConnectionUnifiedOptions<TMessage = unknown, TCustomEvents extends SSEEventMap = Record<string, never>>
	extends SSEConnectionOptionsBase<TCustomEvents> {
	unifiedOnMessage: true;
	onMessageCallback?: SSEUnifiedMessageCallback<TMessage, TCustomEvents>;
}

/**
 * Options for standard mode. Only the default `message` event payload is sent
 * to `onMessageCallback`.
 */
interface SSEConnectionStandardOptions<TMessage = unknown, TCustomEvents extends SSEEventMap = Record<string, never>>
	extends SSEConnectionOptionsBase<TCustomEvents> {
	unifiedOnMessage?: false;
	onMessageCallback?: SSEStandardMessageCallback<TMessage>;
}

/**
 * Public connection options. The `unifiedOnMessage` flag selects which
 * callback signature is valid.
 */
export type SSEConnectionOptions<TMessage = unknown, TCustomEvents extends SSEEventMap = Record<string, never>> =
	| SSEConnectionStandardOptions<TMessage, TCustomEvents>
	| SSEConnectionUnifiedOptions<TMessage, TCustomEvents>;

/**
 * Manage an EventSource connection with optional unified callbacks and typed custom events.
 */
export class SSEConnection<TMessage = unknown, TCustomEvents extends SSEEventMap = Record<string, never>> {
	private readonly url!: string;
	private readonly options!: EventSourceInit | undefined;
	private sseConnection: EventSource | null = null;
	private readonly onMessageCallback?:
		| SSEStandardMessageCallback<TMessage>
		| SSEUnifiedMessageCallback<TMessage, TCustomEvents>;
	private readonly onErrorCallback?: (event: Event) => void;
	private readonly onOpenCallback?: (event: Event) => void;
	private readonly onCloseCallback?: (event: Event) => void;
	private readonly connectionClose?: SSEConnectionCloseOption<TCustomEvents>;
	private readonly customEvents!: SSECustomEvent<TCustomEvents>[];
	private readonly customEventHandlers = new Map<string, Array<(event: MessageEvent) => void>>();
	private readonly unifiedOnMessage: boolean = false;

	/**
	 * Whether the underlying EventSource is currently open.
	 */
	public get connected() {
		return this.sseConnection?.readyState === EventSource.OPEN;
	}

	/**
	 * Direct access to the underlying EventSource instance.
	 */
	public get connection() {
		return this.sseConnection;
	}

	/**
	 * Create the EventSource connection and attach its initial listeners.
	 */
	constructor(options?: SSEConnectionOptions<TMessage, TCustomEvents>) {
		this.url = options?.url ?? '';
		this.options = options?.options ?? undefined;
		this.unifiedOnMessage = options?.unifiedOnMessage ?? false;
		this.onMessageCallback = options?.onMessageCallback;
		this.onErrorCallback = options?.onErrorCallback;
		this.onOpenCallback = options?.onOpenCallback;
		this.onCloseCallback = options?.onCloseCallback;
		this.connectionClose = options?.connectionClose;
		if (options?.customEvents) {
			this.customEvents = Array.isArray(options?.customEvents) ? options.customEvents : [options.customEvents];
		} else this.customEvents = [];
		this.sseConnection = new EventSource(this.url, this.options);
		this.attachDefaultEventListeners(this.sseConnection);
		if (this.customEvents.length > 0) this.attachCustomEventListeners(this.customEvents);
	}

	/**
	 * Safely parse SSE event data. Falls back to the raw string when the payload is not JSON.
	 */
	private parseEventData<T>(rawData: string): T | string {
		try {
			return JSON.parse(rawData) as T;
		} catch {
			return rawData;
		}
	}

	/**
	 * Attach the default EventSource listeners for message, error, and open events.
	 */
	private attachDefaultEventListeners(connection: EventSource) {
		connection.addEventListener('message', this.onMessage as EventListener);
		connection.addEventListener('error', this.onError as EventListener);
		connection.addEventListener('open', this.onOpen as EventListener);
	}

	/**
	 * Emit parsed message data when standard callback mode is enabled.
	 */
	private emitParsedMessage(data: SSEParsedData<TMessage>) {
		if (this.unifiedOnMessage) return;
		(this.onMessageCallback as SSEStandardMessageCallback<TMessage> | undefined)?.(data);
	}

	/**
	 * Emit a unified message object when unified callback mode is enabled.
	 */
	private emitUnifiedMessage(message: SSEUnifiedMessage<TMessage, TCustomEvents>) {
		if (!this.unifiedOnMessage) return;
		(this.onMessageCallback as SSEUnifiedMessageCallback<TMessage, TCustomEvents> | undefined)?.(message);
	}

	/**
	 * Emit the close callback and unified close event.
	 */
	private emitCloseEvent(event: Event) {
		this.onCloseCallback?.(event);
		this.emitUnifiedMessage({ type: 'close', event });
	}

	/**
	 * Close the connection in response to an SSE-level close condition.
	 */
	private closeFromConnectionEvent() {
		const closeEvent = new Event('close');
		this.emitCloseEvent(closeEvent);
		this.close();
	}

	/**
	 * Check whether an incoming message should close the connection.
	 */
	private shouldCloseFromMessage(rawData: string, data: SSEParsedData<TMessage>) {
		if (!this.connectionClose?.message) return false;
		return rawData === this.connectionClose.message || data === this.connectionClose.message;
	}

	/**
	 * Emit one custom event through unified callback mode.
	 */
	private emitUnifiedCustomMessage<TName extends SSEEventName<TCustomEvents>>(
		customEvent: SSECustomEvent<TCustomEvents, TName>,
		data: SSEParsedData<TCustomEvents[TName]>,
		event: MessageEvent,
	) {
		this.emitUnifiedMessage({
			type: customEvent.name,
			data,
			event,
		} as SSEUnifiedCustomMessage<TCustomEvents, TName>);
	}

	/**
	 * Attach one typed custom event listener to the SSE connection.
	 */
	private attachCustomEventListener<TName extends SSEEventName<TCustomEvents>>(
		customEvent: SSECustomEvent<TCustomEvents, TName>,
	) {
		if (!this.sseConnection) return;
		const handler = (eventInfo: MessageEvent) => {
			const data = this.parseEventData<TCustomEvents[TName]>(eventInfo.data);
			customEvent.handler?.(data as TCustomEvents[TName]);
			this.emitUnifiedCustomMessage(customEvent, data, eventInfo);
			if (this.connectionClose?.event === customEvent.name) {
				this.closeFromConnectionEvent();
			}
		};
		const currentHandlers = this.customEventHandlers.get(customEvent.name) ?? [];
		currentHandlers.push(handler);
		this.customEventHandlers.set(customEvent.name, currentHandlers);
		this.sseConnection.addEventListener(customEvent.name, handler as EventListener);
	}

	/**
	 * Attach all configured custom event listeners to the SSE connection.
	 */
	private attachCustomEventListeners(customEvents: SSECustomEvent<TCustomEvents> | SSECustomEvent<TCustomEvents>[]) {
		const events = Array.isArray(customEvents) ? customEvents : [customEvents];
		for (const event of events) {
			this.attachCustomEventListener(event);
		}
	}

	/**
	 * Detach every default and custom listener from the current EventSource.
	 */
	private detachAllEventListeners(connection: EventSource) {
		// defaults
		connection.removeEventListener('message', this.onMessage as EventListener);
		connection.removeEventListener('error', this.onError as EventListener);
		connection.removeEventListener('open', this.onOpen as EventListener);

		// custom events
		for (const [eventName, handlers] of this.customEventHandlers.entries()) {
			for (const handler of handlers) {
				connection.removeEventListener(eventName, handler as EventListener);
			}
		}

		// nullify the custom event array
		this.customEventHandlers.clear();
	}

	/**
	 * Parse and emit the default `message` event payload.
	 */
	onMessage = (event: MessageEvent) => {
		const data = this.parseEventData<TMessage>(event.data);
		this.emitUnifiedMessage({ type: 'message', data, event });
		this.emitParsedMessage(data);
		if (this.shouldCloseFromMessage(event.data, data)) {
			this.closeFromConnectionEvent();
		}
	};

	/**
	 * Forward EventSource errors through the configured callbacks.
	 */
	onError = (event: Event) => {
		this.onErrorCallback?.(event);
		this.emitUnifiedMessage({ type: 'error', event });
	};

	/**
	 * Forward EventSource open events through the configured callbacks.
	 */
	onOpen = (event: Event) => {
		this.onOpenCallback?.(event);
		this.emitUnifiedMessage({ type: 'open', event });
	};

	/**
	 * Close the SSE connection and release resources.
	 */
	public close = () => {
		if (!this.sseConnection) return;
		this.detachAllEventListeners(this.sseConnection);
		this.sseConnection.close();
		this.sseConnection = null;
	};
}
