import { describe, expect, it } from 'vitest';
import { fileItemKey, fileProgress } from './fileListValues';

describe('fileProgress', () => {
	it.each([
		[0, 0],
		[1, 1],
		[40.4, 40],
		[-10, 0],
		[150, 100],
	])('clamps and rounds %s to %s percent', (progress, expected) => {
		expect(fileProgress({ file: 'a.pdf', progress, uploading: true })).toBe(expected);
	});
	it.each([undefined, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
		'uses indeterminate uploading progress for %s',
		(progress) => {
			expect(fileProgress({ file: 'a.pdf', uploading: true, progress })).toBeUndefined();
			expect(fileProgress({ file: 'a.pdf', progress })).toBe(100);
		},
	);
});
describe('fileItemKey', () => {
	it('uses explicit IDs across immutable updates', () => {
		expect(fileItemKey({ id: 'one', file: 'a.pdf' })).toBe(fileItemKey({ id: 'one', file: 'renamed.pdf' }));
	});
	it('keeps retained attachment objects stable and duplicate filenames distinct', () => {
		const first = { file: 'a.pdf' },
			second = { file: 'a.pdf' };
		expect(fileItemKey(first)).toBe(fileItemKey(first));
		expect(fileItemKey(first)).not.toBe(fileItemKey(second));
	});
	it('keeps the same File stable across metadata updates', () => {
		const file = new File([''], 'a.pdf');
		expect(fileItemKey({ file, progress: 1 })).toBe(fileItemKey({ file, progress: 2 }));
	});
});

 it('preserves raw file identity across wrappers and distinguishes duplicate filenames', () => {
 const first = new File(['a'], 'duplicate.pdf');
 const second = new File(['b'], 'duplicate.pdf');
 expect(fileItemKey(first)).toBe(fileItemKey({ file: first }));
 expect(fileItemKey(first)).not.toBe(fileItemKey(second));
 });
