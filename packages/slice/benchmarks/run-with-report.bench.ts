/**
 * Comprehensive Benchmark Suite with Custom Reporting
 * This generates formatted console output and markdown reports
 */

import { describe, it, expect } from 'vitest';
import { runBenchmarkConfig } from './utils/benchmark';
import { BenchmarkReporter } from './utils/reporter';
import { allBenchmarkConfigs } from './configs/all-configs';

describe('Full Benchmark Suite with Reporting', () => {
	const reporter = new BenchmarkReporter();

	// Run all benchmark configs
	allBenchmarkConfigs.forEach((config) => {
		it(`${config.componentName} - Performance Tests`, async () => {
			console.log(`\n⏱️  Testing ${config.componentName} component...`);

			const result = await runBenchmarkConfig(config);
			reporter.addResult(result);

			// Optional: Add threshold checks
			if (result.mountTime) {
				expect(result.mountTime.average).toBeLessThan(100);
			}
		});
	});

	it('Generate Final Report', () => {
		console.log(reporter.generateConsoleReport());
		reporter.saveToFile('reports/benchmark-results.md');
	});
});
