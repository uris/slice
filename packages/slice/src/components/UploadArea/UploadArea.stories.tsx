import type { Meta, StoryObj } from '@storybook/react-vite';
import { createRef, useState } from 'react';
import { expect, fireEvent, fn, spyOn, userEvent, within } from 'storybook/test';
import { Button } from '../Button';
import type { FileItem } from '../FileList';
import { UploadArea } from './UploadArea';
import type { UploadAreaProps } from './_types';

const meta = {
	title: 'Components/UploadArea',
	component: UploadArea,
	args: { onUpload: fn(), onFilesChange: fn(), onReject: fn() },
} satisfies Meta<typeof UploadArea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Busy: Story = { args: { busy: true, files: [{ file: 'report.pdf', uploading: true, progress: 45 }] } };
function ControlledArea(props: UploadAreaProps) {
	const [files, setFiles] = useState<FileItem[]>(props.files ?? []);
	return <UploadArea {...props} files={files} onFilesChange={setFiles} />;
}
export const Controlled: Story = { render: (args) => <ControlledArea {...args} /> };
function fileInput(container: HTMLElement) {
	const input = container.querySelector<HTMLInputElement>('input[type=file]');
	if (!input) throw new Error('Missing file input');
	return input;
}
async function drag(target: HTMLElement, type: string, files: File[]) {
	const dataTransfer = new DataTransfer();
	for (const file of files) dataTransfer.items.add(file);
	// A native event preserves DataTransfer getters that Testing Library's factory would clone away.
	await fireEvent(target, new DragEvent(type, { dataTransfer, bubbles: true, cancelable: true }));
}
async function drop(target: HTMLElement, files: File[]) {
	await drag(target, 'drop', files);
}

export const SharedSelectionValidation: Story = {
	tags: ['tests'],
	args: { acceptedTypes: ['pdf'], multiple: false },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = fileInput(canvasElement);
		await expect(input).toHaveAttribute('accept', '.pdf');
		const pdf = new File([''], 'REPORT.PDF', { type: 'image/png' });
		const excess = new File([''], 'extra.pdf');
		const rejected = new File([''], 'notes.txt');
		await drop(canvas.getByRole('button', { name: 'Upload Files' }), [rejected, pdf, excess]);

		await expect(args.onUpload).toHaveBeenLastCalledWith([pdf]);
		await expect(args.onFilesChange).toHaveBeenLastCalledWith([expect.objectContaining({ file: pdf })]);
		await expect(args.onReject).toHaveBeenLastCalledWith([
			{ file: rejected, reason: 'type' },
			{ file: excess, reason: 'multiple' },
		]);
		await expect(canvas.getByRole('alert')).toHaveTextContent('extra.pdf');
		await fireEvent.change(input, { target: { files: [rejected] } });
		await expect(args.onReject).toHaveBeenLastCalledWith([{ file: rejected, reason: 'type' }]);
		await expect(args.onUpload).toHaveBeenCalledTimes(1);
		await fireEvent.change(input, { target: { files: [pdf] } });
		await expect(args.onUpload).toHaveBeenCalledTimes(2);
		await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
	},
};
export const ControlledAppendAndRemoval: Story = {
	tags: ['tests'],
	args: { files: [{ id: 'existing', file: 'existing.pdf' }] },
	render: (args) => <ControlledArea {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Upload Files' });
		const existing = canvas.getByRole('listitem');
		await expect(trigger).toBeEnabled();
		await expect(canvas.getByRole('button', { name: 'Remove file existing.pdf' })).toBeEnabled();
		await drop(trigger, [new File([''], 'new.pdf')]);
		await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
		await expect(canvas.getAllByRole('listitem')[0]).toBe(existing);
		await userEvent.click(canvas.getByRole('button', { name: 'Remove file existing.pdf' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Remove file new.pdf' }));
		await expect(canvas.queryByRole('listitem')).not.toBeInTheDocument();
		await expect(trigger).toHaveFocus();
	},
};
export const SingleReplacement: Story = {
	tags: ['tests'],
	args: { multiple: false, files: [{ id: 'old', file: 'old.pdf' }] },
	render: (args) => <ControlledArea {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await drop(canvas.getByRole('button', { name: 'Upload Files' }), [new File([''], 'new.pdf')]);
		await expect(canvas.getAllByRole('listitem')).toHaveLength(1);
		await expect(canvas.queryByText('old.pdf')).not.toBeInTheDocument();
		await expect(canvas.getByText('new.pdf')).toBeVisible();
	},
};
export const NativeKeyboardTrigger: Story = {
	tags: ['tests'],
	args: { actionName: 'Choose documents' },
	play: async ({ canvasElement, args }) => {
		const trigger = within(canvasElement).getByRole('button', { name: 'Choose documents' });
		const click = spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
		try {
			await userEvent.tab();
			await expect(trigger).toHaveFocus();
			await userEvent.keyboard('{Enter}');
			await userEvent.keyboard(' ');
			await userEvent.click(trigger);
			await expect(click).toHaveBeenCalledTimes(3);
			await expect(trigger.tagName).toBe('BUTTON');
			await expect(args.onUpload).not.toHaveBeenCalled();
		} finally {
			click.mockRestore();
		}
	},
};
export const BusyGuards: Story = {
	tags: ['tests'],
	args: { busy: true, files: [{ file: 'existing.pdf' }] },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Upload Files' });
		await expect(trigger).toBeDisabled();
		await expect(trigger).toHaveAttribute('aria-busy', 'true');
		await expect(canvas.getByRole('status')).toHaveTextContent('Uploading in progress');
		await expect(canvas.queryByRole('button', { name: /Remove file/ })).not.toBeInTheDocument();
		await drop(trigger, [new File([''], 'ignored.pdf')]);
		await fireEvent.change(fileInput(canvasElement), {
			target: { files: [new File([''], 'ignored.pdf')] },
		});
		await expect(args.onUpload).not.toHaveBeenCalled();
		await expect(args.onFilesChange).not.toHaveBeenCalled();
	},
};
export const DisabledGuards: Story = {
	...BusyGuards,
	args: { disabled: true },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Upload Files' });
		await expect(trigger).toBeDisabled();
		await expect(canvas.getByRole('status')).toBeEmptyDOMElement();
		await drop(trigger, [new File([''], 'ignored.pdf')]);
		await expect(args.onUpload).not.toHaveBeenCalled();
	},
};
const rootRef = createRef<HTMLDivElement>();
export const NativeAttributesAndCancellation: Story = {
	tags: ['tests'],
	args: {
		ref: rootRef,
		id: 'upload-root',
		className: 'custom-upload',
		padding: 0,
		style: { maxWidth: 420 },
		onDrop: fn((event) => event.preventDefault()),
		onClickCapture: fn((event) => event.preventDefault()),
		onKeyDown: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const trigger = within(canvasElement).getByRole('button', { name: 'Upload Files' });
		await expect(rootRef.current).toHaveAttribute('id', 'upload-root');
		await expect(rootRef.current).toHaveClass('custom-upload');
		await expect(rootRef.current).toHaveStyle({ padding: '0px', maxWidth: '420px' });
		await drop(trigger, [new File([''], 'cancelled.pdf')]);
		await expect(args.onDrop).toHaveBeenCalled();
		await expect(args.onUpload).not.toHaveBeenCalled();
		const click = spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
		try {
			await userEvent.click(trigger);
			await expect(click).not.toHaveBeenCalled();
		} finally {
			click.mockRestore();
		}
		await fireEvent.keyDown(trigger, { key: 'a' });
		await expect(args.onKeyDown).toHaveBeenCalled();
	},
};
export const EmptyDrop: Story = {
	tags: ['tests'],
	args: { acceptedTypes: [] },
	play: async ({ canvasElement, args }) => {
		const trigger = within(canvasElement).getByRole('button', { name: 'Upload Files' });
		await fireEvent.dragEnter(trigger);
		await fireEvent.drop(trigger);
		await expect(canvasElement.querySelector('input')).not.toHaveAttribute('accept');
		await expect(args.onUpload).not.toHaveBeenCalled();
		await expect(args.onReject).not.toHaveBeenCalled();
	},
};
function AvailabilityFixture() {
	const [busy, setBusy] = useState(false);
	return (
		<>
			<Button label="Toggle busy" onClick={() => setBusy(!busy)} />
			<UploadArea busy={busy} data-testid="area" />
		</>
	);
}
export const DragLifecycle: Story = {
	tags: ['tests'],
	render: () => <AvailabilityFixture />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const area = canvas.getByTestId('area');
		const draggedFiles = [new File([''], 'a.pdf')];
		const background = () => area.style.getPropertyValue('--ua-bg-color');
		const idle = background();
		await drag(area, 'dragenter', draggedFiles);
		await drag(area, 'dragenter', draggedFiles);
		await drag(area, 'dragleave', draggedFiles);
		await expect(background()).not.toBe(idle);
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle busy' }));
		await expect(background()).toBe(idle);
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle busy' }));
		await drag(area, 'dragenter', draggedFiles);
		await fireEvent.keyDown(window, { key: 'Escape' });
		await expect(background()).toBe(idle);
		await drag(area, 'dragenter', draggedFiles);
		await fireEvent.dragEnd(window);
		await expect(background()).toBe(idle);
		await drag(area, 'dragenter', draggedFiles);
		await fireEvent.blur(window);
		await expect(background()).toBe(idle);
	},
};
export const TooltipForwarding: Story = {
	tags: ['tests'],
	args: { files: [{ file: 'report.pdf' }], onToolTip: fn() },
	play: async ({ canvasElement, args }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Remove file report.pdf' });
		await fireEvent.focusIn(button);
		await expect(args.onToolTip).toHaveBeenCalledWith(
			expect.objectContaining({ payload: { label: 'Remove file report.pdf' } }),
		);
		await fireEvent.focusOut(button);
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null);
	},
};

export const SingleFile: Story = {
	args: { multiple: false, acceptedTypes: ['pdf'] },
	render: (args) => <ControlledArea {...args} />,
};

export const AttachmentCards: Story = {
	args: {
		fileListProps: {
			variant: 'attachments',
			attachmentSize: 's',
			style: { justifyContent: 'center' },
		},
		files: [
			{ id: 'brief', file: 'Project-brief.txt' },
			{ id: 'report', file: 'Quarterly-report.pdf' },
		],
	},
	render: (args) => <ControlledArea {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
		await expect(canvas.getByRole('list')).toHaveStyle({ flexDirection: 'row', justifyContent: 'center' });
		const remove = canvas.getByRole('button', { name: 'Remove file Project-brief.txt' });
		await expect(remove).toBeEnabled();
		await userEvent.tab();
		await userEvent.tab();
		await expect(remove).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		await expect(canvas.getAllByRole('listitem')).toHaveLength(1);
		await expect(canvas.getByRole('button', { name: 'Upload Files' })).toBeEnabled();
	},
};
