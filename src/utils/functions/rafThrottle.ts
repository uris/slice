export interface RafThrottledFunction<T extends (...args: any[]) => void> {
	(...args: Parameters<T>): void;
	cancel: () => void;
}

/**
 * Coalesce rapid calls (scroll, pointermove, resize) down to at most one
 * invocation per animation frame, always using the most recently passed
 * arguments. Unlike `debounce`, this never waits for activity to stop - the
 * first call in a frame schedules the frame, every call after that until the
 * frame fires just updates the pending args, and dropped intermediate calls
 * never run at all.
 */
export function rafThrottle<T extends (...args: any[]) => void>(func: T): RafThrottledFunction<T> {
	let frameId: number | null = null;
	let lastArgs: Parameters<T> | null = null;

	const throttled = function (this: any, ...args: Parameters<T>) {
		lastArgs = args;

		if (frameId !== null) return;

		frameId = requestAnimationFrame(() => {
			frameId = null;
			const argsToApply = lastArgs;
			lastArgs = null;
			if (argsToApply) func.apply(this, argsToApply);
		});
	} as RafThrottledFunction<T>;

	throttled.cancel = () => {
		if (frameId !== null) {
			cancelAnimationFrame(frameId);
			frameId = null;
		}
		lastArgs = null;
	};

	return throttled;
}
