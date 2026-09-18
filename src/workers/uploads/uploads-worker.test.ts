import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	type ConfigurationOptions,
	FileUploadStatus,
	registerUploadsWorker,
	UploadError,
	UploadsWorker,
	UploadWorkerClient,
	type UploadWorkerResponse,
	WorkerStatus,
} from './uploads-worker';

type Listener = (event?: unknown) => void;

class MockXHR {
	static instances: MockXHR[] = [];

	status = 200;
	open = vi.fn();
	send = vi.fn();
	private listeners: Record<string, Listener[]> = {};
	upload = {
		addEventListener: (event: string, cb: Listener) => {
			(this.listeners[`upload:${event}`] ??= []).push(cb);
		},
	};

	constructor() {
		MockXHR.instances.push(this);
	}

	addEventListener(event: string, cb: Listener) {
		(this.listeners[event] ??= []).push(cb);
	}

	fireLoad() {
		for (const cb of this.listeners.load ?? []) cb();
	}
	fireError() {
		for (const cb of this.listeners.error ?? []) cb();
	}
	fireAbort() {
		for (const cb of this.listeners.abort ?? []) cb();
	}
	fireProgress(loaded: number, total: number) {
		for (const cb of this.listeners['upload:progress'] ?? []) {
			cb({ lengthComputable: true, loaded, total });
		}
	}

	static latest(): MockXHR {
		const instance = MockXHR.instances.at(-1);
		if (!instance) throw new Error('No XHR instance created yet');
		return instance;
	}
}

function makeFile(name: string, sizeBytes: number, type = 'text/plain'): File {
	return new File([new Uint8Array(sizeBytes)], name, { type });
}

beforeEach(() => {
	MockXHR.instances = [];
	vi.stubGlobal('XMLHttpRequest', MockXHR as unknown as typeof XMLHttpRequest);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('UploadWorkerClient', () => {
	it('posts a status message with the current worker status', () => {
		const postMessage = vi.fn();
		const client = new UploadWorkerClient({ postMessage }, () => WorkerStatus.Busy);

		client.updateStatus([]);

		expect(postMessage).toHaveBeenCalledWith({
			type: 'status',
			uploads: [],
			workerStatus: WorkerStatus.Busy,
		});
	});
});

describe('UploadsWorker', () => {
	function setup(overrides: Partial<ConfigurationOptions> = {}) {
		const postMessage = vi.fn<(message: UploadWorkerResponse) => void>();
		const worker = new UploadsWorker(
			{ uploadURL: '/upload', maxQueueSize: 2, maxConcurrentUploads: 1, ...overrides },
			{ updateStatus: (uploads) => postMessage({ type: 'status', uploads, workerStatus: worker.status }) },
		);
		return { worker, postMessage };
	}

	it('queues files added via addFiles and reports them through updateStatus', () => {
		const { worker, postMessage } = setup();
		worker.addFiles(makeFile('a.txt', 10));

		const lastCall = postMessage.mock.calls.at(-1)?.[0];
		expect(lastCall?.type).toBe('status');
		if (lastCall?.type !== 'status') throw new Error('expected status message');
		expect(lastCall.uploads).toHaveLength(1);
		expect(lastCall.uploads[0].file.name).toBe('a.txt');
	});

	it('accepts a bare UploadInput as well as a raw File', () => {
		const { worker, postMessage } = setup();
		worker.addFiles({ file: makeFile('b.txt', 10), uploadURL: '/custom' });

		const lastCall = postMessage.mock.calls.at(-1)?.[0];
		if (lastCall?.type !== 'status') throw new Error('expected status message');
		expect(lastCall.uploads[0].uploadURL).toBe('/custom');
	});

	it('stops enqueueing once the queue + active size reaches maxQueueSize', () => {
		const { worker, postMessage } = setup({ maxQueueSize: 1 });
		worker.addFiles([makeFile('a.txt', 10), makeFile('b.txt', 10)]);

		const lastCall = postMessage.mock.calls.at(-1)?.[0];
		if (lastCall?.type !== 'status') throw new Error('expected status message');
		expect(lastCall.uploads).toHaveLength(1);
	});

	it('goes idle immediately when nothing is queued', () => {
		const { worker, postMessage } = setup();
		worker.process();

		expect(worker.status).toBe(WorkerStatus.Idle);
		const lastCall = postMessage.mock.calls.at(-1)?.[0];
		if (lastCall?.type !== 'status') throw new Error('expected status message');
		expect(lastCall.workerStatus).toBe(WorkerStatus.Idle);
	});

	it('fails a file over maxFileSize with SizeExceedsLimit and does not hit the network', async () => {
		const { worker, postMessage } = setup({ maxFileSize: 5 });
		worker.addFiles(makeFile('too-big.txt', 100));

		await vi.waitFor(() => {
			const lastCall = postMessage.mock.calls.at(-1)?.[0];
			if (lastCall?.type !== 'status') throw new Error('expected status message');
			expect(lastCall.uploads[0].status).toBe(FileUploadStatus.failed);
		});

		const lastCall = postMessage.mock.calls.at(-1)?.[0];
		if (lastCall?.type !== 'status') throw new Error('expected status message');
		expect(lastCall.uploads[0].error).toBe(UploadError.SizeExceedsLimit);
		expect(MockXHR.instances).toHaveLength(0);
	});

	it('fails a file whose extension/mime is not in the accepted list', async () => {
		const { worker, postMessage } = setup({ accepted: ['image/png'] });
		worker.addFiles(makeFile('doc.txt', 10, 'text/plain'));

		await vi.waitFor(() => {
			const lastCall = postMessage.mock.calls.at(-1)?.[0];
			if (lastCall?.type !== 'status') throw new Error('expected status message');
			expect(lastCall.uploads[0].status).toBe(FileUploadStatus.failed);
		});

		const lastCall = postMessage.mock.calls.at(-1)?.[0];
		if (lastCall?.type !== 'status') throw new Error('expected status message');
		expect(lastCall.uploads[0].error).toBe(UploadError.TypeNotAllowed);
	});

	it('allows a file that matches the accepted list through to the network', async () => {
		const { worker } = setup({ accepted: ['text/plain'] });
		worker.addFiles(makeFile('doc.txt', 10, 'text/plain'));

		await vi.waitFor(() => expect(MockXHR.instances).toHaveLength(1));
		expect(MockXHR.instances[0].open).toHaveBeenCalledWith('POST', '/upload');
	});

	it('marks an upload completed on a successful XHR response and tracks progress', async () => {
		const { worker, postMessage } = setup();
		worker.addFiles(makeFile('ok.txt', 10));

		await vi.waitFor(() => expect(MockXHR.instances).toHaveLength(1));
		const xhr = MockXHR.latest();
		xhr.fireProgress(50, 100);

		await vi.waitFor(() => {
			const lastCall = postMessage.mock.calls.at(-1)?.[0];
			if (lastCall?.type !== 'status') throw new Error('expected status message');
			expect(lastCall.uploads[0].progress).toBe(50);
		});

		xhr.status = 200;
		xhr.fireLoad();

		await vi.waitFor(() => {
			const lastCall = postMessage.mock.calls.at(-1)?.[0];
			if (lastCall?.type !== 'status') throw new Error('expected status message');
			expect(lastCall.uploads[0].status).toBe(FileUploadStatus.completed);
		});
	});

	it.each([
		[400, UploadError.UploadFailed],
		[401, UploadError.NotAuthorized],
		[403, UploadError.AccessForbidden],
		[404, UploadError.UploadURLNotFound],
		[413, UploadError.TooLarge],
		[415, UploadError.MediaNotSupported],
		[500, UploadError.InternalError],
		[599, UploadError.Other],
	])('maps an XHR %i response to %s and marks the upload failed', async (status, expectedError) => {
		const { worker, postMessage } = setup();
		worker.addFiles(makeFile('bad.txt', 10));

		await vi.waitFor(() => expect(MockXHR.instances).toHaveLength(1));
		const xhr = MockXHR.latest();
		xhr.status = status;
		xhr.fireLoad();

		await vi.waitFor(() => {
			const lastCall = postMessage.mock.calls.at(-1)?.[0];
			if (lastCall?.type !== 'status') throw new Error('expected status message');
			expect(lastCall.uploads[0].status).toBe(FileUploadStatus.failed);
		});

		const lastCall = postMessage.mock.calls.at(-1)?.[0];
		if (lastCall?.type !== 'status') throw new Error('expected status message');
		expect(lastCall.uploads[0].error).toBe(expectedError);
	});

	it('marks an upload failed when the XHR fires a network error event', async () => {
		const { worker, postMessage } = setup();
		worker.addFiles(makeFile('err.txt', 10));

		await vi.waitFor(() => expect(MockXHR.instances).toHaveLength(1));
		MockXHR.latest().fireError();

		await vi.waitFor(() => {
			const lastCall = postMessage.mock.calls.at(-1)?.[0];
			if (lastCall?.type !== 'status') throw new Error('expected status message');
			expect(lastCall.uploads[0].status).toBe(FileUploadStatus.failed);
			expect(lastCall.uploads[0].error).toBe(UploadError.UploadFailed);
		});
	});

	it('marks an upload failed when the XHR is aborted', async () => {
		const { worker, postMessage } = setup();
		worker.addFiles(makeFile('abort.txt', 10));

		await vi.waitFor(() => expect(MockXHR.instances).toHaveLength(1));
		MockXHR.latest().fireAbort();

		await vi.waitFor(() => {
			const lastCall = postMessage.mock.calls.at(-1)?.[0];
			if (lastCall?.type !== 'status') throw new Error('expected status message');
			expect(lastCall.uploads[0].status).toBe(FileUploadStatus.failed);
			expect(lastCall.uploads[0].error).toBe(UploadError.UploadFailed);
		});
	});

	it('processes queued files one at a time up to maxConcurrentUploads', async () => {
		const { worker } = setup({ maxQueueSize: 5, maxConcurrentUploads: 1 });
		worker.addFiles([makeFile('a.txt', 10), makeFile('b.txt', 10)]);

		await vi.waitFor(() => expect(MockXHR.instances).toHaveLength(1));
		// second file should not have started yet since maxConcurrentUploads is 1
		expect(MockXHR.instances).toHaveLength(1);

		MockXHR.latest().fireLoad();

		await vi.waitFor(() => expect(MockXHR.instances).toHaveLength(2));
	});

	it('clearUploads() empties every internal map and notifies idle', async () => {
		const { worker, postMessage } = setup();
		worker.addFiles(makeFile('a.txt', 10));
		await vi.waitFor(() => expect(MockXHR.instances).toHaveLength(1));

		worker.clearUploads();

		const lastCall = postMessage.mock.calls.at(-1)?.[0];
		if (lastCall?.type !== 'status') throw new Error('expected status message');
		expect(lastCall.uploads).toHaveLength(0);
	});
});

describe('registerUploadsWorker / UploadsWorkerRuntime', () => {
	function makeTarget() {
		return {
			onmessage: null as ((event: MessageEvent) => void) | null,
			postMessage: vi.fn(),
		};
	}

	it('wires onmessage on the target when constructed', () => {
		const target = makeTarget();
		registerUploadsWorker(target);
		expect(target.onmessage).toBeInstanceOf(Function);
	});

	it('reports an error when add-files arrives before initialize', () => {
		const target = makeTarget();
		registerUploadsWorker(target);

		target.onmessage?.({ data: { type: 'add-files', files: [] } } as MessageEvent);

		expect(target.postMessage).toHaveBeenCalledWith({
			type: 'error',
			message: 'Uploads worker has not been initialized.',
		});
	});

	it('reports an error when clear-uploads arrives before initialize', () => {
		const target = makeTarget();
		registerUploadsWorker(target);

		target.onmessage?.({ data: { type: 'clear-uploads' } } as MessageEvent);

		expect(target.postMessage).toHaveBeenCalledWith({
			type: 'error',
			message: 'Uploads worker has not been initialized.',
		});
	});

	it('initializes an UploadsWorker and forwards add-files/clear-uploads to it', async () => {
		const target = makeTarget();
		registerUploadsWorker(target);

		target.onmessage?.({
			data: { type: 'initialize', options: { uploadURL: '/upload' } },
		} as MessageEvent);
		target.onmessage?.({
			data: { type: 'add-files', files: [{ file: makeFile('a.txt', 10) }] },
		} as MessageEvent);

		await vi.waitFor(() => {
			const statusCall = target.postMessage.mock.calls
				.map((call) => call[0])
				.findLast((message) => message.type === 'status');
			expect(statusCall?.uploads).toHaveLength(1);
		});

		target.onmessage?.({ data: { type: 'clear-uploads' } } as MessageEvent);

		const lastStatus = target.postMessage.mock.calls.map((call) => call[0]).findLast((m) => m.type === 'status');
		expect(lastStatus?.uploads).toHaveLength(0);
	});
});
