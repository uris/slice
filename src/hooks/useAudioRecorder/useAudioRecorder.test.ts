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
