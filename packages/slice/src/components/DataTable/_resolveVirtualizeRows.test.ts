import { describe, expect, it } from 'vitest';
import { resolveVirtualizeRows } from './_resolveVirtualizeRows';

describe('resolveVirtualizeRows', () => {
	it('auto-enables once rowCount exceeds the threshold when left unset', () => {
		expect(resolveVirtualizeRows(undefined, 501, 500)).toBe(true);
	});

	it('stays off at exactly the threshold - only bigger datasets auto-enable', () => {
		expect(resolveVirtualizeRows(undefined, 500, 500)).toBe(false);
	});

	it('stays off for small datasets when left unset', () => {
		expect(resolveVirtualizeRows(undefined, 5, 500)).toBe(false);
	});

	it('an explicit true always wins, even for a tiny dataset', () => {
		expect(resolveVirtualizeRows(true, 5, 500)).toBe(true);
	});

	it('an explicit false always wins, even for a huge dataset', () => {
		expect(resolveVirtualizeRows(false, 10000, 500)).toBe(false);
	});
});
