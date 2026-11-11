'use client';

import { type FileItem, UploadArea } from '@apple-pie/slice';
import { tipActions } from '@apple-pie/slice/stores/tip';
import { useState } from 'react';

export function UploadPreview() {
	const [files, setFiles] = useState<FileItem[]>([]);
	return (
		<UploadArea
			files={files}
			acceptedTypes={['pdf', 'png', 'jpg']}
			onFilesChange={setFiles}
			onToolTip={tipActions.push}
		/>
	);
}
export function BusyPreview() {
	return <UploadArea busy files={[{ id: 'report', file: 'Quarterly report.pdf', uploading: true, progress: 45 }]} />;
}

export function AttachmentFilesPreview() {
	const [files, setFiles] = useState<FileItem[]>(() => [
		{
			id: 'brief',
			file: new File(
				['Project brief: confirm milestones, review the design, and share the next steps with the team.'],
				'Project-brief.txt',
				{ type: 'text/plain' },
			),
		},
		{ id: 'report', file: new File([new Uint8Array(5632)], 'Quarterly-report.pdf', { type: 'application/pdf' }) },
		{ id: 'upload', file: 'Presentation.pptx', uploading: true, progress: 45 },
	]);
	return (
		<UploadArea
			files={files}
			onFilesChange={setFiles}
			fileListProps={{
				variant: 'attachments',
				attachmentSize: 's',
				style: { justifyContent: 'center' },
			}}
			onToolTip={tipActions.push}
		/>
	);
}
