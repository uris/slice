import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';
import { useDoubleClick } from '../../hooks/useDoubleClick/useDoubleClick';
import { ContentEditable } from './ContentEditable';
import type { ContentEditableProps } from './_types';

function Editor({
	activation = 'doubleClick',
	...args
}: ContentEditableProps & { activation?: 'click' | 'doubleClick' }) {
	const [value, setValue] = useState(args.value ?? 'Quarterly planning');
	const [editing, setEditing] = useState(false);
	const [click, doubleClick] = useDoubleClick(
		() => {},
		() => setEditing(true),
	);
	return (
		<ContentEditable
			{...args}
			value={value}
			isEditable={editing}
			onClick={activation === 'click' ? () => setEditing(true) : click}
			onDoubleClick={doubleClick}
			onEditStart={() => setEditing(true)}
			onCommit={(next, previous) => {
				setValue(next);
				args.onCommit?.(next, previous);
			}}
			onEditEnd={(reason) => {
				setEditing(false);
				args.onEditEnd?.(reason);
			}}
		/>
	);
}
const meta = {
	title: 'Components/ContentEditable',
	component: ContentEditable,
	args: { name: 'Project title' },
} satisfies Meta<typeof ContentEditable>;
export default meta;
type Story = StoryObj<typeof meta>;
const callbacks = () => ({ onChange: fn(), onCommit: fn(), onEditEnd: fn() });
const text = (root: HTMLElement) => within(root).getByRole('textbox');
function paste(element: HTMLElement, plain: string, html = '') {
	const event = new Event('paste', { bubbles: true, cancelable: true });
	Object.defineProperty(event, 'clipboardData', {
		value: { getData: (type: string) => (type === 'text/plain' ? plain : html) },
	});
	element.dispatchEvent(event);
}
async function replace(element: HTMLElement, value: string) {
	element.textContent = value;
	await fireEvent.input(element, { inputType: 'insertText' });
}
export const Default: Story = {
	render: (args) => (
		<article style={{ width: '100%', maxWidth: 480 }}>
			<h2 style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.3 }}>
				<Editor {...args} />
			</h2>
			<p>Bring ideas, milestones, and priorities together. Keep the plan close to the work as it takes shape.</p>
			<time dateTime="2026-11-03T09:30:00-08:00">Updated Nov 3, 2026 · 9:30 AM</time>
		</article>
	),
};
export const Activation: Story = {
	tags: ['tests'],
	render: Default.render,
	args: callbacks(),
	play: async ({ canvasElement, args }) => {
		const title = within(canvasElement).getByText('Quarterly planning');
		await expect(within(canvasElement).queryByRole('textbox')).toBeNull();
		await userEvent.click(title);
		await expect(title).toHaveAttribute('contenteditable', 'false');
		await userEvent.dblClick(title);
		await expect(text(canvasElement)).toHaveFocus();
		await userEvent.keyboard('{End} updated{Enter}');
		await expect(args.onCommit).toHaveBeenCalledTimes(1);
		await expect(args.onCommit).toHaveBeenCalledWith('Quarterly planning updated', 'Quarterly planning');
		await expect(args.onEditEnd).toHaveBeenCalledTimes(1);
		await expect(args.onEditEnd).toHaveBeenCalledWith('enter');
		await expect(within(canvasElement).queryByRole('textbox')).toBeNull();
		await userEvent.click(title);
		await userEvent.keyboard('{F2}');
		await expect(text(canvasElement)).toHaveFocus();
		await userEvent.keyboard('{Escape}');
	},
};
export const BlurCommitsOnce: Story = {
	tags: ['tests'],
	args: { defaultValue: 'Before', isEditable: true, ...callbacks() },
	play: async ({ canvasElement, args }) => {
		const input = text(canvasElement);
		await expect(input).toHaveFocus();
		await replace(input, 'After');
		input.blur();
		await expect(args.onChange).toHaveBeenCalledTimes(1);
		await expect(args.onChange).toHaveBeenCalledWith('After');
		await expect(args.onCommit).toHaveBeenCalledTimes(1);
		await expect(args.onCommit).toHaveBeenCalledWith('After', 'Before');
		await expect(args.onEditEnd).toHaveBeenCalledTimes(1);
		await expect(args.onEditEnd).toHaveBeenCalledWith('blur');
		input.blur();
		await expect(args.onCommit).toHaveBeenCalledTimes(1);
	},
};
export const UnchangedExit: Story = {
	tags: ['tests'],
	args: { defaultValue: 'Same', isEditable: true, ...callbacks() },
	play: async ({ canvasElement, args }) => {
		await userEvent.keyboard('{Enter}');
		await expect(args.onCommit).not.toHaveBeenCalled();
		await expect(args.onEditEnd).toHaveBeenCalledTimes(1);
		await expect(args.onEditEnd).toHaveBeenCalledWith('enter');
		await expect(text(canvasElement)).toHaveTextContent('Same');
	},
};
export const Cancel: Story = {
	tags: ['tests'],
	args: { defaultValue: 'Keep this', isEditable: true, ...callbacks() },
	play: async ({ canvasElement, args }) => {
		await replace(text(canvasElement), 'Discard this');
		await userEvent.keyboard('{Escape}');
		await expect(text(canvasElement)).toHaveTextContent('Keep this');
		await expect(args.onCommit).not.toHaveBeenCalled();
		await expect(args.onEditEnd).toHaveBeenCalledTimes(1);
		await expect(args.onEditEnd).toHaveBeenCalledWith('escape');
	},
};
export const EmptyValue: Story = {
	tags: ['tests'],
	args: { defaultValue: 'Untitled', placeholder: 'Untitled', isEditable: true, selectOnEdit: true, ...callbacks() },
	play: async ({ canvasElement, args }) => {
		const input = text(canvasElement);
		await expect(input.ownerDocument.getSelection()?.toString()).toBe('Untitled');
		await userEvent.keyboard('{Backspace}{Enter}');
		await expect(input.textContent).toBe('');
		await expect(input).toHaveAttribute('data-empty', 'true');
		await expect(args.onCommit).toHaveBeenCalledTimes(1);
		await expect(args.onCommit).toHaveBeenCalledWith('', 'Untitled');
	},
};
function ExternalEditor(args: ContentEditableProps) {
	const [value, setValue] = useState('Initial');
	const [editing, setEditing] = useState(true);
	return (
		<>
			<ContentEditable {...args} value={value} isEditable={editing} />
			<button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => setValue('External')}>
				Update value
			</button>
			<button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => setEditing(false)}>
				End editing
			</button>
		</>
	);
}
export const DeferredExternalValue: Story = {
	tags: ['tests'],
	render: (args) => <ExternalEditor {...args} />,
	args: callbacks(),
	play: async ({ canvasElement, args }) => {
		const input = text(canvasElement);
		await replace(input, 'Local draft');
		await userEvent.click(within(canvasElement).getByText('Update value'));
		await expect(input).toHaveTextContent('Local draft');
		await expect(input).toHaveFocus();
		await userEvent.click(within(canvasElement).getByText('End editing'));
		await expect(input).toHaveTextContent('External');
		await expect(args.onCommit).toHaveBeenCalledTimes(1);
		await expect(args.onCommit).toHaveBeenCalledWith('Local draft', 'Initial');
		await expect(args.onEditEnd).toHaveBeenCalledTimes(1);
		await expect(args.onEditEnd).toHaveBeenCalledWith('external');
	},
};
export const Composition: Story = {
	tags: ['tests'],
	args: { isEditable: true, ...callbacks(), onKeyDown: fn() },
	play: async ({ canvasElement, args }) => {
		const input = text(canvasElement);
		await fireEvent.compositionStart(input);
		await replace(input, '日本語');
		await fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
		await expect(args.onEditEnd).not.toHaveBeenCalled();
		await fireEvent.compositionEnd(input);
		await userEvent.keyboard('{Enter}');
		await expect(args.onCommit).toHaveBeenCalledTimes(1);
		await expect(args.onCommit).toHaveBeenCalledWith('日本語', '');
		await expect(args.onKeyDown).toHaveBeenCalledTimes(2);
	},
};
export const PlainTextPaste: Story = {
	tags: ['tests'],
	args: { isEditable: true, ...callbacks() },
	play: async ({ canvasElement, args }) => {
		const input = text(canvasElement);
		paste(input, '<title>\nwith\ttabs', '<b>Rich</b>');
		await expect(input.textContent).toBe('<title> with tabs');
		await expect(input.querySelector('title, b')).toBeNull();
		await userEvent.keyboard('{Enter}');
		await expect(args.onCommit).toHaveBeenCalledTimes(1);
		await expect(args.onCommit).toHaveBeenCalledWith('<title> with tabs', '');
	},
};
export const NativeEvents: Story = {
	tags: ['tests'],
	args: {
		isEditable: true,
		onClick: fn(),
		onDoubleClick: fn(),
		onBlur: fn(),
		...callbacks(),
		onKeyDown: (event) => {
			if (event.key === 'Enter') event.preventDefault();
		},
	},
	play: async ({ canvasElement, args }) => {
		const input = text(canvasElement);
		await userEvent.dblClick(input);
		await expect(args.onClick).toHaveBeenCalledTimes(2);
		await expect(args.onDoubleClick).toHaveBeenCalledTimes(1);
		await userEvent.keyboard('{Enter}');
		await expect(args.onEditEnd).not.toHaveBeenCalled();
		await expect(input).toHaveFocus();
		await userEvent.tab();
		await expect(args.onBlur).toHaveBeenCalledTimes(1);
	},
};
export const LayoutAndNaming: Story = {
	tags: ['tests'],
	args: {
		isEditable: true,
		name: ' ',
		width: 240,
		padding: '2px 8px',
		borderRadius: 0,
		textSize: 'm',
		textColor: 'core-text-primary',
		clamp: 2,
		defaultValue: 'A long title that wraps without overflowing its own width.',
		className: 'custom-title',
	},
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox', { name: 'Editable text' });
		const style = getComputedStyle(input);
		await expect(style.width).toBe('240px');
		await expect(style.paddingLeft).toBe('8px');
		await expect(style.borderRadius).toBe('0px');
		await expect(style.whiteSpace).toBe('pre-wrap');
		await expect(input).toHaveClass('custom-title');
		await expect(input.scrollWidth).toBeLessThanOrEqual(input.clientWidth);
	},
};

export const LiteralPlaceholder: Story = {
	tags: ['tests'],
	args: { defaultValue: 'Untitled', placeholder: 'Untitled', isEditable: true, ...callbacks() },
	play: async ({ canvasElement, args }) => {
		const input = text(canvasElement);
		await expect(input).not.toHaveAttribute('data-empty');
		await userEvent.keyboard('{Enter}');
		await expect(input.textContent).toBe('Untitled');
		await expect(args.onCommit).not.toHaveBeenCalled();
	},
};
export const PasteRangeFallback: Story = {
	tags: ['tests'],
	args: { defaultValue: 'Title', isEditable: true, ...callbacks() },
	render: (args) => (
		<>
			<p data-testid="outside">Keep this safe</p>
			<ContentEditable {...args} />
		</>
	),
	play: async ({ canvasElement }) => {
		const input = text(canvasElement);
		const document = input.ownerDocument;
		const outside = within(canvasElement).getByTestId('outside');
		const range = document.createRange();
		range.selectNodeContents(outside);
		const selection = document.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
		const nativeInsert = document.execCommand;
		document.execCommand = () => {
			throw new Error('Native insertion unavailable');
		};
		try {
			paste(input, ' plain');
			await expect(input.textContent).toBe('Title plain');
			await expect(outside.textContent).toBe('Keep this safe');
		} finally {
			document.execCommand = nativeInsert;
		}
	},
};
export const PasteUndo: Story = {
	tags: ['tests'],
	args: { isEditable: true, defaultValue: 'Before', selectOnEdit: true },
	play: async ({ canvasElement }) => {
		const input = text(canvasElement);
		paste(input, 'After');
		await expect(input.textContent).toBe('After');
		input.ownerDocument.execCommand('undo');
		await expect(input.textContent).toBe('Before');
	},
};
export const CancelDeferredValue: Story = {
	tags: ['tests'],
	render: (args) => <ExternalEditor {...args} />,
	args: callbacks(),
	play: async ({ canvasElement, args }) => {
		const input = text(canvasElement);
		await userEvent.click(within(canvasElement).getByText('Update value'));
		await replace(input, 'Discard');
		await userEvent.keyboard('{Escape}');
		await expect(input.textContent).toBe('External');
		await expect(args.onCommit).not.toHaveBeenCalled();
		await expect(args.onEditEnd).toHaveBeenCalledWith('escape');
	},
};
export const EmptyHintAndStaticLayout: Story = {
	tags: ['tests'],
	args: { placeholder: '', padding: 0, borderRadius: '8px', width: '100%', clamp: 0 },
	play: async ({ canvasElement }) => {
		const input = canvasElement.querySelector('[data-placeholder]') as HTMLElement;
		await expect(input.textContent).toBe('');
		await expect(input).toHaveAttribute('data-empty', 'true');
		await expect(input).not.toHaveAttribute('role');
		await expect(input.getBoundingClientRect().height).toBeGreaterThan(0);
		await expect(getComputedStyle(input).whiteSpace).toBe('pre-wrap');
		await expect(getComputedStyle(input).userSelect).toBe('text');
	},
};
export const ActivateEmptyAndPaste: Story = {
	tags: ['tests'],
	render: Default.render,
	args: { value: '', placeholder: 'Add a title', ...callbacks() },
	play: async ({ canvasElement, args }) => {
		const title = canvasElement.querySelector('[data-placeholder]') as HTMLElement;
		await userEvent.dblClick(title);
		await expect(text(canvasElement)).toHaveFocus();
		await expect(getComputedStyle(title).overflow).toBe('visible');
		await expect(title.ownerDocument.getSelection()?.isCollapsed).toBe(true);
		paste(title, 'A new\ntitle');
		await expect(title.textContent).toBe('A new title');
		await userEvent.keyboard('{Enter}');
		await expect(args.onCommit).toHaveBeenCalledTimes(1);
		await expect(args.onCommit).toHaveBeenCalledWith('A new title', '');
	},
};

export const InlineContentSizing: Story = {
	tags: ['tests'],
	render: (args) => (
		<p data-testid="line" style={{ width: 400, fontSize: 24 }}>
			<span>Project: </span>
			<Editor {...args} value="Plan" data-testid="inline-title" />
			<span data-testid="following"> · Draft</span>
		</p>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const title = canvas.getByTestId('inline-title');
		const line = canvas.getByTestId('line');
		const following = canvas.getByTestId('following');
		const initialWidth = title.getBoundingClientRect().width;
		await expect(title.tagName).toBe('SPAN');
		await expect(title.parentElement?.tagName).toBe('P');
		await expect(getComputedStyle(title).display).toBe('inline-flex');
		await expect(initialWidth).toBeLessThan(line.clientWidth / 2);
		await expect(following.getBoundingClientRect().left).toBeGreaterThanOrEqual(
			title.getBoundingClientRect().right - 1,
		);
		await expect(following.getBoundingClientRect().top).toBeLessThan(title.getBoundingClientRect().bottom);
		await userEvent.dblClick(title);
		await userEvent.keyboard('{End} for next quarter');
		await expect(title.getBoundingClientRect().width).toBeGreaterThan(initialWidth);
		await expect(title.getBoundingClientRect().width).toBeLessThanOrEqual(line.clientWidth);
		await userEvent.keyboard('{Enter}');
		await expect(title.textContent).toBe('Plan for next quarter');
	},
};
export const ContentSizingInFlexColumn: Story = {
	tags: ['tests'],
	render: (args) => (
		<div data-testid="column" style={{ display: 'flex', flexDirection: 'column', width: 360 }}>
			<Editor {...args} value="Short title" data-testid="short-title" />
			<Editor
				{...args}
				value="A much longer project title that wraps to the available space without a fixed editor width"
				clamp={2}
				data-testid="long-title"
			/>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const short = canvas.getByTestId('short-title');
		const long = canvas.getByTestId('long-title');
		const column = canvas.getByTestId('column');
		await expect(short.getBoundingClientRect().width).toBeLessThan(column.clientWidth);
		await expect(long.getBoundingClientRect().width).toBeLessThanOrEqual(column.clientWidth);
		await expect(long.getBoundingClientRect().height).toBeGreaterThan(short.getBoundingClientRect().height);
		await userEvent.dblClick(long);
		await expect(long).toHaveFocus();
		await expect(long.scrollWidth).toBeLessThanOrEqual(long.clientWidth);
		await userEvent.keyboard('{Escape}');
	},
};

export const ClickPreservesCaret: Story = {
	tags: ['tests'],
	render: (args) => <Editor {...args} activation="click" value="Quarterly planning" data-testid="click-title" />,
	play: async ({ canvasElement }) => {
		const title = within(canvasElement).getByTestId('click-title');
		const range = title.ownerDocument.createRange();
		range.setStart(title.firstChild as Text, 10);
		range.collapse(true);
		const selection = title.ownerDocument.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
		await fireEvent.click(title);
		await expect(title).toHaveFocus();
		await expect(selection?.anchorOffset).toBe(10);
		await userEvent.keyboard('new ');
		await expect(title.textContent).toBe('Quarterly new planning');
		await userEvent.keyboard('{Enter}');
	},
};

export const KeyboardEnterActivation: Story = {
	tags: ['tests'],
	render: Default.render,
	args: callbacks(),
	play: async ({ canvasElement, args }) => {
		const title = within(canvasElement).getByText('Quarterly planning');
		await expect(title).toHaveAttribute('tabindex', '0');
		await userEvent.tab();
		await expect(title).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		await expect(text(canvasElement)).toHaveFocus();
		await expect(args.onEditEnd).not.toHaveBeenCalled();
		await userEvent.keyboard('{Escape}');
	},
};
export const PreventKeyboardActivation: Story = {
	tags: ['tests'],
	args: { defaultValue: 'Title', tabIndex: 0, onEditStart: fn(), onKeyDown: (event) => event.preventDefault() },
	play: async ({ canvasElement, args }) => {
		within(canvasElement).getByText('Title').focus();
		await userEvent.keyboard('{Enter}{F2}');
		await expect(args.onEditStart).not.toHaveBeenCalled();
	},
};
export const CompositionDoesNotActivate: Story = {
	tags: ['tests'],
	args: { defaultValue: 'Title', tabIndex: 0, onEditStart: fn() },
	play: async ({ canvasElement, args }) => {
		const title = within(canvasElement).getByText('Title');
		await fireEvent.compositionStart(title);
		await fireEvent.keyDown(title, { key: 'Enter' });
		await fireEvent.keyDown(title, { key: 'F2', isComposing: true });
		await fireEvent.compositionEnd(title);
		await expect(args.onEditStart).not.toHaveBeenCalled();
	},
};

export const ExplicitTabIndex: Story = {
	tags: ['tests'],
	args: { defaultValue: 'Title', tabIndex: -1, onEditStart: fn() },
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByText('Title')).toHaveAttribute('tabindex', '-1');
	},
};

const wrappingTitle =
	'A long project title with enough words to flow across many lines in a narrow container without losing any of its text.';
export const WrapsWithoutClamp: Story = {
	tags: ['tests'],
	render: (args) => (
		<div style={{ width: 160, fontSize: 16, lineHeight: '20px' }}>
			<ContentEditable {...args} defaultValue={wrappingTitle} data-testid="title" />
		</div>
	),
	play: async ({ canvasElement }) => {
		const title = within(canvasElement).getByTestId('title');
		await expect(title.getBoundingClientRect().height).toBeGreaterThan(60);
		await expect(title.scrollWidth).toBeLessThanOrEqual(160);
	},
};
export const ClampOneLine: Story = {
	tags: ['tests'],
	render: WrapsWithoutClamp.render,
	args: { clamp: 1 },
	play: async ({ canvasElement }) => {
		const title = within(canvasElement).getByTestId('title');
		await expect(title.getBoundingClientRect().height).toBeLessThanOrEqual(21);
		await expect(title.scrollHeight).toBeGreaterThan(title.clientHeight);
	},
};
export const ClampTwoLinesAndEdit: Story = {
	tags: ['tests'],
	render: (args) => (
		<div style={{ width: 160, fontSize: 16, lineHeight: '20px' }}>
			<Editor {...args} value={wrappingTitle} data-testid="title" />
		</div>
	),
	args: { clamp: 2 },
	play: async ({ canvasElement }) => {
		const title = within(canvasElement).getByTestId('title');
		await expect(title.getBoundingClientRect().height).toBeLessThanOrEqual(41);
		await userEvent.dblClick(title);
		await expect(title.getBoundingClientRect().height).toBeGreaterThan(60);
		await userEvent.keyboard('{Escape}');
		await expect(title.getBoundingClientRect().height).toBeLessThanOrEqual(41);
	},
};
export const CustomNoWrap: Story = {
	tags: ['tests'],
	render: WrapsWithoutClamp.render,
	args: { style: { whiteSpace: 'nowrap' } },
	play: async ({ canvasElement }) => {
		const title = within(canvasElement).getByTestId('title');
		await expect(getComputedStyle(title).whiteSpace).toBe('nowrap');
		await expect(title.getBoundingClientRect().height).toBeLessThanOrEqual(21);
	},
};
