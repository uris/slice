import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFileSelection } from './useFileSelection';

describe('useFileSelection', () => {
	it('preserves existing items and notifies accepted/rejected selection in order', () => {
		const existing = { id: 'old', file: 'old.pdf' };
		const onFilesChange = vi.fn(),
			onUpload = vi.fn(),
			onReject = vi.fn();
		const { result } = renderHook(() =>
			useFileSelection({
				files: [existing],
				acceptedTypes: ['pdf'],
				multiple: true,
				disabled: false,
				onFilesChange,
				onUpload,
				onReject,
			}),
		);
		const pdf = new File([''], 'a.PDF'),
			bad = new File([''], 'bad.txt');
		act(() => {
			expect(result.current.selectFiles([pdf, bad])).toBe(true);
		});
		expect(onFilesChange.mock.calls[0][0][0]).toBe(existing);
		expect(onFilesChange.mock.calls[0][0][1].file).toBe(pdf);
		expect(onUpload).toHaveBeenCalledWith([pdf]);
		expect(onReject).toHaveBeenCalledWith([{ file: bad, reason: 'type' }]);
		expect(result.current.rejection).toContain('bad.txt');
	});
	it('ignores disabled and empty selections', () => {
		const onFilesChange = vi.fn();
		const { result, rerender } = renderHook(
			({ disabled }) => useFileSelection({ files: [], acceptedTypes: [], multiple: true, disabled, onFilesChange }),
			{ initialProps: { disabled: true } },
		);
		act(() => {
			expect(result.current.selectFiles([new File([''], 'a.txt')])).toBe(false);
		});
		rerender({ disabled: false });
		act(() => {
			expect(result.current.selectFiles([])).toBe(false);
		});
		expect(onFilesChange).not.toHaveBeenCalled();
	});
	it('replaces single selections and clears errors on success', () => {
		const onFilesChange = vi.fn();
		const { result } = renderHook(() =>
			useFileSelection({
				files: [{ file: 'old.pdf' }],
				acceptedTypes: ['pdf'],
				multiple: false,
				disabled: false,
				onFilesChange,
			}),
		);
		act(() => {
			result.current.selectFiles([new File([''], 'bad.txt')]);
		});
		expect(result.current.rejection).not.toBe('');
		act(() => {
			result.current.selectFiles([new File([''], 'new.pdf'), new File([''], 'extra.pdf')]);
		});
		expect(result.current.rejection).toContain('only one');
		expect(onFilesChange.mock.calls[0][0]).toHaveLength(1);
		act(() => {
			result.current.selectFiles([new File([''], 'valid.pdf')]);
		});
		expect(result.current.rejection).toBe('');
	});
	it('opens and resets the native picker only when enabled', () => {
		const { result, rerender } = renderHook(
			({ disabled }) => useFileSelection({ files: [], acceptedTypes: [], multiple: true, disabled }),
			{ initialProps: { disabled: false } },
		);
		result.current.openPicker();
		const input = document.createElement('input');
		input.type = 'file';
		result.current.inputRef.current = input;
		const click = vi.spyOn(input, 'click').mockImplementation(() => {});
		result.current.openPicker();
		expect(click).toHaveBeenCalledTimes(1);
		rerender({ disabled: true });
		result.current.openPicker();
		expect(click).toHaveBeenCalledTimes(1);
	});
});
