export interface DebouncedFunction<T extends (...args: any[]) => any> {
	(...args: Parameters<T>): void;
	cancel: () => void;
	flush: () => void;
}

/**
 * Delay a function call until activity stops, with cancel and flush helpers.
 */
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): DebouncedFunction<T> {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	let lastArgs: Parameters<T> | null = null;

	const debounced = function (this: any, ...args: Parameters<T>) {
		lastArgs = args;

		if (timeoutId !== null) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			func.apply(this, lastArgs ?? []);
			timeoutId = null;
			lastArgs = null;
		}, delay);
	} as DebouncedFunction<T>;

	debounced.cancel = () => {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
			timeoutId = null;
			lastArgs = null;
		}
	};

	debounced.flush = function (this: any) {
		if (timeoutId !== null && lastArgs !== null) {
			clearTimeout(timeoutId);
			func.apply(this, lastArgs);
			timeoutId = null;
			lastArgs = null;
		}
	};

	return debounced;
}
