export interface MarkdownStreamBufferSnapshot {
	raw: string;
	healthy: string;
	reason: 'raf' | 'manual' | 'complete';
	isComplete: boolean;
	pendingCharacters: number;
}

export interface MarkdownAutoCloseRule {
	name?: string;
	open: string;
	close: string;
	mode?: 'paired' | 'line';
	linePattern?: RegExp;
	partialLinePattern?: RegExp;
	requiresLineStart?: boolean;
	requiresContent?: boolean;
}

export interface MarkdownStreamBufferOptions {
	endOfStreamToken?: string;
	healthyEndMarker?: string;
	htmlHandling?: 'ignore' | 'strip';
	includeLinksAndImages?: boolean;
	flushDelayMs?: number;
	onFlush?: (snapshot: MarkdownStreamBufferSnapshot) => void;
	requestFrame?: (callback: FrameRequestCallback) => number;
	cancelFrame?: (handle: number) => void;
	watchedMarkers?: MarkdownAutoCloseRule[];
}
