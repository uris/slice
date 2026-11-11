import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Attachment } from './Attachment';
import css from './Attachment.module.css';
import type { AttachmentProps } from './_types';

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
			expect(image).toHaveStyle({ opacity: '1' });
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
		await expect(group.querySelector(`.${css.fileThumbnail} svg`)).toHaveAttribute('width', '48');
		await expect(within(group).queryByRole('img')).toBeNull();
		await expect(group).toHaveStyle({ width: '140px' });
		await expect(group.querySelector(`.${css.canvas}`)).toHaveStyle({ height: '140px' });
		await expect(within(group).getByText('5.5 k')).toBeVisible();
		await expect(group).toHaveAccessibleDescription('pdf. 5.5 kilobytes');
	},
};

function AttachmentSizesRow(props: AttachmentProps) {
	return (
		<div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
			{(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
				<figure key={size} style={{ margin: 0 }}>
					<Attachment {...props} size={size} />
					<figcaption style={{ marginTop: 8, textAlign: 'center' }}>{size}</figcaption>
				</figure>
			))}
		</div>
	);
}

export const Sizes: Story = {
	parameters: { layout: 'padded' },
	loaders: ImageThumbnail.loaders,
	render: (args, { loaded }) => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
			<AttachmentSizesRow {...args} content={loaded.image} />
			<AttachmentSizesRow {...args} content={{ file: loaded.image, uploading: true, progress: 45 }} />
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const groups = canvas.getAllByRole('group');
		await expect(groups).toHaveLength(10);
		for (const [index, group] of groups.slice(0, 5).entries()) {
			const fileSize = group.querySelector(`.${css.filesize}`);
			if (index < 2) await expect(fileSize).toBeNull();
			else await expect(fileSize).toBeVisible();
			await expect(group.querySelector(`.${css.filetype}`)).toHaveTextContent('image');
			await expect(group).toHaveAccessibleDescription(/megabytes/);
		}
		const bars = canvas.getAllByRole('progressbar');
		await expect(bars).toHaveLength(5);
		for (const [index, bar] of bars.entries()) {
			await expect(bar).toHaveAttribute('aria-valuenow', '45');
			await expect(bar).toHaveAttribute('aria-valuetext', 'Uploading 45%');
			await expect(within(bar).getByText('Uploading')).toBeVisible();
			await expect(bar.querySelector('svg')).toBeInTheDocument();
			if (index < 2) await expect(within(bar).queryByText('45%')).toBeNull();
			else await expect(within(bar).getByText('45%')).toBeVisible();
		}
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
		await expect(group).toHaveStyle({ width: '100px' });
		await expect(group.querySelector(`.${css.canvas}`)).toHaveStyle({ height: '100px' });
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
		const button = canvas.getByRole('button', { name: 'Remove report.pdf' });
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
		const open = within(group).getByRole('button', { name: 'Open report.pdf' });
		const remove = within(group).getByRole('button', { name: 'Remove report.pdf' });
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
		onRemove: fn(),
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
		const button = within(canvasElement).getByRole('button', { name: 'Remove report.pdf' });
		button.focus();
		await userEvent.click(button);
		await expect(within(canvasElement).queryByRole('group')).toBeNull();
		await expect(within(canvasElement).getByText('Attachment removed')).toBeVisible();
	},
};

export const EmptyAttachment: Story = {
	tags: ['tests'],
	args: { attachmentName: ' ', removeLabel: ' ', openLabel: ' ', onOpen: fn(), onRemove: fn() },
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

export const InvalidImage: Story = {
	loaders: ImageThumbnail.loaders,
	render: (args, { loaded }) => {
		const [file, setFile] = useState(() => new File(['Not an image'], 'broken.png', { type: 'image/png' }));
		return (
			<>
				<Attachment {...args} content={{ file }} />
				<button type="button" onClick={() => setFile(loaded.image)}>
					Load valid image
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const broken = canvas.getByRole('group', { name: 'broken' });
		await waitFor(() => expect(broken.querySelector(`.${css.fileThumbnail} svg`)).toBeVisible());
		await expect(broken.querySelector('img')).toBeNull();
		await expect(broken.querySelector(`.${css.previewLoader}`)).toBeNull();
		await userEvent.click(canvas.getByRole('button', { name: 'Load valid image' }));
		const valid = canvas.getByRole('group', { name: 'flowers-sunflower' });
		await waitFor(() => expect(valid.querySelector('img')).toHaveStyle({ opacity: '1' }));
		await expect(valid.querySelector(`.${css.fileThumbnail}`)).toBeNull();
	},
};

export const NoRemoveHandler: Story = {
	args: { content: { file: 'report.pdf' }, canRemove: true },
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).queryByRole('button')).toBeNull();
	},
};

export const DistinctActionNames: Story = {
	render: () => (
		<>
			<Attachment content={{ file: 'report.pdf' }} onOpen={fn()} onRemove={fn()} />
			<Attachment content={{ file: 'report.docx' }} onOpen={fn()} onRemove={fn()} />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const extension of ['pdf', 'docx']) {
			await expect(canvas.getByRole('button', { name: `Open report.${extension}` })).toBeInTheDocument();
			await expect(canvas.getByRole('button', { name: `Remove report.${extension}` })).toBeInTheDocument();
		}
		await expect(canvas.getAllByText('report')).toHaveLength(2);
	},
};

export const ImagePreviewLoading: Story = {
	tags: ['tests'],
	loaders: ImageThumbnail.loaders,
	render: (args, { loaded }) => {
		const release = useRef<(() => void) | undefined>(undefined);
		return (
			<div
				onLoadCapture={(event) => {
					if (event.target instanceof HTMLImageElement) {
						// Hold decoding to exercise the visible loading state deterministically.
						event.target.decode = () =>
							new Promise<void>((resolve) => {
								release.current = resolve;
							});
					}
				}}
			>
				<Attachment {...args} content={{ file: loaded.image }} />
				<button type="button" onClick={() => release.current?.()}>
					Finish preview
				</button>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const group = canvas.getByRole('group', { name: 'flowers-sunflower' });
		await waitFor(() => expect(group.querySelector('img')?.naturalWidth).toBeGreaterThan(0));
		const image = group.querySelector('img');
		await expect(image).toHaveAttribute('loading', 'lazy');
		await expect(image).toHaveAttribute('decoding', 'async');
		await expect(image).toHaveStyle({ opacity: '0' });
		await expect(group.querySelector(`.${css.previewLoader}`)).toBeVisible();
		await userEvent.click(canvas.getByRole('button', { name: 'Finish preview' }));
		await waitFor(() => expect(image).toHaveStyle({ opacity: '1' }));
		await expect(group.querySelector(`.${css.previewLoader}`)).toBeNull();
	},
};

export const ImageDecodingFailure: Story = {
	tags: ['tests'],
	loaders: ImageThumbnail.loaders,
	render: (args, { loaded }) => (
		<div
			onLoadCapture={(event) => {
				if (event.target instanceof HTMLImageElement)
					event.target.decode = () => Promise.reject(new Error('Decode failed'));
			}}
		>
			<Attachment {...args} content={{ file: loaded.image }} />
		</div>
	),
	play: async ({ canvasElement }) => {
		const group = within(canvasElement).getByRole('group', { name: 'flowers-sunflower' });
		await waitFor(() => expect(group.querySelector(`.${css.fileThumbnail} svg`)).toBeVisible());
		await expect(group.querySelector('img')).toBeNull();
		await expect(group.querySelector(`.${css.previewLoader}`)).toBeNull();
	},
};

export const UploadError: Story = {
	args: {
		content: { file: 'report.pdf', uploading: true, progress: 45, error: 'Upload failed. Please try again.' },
		onRemove: fn(),
		onOpen: fn(),
	},
	render: (args) => (
		<>
			<Attachment {...args} />
			<Attachment content={{ file: 'healthy.pdf' }} />
		</>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const group = canvas.getByRole('group', { name: 'report' });
		const alert = within(group).getByRole('alert');
		await expect(alert).toHaveTextContent('report.pdf: Upload failed. Please try again.');
		await expect(alert.closest(`.${css.canvas}`)).not.toBeNull();
		await expect(alert.closest('[aria-hidden="true"]')).toBeNull();
		await expect(group).toHaveAccessibleDescription(/Upload failed. Please try again./);
		await expect(within(group).queryByRole('progressbar')).toBeNull();
		await expect(within(group).queryByRole('button', { name: 'Open report.pdf' })).toBeNull();
		await expect(group.getBoundingClientRect().height).toBe(
			canvas.getByRole('group', { name: 'healthy' }).getBoundingClientRect().height,
		);
		const remove = within(group).getByRole('button', { name: 'Remove report.pdf' });
		remove.focus();
		await userEvent.click(remove);
		await expect(args.onRemove).toHaveBeenCalledOnce();
	},
};

export const LongUploadError: Story = {
	args: { content: { file: 'report.pdf', error: 'The upload could not be completed. '.repeat(30) } },
	play: async ({ canvasElement }) => {
		const alert = within(canvasElement).getByRole('alert');
		await expect(alert.scrollHeight).toBeGreaterThan(alert.clientHeight);
		await expect(alert).toHaveStyle({ overflow: 'auto' });
		alert.focus();
		await expect(alert).toHaveFocus();
	},
};

export const UploadErrorRecovery: Story = {
	tags: ['tests'],
	render: () => {
		const [error, setError] = useState<string | undefined>();
		return (
			<>
				<Attachment content={{ file: 'report.pdf', uploading: true, progress: 45, error }} />
				<button type="button" onClick={() => setError('Upload failed. Please try again.')}>
					Fail upload
				</button>
				<button type="button" onClick={() => setError(undefined)}>
					Retry upload
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const group = canvas.getByRole('group', { name: 'report' });
		await expect(within(group).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '45');
		await userEvent.click(canvas.getByRole('button', { name: 'Fail upload' }));
		await expect(within(group).getByRole('alert')).toBeVisible();
		await expect(within(group).queryByRole('progressbar')).toBeNull();
		await userEvent.click(canvas.getByRole('button', { name: 'Retry upload' }));
		await expect(within(group).queryByRole('alert')).toBeNull();
		await expect(within(group).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '45');
		await expect(group.querySelector(`.${css.fileThumbnail}`)).toBeVisible();
	},
};

export const RawFile: Story = {
	loaders: PdfThumbnail.loaders,
	render: (args, { loaded }) => <Attachment {...args} content={loaded.pdf as File} />,
	args: { onOpen: fn(), onRemove: fn() },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const group = canvas.getByRole('group', { name: 'Annual-Convention-Summary-Report' });
		await expect(group).toHaveAccessibleDescription('pdf. 5.5 kilobytes');
		await expect(canvas.queryByRole('progressbar')).toBeNull();
		await expect(canvas.queryByRole('alert')).toBeNull();
		await userEvent.click(canvas.getByRole('button', { name: 'Open Annual-Convention-Summary-Report.pdf' }));
		await expect(args.onOpen).toHaveBeenCalledOnce();
		const remove = canvas.getByRole('button', { name: 'Remove Annual-Convention-Summary-Report.pdf' });
		remove.focus();
		await userEvent.click(remove);
		await expect(args.onRemove).toHaveBeenCalledOnce();
	},
};
