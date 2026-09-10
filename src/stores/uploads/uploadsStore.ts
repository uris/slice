import { create } from 'zustand';
import {
	type ConfigurationOptions,
	type UploadInput,
	type UploadStatusMessage,
	type UploadWorkerErrorMessage,
	type UploadWorkerMessage,
	type UploadWorkerResponse,
	WorkerStatus,
} from '../../workers/uploads/uploads-worker';
import type { UploadsStoreState, UploadsWorkerInstance } from './_types';

let uploadsWorker: UploadsWorkerInstance | null = null;

export function createUploadsWorker(workerUrl?: string | URL): UploadsWorkerInstance {
	return new Worker(workerUrl ?? new URL('../../workers/uploads/uploads.ts', import.meta.url), {
		type: 'module',
	}) as UploadsWorkerInstance;
}

export const useUploadsStore = create<UploadsStoreState>((set, get) => ({
	uploads: [],
	workerStatus: WorkerStatus.Idle,
	initialized: false,
	error: null,
	actions: {
		initialize: (options: ConfigurationOptions, worker: UploadsWorkerInstance) => {
			if (!uploadsWorker) {
				uploadsWorker = worker;
				uploadsWorker.onmessage = handleWorkerMessage;
			}

			uploadsWorker.postMessage({
				type: 'initialize',
				options,
			} satisfies UploadWorkerMessage);

			set({
				initialized: true,
				error: null,
			});

			return uploadsWorker;
		},
		push: (files: File | UploadInput | Array<File | UploadInput>) => {
			if (!uploadsWorker || !get().initialized) return;
			const uploads = (Array.isArray(files) ? files : [files]).map((item) =>
				item instanceof File ? { file: item } : item,
			);

			uploadsWorker.postMessage({
				type: 'add-files',
				files: uploads,
			} satisfies UploadWorkerMessage);
		},
		reset: () => {
			if (uploadsWorker) {
				uploadsWorker.postMessage({
					type: 'clear-uploads',
				} satisfies UploadWorkerMessage);
			}

			set({
				uploads: [],
				workerStatus: WorkerStatus.Idle,
				error: null,
			});
		},
	},
}));

function handleWorkerMessage(event: MessageEvent<UploadWorkerResponse>) {
	const message = event.data;

	switch (message.type) {
		case 'status':
			applyStatusMessage(message);
			return;
		case 'error':
			applyErrorMessage(message);
			return;
	}
}

function applyStatusMessage(message: UploadStatusMessage) {
	useUploadsStore.setState({
		uploads: message.uploads,
		workerStatus: message.workerStatus,
		error: null,
	});
}

function applyErrorMessage(message: UploadWorkerErrorMessage) {
	useUploadsStore.setState({
		error: message.message,
	});
}

// atomic hook exports for use in React components
export const useUploads = () => useUploadsStore((state) => state.uploads);
export const useUploadsWorkerStatus = () => useUploadsStore((state) => state.workerStatus);
export const useUploadsInitialized = () => useUploadsStore((state) => state.initialized);
export const useUploadsError = () => useUploadsStore((state) => state.error);
export const useUploadsActions = () => useUploadsStore((state) => state.actions);

// non-reactive imperative exports for use outside the React context
export const uploadsActions = useUploadsStore.getState().actions;
export const getUploads = () => useUploadsStore.getState().uploads;
export const getUploadsWorkerStatus = () => useUploadsStore.getState().workerStatus;
export const uploadsInitialized = () => useUploadsStore.getState().initialized;
export const getUploadsError = () => useUploadsStore.getState().error;
