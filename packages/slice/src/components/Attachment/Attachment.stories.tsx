import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Attachment } from './Attachment';
import css from './Attachment.module.css';

const meta = { title: 'Components/Attachment', component: Attachment } satisfies Meta<typeof Attachment>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TextThumbnail: Story = {
	args: { content: 'A short document preview. '.repeat(15) },
	play: async ({ canvasElement, args }) => {
		const group = within(canvasElement).getByRole('group', { name: 'Clipboard content' });
		const thumbnail = group.querySelector(`.${css.textThumbnail}`);
		await expect(thumbnail?.textContent).toBe((args.content as string).slice(0, 250));
		await expect(thumbnail).toHaveStyle({ fontSize: '10px', overflow: 'hidden' });
		await expect(group).toHaveAccessibleDescription(`text. ${(args.content as string).slice(0, 250)}`);
	},
};

export const ImageThumbnail: Story = {
	loaders: [
		async () => {
			const response = await fetch('/public/images/flowers-sunflower.png');
			if (!response.ok) throw new Error('Failed to load the image thumbnail fixture');
			const blob = await response.blob();
			return { image: new File([blob], 'flowers-sunflower.png', { type: blob.type }) };
		},
	],
	render: (args, { loaded }) => <Attachment {...args} content={{ file: loaded.image }} />,
	play: async ({ canvasElement }) => {
		const group = within(canvasElement).getByRole('group', { name: 'flowers-sunflower' });
		await waitFor(() => {
			const image = group.querySelector('img');
			expect(image?.getAttribute('src')).toMatch(/^blob:/);
			expect(image?.naturalWidth).toBeGreaterThan(0);
		});
		await expect(within(group).queryByRole('img')).toBeNull();
	},
};

export const PdfThumbnail: Story = {
	// Metadata-only fixture: PDFs use the file icon rather than a PDF renderer.
	loaders: [
		() => ({
			pdf: new File([new Uint8Array(5632)], 'Annual-Convention-Summary-Report.pdf', { type: 'application/pdf' }),
		}),
	],
	render: (args, { loaded }) => <Attachment {...args} content={{ file: loaded.pdf }} />,
	play: async ({ canvasElement }) => {
		const group = within(canvasElement).getByRole('group', { name: 'Annual-Convention-Summary-Report' });
		await expect(group.querySelector(`.${css.fileThumbnail} svg`)).toBeVisible();
		await expect(within(group).queryByRole('img')).toBeNull();
		await expect(within(group).getByText('5.5 k')).toBeVisible();
		await expect(group).toHaveAccessibleDescription('pdf. 5.5 kilobytes');
	},
};

export const CustomStyles: Story = {
	args: {
		content: 'Custom styling preview',
		textColor: '#990000',
		textColorLight: '#333333',
		textSize: 'xl',
		backgroundColor: '#ffffff',
		borderColor: '#0000ff',
		borderWidth: 3,
		borderRadius: 0,
		iconGap: 12,
		padding: 0,
		width: 260,
		height: 180,
		thumbColor: '#008000',
		thumbTextSize: 8,
		thumbPadding: 0,
		className: 'custom-attachment',
		title: 'Custom attachment',
		style: { marginTop: 2 },
	},
	play: async ({ canvasElement }) => {
		const group = within(canvasElement).getByRole('group');
		await expect(group).toHaveClass('custom-attachment');
		await expect(group).toHaveAttribute('title', 'Custom attachment');
		await expect(group).toHaveStyle({
			width: '260px',
			borderRadius: '0px',
			borderWidth: '3px',
			borderColor: 'rgb(0, 0, 255)',
			backgroundColor: 'rgb(255, 255, 255)',
			marginTop: '2px',
		});
		await expect(group.querySelector(`.${css.canvas}`)).toHaveStyle({ height: '180px', borderRadius: '0px' });
		const label = within(group).getByText('Clipboard content');
		await expect(label).toHaveStyle({ color: 'rgb(153, 0, 0)' });
		await expect(label).toHaveClass(css.xl);
		await expect(label.parentElement).toHaveStyle({ padding: '0px' });
		await expect(group.querySelector(`.${css.metadata}`)).toHaveStyle({ gap: '12px' });
		await expect(group.querySelector(`.${css.textThumbnail}`)).toHaveStyle({
			fontSize: '8px',
			color: 'rgb(0, 128, 0)',
			padding: '0px',
		});
	},
};

export const WithoutRemove: Story = {
	args: { content: 'Clipboard preview', canRemove: false, size: 'xs' },
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).queryByRole('button')).toBeNull();
		const group = within(canvasElement).getByRole('group');
		await expect(group).toHaveStyle({ width: '80px' });
		await expect(group.querySelector(`.${css.canvas}`)).toHaveStyle({ height: '80px' });
	},
};

export const FileThumbnail: Story = {
	args: { content: { file: 'report.pdf' }, iconSize: 48 },
	render: (args) => (
		<>
			<Attachment {...args} />
			<Attachment content="Matching text preview" />
		</>
	),
	play: async ({ canvasElement }) => {
		const group = within(canvasElement).getByRole('group', { name: 'report' });
		const preview = group.querySelector(`.${css.fileThumbnail}`);
		await expect(preview?.querySelector('svg')).toHaveAttribute('width', '48');
		await expect(preview).toHaveStyle({ justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' });
		const textPreview = canvasElement.querySelector(`.${css.textThumbnail}`);
		const style = getComputedStyle(preview as HTMLElement);
		await expect(style.backgroundColor).toBe(getComputedStyle(textPreview as HTMLElement).backgroundColor);
		await expect(style.padding).toBe(getComputedStyle(textPreview as HTMLElement).padding);
	},
};

export const LongFilename: Story = {
	args: { content: { file: 'A very long report filename that should truncate inside the attachment.pdf' } },
	play: async ({ canvasElement }) => {
		const name = 'A very long report filename that should truncate inside the attachment';
		const group = within(canvasElement).getByRole('group', { name });
		const label = within(group).getByText(name);
		await expect(label).toHaveStyle({ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });
		await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
		await expect(label).toHaveAttribute('title', name);
	},
};

export const RemoveClick: Story = {
	tags: ['tests'],
	args: { content: { file: 'report.pdf' }, onRemove: fn(), onClick: fn() },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const group = canvas.getByRole('group', { name: 'report' });
		const button = canvas.getByRole('button', { name: 'Remove report' });
		button.focus();
		await expect(button.parentElement).toHaveStyle({ opacity: '1', pointerEvents: 'auto' });
		await userEvent.click(button);
		await expect(args.onRemove).toHaveBeenCalledOnce();
		await expect(args.onRemove).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
		await expect(args.onClick).not.toHaveBeenCalled();
		await userEvent.click(within(group).getByText('report'));
		await expect(args.onClick).toHaveBeenCalledOnce();
	},
};

export const KeyboardActions: Story = {
	tags: ['tests'],
	args: { content: { file: 'report.pdf' }, onOpen: fn(), onRemove: fn(), onClick: fn() },
	play: async ({ canvasElement, args }) => {
		const group = within(canvasElement).getByRole('group');
		const open = within(group).getByRole('button', { name: 'Open report' });
		const remove = within(group).getByRole('button', { name: 'Remove report' });
		open.focus();
		await userEvent.keyboard('{Enter}');
		await expect(args.onOpen).toHaveBeenCalledOnce();
		await userEvent.tab();
		await expect(remove).toHaveFocus();
		await userEvent.keyboard(' ');
		await expect(args.onRemove).toHaveBeenCalledOnce();
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};

export const Disabled: Story = {
	args: { content: { file: 'report.pdf' }, disabled: true, onOpen: fn(), onRemove: fn() },
	play: async ({ canvasElement, args }) => {
		const group = within(canvasElement).getByRole('group');
		await expect(group).toHaveAttribute('aria-disabled', 'true');
		for (const button of within(group).getAllByRole('button')) {
			await expect(button).toBeDisabled();
			button.click();
		}
		await expect(args.onOpen).not.toHaveBeenCalled();
		await expect(args.onRemove).not.toHaveBeenCalled();
	},
};

export const ActionNames: Story = {
	tags: ['tests'],
	args: {
		content: '',
		attachmentName: 'Pasted note',
		removeLabel: 'Discard note',
		openLabel: 'Read note',
		onOpen: fn(),
	},
	play: async ({ canvasElement }) => {
		const group = within(canvasElement).getByRole('group', { name: 'Pasted note' });
		await expect(within(group).getByRole('button', { name: 'Discard note' })).toBeInTheDocument();
		await expect(within(group).getByRole('button', { name: 'Read note' })).toBeInTheDocument();
	},
};

export const ControlledRemoval: Story = {
	render: (args) => {
		const [visible, setVisible] = useState(true);
		return visible ? (
			<Attachment {...args} content={{ file: 'report.pdf' }} onRemove={() => setVisible(false)} />
		) : (
			<p>Attachment removed</p>
		);
	},
	play: async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Remove report' });
		button.focus();
		await userEvent.click(button);
		await expect(within(canvasElement).queryByRole('group')).toBeNull();
		await expect(within(canvasElement).getByText('Attachment removed')).toBeVisible();
	},
};

export const EmptyAttachment: Story = {
	tags: ['tests'],
	args: { attachmentName: ' ', removeLabel: ' ', openLabel: ' ', onOpen: fn() },
	play: async ({ canvasElement }) => {
		const group = within(canvasElement).getByRole('group', { name: 'Attachment' });
		await expect(group).not.toHaveAttribute('aria-describedby');
		await expect(within(group).getByRole('button', { name: 'Open Attachment' })).toBeInTheDocument();
		await expect(within(group).getByRole('button', { name: 'Remove Attachment' })).toBeInTheDocument();
		await expect(group.querySelector(`.${css.preview}`)?.childElementCount).toBe(0);
	},
};

export const Uploading: Story = {
	args: { content: { file: 'report.pdf', uploading: true, progress: 45 } },
	play: async ({ canvasElement }) => {
		const progress = within(canvasElement).getByRole('progressbar', { name: 'Uploading report' });
		await expect(progress).toHaveAttribute('aria-valuenow', '45');
		await expect(within(progress).getByText('Uploading')).toBeVisible();
		const percent = within(progress).getByText('45%');
		await expect(percent).toBeVisible();
		await expect(percent).toHaveStyle({ fontVariantNumeric: 'tabular-nums' });
		await expect(percent.getBoundingClientRect().left).toBeGreaterThan(
			within(progress).getByText('Uploading').getBoundingClientRect().right,
		);
		await expect(percent.closest(`.${css.upload}`)?.querySelector('svg')).toBeInTheDocument();
		await expect(percent.closest('[aria-hidden="true"]')).toBeNull();
		await expect(canvasElement.querySelector(`.${css.metadata}`)).toBeNull();
	},
};

export const UploadingIndeterminate: Story = {
	args: { content: { file: 'report.pdf', uploading: true } },
	play: async ({ canvasElement }) => {
		const progress = within(canvasElement).getByRole('progressbar');
		await expect(progress).not.toHaveAttribute('aria-valuenow');
		await expect(progress).toHaveAttribute('aria-valuetext', 'Uploading');
		await expect(within(progress).queryByText(/%/)).toBeNull();
	},
};

export const UploadProgressUpdates: Story = {
	tags: ['tests'],
	render: (args) => {
		const [progress, setProgress] = useState(0);
		const [uploading, setUploading] = useState(true);
		return (
			<>
				<Attachment {...args} content={{ file: 'report.pdf', uploading, progress }} />
				<button type="button" onClick={() => setProgress(150)}>
					Advance upload
				</button>
				<button type="button" onClick={() => setUploading(false)}>
					Finish upload
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const progress = canvas.getByRole('progressbar');
		const spinner = progress.querySelector('svg');
		await expect(progress).toHaveAttribute('aria-valuenow', '0');
		await userEvent.click(canvas.getByRole('button', { name: 'Advance upload' }));
		await expect(progress).toHaveAttribute('aria-valuenow', '100');
		await expect(within(progress).getByText('100%')).toBeVisible();
		await expect(progress.querySelector('svg')).toBe(spinner);
		await expect(spinner?.parentElement?.contains(within(progress).getByText('100%'))).toBe(false);
		await userEvent.click(canvas.getByRole('button', { name: 'Finish upload' }));
		await expect(canvas.queryByRole('progressbar')).toBeNull();
		await expect(canvasElement.querySelector(`.${css.metadata}`)).toBeVisible();
	},
};

export const TextFileThumbnail: Story = {
	loaders: [
		() => ({
			file: new File(
				['Planning notes for the next release. Confirm milestones and share the updated timeline.'],
				'Planning-notes.txt',
				{ type: 'text/plain' },
			),
		}),
	],
	render: (args, { loaded }) => <Attachment {...args} content={{ file: loaded.file }} />,
	play: async ({ canvasElement }) => {
		const group = within(canvasElement).getByRole('group', { name: 'Planning-notes' });
		await waitFor(() =>
			expect(group.querySelector(`.${css.textThumbnail}`)).toHaveTextContent('Planning notes for the next release.'),
		);
		await expect(group.querySelector(`.${css.fileThumbnail}`)).toBeNull();
	},
};
