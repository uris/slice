import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';
import { Button } from '../Button';
import type { FileItem } from '../FileList';
import { TextField } from '../Textfield';
import { PromptInput } from './PromptInput';
import type { PromptActions, PromptProps } from './_types';

const meta = {
	title: 'Components/PromptInput',
	component: PromptInput,
	args: {
		fileListProps: { variant: 'attachments', attachmentSize: 's' },
		onSubmit: fn(),
		onStop: fn(),
		onChange: fn(),
		onAttachmentsChange: fn(),
	},
} satisfies Meta<typeof PromptInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Working: Story = { args: { working: true, stopEnabled: true } };
function ControlledPrompt(props: PromptProps) {
	const [value, setValue] = useState(props.value ?? '');
	const [files, setFiles] = useState<FileItem[]>(props.attachments ?? []);
	return (
		<PromptInput {...props} value={value} onChange={setValue} attachments={files} onAttachmentsChange={setFiles} />
	);
}
function ComposedActionsPreview(props: PromptProps) {
	const [error, setError] = useState('');
	return (
		<>
			<ControlledPrompt
				{...props}
				pasteAttachmentThreshold={1000}
				fileListProps={{ variant: 'attachments', attachmentSize: 's' }}
			>
				{({ pasteText, disabled }) => (
					<Button
						label="Paste"
						variant="text"
						disabled={disabled}
						onClick={async () => {
							try {
								pasteText(await navigator.clipboard.readText());
								setError('');
							} catch {
								setError('Clipboard unavailable. Paste into the message instead.');
							}
						}}
					/>
				)}
			</ControlledPrompt>
			{error && <p role="status">{error}</p>}
		</>
	);
}
export const ComposedActions: Story = { render: (args) => <ComposedActionsPreview {...args} /> };
export const NativeSubmitAndFocus: Story = {
	tags: ['tests'],
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox', { name: 'Message' });
		await userEvent.type(input, 'Hello');
		await userEvent.tab();
		await userEvent.tab();
		await expect(canvas.getByRole('button', { name: 'Send message' })).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		await expect(args.onSubmit).toHaveBeenCalledWith('Hello', []);
		await expect(input).toHaveValue('');
		await expect(input).toHaveFocus();
	},
};
export const ModifierAndComposition: Story = {
	tags: ['tests'],
	play: async ({ canvasElement, args }) => {
		const input = within(canvasElement).getByRole('textbox');
		await userEvent.type(input, 'Hello');
		await userEvent.keyboard('{Shift>}{Enter}{/Shift}');
		await expect(input).toHaveValue('Hello\n');
		await fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
		await fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
		await fireEvent.keyDown(input, { key: 'Enter', repeat: true });
		await expect(args.onSubmit).not.toHaveBeenCalled();
	},
};
export const NativePasteAttachment: Story = {
	tags: ['tests'],
	args: { pasteAttachmentThreshold: 5, fileListProps: { variant: 'attachments' } },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.type(input, 'draft');
		const clipboardData = new DataTransfer();
		clipboardData.setData('text/plain', 'long clipboard content');
		await fireEvent(input, new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true }));
		await expect(input).toHaveValue('draft');
		await expect(canvas.getByRole('listitem')).toHaveTextContent('Pasted-text');
		await expect(args.onAttachmentsChange).toHaveBeenCalledWith([
			expect.objectContaining({ file: expect.objectContaining({ name: 'Pasted-text.txt', type: 'text/plain' }) }),
		]);
	},
};
export const ClipboardActions: Story = {
	tags: ['tests'],
	args: { defaultValue: 'hello world', pasteAttachmentThreshold: 12 },
	render: (args) => (
		<PromptInput {...args}>
			{({ pasteText }) => <Button label="Insert" onClick={() => pasteText('Slice')} />}
		</PromptInput>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox') as HTMLTextAreaElement;
		input.focus();
		input.setSelectionRange(6, 11);
		await userEvent.click(canvas.getByRole('button', { name: 'Insert' }));
		await expect(input).toHaveValue('hello Slice');
		await expect(input.selectionStart).toBe(11);
	},
};
export const AttachmentOnlySubmit: Story = {
	tags: ['tests'],
	args: { defaultAttachments: [{ id: 'file', file: 'ready.pdf' }] },
	play: async ({ canvasElement, args }) => {
		const input = within(canvasElement).getByRole('textbox');
		await userEvent.click(input);
		await userEvent.keyboard('{Enter}');
		await expect(args.onSubmit).toHaveBeenCalledWith('', [{ id: 'file', file: 'ready.pdf' }]);
	},
};
export const PendingAndErrorGuards: Story = {
	tags: ['tests'],
	args: { defaultValue: 'draft', attachments: [{ file: 'pending.pdf', uploading: true }] },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button', { name: 'Send message' })).toBeDisabled();
		await userEvent.click(canvas.getByRole('textbox'));
		await userEvent.keyboard('{Enter}');
		await expect(args.onSubmit).not.toHaveBeenCalled();
	},
};
export const StopAction: Story = {
	tags: ['tests'],
	args: { working: true, stopEnabled: true },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.tab();
		await userEvent.tab();
		await userEvent.tab();
		await userEvent.keyboard(' ');
		await expect(args.onStop).toHaveBeenCalledTimes(1);
		await expect(canvas.getByRole('textbox')).toHaveFocus();
	},
};
export const ToolbarControlFocus: Story = {
	tags: ['tests'],
	render: (args) => (
		<PromptInput {...args}>
			<TextField inputName="Custom action field" placeholder="Toolbar input" />
		</PromptInput>
	),
	play: async ({ canvasElement }) => {
		const field = within(canvasElement).getByRole('textbox', { name: 'Custom action field' });
		await userEvent.click(field);
		await userEvent.type(field, 'custom');
		await expect(field).toHaveFocus();
		await expect(field).toHaveValue('custom');
	},
};
export const ControlledSetters: Story = {
	tags: ['tests'],
	args: { fileListProps: { variant: 'list' } },
	render: (args) => <ControlledPrompt {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(canvas.getByRole('textbox'), 'Controlled text');
		await expect(canvas.getByRole('textbox')).toHaveValue('Controlled text');
		const input = canvasElement.querySelector('input[type=file]');
		if (!input) throw Error('Missing picker');
		await fireEvent.change(input, { target: { files: [new File([''], 'report.pdf')] } });
		await expect(canvas.getByRole('listitem')).toHaveTextContent('report.pdf');
		await userEvent.click(canvas.getByRole('button', { name: 'Remove file report.pdf' }));
		await expect(canvas.queryByRole('listitem')).not.toBeInTheDocument();
	},
};
export const DisabledAttachmentPaste: Story = {
	tags: ['tests'],
	args: { attachmentsDisabled: true, pasteAttachmentThreshold: 5 },
	render: (args) => (
		<PromptInput {...args}>
			{({ pasteText }) => <Button label="Paste draft" onClick={() => pasteText('long clipboard text')} />}
		</PromptInput>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Paste draft' }));
		await expect(canvas.getByRole('textbox')).toHaveValue('long clipboard text');
		await expect(canvas.queryByRole('listitem')).not.toBeInTheDocument();
	},
};
export const UniqueIds: Story = {
	tags: ['tests'],
	render: () => (
		<>
			<PromptInput inputName="First" />
			<PromptInput inputName="Second" />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('textbox', { name: 'First' }).id).not.toBe(
			canvas.getByRole('textbox', { name: 'Second' }).id,
		);
	},
};

function CapturedActions(props: PromptProps) {
	const captured = useRef<PromptActions | undefined>(undefined);
	return (
		<PromptInput {...props}>
			{(actions) => {
				captured.current ??= actions;
				return <Button label="Use captured paste" onClick={() => captured.current?.pasteText(' value')} />;
			}}
		</PromptInput>
	);
}
export const LatestAsyncActions: Story = {
	tags: ['tests'],
	render: (args) => <CapturedActions {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.type(input, 'latest');
		await userEvent.click(canvas.getByRole('button', { name: 'Use captured paste' }));
		await expect(input).toHaveValue('latest value');
	},
};

export const ReadOnlyActions: Story = {
	tags: ['tests'],
	args: { readOnly: true, defaultValue: 'Read only' },
	render: (args) => (
		<PromptInput {...args}>
			{({ pasteText, disabled }) => (
				<Button label="Paste read-only" disabled={disabled} onClick={() => pasteText('ignored')} />
			)}
		</PromptInput>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('textbox')).toHaveAttribute('readonly');
		await expect(canvas.getByRole('button', { name: 'Paste read-only' })).toBeDisabled();
		await expect(canvas.getByRole('button', { name: 'Attach files' })).toBeDisabled();
		await expect(canvas.getByRole('button', { name: 'Send message' })).toBeDisabled();
	},
};
export const CancelledEditorEvents: Story = {
	tags: ['tests'],
	args: {
		defaultValue: 'draft',
		pasteAttachmentThreshold: 5,
		onKeyDown: fn((event) => event.preventDefault()),
		onPaste: fn((event) => event.preventDefault()),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.click(input);
		await userEvent.keyboard('{Enter}');
		await expect(args.onSubmit).not.toHaveBeenCalled();
		const clipboardData = new DataTransfer();
		clipboardData.setData('text/plain', 'long clipboard text');
		await fireEvent(input, new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true }));
		await expect(args.onPaste).toHaveBeenCalled();
		await expect(canvas.queryByRole('listitem')).not.toBeInTheDocument();
	},
};
export const RejectedTextAttachment: Story = {
	tags: ['tests'],
	args: { acceptedTypes: ['pdf'], pasteAttachmentThreshold: 5, onReject: fn() },
	render: (args) => (
		<PromptInput {...args}>
			{({ pasteText }) => <Button label="Paste oversized" onClick={() => pasteText('oversized clipboard content')} />}
		</PromptInput>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Paste oversized' }));
		await expect(canvas.getByRole('alert')).toHaveTextContent('Pasted-text.txt: file type is not accepted.');
		await expect(args.onReject).toHaveBeenCalled();
		await expect(canvas.queryByRole('listitem')).not.toBeInTheDocument();
	},
};
export const NestedLengthLimit: Story = {
	tags: ['tests'],
	args: { defaultValue: 'start', textAreaProps: { maxLength: 7 } },
	render: (args) => (
		<PromptInput {...args}>
			{({ pasteText }) => <Button label="Insert at limit" onClick={() => pasteText('abcdef')} />}
		</PromptInput>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox') as HTMLTextAreaElement;
		input.focus();
		input.setSelectionRange(5, 5);
		await userEvent.click(canvas.getByRole('button', { name: 'Insert at limit' }));
		await expect(input).toHaveValue('startab');
	},
};
export const ErrorAttachmentGuard: Story = {
	tags: ['tests'],
	args: { defaultValue: 'draft', defaultAttachments: [{ file: 'failed.pdf', error: 'Upload failed' }] },
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('button', { name: 'Send message' })).toBeDisabled();
	},
};
export const ControlledValue: Story = {
	tags: ['tests'],
	args: { value: 'Controlled' },
	play: async ({ canvasElement, args }) => {
		const input = within(canvasElement).getByRole('textbox');
		await userEvent.type(input, 'x');
		await expect(args.onChange).toHaveBeenCalledWith('Controlledx', []);
		await expect(input).toHaveValue('Controlled');
	},
};

function UnmountedActions(props: PromptProps) {
	const [show, setShow] = useState(true);
	const captured = useRef<PromptActions | undefined>(undefined);
	return (
		<>
			<Button label="Close composer" onClick={() => setShow(false)} />
			<Button label="Finish delayed paste" onClick={() => captured.current?.pasteText('late content')} />
			{show && (
				<PromptInput {...props}>
					{(actions) => {
						captured.current = actions;
						return null;
					}}
				</PromptInput>
			)}
		</>
	);
}
export const IgnoreUnmountedPaste: Story = {
	tags: ['tests'],
	render: (args) => <UnmountedActions {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Close composer' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Finish delayed paste' }));
		await expect(args.onChange).not.toHaveBeenCalled();
		await expect(args.onAttachmentsChange).not.toHaveBeenCalled();
	},
};

export const SurfaceFocus: Story = {
	tags: ['tests'],
	render: (args) => (
		<PromptInput {...args} data-testid="composer">
			<Button label="Models" />
		</PromptInput>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox', { name: 'Message' });
		await fireEvent.click(canvas.getByTestId('composer'));
		await expect(input).toHaveFocus();
		const button = canvas.getByRole('button', { name: 'Models' });
		await userEvent.click(button);
		await expect(button).toHaveFocus();
	},
};
export const CancelSurfaceFocus: Story = {
	tags: ['tests'],
	render: (args) => <PromptInput {...args} data-testid="composer" onClick={(event) => event.preventDefault()} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await fireEvent.click(canvas.getByTestId('composer'));
		await expect(canvas.getByRole('textbox', { name: 'Message' })).not.toHaveFocus();
	},
};

async function dragFiles(target: HTMLElement, type: string, files: File[]) {
	const dataTransfer = new DataTransfer();
	for (const file of files) dataTransfer.items.add(file);
	const event = new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer });
	await fireEvent(target, event);
	return event;
}
export const FileDrop: Story = {
	tags: ['tests'],
	args: { fileListProps: { variant: 'list' }, defaultAttachments: [{ id: 'existing', file: 'brief.pdf' }] },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const editor = canvas.getByRole('textbox');
		const file = new File(['image'], 'sunflower.png', { type: 'image/png' });
		const event = await dragFiles(editor, 'drop', [file]);
		await expect(event.defaultPrevented).toBe(true);
		await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
		await expect(args.onAttachmentsChange).toHaveBeenCalledWith([
			{ id: 'existing', file: 'brief.pdf' },
			expect.objectContaining({ file }),
		]);
	},
};
export const DropValidation: Story = {
	tags: ['tests'],
	args: { acceptedTypes: ['.pdf'], multiple: false, onReject: fn(), fileListProps: { variant: 'list' } },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const wrong = new File(['x'], 'notes.txt');
		const pdf = new File(['x'], 'report.pdf');
		const extra = new File(['x'], 'extra.pdf');
		await dragFiles(canvas.getByRole('textbox'), 'drop', [wrong, pdf, extra]);
		await expect(canvas.getAllByRole('listitem')).toHaveLength(1);
		await expect(canvas.getByRole('listitem')).toHaveTextContent('report.pdf');
		await expect(args.onReject).toHaveBeenCalledWith([
			{ file: wrong, reason: 'type' },
			{ file: extra, reason: 'multiple' },
		]);
	},
};
const blockedFileDrop: Story['play'] = async ({ canvasElement, args }) => {
	const editor = within(canvasElement).getByRole('textbox');
	const root = editor.closest('[data-testid="drop-composer"]');
	if (!(root instanceof HTMLElement)) throw Error('Missing composer');
	const file = new File(['x'], 'ignored.pdf');
	await dragFiles(editor, 'dragenter', [file]);
	await expect(root).not.toHaveAttribute('data-file-dragging');
	const event = await dragFiles(editor, 'drop', [file]);
	await expect(event.defaultPrevented).toBe(true);
	await expect(args.onAttachmentsChange).not.toHaveBeenCalled();
	await expect(within(canvasElement).queryByRole('listitem')).not.toBeInTheDocument();
};
const dropComposer: Story['render'] = (args) => <PromptInput {...args} data-testid="drop-composer" />;
export const DisabledFileDrop: Story = {
	tags: ['tests'],
	args: { disabled: true },
	render: dropComposer,
	play: blockedFileDrop,
};
export const ReadOnlyFileDrop: Story = {
	tags: ['tests'],
	args: { readOnly: true },
	render: dropComposer,
	play: blockedFileDrop,
};
export const AttachmentsDisabledFileDrop: Story = {
	tags: ['tests'],
	args: { attachmentsDisabled: true },
	render: dropComposer,
	play: blockedFileDrop,
};
export const ControlledAttachmentsWithoutSetterDrop: Story = {
	tags: ['tests'],
	args: { attachments: [], onAttachmentsChange: undefined },
	render: dropComposer,
	play: async ({ canvasElement }) => {
		await dragFiles(within(canvasElement).getByRole('textbox'), 'drop', [new File(['x'], 'ignored.pdf')]);
		await expect(within(canvasElement).queryByRole('listitem')).not.toBeInTheDocument();
	},
};
export const CancelFileDrop: Story = {
	tags: ['tests'],
	args: { onDrop: (event) => event.preventDefault() },
	play: async ({ canvasElement, args }) => {
		await dragFiles(within(canvasElement).getByRole('textbox'), 'drop', [new File(['x'], 'cancelled.pdf')]);
		await expect(args.onAttachmentsChange).not.toHaveBeenCalled();
	},
};
export const TextDropIsNative: Story = {
	tags: ['tests'],
	play: async ({ canvasElement, args }) => {
		const dataTransfer = new DataTransfer();
		dataTransfer.setData('text/plain', 'Dragged text');
		for (const type of ['dragenter', 'dragover', 'drop']) {
			const event = new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer });
			await fireEvent(within(canvasElement).getByRole('textbox'), event);
			await expect(event.defaultPrevented).toBe(false);
		}
		await expect(args.onAttachmentsChange).not.toHaveBeenCalled();
	},
};
export const FileDragHighlight: Story = {
	tags: ['tests'],
	render: dropComposer,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const root = canvas.getByTestId('drop-composer');
		const editor = canvas.getByRole('textbox');
		const files = [new File(['x'], 'sunflower.png')];
		await dragFiles(root, 'dragenter', files);
		await dragFiles(editor, 'dragenter', files);
		await dragFiles(editor, 'dragleave', files);
		await expect(root).toHaveAttribute('data-file-dragging', 'true');
		await dragFiles(root, 'dragleave', files);
		await expect(root).not.toHaveAttribute('data-file-dragging');
		for (const type of ['dragend', 'blur', 'drop']) {
			await dragFiles(editor, 'dragenter', files);
			await expect(root).toHaveAttribute('data-file-dragging', 'true');
			await fireEvent(window, new Event(type));
			await expect(root).not.toHaveAttribute('data-file-dragging');
		}
		await dragFiles(editor, 'dragenter', files);
		await fireEvent.keyDown(window, { key: 'Escape' });
		await expect(root).not.toHaveAttribute('data-file-dragging');
	},
};
