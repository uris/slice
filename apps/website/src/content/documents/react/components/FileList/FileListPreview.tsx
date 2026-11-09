'use client';

import { type FileItem, FileList } from '@apple-pie/slice';
import { tipActions } from '@apple-pie/slice/stores/tip';
import { useEffect, useState } from 'react';

export function AttachmentsPreview() {
	const [files, setFiles] = useState<FileItem[]>([
		{ file: 'Quarterly report.pdf' },
		{ file: 'Project notes.md' },
		{ file: 'Cover image.webp' },
	]);
	return <FileList files={files} onChange={setFiles} onToolTip={tipActions.push} />;
}

export function UploadStatesPreview() {
	return (
		<FileList
			direction="column"
			canRemove={false}
			files={[
				{ file: 'Presentation.pptx', uploading: true, progress: 40 },
				{ file: 'Budget.xlsx' },
				{ file: 'Recording.mp4', error: 'Upload failed. Try again.' },
			]}
		/>
	);
}

export function AttachmentCardsPreview() {
	const [files, setFiles] = useState<FileItem[]>(() => [
		{ id: 'image', file: 'flowers-sunflower.png' },
		{
			id: 'text',
			file: new File(
				[
					"Notes from today's planning session. Confirm the project milestones, review the release checklist, and share the next steps with the team.",
				],
				'Planning-notes.txt',
				{ type: 'text/plain' },
			),
		},
		{ id: 'report', file: new File([new Uint8Array(5632)], 'Quarterly-report.pdf', { type: 'application/pdf' }) },
		{ id: 'upload', file: 'Project-notes.md', uploading: true, progress: 45 },
		{ id: 'error', file: 'Archive.zip', error: 'Upload failed. Try again.' },
	]);
	useEffect(() => {
		const controller = new AbortController();
		void fetch('/images/flowers-sunflower.png', { signal: controller.signal })
			.then((response) => {
				if (!response.ok) throw new Error('Image preview unavailable');
				return response.blob();
			})
			.then((blob) => {
				if (controller.signal.aborted) return;
				const file = new File([blob], 'flowers-sunflower.png', { type: blob.type });
				setFiles((current) => current.map((item) => (item.id === 'image' ? { ...item, file } : item)));
			})
			.catch(() => {
				/* Keep the filename fallback if the image cannot be loaded. */
			});
		return () => controller.abort();
	}, []);
	return (
		<FileList variant="attachments" attachmentSize="s" files={files} onChange={setFiles} onToolTip={tipActions.push} />
	);
}
