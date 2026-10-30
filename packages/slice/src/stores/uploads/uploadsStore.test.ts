import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	FileUploadStatus,
	WorkerStatus,
} from '../../workers/uploads/uploads-worker';
import { useUploadsStore } from './uploadsStore';

// The store keeps a module-level worker singleton that only ever binds once
// (`if (!uploadsWorker)`), so every test in this file shares the same mock
// worker instance passed to the first initialize() call.
const mockWorker = {
	postMessage: vi.fn(),
	onmessage: null as ((event: MessageEvent) => void) | null,
} as unknown as import('./_types').UploadsWorkerInstance;

beforeEach(() => {
	mockWorker.postMessage = vi.fn();
	useUploadsStore.setState({
		uploads: [],
		workerStatus: WorkerStatus.Idle,
		initialized: false,
		error: null,
	});
});

describe('uploadsStore', () => {
	it('push() before initialize() is a no-op', () => {
		useUploadsStore.getState().actions.push(new File(['a'], 'a.txt'));
		expect(mockWorker.postMessage).not.toHaveBeenCalled();
	});

	it('initialize() posts an initialize message and marks the store initialized', () => {
		const worker = useUploadsStore
			.getState()
			.actions.initialize({ uploadURL: '/upload' }, mockWorker);

		expect(worker).toBe(mockWorker);
		expect(mockWorker.postMessage).toHaveBeenCalledWith({
			type: 'initialize',
			options: { uploadURL: '/upload' },
		});
		expect(useUploadsStore.getState().initialized).toBe(true);
	});

	it('push() after initialize() posts add-files with normalized inputs', () => {
		useUploadsStore
			.getState()
			.actions.initialize({ uploadURL: '/upload' }, mockWorker);
		const file = new File(['a'], 'a.txt');
		const input = { file: new File(['b'], 'b.txt'), uploadURL: '/custom' };

		useUploadsStore.getState().actions.push([file, input]);

		expect(mockWorker.postMessage).toHaveBeenCalledWith({
			type: 'add-files',
			files: [{ file }, input],
		});
	});

	it('reset() posts clear-uploads and resets local state', () => {
		useUploadsStore
			.getState()
			.actions.initialize({ uploadURL: '/upload' }, mockWorker);
		useUploadsStore.setState({
			uploads: [
				{
					id: '1',
					file: new File(['a'], 'a.txt'),
					status: FileUploadStatus.completed,
				},
			],
			workerStatus: WorkerStatus.Busy,
			error: 'boom',
		});

		useUploadsStore.getState().actions.reset();

		expect(mockWorker.postMessage).toHaveBeenCalledWith({
			type: 'clear-uploads',
		});
		expect(useUploadsStore.getState().uploads).toEqual([]);
		expect(useUploadsStore.getState().workerStatus).toBe(WorkerStatus.Idle);
		expect(useUploadsStore.getState().error).toBeNull();
	});

	it('applies a status message from the worker to the store', () => {
		useUploadsStore
			.getState()
			.actions.initialize({ uploadURL: '/upload' }, mockWorker);
		const upload = {
			id: '1',
			file: new File(['a'], 'a.txt'),
			status: FileUploadStatus.uploading,
		};

		mockWorker.onmessage?.({
			data: {
				type: 'status',
				uploads: [upload],
				workerStatus: WorkerStatus.Busy,
			},
		} as MessageEvent);

		expect(useUploadsStore.getState().uploads).toEqual([upload]);
		expect(useUploadsStore.getState().workerStatus).toBe(WorkerStatus.Busy);
	});

	it('applies an error message from the worker to the store', () => {
		useUploadsStore
			.getState()
			.actions.initialize({ uploadURL: '/upload' }, mockWorker);

		mockWorker.onmessage?.({
			data: { type: 'error', message: 'upload failed' },
		} as MessageEvent);

		expect(useUploadsStore.getState().error).toBe('upload failed');
	});
});
