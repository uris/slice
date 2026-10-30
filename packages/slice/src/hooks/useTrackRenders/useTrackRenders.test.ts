import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useTrackRenders } from './useTrackRenders';

const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
	process.env.NODE_ENV = originalNodeEnv;
});

describe('useTrackRenders', () => {
	it('mounts, rerenders, and unmounts without throwing when debug() short-circuits under NODE_ENV=test', () => {
		// `debug()` (from utils/functions/misc) returns `undefined` whenever
		// `process.env.NODE_ENV === 'test'`, which vitest always sets - so under
		// the unit project, the render effect always leaves `prev.current`
		// falsy by the time the unmount cleanup runs. That's the branch this
		// exercises: `if (prev.current)` taking its false path.
		const { rerender, unmount } = renderHook(({ props }: { props: Record<string, unknown> }) => useTrackRenders(props, 'Widget'), {
			initialProps: { props: { a: 1 } },
		});

		rerender({ props: { a: 2 } });

		expect(() => unmount()).not.toThrow();
	});

	it('runs the prev.current cleanup branch when debug() resolves to a real value outside of NODE_ENV=test', () => {
		// Outside a test environment (e.g. Storybook/production), `debug()`
		// returns a real object instead of short-circuiting, so `prev.current`
		// stays truthy through to unmount and the cleanup's `if (prev.current)`
		// takes its true path.
		process.env.NODE_ENV = 'development';

		const { unmount } = renderHook(({ props }: { props: Record<string, unknown> }) => useTrackRenders(props, 'Widget'), {
			initialProps: { props: { a: 1 } },
		});

		expect(() => unmount()).not.toThrow();
	});
});
