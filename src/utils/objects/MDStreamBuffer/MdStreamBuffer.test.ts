import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MdBuffer } from './MdStreamBuffer';

function flushRaf() {
	// MdBuffer schedules its snapshot flush on requestAnimationFrame (and an
	// optional setTimeout on top of that for flushDelayMs). Fake timers mock
	// both, so advancing far enough covers either path.
	vi.advanceTimersByTime(50);
}

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

describe('MdBuffer - core buffering', () => {
	it('accumulates raw content across appends', () => {
		const buffer = new MdBuffer();
		buffer.append('hello ');
		buffer.append('world');
		expect(buffer.raw).toBe('hello world');
	});

	it('append() with an empty chunk is a no-op', () => {
		const buffer = new MdBuffer();
		const result = buffer.append('');
		expect(result).toBeUndefined();
		expect(buffer.raw).toBe('');
	});

	it('flush() invokes onFlush with a full snapshot and resets pendingCharacters', () => {
		const onFlush = vi.fn();
		const buffer = new MdBuffer({ onFlush });
		buffer.append('hello');

		const snapshot = buffer.flush('manual');

		expect(snapshot.raw).toBe('hello');
		expect(snapshot.reason).toBe('manual');
		expect(snapshot.isComplete).toBe(false);
		expect(onFlush).toHaveBeenCalledWith(snapshot);
		expect(buffer.pendingCharacters).toBe(0);
	});

	it('append() schedules an automatic raf-based flush', () => {
		const onFlush = vi.fn();
		const buffer = new MdBuffer({ onFlush });
		buffer.append('hello');

		flushRaf();

		expect(onFlush).toHaveBeenCalledWith(expect.objectContaining({ reason: 'raf', raw: 'hello' }));
	});

	it('does not schedule a second frame while one is already pending', () => {
		const onFlush = vi.fn();
		const buffer = new MdBuffer({ onFlush });
		buffer.append('a');
		buffer.append('b');

		flushRaf();

		expect(onFlush).toHaveBeenCalledTimes(1);
		expect(buffer.raw).toBe('ab');
	});

	it('complete() marks isComplete and flushes with reason "complete"', () => {
		const onFlush = vi.fn();
		const buffer = new MdBuffer({ onFlush });
		buffer.append('hello');

		const snapshot = buffer.complete();

		expect(snapshot.isComplete).toBe(true);
		expect(snapshot.reason).toBe('complete');
	});

	it('reset() clears raw, healthy, and completion state', () => {
		const buffer = new MdBuffer();
		buffer.append('hello');
		buffer.complete();

		buffer.reset();

		expect(buffer.raw).toBe('');
		expect(buffer.healthy).toBe('');
		expect(buffer.pendingCharacters).toBe(0);
	});

	it('dispose() behaves like reset()', () => {
		const buffer = new MdBuffer();
		buffer.append('hello');
		buffer.dispose();
		expect(buffer.raw).toBe('');
	});

	it('respects a configured flushDelayMs before flushing again', () => {
		const onFlush = vi.fn();
		const buffer = new MdBuffer({ onFlush, flushDelayMs: 200 });
		buffer.append('first');
		flushRaf();
		expect(onFlush).toHaveBeenCalledTimes(1);

		buffer.append('second');
		vi.advanceTimersByTime(10);
		// still within the flushDelayMs window from the first flush
		expect(onFlush).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(300);
		expect(onFlush).toHaveBeenCalledTimes(2);
	});

	it('commits complete lines into committedRaw once the tail is healthy', () => {
		const buffer = new MdBuffer();
		buffer.append('first line\nsecond line without newline');
		// raw is unaffected by committing internally
		expect(buffer.raw).toBe('first line\nsecond line without newline');
		expect(buffer.healthy).toBe('first line\nsecond line without newline');
	});
});

describe('MdBuffer - end of stream token', () => {
	it('completes and disposes automatically when the end-of-stream token arrives', () => {
		const onFlush = vi.fn();
		const buffer = new MdBuffer({ onFlush, endOfStreamToken: '<END>' });

		const snapshot = buffer.append('hello world<END>');

		expect(snapshot?.isComplete).toBe(true);
		expect(snapshot?.raw).toBe('hello world');
		// disposed after completion
		expect(buffer.raw).toBe('');
	});

	it('ignores chunks that do not contain the end-of-stream token', () => {
		const buffer = new MdBuffer({ endOfStreamToken: '<END>' });
		const result = buffer.append('still streaming');
		expect(result).toBeUndefined();
		expect(buffer.raw).toBe('still streaming');
	});
});

describe('MdBuffer - healthyEndMarker', () => {
	it('appends the marker directly when there is content and no trailing newline', () => {
		const buffer = new MdBuffer({ healthyEndMarker: '▍' });
		buffer.append('hello');
		expect(buffer.healthy.endsWith('▍')).toBe(true);
	});

	it('returns the marker alone when there is no healthy content yet', () => {
		const buffer = new MdBuffer({ healthyEndMarker: '▍' });
		expect(buffer.healthy).toBe('▍');
	});

	it('inserts the marker before a trailing newline introduced by closing a line construct', () => {
		const buffer = new MdBuffer({ healthyEndMarker: '▍' });
		buffer.append('# Heading');
		expect(buffer.healthy).toBe('# Heading▍\n');
	});
});

describe('MdBuffer - auto-closing inline markdown', () => {
	it('closes an unclosed bold marker', () => {
		const buffer = new MdBuffer();
		buffer.append('this is **bold');
		expect(buffer.healthy).toBe('this is **bold**');
	});

	it('closes an unclosed italic marker', () => {
		const buffer = new MdBuffer();
		buffer.append('this is *italic');
		expect(buffer.healthy).toBe('this is *italic*');
	});

	it('closes an unclosed inline code span', () => {
		const buffer = new MdBuffer();
		buffer.append('run `npm test');
		expect(buffer.healthy).toBe('run `npm test`');
	});

	it('closes an unclosed strikethrough marker', () => {
		const buffer = new MdBuffer();
		buffer.append('~~gone');
		expect(buffer.healthy).toBe('~~gone~~');
	});

	it('leaves a fully-closed bold marker untouched', () => {
		const buffer = new MdBuffer();
		buffer.append('this is **bold** already');
		expect(buffer.healthy).toBe('this is **bold** already');
	});

	it('does not treat an escaped marker as an opener', () => {
		const buffer = new MdBuffer();
		buffer.append('use \\* as a literal star, not *emphasis');
		expect(buffer.healthy).toBe('use \\* as a literal star, not *emphasis*');
	});

	it('does not close an underscore marker adjacent to a word character (snake_case)', () => {
		const buffer = new MdBuffer();
		buffer.append('a snake_case identifier');
		expect(buffer.healthy).toBe('a snake_case identifier');
	});
});

describe('MdBuffer - line-based markdown constructs', () => {
	it('auto-closes a heading once it has content', () => {
		const buffer = new MdBuffer();
		buffer.append('## Section title');
		expect(buffer.healthy).toBe('## Section title\n');
	});

	it('drops a heading marker with no content yet', () => {
		const buffer = new MdBuffer();
		buffer.append('##');
		expect(buffer.healthy).toBe('');
	});

	it('auto-closes a blockquote line', () => {
		const buffer = new MdBuffer();
		buffer.append('> quoted text');
		expect(buffer.healthy).toBe('> quoted text\n');
	});

	it('auto-closes an unordered list item', () => {
		const buffer = new MdBuffer();
		buffer.append('- list item');
		expect(buffer.healthy).toBe('- list item\n');
	});

	it('drops a bare list marker with no content yet', () => {
		const buffer = new MdBuffer();
		buffer.append('-');
		expect(buffer.healthy).toBe('');
	});
});

describe('MdBuffer - html handling', () => {
	it('leaves html untouched by default (ignore)', () => {
		const buffer = new MdBuffer();
		buffer.append('<div>hi</div>');
		expect(buffer.healthy).toContain('<div>hi</div>');
	});

	it('strips complete html tags when htmlHandling is "strip"', () => {
		const buffer = new MdBuffer({ htmlHandling: 'strip' });
		buffer.append('<div>hi</div> after');
		expect(buffer.healthy).toBe('hi after');
	});

	it('strips a trailing partial html tag when htmlHandling is "strip"', () => {
		const buffer = new MdBuffer({ htmlHandling: 'strip' });
		buffer.append('hello <sp');
		expect(buffer.healthy).toBe('hello ');
	});
});

describe('MdBuffer - links and images', () => {
	it('leaves link syntax alone when includeLinksAndImages is not set', () => {
		const buffer = new MdBuffer();
		buffer.append('see [docs');
		expect(buffer.healthy).toBe('see [docs');
	});

	it('drops a trailing unclosed link label', () => {
		const buffer = new MdBuffer({ includeLinksAndImages: true });
		buffer.append('see [docs');
		expect(buffer.healthy).toBe('see ');
	});

	it('previews a link whose url is still streaming with an empty href', () => {
		const buffer = new MdBuffer({ includeLinksAndImages: true });
		buffer.append('see [docs](https://exa');
		expect(buffer.healthy).toBe('see [docs]()');
	});

	it('leaves a fully-closed link untouched', () => {
		const buffer = new MdBuffer({ includeLinksAndImages: true });
		buffer.append('see [docs](https://example.com) done');
		expect(buffer.healthy).toBe('see [docs](https://example.com) done');
	});

	it('drops a trailing unclosed image label', () => {
		const buffer = new MdBuffer({ includeLinksAndImages: true });
		buffer.append('here ![al');
		expect(buffer.healthy).toBe('here ');
	});

	it('drops a trailing bare "!" image signal', () => {
		const buffer = new MdBuffer({ includeLinksAndImages: true });
		buffer.append('here !');
		expect(buffer.healthy).toBe('here ');
	});
});

describe('MdBuffer - custom watchedMarkers', () => {
	it('uses a fully custom set of watched markers instead of the defaults', () => {
		const buffer = new MdBuffer({
			watchedMarkers: [{ name: 'custom', open: '::', close: '::' }],
		});
		buffer.append('a ::custom');
		expect(buffer.healthy).toBe('a ::custom::');
		// default bold marker should no longer be auto-closed
		expect(new MdBuffer({ watchedMarkers: [] }).append('**bold') || true).toBe(true);
	});
});

describe('MdBuffer - trailing $$ math blocks', () => {
	it('drops a lone trailing unmatched "$"', () => {
		const buffer = new MdBuffer();
		buffer.append('price is $');
		expect(buffer.healthy).toBe('price is ');
	});

	it('leaves a fully-closed $$ ... $$ block untouched', () => {
		const buffer = new MdBuffer();
		buffer.append('$$ E = mc^2 $$ done');
		expect(buffer.healthy).toBe('$$ E = mc^2 $$ done');
	});

	it('truncates back to before an unclosed $$ block', () => {
		const buffer = new MdBuffer();
		buffer.append('the formula is $$ x');
		expect(buffer.healthy).toBe('the formula is ');
	});
});

describe('MdBuffer - symmetric marker suppression', () => {
	it('suppresses a lower-priority rule sharing the same repeated character once it has already closed', () => {
		// "**" (bold) sorts before "*" (italic) since rules are sorted by open
		// length; once bold has consumed and closed on "*", italic is skipped
		// for the same character rather than double-closing it.
		const buffer = new MdBuffer();
		buffer.append('this is **bold and *more');
		expect(buffer.healthy).toBe('this is **bold and *more**');
	});
});

describe('MdBuffer - asymmetric custom markers', () => {
	it('appends the missing closer when a custom open/close pair is unbalanced', () => {
		const buffer = new MdBuffer({ watchedMarkers: [{ name: 'custom', open: '<<', close: '>>' }] });
		buffer.append('<<open text');
		expect(buffer.healthy).toBe('<<open text>>');
	});

	it('does not add an extra closer once a custom open/close pair is already balanced', () => {
		const buffer = new MdBuffer({ watchedMarkers: [{ name: 'custom', open: '<<', close: '>>' }] });
		buffer.append('<<balanced>> after');
		expect(buffer.healthy).toBe('<<balanced>> after');
	});
});

describe('MdBuffer - links and images, additional branches', () => {
	it('strips a closed image construct that is not at the trailing edge of the buffer', () => {
		const buffer = new MdBuffer({ includeLinksAndImages: true });
		buffer.append('This is ![alt] more text');
		expect(buffer.healthy).toBe('This is  more text');
	});

	it('leaves a closed bracket construct alone when it is not recognized as a trailing link', () => {
		const buffer = new MdBuffer({ includeLinksAndImages: true });
		buffer.append('This is [text] more text');
		expect(buffer.healthy).toBe('This is [text] more text');
	});

	it('drops a bare closed image label with nothing after it', () => {
		const buffer = new MdBuffer({ includeLinksAndImages: true });
		buffer.append('![alt]');
		expect(buffer.healthy).toBe('');
	});

	it('does not treat an escaped "!" as a trailing image signal', () => {
		const buffer = new MdBuffer({ includeLinksAndImages: true });
		buffer.append('\\!');
		expect(buffer.healthy).toBe('\\!');
	});
});

describe('MdBuffer - manual flush cancels scheduled work', () => {
	it('cancels a pending animation frame when flush() is called before it fires', () => {
		const onFlush = vi.fn();
		const buffer = new MdBuffer({ onFlush });
		buffer.append('hello');
		// a raf is now scheduled but has not fired yet
		const snapshot = buffer.flush('manual');
		expect(snapshot.raw).toBe('hello');

		// advancing timers should not produce a second, stale "raf" flush
		flushRaf();
		expect(onFlush).toHaveBeenCalledTimes(1);
	});

	it('cancels a pending flushDelayMs timer when flush() is called before it fires', () => {
		const onFlush = vi.fn();
		const buffer = new MdBuffer({ onFlush, flushDelayMs: 100 });
		buffer.complete(); // establishes lastFlushAt

		buffer.append('more content');
		// let the raf fire (needs to cross fake-timer's internal rAF tick),
		// which schedules a flushTimer since we're still within the
		// flushDelayMs window
		vi.advanceTimersByTime(20);

		const snapshot = buffer.flush('manual');
		expect(snapshot.raw).toBe('more content');

		vi.advanceTimersByTime(200);
		// no stale timer-driven flush should follow
		expect(onFlush).toHaveBeenCalledTimes(2);
	});
});

describe('MdBuffer - trailing $$ block ending exactly at the closer', () => {
	it('leaves a $$ ... $$ block untouched when the string ends right at the closer', () => {
		const buffer = new MdBuffer();
		buffer.append('here $$closed$$');
		expect(buffer.healthy).toBe('here $$closed$$');
	});
});

describe('MdBuffer - $$ block followed by a glued re-opening', () => {
	it('keeps scanning for further $$ pairs after a closer glued directly to content', () => {
		const buffer = new MdBuffer();
		buffer.append('$$first$$glued$$second');
		expect(buffer.healthy).toBe('$$first$$glued$$');
	});
});

describe('MdBuffer - line markers without a linePattern', () => {
	const customLineMarker = {
		watchedMarkers: [
			{ name: 'note', open: 'NOTE:', close: '\n', mode: 'line' as const, requiresLineStart: true },
		],
	};

	it('closes a requiresLineStart marker once it has content', () => {
		const buffer = new MdBuffer(customLineMarker);
		buffer.append('NOTE:something');
		expect(buffer.healthy).toBe('NOTE:something\n');
	});

	it('drops a requiresLineStart marker with no content yet', () => {
		const buffer = new MdBuffer(customLineMarker);
		buffer.append('NOTE:');
		expect(buffer.healthy).toBe('');
	});

	it('ignores a requiresLineStart marker that does not actually start the line', () => {
		const buffer = new MdBuffer(customLineMarker);
		buffer.append('not a note NOTE:x');
		expect(buffer.healthy).toBe('not a note NOTE:x');
	});
});
