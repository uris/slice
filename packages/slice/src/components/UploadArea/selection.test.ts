import { describe, expect, it } from 'vitest';
import { normalizeAcceptedTypes, selectUploadFiles } from './selection';

const pdf = new File([''], 'REPORT.PDF', { type: 'image/png' });
const text = new File([''], 'notes.txt', { type: 'text/plain' });
describe('normalizeAcceptedTypes', () => {
	it('normalizes extensions, preserves MIME tokens, and deduplicates hints', () => {
		expect(
			normalizeAcceptedTypes(['PDF', ' .pdf ', 'image/*', 'IMAGE/PNG', 'bad/token/extra', '', 'bad token']),
		).toEqual(['.pdf', 'image/*', 'image/png']);
	});
});
describe('selectUploadFiles', () => {
	it('matches extensions using the name, ignoring conflicting MIME type', () => {
		expect(selectUploadFiles([pdf, text], ['pdf'], true)).toEqual({
			accepted: [pdf],
			rejected: [{ file: text, reason: 'type' }],
		});
	});
	it.each(['image/*', 'image/png'])('supports explicit %s MIME acceptance', (token) => {
		expect(selectUploadFiles([pdf, text], [token], true).accepted).toEqual([pdf]);
	});
	it('accepts every file with an empty restriction list', () => {
		expect(selectUploadFiles([pdf, text], [], true).accepted).toEqual([pdf, text]);
	});
	it('does not silently permit all files when every configured token is invalid', () => {
		expect(selectUploadFiles([pdf], ['invalid token'], true).rejected).toEqual([{ file: pdf, reason: 'type' }]);
	});
	it('accepts the first matching file in single mode and reports each excess match', () => {
		const extra = new File([''], 'another.pdf');
		expect(selectUploadFiles([text, pdf, extra], ['pdf'], false)).toEqual({
			accepted: [pdf],
			rejected: [
				{ file: text, reason: 'type' },
				{ file: extra, reason: 'multiple' },
			],
		});
	});
	it('does nothing for an empty selection', () => {
		expect(selectUploadFiles([], [], false)).toEqual({ accepted: [], rejected: [] });
	});
});
