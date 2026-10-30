import type { BenchmarkResult } from './benchmark';

export interface ComponentBenchmark {
	componentName: string;
	mountTime: BenchmarkResult;
	rerenderTime?: BenchmarkResult;
	eventResponseTime?: BenchmarkResult;
	animationFPS?: { fps: number; frameCount: number; droppedFrames: number };
	memory?: {
		averageDelta: number;
		maxDelta: number;
		minDelta: number;
		leakSuspected: boolean;
	};
}

export class BenchmarkReporter {
	private results: ComponentBenchmark[] = [];
	private startTime: number;

	constructor() {
		this.startTime = Date.now();
	}

	addResult(result: ComponentBenchmark) {
		this.results.push(result);
	}

	generateConsoleReport(): string {
		const lines: string[] = [];
		const elapsed = this.formatTime((Date.now() - this.startTime) / 1000);

		lines.push('\n┌─────────────────────────────────────────────────────────┐');
		lines.push('│          COMPONENT PERFORMANCE BENCHMARK REPORT          │');
		lines.push('└─────────────────────────────────────────────────────────┘\n');
		lines.push(`⏱️  Total Time: ${elapsed}`);
		lines.push(`📊 Components Tested: ${this.results.length}\n`);

		for (const result of this.results) {
			lines.push(`\n${'='.repeat(60)}`);
			lines.push(`📦 ${result.componentName}`);
			lines.push('='.repeat(60));

			// Mount Time
			const mountRating = this.getRatingInfo('mount', result.mountTime.average);
			lines.push(`\n🚀 Mount Performance: ${mountRating.emoji}`);
			lines.push(`   Average: ${this.formatMilliseconds(result.mountTime.average)}`);
			lines.push(`   Median:  ${this.formatMilliseconds(result.mountTime.median)}`);
			lines.push(
				`   Range:   ${this.formatMilliseconds(result.mountTime.min)} - ${this.formatMilliseconds(result.mountTime.max)}`,
			);
			lines.push(
				`   Std Dev: ${this.formatMilliseconds(result.mountTime.stdDev)} (${((result.mountTime.stdDev / result.mountTime.average) * 100).toFixed(1)}%)`,
			);
			lines.push(`   ${mountRating.text}`);

			// Re-render Time
			if (result.rerenderTime) {
				const rerenderRating = this.getRatingInfo(
					'rerender',
					result.rerenderTime.average,
				);
				lines.push(`\n🔄 Re-render Performance: ${rerenderRating.emoji}`);
				lines.push(
					`   Average: ${this.formatMilliseconds(result.rerenderTime.average)}`,
				);
				lines.push(
					`   Median:  ${this.formatMilliseconds(result.rerenderTime.median)}`,
				);
				lines.push(
					`   Range:   ${this.formatMilliseconds(result.rerenderTime.min)} - ${this.formatMilliseconds(result.rerenderTime.max)}`,
				);
				lines.push(`   ${rerenderRating.text}`);
			}

			// Event Response Time
			if (result.eventResponseTime) {
				const eventRating = this.getRatingInfo(
					'event',
					result.eventResponseTime.average,
				);
				lines.push(`\n⚡ Event Response: ${eventRating.emoji}`);
				lines.push(
					`   Average: ${this.formatMilliseconds(result.eventResponseTime.average)}`,
				);
				lines.push(
					`   Median:  ${this.formatMilliseconds(result.eventResponseTime.median)}`,
				);
				lines.push(`   ${eventRating.text}`);
			}

			// Animation FPS
			if (result.animationFPS) {
				const animRating = this.getRatingInfo(
					'animation',
					result.animationFPS.fps,
				);
				lines.push(`\n🎬 Animation Performance: ${animRating.emoji}`);
				lines.push(`   FPS: ${result.animationFPS.fps}`);
				lines.push(`   Frame Count: ${result.animationFPS.frameCount}`);
				lines.push(`   Dropped Frames: ${result.animationFPS.droppedFrames}`);
				lines.push(`   ${animRating.text}`);
			}

			// Memory
			if (result.memory) {
				const memRating = this.getRatingInfo(
					'memory',
					result.memory.averageDelta,
				);
				lines.push(`\n💾 Memory Usage: ${memRating.emoji}`);
				lines.push(
					`   Avg Delta: ${this.formatBytes(result.memory.averageDelta)}`,
				);
				lines.push(`   Max Delta: ${this.formatBytes(result.memory.maxDelta)}`);
				lines.push(`   Min Delta: ${this.formatBytes(result.memory.minDelta)}`);
				lines.push(
					`   Leak: ${result.memory.leakSuspected ? '❌ SUSPECTED' : '✓ None detected'}`,
				);
			}
		}

		lines.push(`\n${'='.repeat(60)}`);
		lines.push(this.generateSummary());
		lines.push(`${'='.repeat(60)}\n`);

		return lines.join('\n');
	}

	generateMarkdownReport(): string {
		const lines: string[] = [];
		
		lines.push(`*Generated:* ${new Date().toLocaleDateString()}`);
		lines.push(`*Components Tested:* ${this.results.length}\n`);
		lines.push('\n');

		// Summary Table
		lines.push(
			'| Component | Rating | Mount (avg) | Re-render (avg) | Event (avg) | Memory Delta | Leak Suspected |',
		);
		lines.push(
			'|-----------|:------:|-------------|-----------------|-------------|--------------|:--------------:|',
		);

		for (const result of this.results) {
			const mountRating = this.getRatingInfo('mount', result.mountTime.average);
			const mount = this.formatMilliseconds(result.mountTime.average);
			const rerender = result.rerenderTime
				? this.formatMilliseconds(result.rerenderTime.average)
				: '-';
			const event = result.eventResponseTime
				? this.formatMilliseconds(result.eventResponseTime.average)
				: '-';
			const memory = result.memory
				? this.formatBytes(result.memory.averageDelta)
				: '-';
			const leak = result.memory
				? result.memory.leakSuspected ? '❌ Yes' : '✓ No'
				: '-';

			lines.push(
				`| ${result.componentName} | ${mountRating.emoji} | ${mount} | ${rerender} | ${event} | ${memory} | ${leak} |`,
			);
		}

		lines.push('\n\n');
		lines.push('*Note: Memory measurements are simulated in jsdom test environment. Run in browser for actual memory measurements.*\n');
		lines.push('*Rating: ⚡ Excellent (<2ms) | ✓✓ Very Good (2-5ms) | ✓ Good (5-16ms) | ⚠️ Fair (16-50ms) | ❌ Poor (>50ms)*\n');

		return lines.join('\n');
	}

	private generateSummary(): string {
		const avgMount =
			this.results.reduce((sum, r) => sum + r.mountTime.average, 0) /
			this.results.length;
		const avgRerender =
			this.results
				.filter((r) => r.rerenderTime)
				.reduce((sum, r) => sum + (r.rerenderTime?.average || 0), 0) /
			this.results.filter((r) => r.rerenderTime).length;

		const lines: string[] = [];
		lines.push('\n📈 SUMMARY');
		lines.push(
			`   Average Mount Time: ${this.formatMilliseconds(avgMount)}`,
		);
		if (!Number.isNaN(avgRerender)) {
			lines.push(
				`   Average Re-render Time: ${this.formatMilliseconds(avgRerender)}`,
			);
		}

		// Performance grades
		const excellentCount = this.results.filter(
			(r) => r.mountTime.average < 5,
		).length;
		const goodCount = this.results.filter(
			(r) => r.mountTime.average >= 5 && r.mountTime.average < 16,
		).length;
		const fairCount = this.results.filter(
			(r) => r.mountTime.average >= 16 && r.mountTime.average < 50,
		).length;
		const poorCount = this.results.filter(
			(r) => r.mountTime.average >= 50,
		).length;

		lines.push('\n   Performance Distribution:');
		lines.push(`   ⚡ Excellent (<5ms):    ${excellentCount} components`);
		lines.push(`   ✓  Good (5-16ms):      ${goodCount} components`);
		lines.push(`   ⚠️  Fair (16-50ms):     ${fairCount} components`);
		lines.push(`   ❌ Poor (>50ms):       ${poorCount} components`);

		return lines.join('\n');
	}

	private getRating(type: string, value: number): string {
		const info = this.getRatingInfo(type, value);
		return `   ${info.emoji} ${info.text}`;
	}

	private getRatingInfo(
		type: string,
		value: number,
	): { emoji: string; text: string } {
		if (type === 'mount' || type === 'rerender' || type === 'event') {
			if (value < 2) return { emoji: '⚡', text: 'Excellent' };
			if (value < 5) return { emoji: '✓✓', text: 'Very Good' };
			if (value < 16) return { emoji: '✓', text: 'Good (60fps target)' };
			if (value < 50) return { emoji: '⚠️', text: 'Fair' };
			return { emoji: '❌', text: 'Poor - Needs optimization' };
		}

		if (type === 'animation') {
			if (value >= 55) return { emoji: '⚡', text: 'Excellent' };
			if (value >= 45) return { emoji: '✓', text: 'Good' };
			if (value >= 30) return { emoji: '⚠️', text: 'Fair' };
			return { emoji: '❌', text: 'Poor - Needs optimization' };
		}

		if (type === 'memory') {
			if (value < 50000) return { emoji: '⚡', text: 'Excellent (<50KB)' };
			if (value < 200000) return { emoji: '✓', text: 'Good (<200KB)' };
			if (value < 500000) return { emoji: '⚠️', text: 'Fair (<500KB)' };
			return { emoji: '❌', text: 'Poor - High memory usage' };
		}

		return { emoji: '', text: '' };
	}

	private formatBytes(bytes: number): string {
		if (bytes === 0) return '0B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
		const value = bytes / k ** i;
		// Format with appropriate precision
		const formatted =
			value < 10 ? value.toFixed(2) : value < 100 ? value.toFixed(1) : value.toFixed(0);
		return `${formatted}${sizes[i]}`;
	}

	private formatMilliseconds(ms: number): string {
		if (ms < 0.001) return `${ms.toFixed(6)}ms`;
		if (ms < 0.01) return `${ms.toFixed(5)}ms`;
		if (ms < 0.1) return `${ms.toFixed(4)}ms`;
		if (ms < 1) return `${ms.toFixed(3)}ms`;
		if (ms < 10) return `${ms.toFixed(3)}ms`;
		if (ms < 100) return `${ms.toFixed(2)}ms`;
		if (ms < 1000) return `${ms.toFixed(1)}ms`;
		return `${(ms / 1000).toFixed(2)}s`;
	}

	private formatTime(seconds: number): string {
		if (seconds < 60) return `${seconds.toFixed(2)}s`;
		const mins = Math.floor(seconds / 60);
		const secs = (seconds % 60).toFixed(0);
		return `${mins}m ${secs}s`;
	}

	saveToFile(filename: string): void {
		const fs = require('node:fs');
		const path = require('node:path');
		const content = this.generateMarkdownReport();
		const filePath = path.join(process.cwd(), filename);
		fs.mkdirSync(path.dirname(filePath), { recursive: true });
		fs.writeFileSync(filePath, content);
		console.log(`\n✅ Report saved to: ${filePath}`);
	}
}
