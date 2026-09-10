import type {
	ConfigurationOptions,
	Upload,
	UploadInput,
	UploadWorkerMessage,
	UploadWorkerResponse,
	WorkerStatus,
} from '../../workers/uploads/uploads-worker';

export type UploadsStoreState = {
	uploads: Upload[];
	workerStatus: WorkerStatus;
	initialized: boolean;
	error: string | null;
	actions: {
		initialize: (options: ConfigurationOptions, worker: UploadsWorkerInstance) => UploadsWorkerInstance;
		push: (files: File | UploadInput | Array<File | UploadInput>) => void;
		reset: () => void;
	};
};

export type UploadsWorkerInstance = Worker & {
	postMessage: (message: UploadWorkerMessage) => void;
	onmessage: ((event: MessageEvent<UploadWorkerResponse>) => void) | null;
};
