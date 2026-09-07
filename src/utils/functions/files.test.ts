import { describe, expect, it } from 'vitest';
import { clipboardTextToFile, fileIconName, nameAndExtension } from './files';

describe('nameAndExtension', () => {
	it('splits a normal file name into name and extension', () => {
		expect(nameAndExtension('report.pdf')).toEqual({
			name: 'report.pdf',
			ext: 'pdf',
		});
	});

	it('uses the last segment for multi-dot file names', () => {
		expect(nameAndExtension('archive.tar.gz')).toEqual({
			name: 'archive.tar.gz',
			ext: 'gz',
		});
	});

	it('falls back to the whole name when there is no extension', () => {
		expect(nameAndExtension('README')).toEqual({
			name: 'README',
			ext: 'README',
		});
	});
});

describe('fileIconName', () => {
	it.each([
		['png', 'image'],
		['jpeg', 'image'],
		['docx', 'text'],
		['md', 'md'],
		['ts', 'code'],
		['csv', 'sheet'],
		['pptx', 'preso'],
		['pdf', 'pdf'],
		['mp3', 'audio'],
		['mp4', 'video'],
		['clipboard', 'clipboard'],
		['xyz', 'other'],
	])('maps .%s to %s', (extension, expected) => {
		expect(fileIconName(extension)).toBe(expected);
	});
});

describe('clipboardTextToFile', () => {
	it('appends a .clipboard extension to a default generated name', () => {
		const file = clipboardTextToFile('hello');
		expect(file).toBeInstanceOf(File);
		expect(file.name.endsWith('.clipboard')).toBe(true);
		expect(file.type).toBe('text/plain');
	});

	it('appends .clipboard to a custom name that lacks it', () => {
		const file = clipboardTextToFile('hello', 'my-note');
		expect(file.name).toBe('my-note.clipboard');
	});

	it('does not double up the .clipboard extension', () => {
		const file = clipboardTextToFile('hello', 'my-note.clipboard');
		expect(file.name).toBe('my-note.clipboard');
	});
});
