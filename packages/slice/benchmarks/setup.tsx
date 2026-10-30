import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock motion/react for performance testing
// This prevents animation overhead from skewing results
vi.mock('motion/react', async () => {
	const actual = await vi.importActual('motion/react');
	return {
		...actual,
		motion: new Proxy(
			{},
			{
				get: (_target, prop: string) => {
					// Return a basic div wrapper for motion components
					const Component = ({ children, ...props }: any) => {
						return <div {...props}>{children}</div>;
					};
					Component.displayName = `motion.${prop}`;
					return Component;
				},
			},
		),
	};
});

// Disable render debug hook during benchmarks so timings focus on component behavior.
vi.mock('../src/hooks/useTrackRenders', () => ({
	useTrackRenders: () => {},
}));

// Setup global performance marks
global.performance.mark = global.performance.mark || (() => {});
global.performance.measure =
	global.performance.measure ||
	(() => ({ duration: 0, name: '', entryType: 'measure', startTime: 0 }));
global.performance.clearMarks = global.performance.clearMarks || (() => {});
global.performance.clearMeasures =
	global.performance.clearMeasures || (() => {});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
	constructor() {}
	disconnect() {}
	observe() {}
	takeRecords() {
		return [];
	}
	unobserve() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
	constructor() {}
	disconnect() {}
	observe() {}
	unobserve() {}
} as any;

// Mock matchMedia for theme-aware components/hooks in jsdom.
if (!globalThis.matchMedia) {
	globalThis.matchMedia = ((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: () => {},
		removeEventListener: () => {},
		addListener: () => {},
		removeListener: () => {},
		dispatchEvent: () => false,
	})) as typeof globalThis.matchMedia;
}

// Mock media element methods used by Audio/Video benchmarks in jsdom.
if (typeof HTMLMediaElement !== 'undefined') {
	Object.defineProperty(HTMLMediaElement.prototype, 'play', {
		configurable: true,
		writable: true,
		value: vi.fn().mockResolvedValue(undefined),
	});

	Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
		configurable: true,
		writable: true,
		value: vi.fn(),
	});
}

// Mock fullscreen APIs used by media components in jsdom.
if (typeof HTMLElement !== 'undefined') {
	Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
		configurable: true,
		writable: true,
		value: vi.fn().mockResolvedValue(undefined),
	});
}

if (!document.exitFullscreen) {
	Object.defineProperty(document, 'exitFullscreen', {
		configurable: true,
		writable: true,
		value: vi.fn().mockResolvedValue(undefined),
	});
}
