export enum FileUploadStatus {
	queued = 'pending',
	uploading = 'uploading',
	completed = 'completed',
	failed = 'failed',
}

export enum UploadError {
	SizeExceedsLimit = 'size exceed limit',
	TypeNotAllowed = 'file type not allowed',
	UploadFailed = 'upload failed',
	UploadURLNotFound = 'invalid upload url',
	AccessForbidden = 'upload access forbidden',
	NotAuthorized = 'upload not authorized on server',
	TooLarge = 'payload too large for server',
	MediaNotSupported = 'server does not supported file type',
	InternalError = 'Internal server error',
	Other = 'Other server error',
}

export type Upload = {
	id: string;
	file: File;
	uploadURL?: string;
	status: FileUploadStatus;
	error?: UploadError;
	progress?: number;
};

export type UploadInput = {
	file: File;
	uploadURL?: string;
};

export type ConfigurationOptions = {
	uploadURL: string;
	maxQueueSize?: number;
	maxFileSize?: number;
	accepted?: string[];
	maxConcurrentUploads?: number;
};

export type UploadStatusMessage = {
	type: 'status';
	uploads: Upload[];
	workerStatus: WorkerStatus;
};

export type UploadWorkerErrorMessage = {
	type: 'error';
	message: string;
};

export type UploadWorkerMessage =
	| {
			type: 'initialize';
			options: ConfigurationOptions;
	  }
	| {
			type: 'add-files';
			files: UploadInput[];
	  }
	| {
			type: 'clear-uploads';
	  };

export type UploadWorkerResponse = UploadStatusMessage | UploadWorkerErrorMessage;

export interface UploadWorkerBridge {
	updateStatus(status: Upload[]): void;
}

export enum WorkerStatus {
	Idle = 'idle',
	Busy = 'busy',
}

export class UploadWorkerClient implements UploadWorkerBridge {
	constructor(
		private readonly target: {
			postMessage: (message: UploadWorkerResponse) => void;
		},
		private readonly getWorkerStatus: () => WorkerStatus,
	) {}

	public updateStatus(status: Upload[]): void {
		this.target.postMessage({
			type: 'status',
			uploads: status,
			workerStatus: this.getWorkerStatus(),
		});
	}
}

type UploadWorkerTarget = {
	onmessage: ((event: MessageEvent<UploadWorkerMessage>) => void) | null;
	postMessage: (message: UploadWorkerResponse) => void;
};

export class UploadsWorker {
	private readonly uploadURL!: string;
	private readonly maxQueueSize!: number;
	private readonly maxFileSize!: number;
	private readonly accepted!: string[];
	private readonly maxConcurrentUploads!: number;
	private readonly worker: UploadWorkerBridge;

	private readonly queue: Map<string, Upload> = new Map();
	private readonly active: Map<string, Upload> = new Map();
	private readonly completed: Map<string, Upload> = new Map();
	private readonly failed: Map<string, Upload> = new Map();

	private workerStatus = WorkerStatus.Idle;

	constructor(options: ConfigurationOptions, worker?: UploadWorkerBridge) {
		const {
			uploadURL,
			maxQueueSize = 5,
			accepted = [],
			maxConcurrentUploads = 5,
			maxFileSize = 1024 * 1024 * 5,
		} = options;
		this.uploadURL = uploadURL;
		this.maxQueueSize = maxQueueSize;
		this.maxConcurrentUploads = maxConcurrentUploads;
		this.accepted = accepted;
		this.maxFileSize = maxFileSize;
		this.worker =
			worker ??
			new UploadWorkerClient(
				globalThis as { postMessage: (message: UploadWorkerResponse) => void },
				() => this.workerStatus,
			);
	}

	/**
	 * Add new files to the upload queue
	 */
	public addFiles(file: UploadInput | File | Array<UploadInput | File>) {
		const uploads = Array.isArray(file) ? file : [file];
		// add uploads to the queue
		for (const item of uploads) {
			if (this.queue.size + this.active.size >= this.maxQueueSize) break;

			const uploadItem = item instanceof File ? { file: item } : item;

			const uploadInfo = {
				id: crypto.randomUUID(),
				file: uploadItem.file,
				uploadURL: uploadItem.uploadURL,
				status: FileUploadStatus.queued,
			};
			this.queue.set(uploadInfo.id, uploadInfo);
			this.notifyStatus();
		}
		// kick of the upload process
		this.process();
	}

	/**
	 * Stop activity and flush all maps / data
	 */
	public clearUploads() {
		this.queue.clear();
		this.active.clear();
		this.completed.clear();
		this.failed.clear();
		this.notifyStatus();
	}

	/**
	 * Start the processing files in the upload queue
	 */
	public process() {
		if (this.queue.size === 0 && this.active.size === 0) {
			this.workerStatus = WorkerStatus.Idle;
			this.notifyStatus();
			return;
		}

		this.workerStatus = WorkerStatus.Busy;
		this.notifyStatus();

		while (this.active.size < this.maxConcurrentUploads && this.queue.size > 0) {
			const nextUpload = this.queue.values().next().value;
			if (!nextUpload) break;

			void this.startUpload(nextUpload);
		}
	}

	public get status(): WorkerStatus {
		return this.workerStatus;
	}

	private async startUpload(upload: Upload): Promise<void> {
		try {
			// guard for file size
			if (upload.file.size > this.maxFileSize) {
				throw new Error(UploadError.SizeExceedsLimit);
			}

			// guard for file types
			const ext = upload.file.name.split('.').pop();
			const mime = upload.file.type;
			const filter = this.accepted.length > 0;
			const accepted = this.accepted.includes(ext ?? '') || this.accepted.includes(mime ?? '');
			if (filter && !accepted) {
				throw new Error(UploadError.TypeNotAllowed);
			}

			// update the status to active
			upload.status = FileUploadStatus.uploading;
			upload.progress = 0;
			this.queue.delete(upload.id);
			this.updateUploadStatus(upload);
			this.notifyStatus();

			// do the upload
			const success = await this.uploadFile(upload);
			if (!success) {
				throw new Error(UploadError.UploadFailed);
			}

			// update status and completion
			upload.status = FileUploadStatus.completed;
			upload.progress = 100;
			this.updateUploadStatus(upload);

			// add to the completed map and notify
			this.completed.set(upload.id, upload);
			this.notifyStatus();
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			switch (message) {
				case UploadError.SizeExceedsLimit:
				case UploadError.TypeNotAllowed:
				case UploadError.UploadFailed:
				case UploadError.InternalError:
				case UploadError.UploadURLNotFound:
				case UploadError.TooLarge:
				case UploadError.AccessForbidden:
				case UploadError.NotAuthorized:
				case UploadError.MediaNotSupported:
				case UploadError.Other:
					upload.error = message;
					break;
				default:
					upload.error = UploadError.Other;
					break;
			}

			// update status
			upload.status = FileUploadStatus.failed;
			this.updateUploadStatus(upload);

			// push to the failed and notify
			this.failed.set(upload.id, upload);
			this.notifyStatus();
		} finally {
			// remove from queue/active
			this.queue.delete(upload.id);
			this.active.delete(upload.id);

			// push the next file as needed
			if (this.queue.size === 0 && this.active.size === 0) {
				this.workerStatus = WorkerStatus.Idle;
				this.notifyStatus();
			} else {
				this.process();
			}
		}
	}

	/**
	 * perform the actual upload
	 */
	private async uploadFile(upload: Upload): Promise<boolean> {
		const formData = new FormData();
		formData.append('file', upload.file);

		return new Promise<boolean>((resolve, reject) => {
			const request = new XMLHttpRequest();

			request.upload.addEventListener('progress', (event) => {
				if (!event.lengthComputable || event.total === 0) return;

				upload.progress = Math.round((event.loaded / event.total) * 100);
				this.updateUploadStatus(upload);
			});

			request.addEventListener('load', () => {
				let error: UploadError;
				if (request.status > 300 || request.status < 200) {
					switch (request.status) {
						case 400:
							error = UploadError.UploadFailed;
							break;
						case 401:
							error = UploadError.NotAuthorized;
							break;
						case 403:
							error = UploadError.AccessForbidden;
							break;
						case 404:
							error = UploadError.UploadURLNotFound;
							break;
						case 413:
							error = UploadError.TooLarge;
							break;
						case 415:
							error = UploadError.MediaNotSupported;
							break;
						case 500:
							error = UploadError.InternalError;
							break;
						default:
							error = UploadError.Other;
							break;
					}
					reject(new Error(error));
				}
				resolve(true);
			});

			request.addEventListener('error', (e) => {
				reject(new Error(UploadError.UploadFailed));
			});

			request.addEventListener('abort', () => {
				reject(new Error(UploadError.UploadFailed));
			});

			request.open('POST', upload.uploadURL ?? this.uploadURL);
			request.send(formData);
		});
	}

	/**
	 * Update the active upload with new data
	 */
	private updateUploadStatus(upload: Upload, updates: Partial<Upload> = {}) {
		const updated = { ...upload, ...updates };
		this.active.set(upload.id, updated);
		this.notifyStatus();
	}

	/**
	 * Create array with the current state of all uploads
	 */
	private currentStatus(): Upload[] {
		// combine queue, active, completed and failed into a single array
		return [...this.queue.values(), ...this.active.values(), ...this.completed.values(), ...this.failed.values()];
	}

	/**
	 * Push status updates to the web worker
	 */
	private notifyStatus(): void {
		this.worker.updateStatus(this.currentStatus());
	}
}

export class UploadsWorkerRuntime {
	private uploads: UploadsWorker | null = null;

	constructor(private readonly target: UploadWorkerTarget) {
		this.target.onmessage = (event) => {
			this.handleMessage(event.data);
		};
	}

	private handleMessage(message: UploadWorkerMessage): void {
		switch (message.type) {
			case 'initialize':
				this.uploads = new UploadsWorker(
					message.options,
					new UploadWorkerClient(this.target, () => this.getWorkerStatus()),
				);
				return;
			case 'add-files':
				if (!this.uploads) {
					this.postError('Uploads worker has not been initialized.');
					return;
				}

				this.uploads.addFiles(message.files);
				return;
			case 'clear-uploads':
				if (!this.uploads) {
					this.postError('Uploads worker has not been initialized.');
					return;
				}

				this.uploads.clearUploads();
				return;
		}
	}

	private getWorkerStatus(): WorkerStatus {
		return this.uploads ? this.uploads.status : WorkerStatus.Idle;
	}

	private postError(message: string): void {
		this.target.postMessage({
			type: 'error',
			message,
		});
	}
}

export function registerUploadsWorker(target = globalThis as UploadWorkerTarget): UploadsWorkerRuntime {
	return new UploadsWorkerRuntime(target);
}
