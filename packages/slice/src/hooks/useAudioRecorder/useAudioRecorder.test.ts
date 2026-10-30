import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAudioRecorder } from './useAudioRecorder';

class MockMediaStreamTrack {
	kind = 'audio';
}

class MockMediaStream {
	tracks: MockMediaStreamTrack[];
	constructor(tracks: MockMediaStreamTrack[] = []) {
		this.tracks = tracks;
	}
	getTracks() {
		return this.tracks;
	}
}

class MockMediaRecorder {
	static supportedTypes = ['audio/webm;codecs=opus'];
	static isTypeSupported(type: string) {
		return MockMediaRecorder.supportedTypes.includes(type);
	}
	static instances: MockMediaRecorder[] = [];

	state: 'inactive' | 'recording' | 'paused' = 'inactive';
	mimeType: string;
	ondataavailable: ((event: BlobEvent) => void) | null = null;
	onerror: (() => void) | null = null;
	onstop: (() => void) | null = null;

	constructor(
		public stream: MockMediaStream,
		options?: { mimeType?: string },
	) {
		this.mimeType = options?.mimeType ?? '';
		MockMediaRecorder.instances.push(this);
	}

	start(_timeslice?: number) {
		this.state = 'recording';
	}

	stop() {
		this.state = 'inactive';
		this.onstop?.();
	}

	emitData(size: number) {
		this.ondataavailable?.({ data: { size } } as unknown as BlobEvent);
	}
}

beforeEach(() => {
	MockMediaRecorder.instances = [];
	MockMediaRecorder.supportedTypes = ['audio/webm;codecs=opus'];
	vi.stubGlobal('MediaRecorder', MockMediaRecorder);
	vi.stubGlobal('MediaStream', MockMediaStream);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('useAudioRecorder', () => {
	it('startRecording() creates and starts a MediaRecorder with a supported mime type', () => {
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const { result } = renderHook(() =>
			useAudioRecorder(stream as unknown as MediaStream),
		);

		act(() => {
			result.current.startRecording();
		});

		expect(result.current.isRecording).toBe(true);
		expect(result.current.mimeType).toBe('audio/webm;codecs=opus');
		expect(MockMediaRecorder.instances).toHaveLength(1);
		expect(MockMediaRecorder.instances[0].state).toBe('recording');
	});

	it('startRecording() is a no-op when already recording', () => {
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const { result } = renderHook(() =>
			useAudioRecorder(stream as unknown as MediaStream),
		);

		act(() => {
			result.current.startRecording();
			result.current.startRecording();
		});

		expect(MockMediaRecorder.instances).toHaveLength(1);
	});

	it('startRecording() sets an error when there is no stream', () => {
		const { result } = renderHook(() => useAudioRecorder(null));

		act(() => {
			result.current.startRecording();
		});

		expect(result.current.isRecording).toBe(false);
		expect(result.current.error?.message).toBe(
			'No audio stream or track provided',
		);
	});

	it('startRecording() sets an error when MediaRecorder is unsupported', () => {
		vi.stubGlobal('MediaRecorder', undefined);
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const { result } = renderHook(() =>
			useAudioRecorder(stream as unknown as MediaStream),
		);

		act(() => {
			result.current.startRecording();
		});

		expect(result.current.error?.message).toBe(
			'MediaRecorder is not supported in this browser',
		);
	});

	it('startRecording() sets an error when MediaStream is unsupported, even with a valid track', () => {
		// resolveAudioSource() returns the track as-is (a truthy source), so this
		// exercises toMediaStream()'s own `typeof MediaStream === 'undefined'`
		// check rather than the earlier `!source` guard.
		vi.stubGlobal('MediaStream', undefined);
		const track = new MockMediaStreamTrack();
		const { result } = renderHook(() =>
			useAudioRecorder(track as unknown as MediaStreamTrack),
		);

		act(() => {
			result.current.startRecording();
		});

		expect(result.current.error?.message).toBe(
			'No audio stream or track provided',
		);
	});

	it('accepts a RefObject source and resolves the track into a MediaStream', () => {
		const track = new MockMediaStreamTrack();
		const ref = { current: track };
		const { result } = renderHook(() =>
			useAudioRecorder(ref as unknown as React.RefObject<MediaStreamTrack>),
		);

		act(() => {
			result.current.startRecording();
		});

		expect(result.current.isRecording).toBe(true);
	});

	it('accumulates chunk sizes as data becomes available', () => {
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const { result } = renderHook(() =>
			useAudioRecorder(stream as unknown as MediaStream),
		);

		act(() => {
			result.current.startRecording();
		});
		act(() => {
			MockMediaRecorder.instances[0].emitData(1024 * 1024);
		});

		expect(result.current.recordingSizeMb).toBeCloseTo(1, 5);
	});

	it('ignores empty data-available events instead of accumulating them', () => {
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const { result } = renderHook(() =>
			useAudioRecorder(stream as unknown as MediaStream),
		);

		act(() => {
			result.current.startRecording();
		});
		act(() => {
			MockMediaRecorder.instances[0].emitData(0);
		});

		expect(result.current.recordingSizeMb).toBe(0);
	});

	it('falls back to no mime type and a default blob type when nothing is supported', async () => {
		MockMediaRecorder.supportedTypes = [];

		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const { result } = renderHook(() =>
			useAudioRecorder(stream as unknown as MediaStream),
		);

		act(() => {
			result.current.startRecording();
		});

		// nextMimeType is null, so the MediaRecorder is constructed without a
		// mimeType option (the ternary's false branch), leaving the instance's
		// own mimeType empty.
		expect(result.current.mimeType).toBeNull();
		expect(MockMediaRecorder.instances[0].mimeType).toBe('');

		let blob: Blob | null = null;
		await act(async () => {
			blob = await result.current.stopRecording();
		});

		// mediaRecorder.mimeType || nextMimeType || 'audio/webm' - both of the
		// first two are falsy here, so the blob type falls all the way through
		// to the final default.
		const finalBlob = blob as Blob | null;
		expect(finalBlob).not.toBeNull();
		expect(finalBlob?.type).toBe('audio/webm');
	});

	it('startRecording() wraps a non-Error thrown value as an Unknown error', () => {
		class ThrowingMediaRecorder {
			static isTypeSupported() {
				return false;
			}
			constructor() {
				throw 'native failure';
			}
		}
		vi.stubGlobal('MediaRecorder', ThrowingMediaRecorder);

		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const { result } = renderHook(() =>
			useAudioRecorder(stream as unknown as MediaStream),
		);

		act(() => {
			result.current.startRecording();
		});

		expect(result.current.error?.message).toBe('Unknown error');
		expect(result.current.isRecording).toBe(false);
	});

	it('stopRecording() resolves with the recorded blob and clears isRecording', async () => {
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const { result } = renderHook(() =>
			useAudioRecorder(stream as unknown as MediaStream),
		);

		act(() => {
			result.current.startRecording();
		});

		let blob: Blob | null = null;
		await act(async () => {
			blob = await result.current.stopRecording();
		});

		expect(blob).not.toBeNull();
		expect(result.current.isRecording).toBe(false);
	});

	it('stopRecording() with nothing recording resolves the current blob without throwing', async () => {
		const { result } = renderHook(() => useAudioRecorder(null));

		let blob: Blob | null | undefined;
		await act(async () => {
			blob = await result.current.stopRecording();
		});

		expect(blob).toBeNull();
	});

	it('stopRecording() sets the thrown Error when checking the recorder state fails', async () => {
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const { result } = renderHook(() =>
			useAudioRecorder(stream as unknown as MediaStream),
		);

		act(() => {
			result.current.startRecording();
		});

		// Redefine `state` as an accessor that throws, so reading it inside
		// stopRecording's own try block (before the Promise is ever created)
		// exercises that catch's `error instanceof Error` true branch.
		Object.defineProperty(MockMediaRecorder.instances[0], 'state', {
			configurable: true,
			get() {
				throw new Error('state check failed');
			},
		});

		let blob: Blob | null | undefined;
		await act(async () => {
			blob = await result.current.stopRecording();
		});

		expect(blob).toBeNull();
		expect(result.current.error?.message).toBe('state check failed');
		expect(result.current.isRecording).toBe(false);

		// Restore a plain, non-throwing state before the hook unmounts, since
		// the unmount cleanup effect also reads `.state` with no try/catch.
		Object.defineProperty(MockMediaRecorder.instances[0], 'state', {
			configurable: true,
			writable: true,
			value: 'inactive',
		});
	});

	it('stopRecording() wraps a non-Error thrown value as an Unknown error', async () => {
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const { result } = renderHook(() =>
			useAudioRecorder(stream as unknown as MediaStream),
		);

		act(() => {
			result.current.startRecording();
		});

		Object.defineProperty(MockMediaRecorder.instances[0], 'state', {
			configurable: true,
			get() {
				throw 'native failure';
			},
		});

		let blob: Blob | null | undefined;
		await act(async () => {
			blob = await result.current.stopRecording();
		});

		expect(blob).toBeNull();
		expect(result.current.error?.message).toBe('Unknown error');

		// Restore a plain, non-throwing state before the hook unmounts, since
		// the unmount cleanup effect also reads `.state` with no try/catch.
		Object.defineProperty(MockMediaRecorder.instances[0], 'state', {
			configurable: true,
			writable: true,
			value: 'inactive',
		});
	});

	it('resetRecording() clears the blob, size, and error', () => {
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const { result } = renderHook(() =>
			useAudioRecorder(stream as unknown as MediaStream),
		);

		act(() => {
			result.current.startRecording();
			MockMediaRecorder.instances[0].emitData(1024);
		});
		act(() => {
			result.current.resetRecording();
		});

		expect(result.current.recordingSizeMb).toBe(0);
		expect(result.current.error).toBeNull();
	});
});
