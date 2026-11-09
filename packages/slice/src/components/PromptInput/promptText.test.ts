import { describe, expect, it } from 'vitest';
import { insertPromptText, pasteBecomesAttachment } from './promptText';
describe('pasteBecomesAttachment', () => {
	it.each([undefined, -1, Number.NaN, Number.POSITIVE_INFINITY])('disables invalid limit %s', (limit) =>
		expect(pasteBecomesAttachment('long', limit)).toBe(false),
	);
	it('uses a strict greater-than boundary', () => {
		expect(pasteBecomesAttachment('hello', 5)).toBe(false);
		expect(pasteBecomesAttachment('hello!', 5)).toBe(true);
		expect(pasteBecomesAttachment('x', 0)).toBe(true);
	});
});
describe('insertPromptText', () => {
	it('replaces the selection and preserves surrounding text', () =>
		expect(insertPromptText('hello world', 'Slice', 6, 11)).toEqual({ value: 'hello Slice', caret: 11 }));
	it('limits inserted text without removing the suffix', () =>
		expect(insertPromptText('abcd', '12345', 1, 2, 6)).toEqual({ value: 'a123cd', caret: 4 }));
	it('supports empty text and zero length', () =>
		expect(insertPromptText('', 'text', 0, 0, 0)).toEqual({ value: '', caret: 0 }));
});

it('does not split emoji when applying a length limit', () => {
	expect(insertPromptText('', '😊', 0, 0, 1)).toEqual({ value: '', caret: 0 });
	expect(insertPromptText('', '😊', 0, 0, 2)).toEqual({ value: '😊', caret: 2 });
});
