import type { Meta, StoryObj } from '@storybook/react-vite';
import { createRef, useState } from 'react';
import { FlexBox } from 'src/components/FlexBox';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { FileList } from './FileList';
import type { FileItem, FileListProps } from './_types';

const meta: Meta<typeof FileList> = {
	title: 'Components/FileList',
	component: FileList,
	args: {
		files: [
			{ file: 'document.doc' },
			{ file: 'presentation.ppt' },
			{ file: 'spreadsheet.xls', uploading: true, progress: 35 },
			{ file: 'image.png' },
			{ file: 'markdown.md', uploading: true, progress: 82 },
			{ file: 'pdf.pdf', error: 'Upload failed' },
			{ file: 'video.mp4' },
			{ file: 'audio.mp3' },
		],
		textSize: 's',
		maxWidth: undefined,
		minWidth: undefined,
		direction: 'row',
		padding: undefined,
		gap: 8,
		iconSize: 24,
		onChange: fn(),
		onToolTip: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof FileList> = {
	render: (args) => {
		return (
			<FlexBox
				justify={'center'}
				align={'center'}
				padding={'0px 64px'}
				style={{ overflow: 'hidden' }}
				width={'fill'}
				height={'viewport'}
			>
				<FileList {...args} />
			</FlexBox>
		);
	},
};

const attachments: FileItem[] = [
	{ id: 'a', file: 'report.pdf' },
	{ id: 'b', file: 'report.pdf' },
	{ id: 'c', file: 'notes.md' },
];
function ControlledList() {
	const [files, setFiles] = useState(attachments);
	return <FileList files={files} onChange={setFiles} />;
}
export const ControlledRemoval: StoryObj<typeof FileList> = {
	tags: ['tests'],
	render: () => <ControlledList />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const duplicates = canvas.getAllByRole('button', { name: 'Remove file report.pdf' });
		await expect(duplicates[0].tagName).toBe('BUTTON');
		await userEvent.tab();
		await userEvent.keyboard('{Enter}');
		await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
		await expect(canvas.getByRole('button', { name: 'Remove file report.pdf' })).toBe(duplicates[1]);
		await expect(duplicates[1]).toHaveFocus();
		await userEvent.keyboard(' ');
		await waitFor(() => expect(canvas.getAllByRole('listitem')).toHaveLength(1));
		await expect(canvas.getByRole('button', { name: 'Remove file notes.md' })).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		await expect(canvas.queryByRole('listitem')).not.toBeInTheDocument();
		await expect(canvas.getByRole('list', { name: 'Files' })).toHaveFocus();
	},
};
function ReorderedList() {
	const [files, setFiles] = useState(attachments);
	return (
		<>
			<Button
				label="Reorder"
				onClick={() => setFiles((current) => current.toReversed().map((item) => ({ ...item })))}
			/>
			<FileList files={files} />
		</>
	);
}
export const ImmutableReordering: StoryObj<typeof FileList> = {
	tags: ['tests'],
	render: () => <ReorderedList />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const nodes = canvas.getAllByRole('listitem');
		await userEvent.click(canvas.getByRole('button', { name: 'Reorder' }));
		const reordered = canvas.getAllByRole('listitem');
		await expect(reordered[0]).toBe(nodes[2]);
		await expect(reordered[1]).toBe(nodes[1]);
		await expect(reordered[2]).toBe(nodes[0]);
	},
};
export const UploadFeedback: StoryObj<typeof FileList> = {
	tags: ['tests'],
	args: {
		files: [
			{ file: 'report.pdf', uploading: true, progress: 1 },
			{ file: 'video.mp4', uploading: true },
			{ file: 'notes.md', error: 'Upload failed' },
		],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const numeric = canvas.getByRole('progressbar', { name: 'Uploading report.pdf' });
		await expect(numeric).toHaveAttribute('aria-valuenow', '1');
		await expect(numeric).toHaveAttribute('aria-valuemax', '100');
		await expect(canvas.getByRole('progressbar', { name: 'Uploading video.mp4' })).not.toHaveAttribute('aria-valuenow');
		await expect(canvas.queryByRole('button', { name: 'Remove file report.pdf' })).not.toBeInTheDocument();
		await expect(canvas.getByRole('alert')).toHaveTextContent('notes.md: Upload failed');
		await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
	},
};
const listRef = createRef<HTMLDivElement>();
export const LayoutAndRef: StoryObj<typeof FileList> = {
	tags: ['tests'],
	args: {
		ref: listRef,
		files: [{ file: 'a.pdf' }],
		direction: 'column',
		minWidth: 0,
		padding: 0,
		canRemove: false,
		listName: 'Attachments',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('list', { name: 'Attachments' })).toBe(listRef.current);
		await expect(canvas.getByRole('listitem')).toHaveStyle({ padding: '0px', minWidth: '0px' });
		await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
	},
};
function TooltipFixture({ onToolTip }: Pick<FileListProps, 'onToolTip'>) {
	const [show, setShow] = useState(true);
	return (
		<>
			<Button label="Hide files" onClick={() => setShow(false)} />
			{show && <FileList files={attachments} onToolTip={onToolTip} />}
		</>
	);
}
export const TooltipLifecycle: StoryObj<typeof FileList> = {
	tags: ['tests'],
	args: { onToolTip: fn() },
	render: (args) => <TooltipFixture onToolTip={args.onToolTip} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Remove file notes.md' });
		await fireEvent.mouseOver(button);
		await expect(args.onToolTip).toHaveBeenLastCalledWith(
			expect.objectContaining({ payload: { label: 'Remove file notes.md' }, ref: { current: button } }),
		);
		await fireEvent.focusIn(button);
		await fireEvent.mouseOut(button);
		await expect(args.onToolTip).not.toHaveBeenLastCalledWith(null);
		await userEvent.click(canvas.getByRole('button', { name: 'Hide files' }));
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null);
	},
};

export const EditableAttachments: StoryObj<typeof FileList> = {
	render: () => <ControlledList />,
};

export const LongFilename: StoryObj<typeof FileList> = {
	tags: ['tests'],
	render: () => (
		<div style={{ width: 180 }}>
			<FileList
				files={[{ file: 'A very long attachment filename that should be truncated rather than overflow.pdf' }]}
			/>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const row = canvas.getByRole('listitem');
		const button = canvas.getByRole('button');
		await expect(row.getBoundingClientRect().width).toBeLessThanOrEqual(180);
		await expect(button.getBoundingClientRect().right).toBeLessThanOrEqual(row.getBoundingClientRect().right);
	},
};

export const Attachments: StoryObj<typeof FileList> = {
	args: { variant: 'attachments' },
	loaders: [
		async () => {
			const response = await fetch('/public/images/flowers-sunflower.png');
			if (!response.ok) throw new Error('Failed to load the attachment image');
			const blob = await response.blob();
			return {
				attachmentFiles: [
					{ id: 'image', file: new File([blob], 'sunflower.png', { type: blob.type }) },
					{
						id: 'text',
						file: new File(
							['Planning notes for the next release. Confirm milestones and share the updated timeline.'],
							'Planning-notes.txt',
							{ type: 'text/plain' },
						),
					},
					{ id: 'pdf', file: new File([new Uint8Array(5632)], 'report.pdf', { type: 'application/pdf' }) },
					{ id: 'upload', file: 'notes.md', uploading: true, progress: 45 },
					{ id: 'error', file: 'archive.zip', uploading: true, progress: 10, error: 'Upload failed' },
				] satisfies FileItem[],
			};
		},
	],
	render: (args, { loaded }) => <FileList {...args} files={loaded.attachmentFiles} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(() =>
			expect(canvas.getByRole('group', { name: 'Planning-notes' })).toHaveAccessibleDescription(
				/Planning notes for the next release/,
			),
		);
		await expect(canvas.getAllByRole('listitem')).toHaveLength(5);
		const report = canvas.getByRole('group', { name: 'report' });
		await expect(report).toHaveStyle({ width: '140px' });
		await expect(within(report).getByText('5.5 k')).toBeVisible();
		await expect(report).toHaveAccessibleDescription('pdf. 5.5 kilobytes');
		await expect(canvas.getByRole('progressbar', { name: 'Uploading notes' })).toHaveAttribute('aria-valuenow', '45');
		await expect(canvas.queryByRole('button', { name: 'Remove file notes.md' })).toBeNull();
		const alert = canvas.getByRole('alert');
		await expect(alert).toHaveTextContent('archive.zip: Upload failed');
		const card = canvas.getByRole('group', { name: 'archive' });
		await expect(card.contains(alert)).toBe(true);
		await expect(within(card).queryByRole('progressbar')).toBeNull();
		await expect(within(card).getByRole('button', { name: 'Remove file archive.zip' })).toBeInTheDocument();
		await expect(alert.closest('[role="listitem"]')?.getBoundingClientRect().height).toBe(
			card.getBoundingClientRect().height,
		);
		await waitFor(() =>
			expect(canvas.getByRole('group', { name: 'sunflower' }).querySelector('img')?.naturalWidth).toBeGreaterThan(0),
		);
	},
};

function ControlledAttachments<T extends File | FileItem>(props: FileListProps<T>) {
	const [files, setFiles] = useState(props.files ?? []);
	return (
		<FileList
			{...props}
			files={files}
			onChange={(next) => {
				setFiles(next);
				props.onChange?.(next);
			}}
		/>
	);
}

export const AttachmentRemoval: StoryObj<typeof FileList> = {
	tags: ['tests'],
	args: { variant: 'attachments', files: attachments, onChange: fn(), onToolTip: fn() },
	render: (args) => <ControlledAttachments {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const duplicates = canvas.getAllByRole('button', { name: 'Remove file report.pdf' });
		duplicates[0].focus();
		await userEvent.keyboard('{Enter}');
		await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
		await expect(args.onChange).toHaveBeenLastCalledWith([attachments[1], attachments[2]]);
		await expect(duplicates[1]).toHaveFocus();
		await expect(args.onToolTip).toHaveBeenCalled();
		await userEvent.keyboard(' ');
		await expect(canvas.getByRole('button', { name: 'Remove file notes.md' })).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		await expect(canvas.queryByRole('listitem')).toBeNull();
		await expect(canvas.getByRole('list')).toHaveFocus();
	},
};

export const AttachmentsColumn: StoryObj<typeof FileList> = {
	args: { variant: 'attachments', direction: 'column', attachmentSize: 'xs', files: attachments, canRemove: false },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('list')).toHaveStyle({ flexDirection: 'column' });
		await expect(canvas.queryByRole('button')).toBeNull();
		await expect(canvas.getAllByRole('group')[0]).toHaveStyle({ width: '100px' });
	},
};

export const AttachmentProgressUpdates: StoryObj<typeof FileList> = {
	tags: ['tests'],
	render: (args) => {
		const [file, setFile] = useState<FileItem>({ id: 'upload', file: 'report.pdf', uploading: true, progress: 0 });
		return (
			<>
				<FileList {...args} variant="attachments" files={[file]} />
				<button type="button" onClick={() => setFile({ ...file, progress: 75 })}>
					Advance upload
				</button>
				<button type="button" onClick={() => setFile({ ...file, uploading: false })}>
					Finish upload
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const group = canvas.getByRole('group', { name: 'report' });
		const spinner = canvas.getByRole('progressbar').querySelector('svg');
		await userEvent.click(canvas.getByRole('button', { name: 'Advance upload' }));
		await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
		await expect(canvas.getByRole('progressbar').querySelector('svg')).toBe(spinner);
		await expect(canvas.getByRole('group', { name: 'report' })).toBe(group);
		await userEvent.click(canvas.getByRole('button', { name: 'Finish upload' }));
		await expect(canvas.queryByRole('progressbar')).toBeNull();
		await expect(canvas.getByRole('button', { name: 'Remove file report.pdf' })).toBeInTheDocument();
	},
};

export const AttachmentSizing: StoryObj<typeof FileList> = {
	tags: ['tests'],
	args: {
		variant: 'attachments',
		files: [{ file: 'report.pdf' }],
		attachmentSize: 'l',
		maxWidth: 100,
		minWidth: 0,
		padding: 0,
		iconSize: 18,
		canRemove: false,
	},
	render: (args) => (
		<>
			<FileList {...args} listName="Narrow cards" />
			<FileList {...args} attachmentSize="xs" minWidth={180} maxWidth={undefined} listName="Wide cards" />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const narrow = within(canvas.getByRole('list', { name: 'Narrow cards' })).getByRole('group');
		const wide = within(canvas.getByRole('list', { name: 'Wide cards' })).getByRole('group');
		await expect(narrow).toHaveStyle({ width: '100px' });
		await expect(wide).toHaveStyle({ width: '180px' });
		await expect(narrow.querySelector('svg')).toHaveAttribute('width', '18');
		await expect(within(narrow).getByText('report').parentElement).toHaveStyle({ padding: '0px' });
	},
};

function RawFilesFixture({ variant }: Pick<FileListProps, 'variant'>) {
	const [files, setFiles] = useState<File[]>(() => [
		new File(['first'], 'report.pdf', { type: 'application/pdf' }),
		new File(['second'], 'report.pdf', { type: 'application/pdf' }),
	]);
	return (
		<>
			<FileList variant={variant} files={files} onChange={setFiles} />
			<output aria-label="Remaining raw files">{files.map((file) => `${file.name}: ${file.size}`).join(', ')}</output>
		</>
	);
}

export const RawFiles: StoryObj<typeof FileList> = {
	render: () => <RawFilesFixture />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.queryByRole('progressbar')).toBeNull();
		await expect(canvas.queryByRole('alert')).toBeNull();
		const buttons = canvas.getAllByRole('button', { name: 'Remove file report.pdf' });
		buttons[0].focus();
		await userEvent.keyboard('{Enter}');
		await expect(canvas.getAllByRole('listitem')).toHaveLength(1);
		await expect(canvas.getByRole('button', { name: 'Remove file report.pdf' })).toBe(buttons[1]);
		await expect(buttons[1]).toHaveFocus();
		await expect(canvas.getByLabelText('Remaining raw files')).toHaveTextContent('report.pdf: 6');
	},
};

export const RawFileAttachments: StoryObj<typeof FileList> = {
	render: () => <RawFilesFixture variant="attachments" />,
	play: RawFiles.play,
};
