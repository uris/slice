/**
 * Benchmark Runner
 * Runs the centralized benchmark config suite and generates formatted reports
 */

import { allBenchmarkConfigs } from './configs/all-configs';
import { BenchmarkReporter } from './utils/reporter';
import { runBenchmarkConfig } from './utils/benchmark';

async function runBenchmarks() {
	const reporter = new BenchmarkReporter();

	console.log('\n🚀 Starting Component Performance Benchmarks...\n');

	for (const config of allBenchmarkConfigs) {
		console.log(`Testing ${config.componentName} component...`);
		const result = await runBenchmarkConfig(config);
		reporter.addResult(result);
	}

	console.log(reporter.generateConsoleReport());
	reporter.saveToFile('reports/benchmark-results.md');

	console.log('\n✅ Benchmarks complete!\n');
}

if (require.main === module) {
	runBenchmarks().catch(console.error);
}

export { runBenchmarks };
