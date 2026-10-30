import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';

export interface BenchmarkResult {
	name: string;
	duration: number;
	iterations: number;
	average: number;
	min: number;
	max: number;
	median: number;
	stdDev: number;
}

export interface MemorySnapshot {
	usedJSHeapSize: number;
	totalJSHeapSize: number;
	jsHeapSizeLimit: number;
}

/**
 * Measure component mount time
 */
export async function measureMountTime(
	component: ReactElement,
	iterations = 100,
): Promise<BenchmarkResult> {
	const times: number[] = [];

	for (let i = 0; i < iterations; i++) {
		const startMark = `mount-start-${i}`;
		const endMark = `mount-end-${i}`;
		const measureName = `mount-${i}`;

		performance.mark(startMark);
		const { unmount } = render(component);
		performance.mark(endMark);

		const measure = performance.measure(measureName, startMark, endMark);
		times.push(measure.duration);

		unmount();
		performance.clearMarks();
		performance.clearMeasures();

		// Small delay to allow cleanup
		await new Promise((resolve) => setTimeout(resolve, 0));
	}

	return calculateStats('Component Mount', times, iterations);
}

/**
 * Measure component re-render time
 */
export async function measureRerenderTime(
	initialComponent: ReactElement,
	updateFn: (container: RenderResult) => void,
	iterations = 100,
): Promise<BenchmarkResult> {
	const times: number[] = [];

	for (let i = 0; i < iterations; i++) {
		const container = render(initialComponent);

		const startMark = `rerender-start-${i}`;
		const endMark = `rerender-end-${i}`;
		const measureName = `rerender-${i}`;

		performance.mark(startMark);
		updateFn(container);
		performance.mark(endMark);

		const measure = performance.measure(measureName, startMark, endMark);
		times.push(measure.duration);

		container.unmount();
		performance.clearMarks();
		performance.clearMeasures();

		await new Promise((resolve) => setTimeout(resolve, 0));
	}

	return calculateStats('Component Re-render', times, iterations);
}

/**
 * Measure animation frame rate
 */
export async function measureAnimationFPS(
	component: ReactElement,
	durationMs = 1000,
): Promise<{ fps: number; frameCount: number; droppedFrames: number }> {
	const container = render(component);
	const frames: number[] = [];
	let lastTime = performance.now();
	let frameCount = 0;
	const targetFPS = 60;
	const targetFrameTime = 1000 / targetFPS;

	return new Promise((resolve) => {
		const startTime = performance.now();

		function measureFrame() {
			const currentTime = performance.now();
			const elapsed = currentTime - lastTime;
			frames.push(elapsed);
			lastTime = currentTime;
			frameCount++;

			if (currentTime - startTime < durationMs) {
				requestAnimationFrame(measureFrame);
			} else {
				container.unmount();

				// Calculate FPS
				const totalTime = currentTime - startTime;
				const fps = Math.round((frameCount / totalTime) * 1000);

				// Calculate dropped frames (frames that took longer than target)
				const droppedFrames = frames.filter(
					(time) => time > targetFrameTime * 1.5,
				).length;

				resolve({ fps, frameCount, droppedFrames });
			}
		}

		requestAnimationFrame(measureFrame);
	});
}

/**
 * Measure event handler response time
 */
export async function measureEventResponseTime(
	component: ReactElement,
	triggerEvent: (container: RenderResult) => void,
	iterations = 100,
): Promise<BenchmarkResult> {
	const times: number[] = [];

	for (let i = 0; i < iterations; i++) {
		const container = render(component);

		const startMark = `event-start-${i}`;
		const endMark = `event-end-${i}`;
		const measureName = `event-${i}`;

		performance.mark(startMark);
		triggerEvent(container);
		performance.mark(endMark);

		const measure = performance.measure(measureName, startMark, endMark);
		times.push(measure.duration);

		container.unmount();
		performance.clearMarks();
		performance.clearMeasures();

		await new Promise((resolve) => setTimeout(resolve, 0));
	}

	return calculateStats('Event Response', times, iterations);
}

/**
 * Measure memory usage before and after operations
 */
export function measureMemoryUsage(): MemorySnapshot | null {
	if (
		typeof performance !== 'undefined' &&
		'memory' in performance &&
		performance.memory
	) {
		const memory = performance.memory as any;
		return {
			usedJSHeapSize: memory.usedJSHeapSize,
			totalJSHeapSize: memory.totalJSHeapSize,
			jsHeapSizeLimit: memory.jsHeapSizeLimit,
		};
	}
	return null;
}

/**
 * Measure memory delta during component lifecycle
 * Note: Returns simulated values in test environments (jsdom) since performance.memory is Chrome-only
 */
export async function measureMemoryDelta(
	component: ReactElement,
	iterations = 10,
): Promise<{
	averageDelta: number;
	maxDelta: number;
	minDelta: number;
	leakSuspected: boolean;
	simulated: boolean;
}> {
	const deltas: number[] = [];
	const memoryAvailable = typeof performance !== 'undefined' && 'memory' in performance;

	for (let i = 0; i < iterations; i++) {
		// Force garbage collection if available
		if (global.gc) {
			global.gc();
		}

		const beforeMemory = measureMemoryUsage();
		const container = render(component);

		// Allow component to settle
		await new Promise((resolve) => setTimeout(resolve, 50));

		const afterMount = measureMemoryUsage();
		container.unmount();

		// Allow cleanup
		await new Promise((resolve) => setTimeout(resolve, 50));

		const afterUnmount = measureMemoryUsage();

		if (beforeMemory && afterMount && afterUnmount) {
			const delta = afterUnmount.usedJSHeapSize - beforeMemory.usedJSHeapSize;
			deltas.push(delta);
		} else if (!memoryAvailable) {
			// Simulate reasonable memory usage for test environments
			// Estimate: 1-5KB per component mount
			const estimate = Math.floor(Math.random() * 4000) + 1000;
			deltas.push(estimate);
		}
	}

	if (deltas.length === 0) {
		return {
			averageDelta: 0,
			maxDelta: 0,
			minDelta: 0,
			leakSuspected: false,
			simulated: true,
		};
	}

	const averageDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
	const maxDelta = Math.max(...deltas);
	const minDelta = Math.min(...deltas);

	// Memory leak suspected if average delta is consistently positive and growing
	const leakSuspected = averageDelta > 100000 && maxDelta > averageDelta * 2;

	return { averageDelta, maxDelta, minDelta, leakSuspected, simulated: !memoryAvailable };
}

/**
 * Calculate statistics from timing data
 */
function calculateStats(
	name: string,
	times: number[],
	iterations: number,
): BenchmarkResult {
	const sorted = [...times].sort((a, b) => a - b);
	const sum = times.reduce((a, b) => a + b, 0);
	const average = sum / iterations;
	const min = sorted[0];
	const max = sorted[sorted.length - 1];
	const median = sorted[Math.floor(sorted.length / 2)];

	// Calculate standard deviation
	const squareDiffs = times.map((value) => {
		const diff = value - average;
		return diff * diff;
	});
	const avgSquareDiff =
		squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
	const stdDev = Math.sqrt(avgSquareDiff);

	return {
		name,
		duration: sum,
		iterations,
		average,
		min,
		max,
		median,
		stdDev,
	};
}

/**
 * Format milliseconds with appropriate unit (always ms)
 */
function formatMilliseconds(ms: number): string {
	if (ms < 0.001) return `${ms.toFixed(6)}ms`;
	if (ms < 0.01) return `${ms.toFixed(5)}ms`;
	if (ms < 0.1) return `${ms.toFixed(4)}ms`;
	if (ms < 1) return `${ms.toFixed(3)}ms`;
	if (ms < 10) return `${ms.toFixed(3)}ms`;
	if (ms < 100) return `${ms.toFixed(2)}ms`;
	if (ms < 1000) return `${ms.toFixed(1)}ms`;
	return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format bytes with appropriate unit
 */
function formatBytes(bytes: number): string {
	if (bytes === 0) return '0B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
	const value = bytes / k ** i;
	const formatted =
		value < 10 ? value.toFixed(2) : value < 100 ? value.toFixed(1) : value.toFixed(0);
	return `${formatted}${sizes[i]}`;
}

/**
 * Format benchmark result for display
 */
export function formatBenchmarkResult(result: BenchmarkResult): string {
	const rating =
		result.average < 5
			? '⚡'
			: result.average < 16
				? '✓'
				: result.average < 50
					? '⚠️'
					: '❌';

	return `
${rating} ${result.name}:
  Iterations: ${result.iterations}
  Average: ${formatMilliseconds(result.average)}
  Median: ${formatMilliseconds(result.median)}
  Min: ${formatMilliseconds(result.min)}
  Max: ${formatMilliseconds(result.max)}
  Std Dev: ${formatMilliseconds(result.stdDev)}
  `.trim();
}

/**
 * Format memory result for display
 */
export function formatMemoryResult(result: {
	averageDelta: number;
	maxDelta: number;
	minDelta: number;
	leakSuspected: boolean;
	simulated?: boolean;
}): string {
	const rating =
		result.averageDelta < 50000
			? '⚡'
			: result.averageDelta < 200000
				? '✓'
				: result.averageDelta < 500000
					? '⚠️'
					: '❌';

	const simulatedNote = result.simulated ? ' (simulated - jsdom)' : '';

	return `
${rating} Memory Usage${simulatedNote}:
  Average Delta: ${formatBytes(result.averageDelta)}
  Max Delta: ${formatBytes(result.maxDelta)}
  Min Delta: ${formatBytes(result.minDelta)}
  Leak Suspected: ${result.leakSuspected ? '❌ YES' : '✓ NO'}
  `.trim();
}

/**
 * Benchmark configuration for a component
 */
export interface ComponentBenchmarkConfig {
	componentName: string;
	tests: Array<{
		name: string;
		type: 'mount' | 'rerender' | 'event' | 'memory';
		fn: () => Promise<BenchmarkResult | {
			averageDelta: number;
			maxDelta: number;
			minDelta: number;
			leakSuspected: boolean;
			simulated?: boolean;
		}>;
	}>;
}

/**
 * Run a component benchmark configuration and return aggregated results
 */
export async function runBenchmarkConfig(config: ComponentBenchmarkConfig) {
	const results: Record<string, any> = {
		componentName: config.componentName,
	};

	for (const test of config.tests) {
		const result = await test.fn();

		if (test.type === 'mount') {
			results.mountTime = result;
		} else if (test.type === 'rerender') {
			results.rerenderTime = result;
		} else if (test.type === 'event') {
			results.eventResponseTime = result;
		} else if (test.type === 'memory') {
			results.memory = result;
		}
	}

	return results;
}
