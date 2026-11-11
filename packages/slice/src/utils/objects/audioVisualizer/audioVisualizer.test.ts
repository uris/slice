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
	suspend = vi.fn().mockResolvedValue(undefined);
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

describe('AudioVisualizer resilience', () => {
 it('reuses the graph and resets intensity when stopped and restarted', () => {
  const visualizer = new AudioVisualizer(new MockMediaStream() as unknown as MediaStream);
  visualizer.start(); MockAudioContext.instances[0].analyser.sampleValue = 255; runNextFrame(500);
  expect(visualizer.getIntensity()).toBeGreaterThan(0);
  visualizer.stop(); expect(visualizer.getIntensity()).toBe(0);
  visualizer.start(); expect(MockAudioContext.instances).toHaveLength(1);
  expect(MockAudioContext.instances[0].resume).toHaveBeenCalledTimes(2);
 });
 it('normalizes invalid settings and keeps reported values finite', () => {
  const update = vi.fn();
  const visualizer = new AudioVisualizer(new MockMediaStream() as unknown as MediaStream, {
   fftSize: 7, intensityMultiplier: Number.NaN, peakIntensity: 0, risePerSecond: -1, releasePerSecond: Infinity,
   minScale: -1, maxScale: Number.NaN, onUpdate: update,
  });
  visualizer.start(); expect(MockAudioContext.instances[0].analyser.fftSize).toBe(32);
  MockAudioContext.instances[0].analyser.sampleValue = 255; runNextFrame(500);
  expect(visualizer.getIntensity()).toBe(1); expect(Number.isFinite(visualizer.getScale())).toBe(true);
  MockAudioContext.instances[0].analyser.sampleValue = 128; runNextFrame(1500);
  expect(visualizer.getIntensity()).toBe(0);
 });
 it('cleans up a partially constructed graph on startup failure', () => {
  vi.spyOn(MockAudioContext.prototype, 'createMediaStreamSource').mockImplementation(() => { throw new Error('No audio'); });
  const visualizer = new AudioVisualizer(new MockMediaStream() as unknown as MediaStream);
  expect(() => visualizer.start()).toThrow('No audio');
  expect(MockAudioContext.instances[0].close).toHaveBeenCalled(); expect(frameCallbacks.filter(Boolean)).toHaveLength(0);
 });
 it('handles resume rejection without leaving an animation loop running', async () => {
  const error = new Error('Blocked'); const onError = vi.fn(); const onUpdate = vi.fn();
  const visualizer = new AudioVisualizer(new MockMediaStream() as unknown as MediaStream, { onError, onUpdate });
  visualizer.start(); visualizer.stop(); MockAudioContext.instances[0].resume.mockRejectedValue(error);
  visualizer.start(); await Promise.resolve();
  expect(onError).toHaveBeenCalledWith(error); expect(onUpdate).toHaveBeenCalledWith({ intensity: 0, scale: 1 });
  expect(frameCallbacks.filter(Boolean)).toHaveLength(0);
 });
 it('ignores an old resume failure after disposal', async () => {
  const onError = vi.fn(); let reject!: (reason: Error) => void;
  const visualizer = new AudioVisualizer(new MockMediaStream() as unknown as MediaStream, { onError });
  visualizer.start(); visualizer.stop();
  MockAudioContext.instances[0].resume.mockReturnValue(new Promise((_resolve, fail) => { reject = fail; }));
  visualizer.start(); visualizer.dispose(); reject(new Error('Late')); await Promise.resolve();
  expect(onError).not.toHaveBeenCalled();
 });
});

it('does not schedule another frame if its update callback disposes it', () => {
 const visualizer = new AudioVisualizer(new MockMediaStream() as unknown as MediaStream, { onUpdate: () => visualizer.dispose() });
 visualizer.start(); runNextFrame(16); expect(frameCallbacks.filter(Boolean)).toHaveLength(0);
});
it('does not let an earlier resume rejection stop a later run', async () => {
 let reject!: (reason: Error) => void;
 const visualizer = new AudioVisualizer(new MockMediaStream() as unknown as MediaStream);
 visualizer.start(); visualizer.stop();
 MockAudioContext.instances[0].resume.mockReturnValueOnce(new Promise((_resolve, fail) => { reject = fail; }));
 visualizer.start(); visualizer.stop(); visualizer.start(); reject(new Error('Old resume')); await Promise.resolve();
 expect(frameCallbacks.filter(Boolean)).toHaveLength(1);
});
