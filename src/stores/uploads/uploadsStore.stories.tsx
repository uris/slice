import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useEffect } from 'react';
import { Button } from '../../components/Button';
import type { FileItem } from '../../components/FileList';
import { FlexDiv } from '../../components/FlexDiv';
import { UploadArea } from '../../components/UploadArea';
import { type ConfigurationOptions, FileUploadStatus, WorkerStatus } from '../../workers/uploads/uploads-worker';
// @ts-expect-error Vite resolves ?url imports in Storybook
import uploadsWorkerUrl from '../../workers/uploads/uploads.ts?url';
import type { UploadsWorkerInstance } from './_types';
import {
	createUploadsWorker,
	useUploads,
	useUploadsActions,
	useUploadsError,
	useUploadsInitialized,
	useUploadsWorkerStatus,
} from './uploadsStore';

const storyOptions: ConfigurationOptions = {
	uploadURL: '/iframe.html',
	maxQueueSize: 10,
	maxConcurrentUploads: 2,
};

function getStoryWorker(): UploadsWorkerInstance | null {
	const uploadsWorkerUrl = new URL('../../workers/uploads/uploads.ts', import.meta.url);
	return createUploadsWorker(uploadsWorkerUrl);
}

const WorkerDemo = () => {
	const uploads = useUploads();
	const workerStatus = useUploadsWorkerStatus();
	const initialized = useUploadsInitialized();
	const error = useUploadsError();
	const actions = useUploadsActions();
	const [files, setFiles] = React.useState<FileItem[]>([]);
	const workerRef = React.useRef<UploadsWorkerInstance | null>(null);

	useEffect(() => {
		if (workerRef.current) return;
		workerRef.current = getStoryWorker();
		workerRef.current && actions.initialize(storyOptions, workerRef.current);
	}, [actions]);

	useEffect(() => {
		const updatedFiles = uploads.map((upload) => ({
			file: upload.file,
			uploading: upload.status === FileUploadStatus.uploading || upload.status === FileUploadStatus.queued,
			progress: upload.progress,
			error: upload.error,
		}));
		setFiles(updatedFiles);
	}, [uploads]);

	return (
		<FlexDiv absolute direction={'column'} justify={'center'} align={'center'} padding={48} gap={16}>
			<FlexDiv direction={'column'} width={'fill'} justify={'center'} align={'center'} gap={8}>
				<div>Uploads Worker Initialized: {initialized ? 'yes' : 'no'}</div>
				<div>Upload Worker Status: {workerStatus}</div>
				<div>Uploads Worker Error: {error ?? 'none'}</div>
				{uploads.length > 0 && <div>Uploads: {uploads.length}</div>}
			</FlexDiv>

			<UploadArea
				width={'100%'}
				title={'Upload Files With Worker'}
				message={'Choose files to verify the upload worker boots and posts updates'}
				busyMessage={'Worker upload in progress'}
				files={files}
				busy={workerStatus === WorkerStatus.Busy}
				onUpload={(nextFiles) => actions.push(nextFiles)}
			/>
			<FlexDiv gap={12} width={'fill'} direction={'column'} align={'center'} justify={'center'}>
				{!initialized && (
					<Button
						label={'Initialize'}
						onClick={() => {
							const worker = getStoryWorker();
							if (!worker) return;
							actions.initialize(storyOptions, worker);
						}}
					/>
				)}
				<Button
					label={'Reset Uploads'}
					state={uploads.length === 0 ? 'disabled' : 'normal'}
					onClick={() => {
						actions.reset();
						setFiles([]);
					}}
				/>
				Note: for demo, there is no valid upload server so uploads will fail
			</FlexDiv>
		</FlexDiv>
	);
};

const meta: Meta<typeof WorkerDemo> = {
	title: 'Stores/Uploads Store',
	component: WorkerDemo,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;

export const Demo: StoryObj<typeof WorkerDemo> = {};
