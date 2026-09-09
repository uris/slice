import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioVisualizer } from './audioVisualizer';

class MockMediaStreamTrack {}

class MockMediaStream {
	constructor(public tracks: MockMediaStreamTrack[] = []) {}
}

class MockAnalyserNode {
	fftSize = 2048;
	connect = vi.fn();
	disconnect = vi.fn();
	// filled in per-test to control the simulated waveform
	sampleValue = 128;

	getByteTimeDomainData(array: Uint8Array) {
		array.fill(this.sampleValue);
	}
}

class MockSourceNode {
	connect = vi.fn();
	disconnect = vi.fn();
}

class MockAudioContext {
	static instances: MockAudioContext[] = [];
	analyser = new MockAnalyserNode();
	sourceNode = new MockSourceNode();
	resume = vi.fn().mockResolvedValue(undefined);
	close = vi.fn().mockResolvedValue(undefined);

	constructor() {
		MockAudioContext.instances.push(this);
	}

	createAnalyser() {
		return this.analyser;
	}

	createMediaStreamSource(_stream: MockMediaStream) {
		return this.sourceNode;
	}
}

let frameCallbacks: FrameRequestCallback[];
let nextFrameId: number;
let cancelledFrames: number[];
let now: number;

beforeEach(() => {
	frameCallbacks = [];
	nextFrameId = 1;
	cancelledFrames = [];
	now = 0;
	MockAudioContext.instances = [];

	vi.stubGlobal('AudioContext', MockAudioContext);
	vi.stubGlobal('MediaStream', MockMediaStream);
	vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
		const id = nextFrameId++;
		frameCallbacks[id] = cb;
		return id;
	});
	vi.stubGlobal('cancelAnimationFrame', (id: number) => {
		cancelledFrames.push(id);
		delete frameCallbacks[id];
	});
	vi.spyOn(performance, 'now').mockImplementation(() => now);
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

function runNextFrame(atTime: number) {
	now = atTime;
	const id = frameCallbacks.findIndex((cb) => cb !== undefined);
	const cb = frameCallbacks[id];
	delete frameCallbacks[id];
	cb?.(atTime);
}

describe('AudioVisualizer', () => {
	it('start() wires up the AudioContext graph and schedules the first frame', () => {
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const visualizer = new AudioVisualizer(stream as unknown as MediaStream);

		visualizer.start();

		const context = MockAudioContext.instances[0];
		expect(context.resume).toHaveBeenCalled();
		expect(context.sourceNode.connect).toHaveBeenCalledWith(context.analyser);
		expect(frameCallbacks.filter(Boolean)).toHaveLength(1);
	});

	it('start() is idempotent while already running', () => {
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const visualizer = new AudioVisualizer(stream as unknown as MediaStream);

		visualizer.start();
		visualizer.start();

		expect(MockAudioContext.instances).toHaveLength(1);
	});

	it('start() throws when AudioContext is unsupported', () => {
		vi.stubGlobal('AudioContext', undefined);
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const visualizer = new AudioVisualizer(stream as unknown as MediaStream);

		expect(() => visualizer.start()).toThrow(
			'AudioVisualizer requires a browser AudioContext',
		);
	});

	it('wraps a bare MediaStreamTrack into a MediaStream', () => {
		const track = new MockMediaStreamTrack();
		const visualizer = new AudioVisualizer(
			track as unknown as MediaStreamTrack,
		);

		expect(() => visualizer.start()).not.toThrow();
	});

	it('rises intensity toward a loud signal and reports it via onUpdate', () => {
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const onUpdate = vi.fn();
		const visualizer = new AudioVisualizer(stream as unknown as MediaStream, {
			onUpdate,
			risePerSecond: 10,
			peakIntensity: 0.2,
		});

		visualizer.start();
		const context = MockAudioContext.instances[0];
		context.analyser.sampleValue = 220; // loud signal, far from the 128 midpoint

		runNextFrame(500); // 500ms after start (lastFrameTime was 0)

		expect(visualizer.getIntensity()).toBeGreaterThan(0);
		expect(onUpdate).toHaveBeenCalledWith(
			expect.objectContaining({ intensity: visualizer.getIntensity() }),
		);
		expect(visualizer.getScale()).toBeGreaterThan(1);
	});

	it('schedules the next frame after each frame runs', () => {
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const visualizer = new AudioVisualizer(stream as unknown as MediaStream);
		visualizer.start();

		runNextFrame(16);

		expect(frameCallbacks.filter(Boolean)).toHaveLength(1);
	});

	it('stop() cancels the scheduled frame', () => {
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const visualizer = new AudioVisualizer(stream as unknown as MediaStream);
		visualizer.start();

		visualizer.stop();

		expect(cancelledFrames).toHaveLength(1);
		expect(frameCallbacks.filter(Boolean)).toHaveLength(0);
	});

	it('dispose() disconnects nodes, closes the context, and resets intensity', () => {
		const stream = new MockMediaStream([new MockMediaStreamTrack()]);
		const visualizer = new AudioVisualizer(stream as unknown as MediaStream);
		visualizer.start();
		const context = MockAudioContext.instances[0];

		visualizer.dispose();

		expect(context.sourceNode.disconnect).toHaveBeenCalled();
		expect(context.analyser.disconnect).toHaveBeenCalled();
		expect(context.close).toHaveBeenCalled();
		expect(visualizer.getIntensity()).toBe(0);
	});
});
