'use client';

import { Attachment, type AttachmentProps, type FileItem } from '@apple-pie/slice';
import { tipActions } from '@apple-pie/slice/stores/tip';
import { useEffect, useState } from 'react';

function useImageAttachmentContent() {
	const [content, setContent] = useState<File | FileItem>({ file: 'flowers-sunflower.png' });
	useEffect(() => {
		const controller = new AbortController();
		void fetch('/images/flowers-sunflower.png', { signal: controller.signal })
			.then((response) => {
				if (!response.ok) throw new Error('Image preview unavailable');
				return response.blob();
			})
			.then((blob) => {
				if (!controller.signal.aborted) setContent(new File([blob], 'flowers-sunflower.png', { type: blob.type }));
			})
			.catch(() => {
				/* Keep the filename fallback if the image cannot be loaded. */
			});
		return () => controller.abort();
	}, []);
	return content;
}

export function ImageAttachmentPreview() {
	const content = useImageAttachmentContent();
	return <Attachment content={content} canRemove={false} />;
}

export function AttachmentSizePreview({
	size,
	uploading = false,
}: Pick<AttachmentProps, 'size'> & { uploading?: boolean }) {
	const content = useImageAttachmentContent();
	const file = 'file' in content ? content.file : content;
	const previewContent = uploading ? { file, uploading: true, progress: 45 } : content;
	return (
		<div style={{ minHeight: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Attachment content={previewContent} size={size} canRemove={false} />
		</div>
	);
}

export function TextAttachmentPreview() {
	return (
		<Attachment
			content="Notes from today's planning session. Review the project milestones, confirm the next release, and share the updated timeline with the team."
			canRemove={false}
		/>
	);
}

export function PdfAttachmentPreview() {
	const [content] = useState(
		() => new File([new Uint8Array(5632)], 'Quarterly-report.pdf', { type: 'application/pdf' }),
	);
	return <Attachment content={content} canRemove={false} />;
}

export function UploadAttachmentPreview({ indeterminate = false }: Readonly<{ indeterminate?: boolean }>) {
	return (
		<Attachment
			content={{ file: 'Quarterly-report.pdf', uploading: true, progress: indeterminate ? undefined : 45 }}
			size="l"
			canRemove={false}
		/>
	);
}

export function RemovableAttachmentPreview() {
	const [visible, setVisible] = useState(true);
	return visible ? (
		<Attachment
			content={{ file: 'Quarterly-report.pdf' }}
			onRemove={() => setVisible(false)}
			onToolTip={tipActions.push}
		/>
	) : null;
}

export function UploadErrorPreview() {
	return (
		<Attachment
			content={{ file: 'Quarterly-report.pdf', error: 'Upload failed. Check your connection and try again.' }}
			canRemove={false}
		/>
	);
}
