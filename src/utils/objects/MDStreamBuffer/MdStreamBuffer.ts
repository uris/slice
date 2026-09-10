import { DEFAULT_WATCHED_MARKERS } from './_defaults';
import type { MarkdownAutoCloseRule, MarkdownStreamBufferOptions, MarkdownStreamBufferSnapshot } from './_types';

interface TrailingInlineConstruct {
	start: number;
	isImage: boolean;
	labelClosed: boolean;
	labelEnd: number;
	parenOpened: boolean;
}

/**
 * Buffer streamed Markdown and emit parser-safe snapshots on animation frames.
 */
export class MdBuffer {
	private readonly endOfStreamToken?: string;
	private readonly healthyEndMarker?: string;
	private readonly htmlHandling: 'ignore' | 'strip';
	private readonly includeLinksAndImages: boolean;
	private readonly flushDelayMs: number;
	private readonly onFlush?: (snapshot: MarkdownStreamBufferSnapshot) => void;
	private readonly requestFrame: (callback: FrameRequestCallback) => number;
	private readonly cancelFrame: (handle: number) => void;
	private readonly watchedMarkers: MarkdownAutoCloseRule[];
	private committedRaw = '';
	private activeRaw = '';
	private frameHandle: number | null = null;
	private flushTimer: ReturnType<typeof setTimeout> | null = null;
	private lastFlushAt = 0;
	private lastFlushedRawLength = 0;
	private completeSignal = false;

	constructor(options?: MarkdownStreamBufferOptions) {
		this.endOfStreamToken = options?.endOfStreamToken;
		this.healthyEndMarker = options?.healthyEndMarker;
		this.htmlHandling = options?.htmlHandling ?? 'ignore';
		this.includeLinksAndImages = options?.includeLinksAndImages ?? false;
		this.flushDelayMs = Math.max(0, options?.flushDelayMs ?? 0);
		this.onFlush = options?.onFlush;
		this.requestFrame = options?.requestFrame ?? getRequestFrame();
		this.cancelFrame = options?.cancelFrame ?? getCancelFrame();
		this.watchedMarkers = sortRules(options?.watchedMarkers ?? DEFAULT_WATCHED_MARKERS);
	}

	/**
	 * The raw Markdown accumulated so far.
	 */
	public get raw() {
		return `${this.committedRaw}${this.activeRaw}`;
	}

	/**
	 * The current parser-safe preview derived from the raw buffer.
	 */
	public get healthy() {
		return this.buildHealthyOutput();
	}

	/**
	 * Characters appended since the last emitted snapshot.
	 */
	public get pendingCharacters() {
		return Math.max(0, this.raw.length - this.lastFlushedRawLength);
	}

	/**
	 * Append a streamed Markdown token and schedule a frame flush.
	 */
	public append(chunk: string) {
		const eosSnapshot = this.handleEndOfStreamToken(chunk);
		if (eosSnapshot) return eosSnapshot;
		if (!chunk) return;
		this.activeRaw += chunk;
		this.commitStableLines();
		this.scheduleFlush();
	}

	/**
	 * Emit the current snapshot immediately.
	 */
	public flush(reason: MarkdownStreamBufferSnapshot['reason'] = 'manual') {
		this.clearScheduledFlush();
		const raw = this.committedRaw + this.activeRaw;
		const healthy = this.buildHealthyOutput();
		this.lastFlushAt = Date.now();
		this.lastFlushedRawLength = raw.length;
		const snapshot: MarkdownStreamBufferSnapshot = {
			raw,
			healthy,
			reason,
			isComplete: this.completeSignal,
			pendingCharacters: this.pendingCharacters,
		};
		this.onFlush?.(snapshot);
		return snapshot;
	}

	/**
	 * Mark the stream as complete and flush one final snapshot.
	 */
	public complete() {
		this.clearScheduledFlush();
		this.completeSignal = true;
		return this.flush('complete');
	}

	/**
	 * Clear the buffered state and cancel any pending frame.
	 */
	public reset() {
		this.clearScheduledFlush();
		this.committedRaw = '';
		this.activeRaw = '';
		this.lastFlushAt = 0;
		this.lastFlushedRawLength = 0;
		this.completeSignal = false;
	}

	/**
	 * Cancel future work and release the retained state.
	 */
	public dispose() {
		this.reset();
	}

	private handleEndOfStreamToken(chunk: string) {
		if (!this.endOfStreamToken) return null;
		if (!chunk.includes(this.endOfStreamToken)) return null;

		const [beforeToken] = chunk.split(this.endOfStreamToken);
		if (beforeToken) {
			this.activeRaw += beforeToken;
			this.commitStableLines();
		}

		const snapshot = this.complete();
		this.dispose();
		return snapshot;
	}

	private scheduleFlush() {
		if (this.frameHandle !== null || this.flushTimer !== null) return;
		this.frameHandle = this.requestFrame(() => {
			this.frameHandle = null;
			const remainingDelay = this.getRemainingFlushDelay();
			if (remainingDelay <= 0) {
				this.flush('raf');
				return;
			}

			this.flushTimer = setTimeout(() => {
				this.flushTimer = null;
				this.flush('raf');
			}, remainingDelay);
		});
	}

	private getRemainingFlushDelay() {
		if (this.flushDelayMs <= 0) return 0;
		const elapsed = Date.now() - this.lastFlushAt;
		return Math.max(0, this.flushDelayMs - elapsed);
	}

	private clearScheduledFlush() {
		if (this.frameHandle !== null) {
			this.cancelFrame(this.frameHandle);
			this.frameHandle = null;
		}

		if (this.flushTimer !== null) {
			clearTimeout(this.flushTimer);
			this.flushTimer = null;
		}
	}

	private commitStableLines() {
		const activeHealthy = this.buildHealthyTail(this.activeRaw);
		if (activeHealthy !== this.activeRaw) return;

		const lastNewlineIndex = this.activeRaw.lastIndexOf('\n');
		if (lastNewlineIndex === -1) return;

		const stablePrefix = this.activeRaw.slice(0, lastNewlineIndex + 1);
		this.committedRaw += stablePrefix;
		this.activeRaw = this.activeRaw.slice(lastNewlineIndex + 1);
	}

	private buildHealthyOutput() {
		const healthyTail = this.buildHealthyTail(this.activeRaw);
		return `${this.committedRaw}${this.applyHealthyEndMarker(this.activeRaw, healthyTail)}`;
	}

	private applyHealthyEndMarker(rawTail: string, healthyTail: string) {
		if (!this.healthyEndMarker) return healthyTail;
		if (healthyTail.length === 0) return this.healthyEndMarker;
		if (healthyTail.endsWith('\n') && !rawTail.endsWith('\n')) {
			return `${healthyTail.slice(0, -1)}${this.healthyEndMarker}\n`;
		}
		return `${healthyTail}${this.healthyEndMarker}`;
	}

	private buildHealthyTail(value: string) {
		const withHtmlHandling = this.htmlHandling === 'strip' ? stripHtmlTags(value) : value;
		const withInlineSelects = this.closeTrailingInlineSelect(withHtmlHandling);
		const withLinksAndImages = this.includeLinksAndImages
			? this.closeLinksAndImages(withInlineSelects)
			: withInlineSelects;
		return this.closeInlineMarkdown(withLinksAndImages);
	}

	private closeTrailingInlineSelect(value: string) {
		if (value.length === 0) return value;

		let cursor = 0;
		let selectStart = -1;
		let lastCompleteBoundary = -1;

		while (cursor < value.length) {
			if (isEscaped(value, cursor)) {
				cursor += 1;
				continue;
			}

			if (value[cursor] !== '$') {
				cursor += 1;
				continue;
			}

			const nextCharacter = value[cursor + 1];
			if (nextCharacter !== '$') {
				if (cursor === value.length - 1) {
					if (selectStart === -1) return value.slice(0, -1);
					return lastCompleteBoundary === -1 ? value.slice(0, selectStart) : value.slice(0, lastCompleteBoundary);
				}
				cursor += 1;
				continue;
			}

			if (selectStart === -1) {
				selectStart = cursor;
				lastCompleteBoundary = -1;
				cursor += 2;
				continue;
			}

			lastCompleteBoundary = cursor + 2;
			const postMarkerCharacter = value[cursor + 2];
			if (postMarkerCharacter === undefined) {
				return value.slice(0, lastCompleteBoundary);
			}

			if (/[\s,.!]/.test(postMarkerCharacter)) {
				selectStart = -1;
				lastCompleteBoundary = -1;
				cursor += 2;
				continue;
			}

			cursor += 2;
		}

		if (selectStart === -1) return value;
		return lastCompleteBoundary === -1 ? value.slice(0, selectStart) : value.slice(0, lastCompleteBoundary);
	}

	private closeInlineMarkdown(value: string) {
		const pairedRules = this.getPairedRules();
		const counts = countRuleOccurrences(value, pairedRules);
		const withSymmetricClosers = this.closeSymmetricPairedMarkers(value);
		const withAsymmetricClosers = this.closeAsymmetricPairedMarkers(withSymmetricClosers, counts);
		return this.closeLineMarkers(withAsymmetricClosers);
	}

	private closeLinksAndImages(value: string) {
		const withImageSignalHandled = this.closeTrailingImageSignal(value);
		if (withImageSignalHandled !== value) {
			return withImageSignalHandled;
		}

		const trailingImage = this.findTrailingImage(value);
		if (trailingImage) {
			return this.closeTrailingImage(value, trailingImage);
		}

		const trailingLink = this.findTrailingLink(value);
		if (!trailingLink) return value;
		return this.closeTrailingLink(value, trailingLink);
	}

	private getPairedRules() {
		return this.watchedMarkers.filter((rule) => (rule.mode ?? 'paired') === 'paired');
	}

	private closeSymmetricPairedMarkers(value: string) {
		let nextValue = value;
		const suppressedCharacters = new Set<string>();
		const symmetricRules = this.getPairedRules().filter((rule) => rule.open === rule.close);

		for (const rule of symmetricRules) {
			const repeatedCharacter = getRepeatedTokenCharacter(rule.open);
			if (repeatedCharacter && suppressedCharacters.has(repeatedCharacter)) {
				continue;
			}

			const unmatchedOpenIndex = findLastUnmatchedSymmetricOpen(nextValue, rule.open);
			if (unmatchedOpenIndex === -1) continue;

			if (!hasMeaningfulInlineContent(nextValue.slice(unmatchedOpenIndex + rule.open.length), repeatedCharacter)) {
				nextValue = nextValue.slice(0, unmatchedOpenIndex);
				if (repeatedCharacter) suppressedCharacters.add(repeatedCharacter);
				continue;
			}

			if (repeatedCharacter) {
				const trailingRunLength = countTrailingRepeatedCharacter(nextValue, repeatedCharacter);
				const remainingCharacters = Math.max(rule.close.length - trailingRunLength, 0);
				nextValue += repeatedCharacter.repeat(remainingCharacters);
			} else {
				nextValue += rule.close;
			}

			if (repeatedCharacter) {
				suppressedCharacters.add(repeatedCharacter);
			}
		}

		return nextValue;
	}

	private closeAsymmetricPairedMarkers(value: string, counts: Record<string, number>) {
		let nextValue = value;
		const asymmetricRules = this.getPairedRules().filter((rule) => rule.open !== rule.close);

		for (const rule of asymmetricRules) {
			const openCount = counts[rule.open] ?? 0;
			const closeCount = counts[rule.close] ?? 0;
			if (openCount > closeCount) {
				nextValue += rule.close.repeat(openCount - closeCount);
			}
		}

		return nextValue;
	}

	private closeLineMarkers(value: string) {
		let nextValue = value;
		const trailingLine = nextValue.split('\n').at(-1) ?? '';
		if (trailingLine.trim().length === 0) return nextValue;
		const trailingLineStart = nextValue.length - trailingLine.length;

		const lineRules = this.watchedMarkers.filter((rule) => (rule.mode ?? 'paired') === 'line');

		for (const rule of lineRules) {
			if (rule.linePattern) {
				if (!rule.linePattern.test(trailingLine)) continue;
				nextValue += rule.close;
				break;
			}

			if (rule.requiresLineStart && !trailingLine.startsWith(rule.open)) continue;

			const remaining = trailingLine.slice(rule.open.length).trim();
			const requiresContent = rule.requiresContent ?? true;
			if (requiresContent && remaining.length === 0) continue;

			nextValue += rule.close;
			break;
		}

		for (const rule of lineRules) {
			if (rule.partialLinePattern?.test(trailingLine)) {
				return nextValue.slice(0, trailingLineStart);
			}

			if (!rule.requiresLineStart || !trailingLine.startsWith(rule.open)) continue;
			if (!(rule.requiresContent ?? true)) continue;

			const remaining = trailingLine.slice(rule.open.length).trim();
			if (remaining.length === 0) {
				return nextValue.slice(0, trailingLineStart);
			}
		}

		return nextValue;
	}

	private closeTrailingLink(value: string, construct: TrailingInlineConstruct) {
		if (!construct.labelClosed) {
			return value.slice(0, construct.start);
		}

		if (construct.parenOpened) {
			const linkPreview = `${value.slice(construct.start, construct.labelEnd + 1)}()`;
			return `${value.slice(0, construct.start)}${linkPreview}`;
		}

		if (construct.labelEnd === value.length - 1) {
			return value.slice(0, construct.start);
		}

		return value;
	}

	private closeTrailingImage(value: string, construct: TrailingInlineConstruct) {
		if (!construct.labelClosed) {
			return value.slice(0, construct.start);
		}

		if (construct.parenOpened) {
			return value.slice(0, construct.start);
		}

		if (construct.labelEnd === value.length - 1) {
			return value.slice(0, construct.start);
		}

		return `${value.slice(0, construct.start)}${value.slice(construct.labelEnd + 1)}`;
	}

	private closeTrailingImageSignal(value: string) {
		const lastBangIndex = value.lastIndexOf('!');
		if (lastBangIndex === -1) return value;
		if (lastBangIndex !== value.length - 1) return value;
		if (isEscaped(value, lastBangIndex)) return value;
		return value.slice(0, lastBangIndex);
	}

	private findTrailingLink(value: string) {
		const construct = this.findTrailingInlineConstruct(value, false);
		if (!construct) return null;
		if (!construct.labelClosed) return construct;
		if (construct.parenOpened) return construct;
		if (construct.labelEnd === value.length - 1) return construct;
		return null;
	}

	private findTrailingImage(value: string) {
		return this.findTrailingInlineConstruct(value, true);
	}

	private findTrailingInlineConstruct(value: string, isImage: boolean) {
		const stack: TrailingInlineConstruct[] = [];

		for (let index = 0; index < value.length; index += 1) {
			if (isEscaped(value, index)) continue;

			const character = value[index];
			if (character === '[') {
				const isImage = index > 0 && value[index - 1] === '!' && !isEscaped(value, index - 1);
				stack.push({
					start: isImage ? index - 1 : index,
					isImage,
					labelClosed: false,
					labelEnd: -1,
					parenOpened: false,
				});
				continue;
			}

			if (character === ']') {
				const target = [...stack].reverse().find((item) => !item.labelClosed);
				if (!target) continue;
				target.labelClosed = true;
				target.labelEnd = index;
				continue;
			}

			if (character === '(') {
				const target = [...stack]
					.reverse()
					.find((item) => item.labelClosed && !item.parenOpened && item.labelEnd === index - 1);
				if (!target) continue;
				target.parenOpened = true;
				continue;
			}

			if (character === ')') {
				const targetIndex = [...stack]
					.map((item, stackIndex) => ({ item, stackIndex }))
					.reverse()
					.find(({ item }) => item.parenOpened)?.stackIndex;
				if (typeof targetIndex === 'number') {
					stack.splice(targetIndex, 1);
				}
			}
		}

		const trailingConstruct = stack.findLast((item) => item.isImage === isImage);
		return trailingConstruct ?? null;
	}
}

function getRequestFrame() {
	if (typeof globalThis !== 'undefined' && typeof globalThis.requestAnimationFrame === 'function') {
		return globalThis.requestAnimationFrame.bind(globalThis);
	}
	return ((callback: FrameRequestCallback) =>
		globalThis.setTimeout(() => callback(Date.now()), 16) as unknown as number) as (
		callback: FrameRequestCallback,
	) => number;
}

function getCancelFrame() {
	if (typeof globalThis !== 'undefined' && typeof globalThis.cancelAnimationFrame === 'function') {
		return globalThis.cancelAnimationFrame.bind(globalThis);
	}
	return ((handle: number) => globalThis.clearTimeout(handle)) as (handle: number) => void;
}

function isEscaped(value: string, index: number) {
	let slashCount = 0;
	for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
		if (value[cursor] !== '\\') break;
		slashCount += 1;
	}
	return slashCount % 2 !== 0;
}

function sortRules(rules: MarkdownAutoCloseRule[]) {
	return [...rules].sort((left, right) => right.open.length - left.open.length);
}

function countRuleOccurrences(value: string, rules: MarkdownAutoCloseRule[]): Record<string, number> {
	const counts: Record<string, number> = {};
	const tokens = new Set<string>();

	for (const rule of rules) {
		tokens.add(rule.open);
		tokens.add(rule.close);
	}

	const sortedTokens = [...tokens].sort((left, right) => right.length - left.length);

	for (let index = 0; index < value.length; index += 1) {
		if (isEscaped(value, index)) continue;

		const matchedToken = sortedTokens.find(
			(token) => token.length > 0 && value.slice(index, index + token.length) === token,
		);
		if (!matchedToken) continue;
		if (shouldIgnoreSymmetricToken(value, matchedToken, index)) continue;
		if (matchedToken === '*' && isStarListMarker(value, index)) continue;

		counts[matchedToken] = (counts[matchedToken] ?? 0) + 1;
		index += matchedToken.length - 1;
	}

	return counts;
}

function isStarListMarker(value: string, index: number) {
	const atLineStart = index === 0 || value[index - 1] === '\n';
	return atLineStart && value[index + 1] === ' ';
}

function getRepeatedTokenCharacter(token: string) {
	if (token.length === 0) return null;
	if (token.split('').every((character) => character === token[0])) {
		return token[0];
	}
	return null;
}

function countTrailingRepeatedCharacter(value: string, character: string) {
	let count = 0;
	for (let index = value.length - 1; index >= 0; index -= 1) {
		if (value[index] !== character) break;
		count += 1;
	}
	return count;
}

function shouldIgnoreSymmetricToken(value: string, token: string, index: number) {
	if (!token.includes('_')) return false;
	const previousCharacter = value[index - 1] ?? '';
	const nextCharacter = value[index + token.length] ?? '';
	return isWordCharacter(previousCharacter) || isWordCharacter(nextCharacter);
}

function isWordCharacter(value: string) {
	return /[A-Za-z0-9]/.test(value);
}

function findLastUnmatchedSymmetricOpen(value: string, token: string) {
	let occurrenceCount = 0;
	let lastIndex = -1;

	for (let index = 0; index <= value.length - token.length; index += 1) {
		if (isEscaped(value, index)) continue;
		if (value.slice(index, index + token.length) !== token) continue;
		if (shouldIgnoreSymmetricToken(value, token, index)) continue;
		occurrenceCount += 1;
		lastIndex = index;
		index += token.length - 1;
	}

	if (occurrenceCount % 2 === 0) return -1;
	return lastIndex;
}

function hasMeaningfulInlineContent(value: string, repeatedCharacter: string | null) {
	if (value.trim().length === 0) return false;
	if (!repeatedCharacter) return true;
	const withoutRepeatedCharacters = value.replaceAll(repeatedCharacter, '').trim();
	return withoutRepeatedCharacters.length > 0;
}

function stripHtmlTags(value: string) {
	let stripped = value.replaceAll(/<\/?[a-zA-Z][^>]*>/g, '');
	const lastOpenTag = stripped.lastIndexOf('<');
	const lastCloseBracket = stripped.lastIndexOf('>');

	if (lastOpenTag > lastCloseBracket) {
		const trailingSegment = stripped.slice(lastOpenTag);
		if (/^<\/?[a-zA-Z][^>]*$/.test(trailingSegment)) {
			stripped = stripped.slice(0, lastOpenTag);
		}
	}

	return stripped;
}
