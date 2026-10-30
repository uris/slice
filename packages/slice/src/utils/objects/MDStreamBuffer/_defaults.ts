import type { MarkdownAutoCloseRule } from './_types';

export const DEFAULT_MAX_DEFERRED_CHARACTERS = 48;
export const DEFAULT_WATCHED_MARKERS: MarkdownAutoCloseRule[] = [
	{
		name: 'fenced code block',
		open: '```',
		close: '```',
	},
	{
		name: 'bold',
		open: '**',
		close: '**',
	},
	{
		name: 'double underscore emphasis',
		open: '__',
		close: '__',
	},
	{
		name: 'strikethrough',
		open: '~~',
		close: '~~',
	},
	{
		name: 'inline code',
		open: '`',
		close: '`',
	},
	{
		name: 'italic',
		open: '*',
		close: '*',
	},
	{
		name: 'underscore emphasis',
		open: '_',
		close: '_',
	},
	{
		name: 'heading - ie #, ##, etc.',
		open: '',
		close: '\n',
		mode: 'line',
		linePattern: /^#{1,6}\s+\S.*/,
		partialLinePattern: /^#{1,6}\s*$/,
	},
	{
		name: 'blockquote',
		open: '',
		close: '\n',
		mode: 'line',
		linePattern: /^>\s+\S.*/,
		partialLinePattern: /^>\s*$/,
	},
	{
		name: 'horizontal rule with "-"',
		open: '',
		close: '\n',
		mode: 'line',
		linePattern: /^-{3,}\s*$/,
		partialLinePattern: /^-{1,2}\s*$/,
	},
	{
		name: 'task list',
		open: '',
		close: '\n',
		mode: 'line',
		linePattern: /^[-*+]\s+\[(?: |x|X)\]\s+\S.*/,
		partialLinePattern: /^[-*+]\s+\[(?:\s|x|X)?\]?\s*$/,
	},
	{
		name: 'unordered list "-"',
		open: '',
		close: '\n',
		mode: 'line',
		linePattern: /^-\s+\S.*/,
		partialLinePattern: /^-\s*$/,
	},
	{
		name: 'unordered list with "*"',
		open: '',
		close: '\n',
		mode: 'line',
		linePattern: /^\*\s+\S.*/,
		partialLinePattern: /^\*\s*$/,
	},
	{
		name: 'unordered list with "+"',
		open: '',
		close: '\n',
		mode: 'line',
		linePattern: /^\+\s+\S.*/,
		partialLinePattern: /^\+\s*$/,
	},
	{
		name: 'ordered list',
		open: '',
		close: '\n',
		mode: 'line',
		linePattern: /^\d+\.\s+\S.*/,
		partialLinePattern: /^\d+\.\s*$/,
	},
];
