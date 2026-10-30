import { bench, describe } from 'vitest';
import type { ComponentBenchmarkConfig } from './benchmark';

const ITERATIONS_BY_TYPE: Record<string, number> = {
	mount: 5,
	rerender: 5,
	event: 5,
	memory: 3,
};

export function registerBenchConfig(config: ComponentBenchmarkConfig) {
	describe(`${config.componentName} Component Benchmarks`, () => {
		for (const test of config.tests) {
			bench(
				`${config.componentName} - ${test.name}`,
				async () => {
					await test.fn();
				},
				{ iterations: ITERATIONS_BY_TYPE[test.type] ?? 5 },
			);
		}
	});
}
