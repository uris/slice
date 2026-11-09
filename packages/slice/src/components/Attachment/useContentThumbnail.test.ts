import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { Content } from './_types';
import { useContentThumbnail } from './useContentThumbnail';

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

it('truncates literal text and clears it when content is removed', () => {
	const { result, rerender } = renderHook(({ content }: { content?: Content }) => useContentThumbnail(content), {
		initialProps: { content: 'a'.repeat(300) } as { content?: Content },
	});
	expect(result.current.thumbnail).toEqual({ type: 'text', text: 'a'.repeat(250) });
	rerender({ content: '' });
	expect(result.current.thumbnail).toEqual({ type: 'text', text: '' });
	rerender({});
	expect(result.current).toEqual({ contentType: undefined, contentFormat: undefined, thumbnail: undefined, isLoading: false, fileName: undefined, fileExtension: undefined, fileSize: undefined });
});

it('owns image URLs and releases them on replacement and unmount', () => {
	const createObjectURL = vi.fn().mockReturnValueOnce('blob:first').mockReturnValueOnce('blob:second');
	const revokeObjectURL = vi.fn();
	vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
	const first = new File(['a'], 'first', { type: 'image/png' });
	const second = new File(['b'], 'second.jpg');
	const { result, rerender, unmount } = renderHook(({ content }: { content: Content }) => useContentThumbnail(content), {
		initialProps: { content: { file: first } } as { content: Content },
	});
	expect(result.current.thumbnail).toEqual({ type: 'image', src: 'blob:first' });
	rerender({ content: { file: first } });
	expect(createObjectURL).toHaveBeenCalledTimes(1);
	rerender({ content: { file: second } });
	expect(revokeObjectURL).toHaveBeenCalledWith('blob:first');
	expect(result.current.thumbnail).toEqual({ type: 'image', src: 'blob:second' });
	unmount();
	expect(revokeObjectURL).toHaveBeenCalledWith('blob:second');
});

it('does not create previews for filenames or unsupported files', () => {
	const { result, rerender } = renderHook(({ content }: { content: Content }) => useContentThumbnail(content), {
		initialProps: { content: { file: 'photo.png' } } as { content: Content },
	});
	expect(result.current.contentFormat).toBe('image');
	expect(result.current.thumbnail).toBeUndefined();
	rerender({ content: { file: new File(['pdf'], 'document.pdf') } });
	expect(result.current.contentFormat).toBe('pdf');
	expect(result.current.thumbnail).toBeUndefined();
});

it.each([
    [0, '0 k'], [512, '0.5 k'], [5120, '5 k'],
    [1024 * 1024 - 1, '1024 k'], [1024 * 1024, '1 mb'],
    [5 * 1024 * 1024, '5 mb'], [5.5 * 1024 * 1024, '5.5 mb'],
])('formats %i bytes as %s', (bytes, expected) => {
    const {result} = renderHook(() => useContentThumbnail({file: new File([new Uint8Array(bytes)], 'Report.PDF')}));
    expect(result.current.fileSize).toBe(expected);
    expect(result.current.fileExtension).toBe('pdf');
});

it.each([
    ['photo.JPG', 'jpg'], ['https://example.com/photo.PNG?v=1#preview', 'png'],
    ['archive.tar.gz', 'gz'], ['README', undefined], ['.gitignore', undefined], ['file.', undefined],
])('extracts the extension from %s without requiring file bytes', (file, expected) => {
    const {result} = renderHook(() => useContentThumbnail({file}));
    expect(result.current.fileExtension).toBe(expected);
    expect(result.current.fileSize).toBeUndefined();
});

it.each([
    ['Report.PDF', 'Report'], ['archive.tar.gz', 'archive.tar'],
    ['README', 'README'], ['.gitignore', '.gitignore'],
    ['https://example.com/photo.JPG?v=1', 'photo'],
])('returns the filename without its final extension for %s', (file, expected) => {
    const {result} = renderHook(() => useContentThumbnail({file}));
    expect(result.current.fileName).toBe(expected);
});

it('uses clipboard for string content and preserves File name casing', () => {
    const {result, rerender} = renderHook(({content}: {content: Content}) => useContentThumbnail(content), {
        initialProps: {content: 'Copied text'} as {content: Content},
    });
    expect(result.current.fileName).toBe('clipboard');
    rerender({content: {file: new File([], 'My.Report.PDF')}});
    expect(result.current.fileName).toBe('My.Report');
});

it('reads a bounded text-file prefix, truncates it, and keeps the file metadata', async () => {
    const file = new File(['A'.repeat(5000)], 'Meeting-notes.txt', {type: 'text/plain'});
    const slice = vi.spyOn(file, 'slice');
    const {result} = renderHook(() => useContentThumbnail({file}));
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.thumbnail).toEqual({type: 'text', text: 'A'.repeat(250)}));
    expect(result.current.isLoading).toBe(false);
    expect(slice).toHaveBeenCalledWith(0, 4096);
    expect(result.current.fileName).toBe('Meeting-notes');
    expect(result.current.fileExtension).toBe('txt');
    expect(result.current.fileSize).toBe('4.9 k');
});

it('replaces pending text reads and clears previews for other files', async () => {
    const {result, rerender, unmount} = renderHook(({content}: {content: Content}) => useContentThumbnail(content), {
        initialProps: {content: {file: new File(['Old text'], 'old.txt')}} as {content: Content},
    });
    rerender({content: {file: new File(['<b>New text</b>'], 'new.md')}});
    await waitFor(() => expect(result.current.thumbnail).toEqual({type: 'text', text: '<b>New text</b>'}));
    rerender({content: {file: new File(['binary'], 'document.docx')}});
    expect(result.current.thumbnail).toBeUndefined();
    rerender({content: {file: new File(['Pending'], 'pending.txt')}});
    unmount();
});

it('clears loading and falls back after a text read error', () => {
    vi.spyOn(FileReader.prototype, 'readAsText').mockImplementation(function(this: FileReader) {
        this.dispatchEvent(new ProgressEvent('error'));
    });
    const file = new File(['Unreadable'], 'notes.txt');
    const {result} = renderHook(() => useContentThumbnail({file}));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.thumbnail).toBeUndefined();
});

it('falls back if an image URL cannot be generated', () => {
    vi.stubGlobal('URL', {createObjectURL: vi.fn(() => {throw new Error('Unavailable');})});
    const file = new File([], 'photo.png');
    const {result} = renderHook(() => useContentThumbnail({file}));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.thumbnail).toBeUndefined();
});
