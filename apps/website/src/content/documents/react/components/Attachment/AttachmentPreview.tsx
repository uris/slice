'use client';

import { Attachment, type FileItem } from '@apple-pie/slice';
import { tipActions } from '@apple-pie/slice/stores/tip';
import { useEffect, useState } from 'react';

export function ImageAttachmentPreview() {
	const [content, setContent] = useState<FileItem>({ file: 'flowers-sunflower.png' });
	useEffect(() => {
		const controller = new AbortController();
		void fetch('/images/flowers-sunflower.png', { signal: controller.signal })
			.then((response) => {
				if (!response.ok) throw new Error('Image preview unavailable');
				return response.blob();
			})
			.then((blob) => {
				if (!controller.signal.aborted)
					setContent({ file: new File([blob], 'flowers-sunflower.png', { type: blob.type }) });
			})
			.catch(() => {
				/* Keep the filename fallback if the image cannot be loaded. */
			});
		return () => controller.abort();
	}, []);
	return <Attachment content={content} canRemove={false} />;
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
	const [content] = useState<FileItem>(() => ({
		file: new File([new Uint8Array(5632)], 'Quarterly-report.pdf', { type: 'application/pdf' }),
	}));
	return <Attachment content={content} canRemove={false} />;
}

export function UploadAttachmentPreview({ indeterminate = false }: Readonly<{ indeterminate?: boolean }>) {
	return (
		<Attachment
			content={{ file: 'Quarterly-report.pdf', uploading: true, progress: indeterminate ? undefined : 45 }}
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
