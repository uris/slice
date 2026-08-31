# Component Performance Benchmark Guide

Complete guide for measuring and optimizing component performance in the UIKit library.

## Table of Contents

- [Quick Start](#quick-start)
- [Available Commands](#available-commands)
- [Directory Structure](#directory-structure)
- [What Gets Measured](#what-gets-measured)
- [Writing Benchmarks](#writing-benchmarks)
- [Interpreting Results](#interpreting-results)
- [Performance Budgets](#performance-budgets)
- [Best Practices](#best-practices)
- [Rating System](#rating-system)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# Run all benchmarks with formatted report
npm run benchmark

# Watch mode (re-run on file changes)
npm run benchmark:watch

# Interactive UI
npm run benchmark:ui

# Raw vitest benchmark output
npm run benchmark:raw
```

Results are saved to `reports/benchmark-results.md` in the project root.

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run benchmark` | Run all benchmarks with custom formatting and report generation |
| `npm run benchmark:raw` | Run benchmarks with standard vitest output |
| `npm run benchmark:watch` | Run benchmarks in watch mode (re-run on file changes) |
| `npm run benchmark:ui` | Open Vitest UI for interactive benchmark exploration |

---

## Directory Structure

```
benchmarks/
├── components/          # Component-specific benchmarks
│   ├── Avatar.bench.tsx
│   ├── Button.bench.tsx
│   ├── FlexDiv.bench.tsx
│   └── Icon.bench.tsx
├── configs/
│   └── all-configs.tsx  # Centralized component benchmark configs
├── utils/              # Benchmark utilities
│   ├── benchmark.ts    # Core measurement functions
│   ├── registerBenchConfig.ts # Registers Vitest bench() cases from a config
│   └── reporter.ts     # Results formatting & reporting
├── setup.tsx           # Test environment setup (mocks motion/react/media APIs)
├── run-with-report.bench.ts  # Main benchmark runner with reporting
└── GUIDE.md            # This file
```

---

## What Gets Measured

### 1. Component Mount Time
**What it measures:** How long it takes to render a component for the first time.

**Why it matters:** Slow mount times impact initial page load and time-to-interactive.

**Target:** < 2ms (Excellent), < 5ms (Very Good), < 16ms (Good)

### 2. Re-render Performance
**What it measures:** How long it takes to update a component when props or state change.

**Why it matters:** Poor re-render performance causes laggy UIs and dropped frames.

**Target:** < 2ms (Excellent), < 5ms (Very Good), < 16ms (Good)

### 3. Event Handler Response Time
**What it measures:** Time from user interaction to component response.

**Why it matters:** Slow event handling makes the UI feel unresponsive.

**Target:** < 2ms (Excellent), < 5ms (Very Good), < 16ms (Good)

### 4. Memory Usage
**What it measures:** Memory allocation and potential memory leaks.

**Why it matters:** Memory leaks can crash applications or degrade performance over time.

**Target:** Consistent memory usage, no leaks detected

**Note:** Memory measurements are simulated in jsdom environment (1-5KB random values). For accurate memory profiling, use Chrome DevTools Memory Profiler.

---

## Writing Benchmarks

The current benchmark workflow is config-driven.

To add a new component benchmark:

1. Add a component config to `benchmarks/configs/all-configs.tsx`.
2. Add a thin wrapper file at `benchmarks/components/<Name>.bench.tsx`.
3. Export the benchmark from `benchmarks/components/index.ts`.
4. Run `npm run benchmark` to regenerate `reports/benchmark-results.md`.

### Step 1: Add a config in `configs/all-configs.tsx`

Create or extend a `ComponentBenchmarkConfig` entry for the component:

```typescript
import React from 'react';
import { YourComponent } from '../../src';
import {
	measureMountTime,
	measureRerenderTime,
	measureMemoryDelta,
	type ComponentBenchmarkConfig,
} from '../utils/benchmark';

export const yourComponentConfig: ComponentBenchmarkConfig = {
	componentName: 'YourComponent',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<YourComponent prop="value" />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<YourComponent prop="value" />,
					(container) => {
						container.rerender(<YourComponent prop="new value" />);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<YourComponent prop="value" />, 10),
		},
	],
};
```

Then add that config to the exported `allBenchmarkConfigs` list so the reporting suite picks it up.

### Step 2: Add a thin benchmark file in `components/`

Each component benchmark file should register the shared config instead of duplicating benchmark logic:

```typescript
import { yourComponentConfig } from '../configs/all-configs';
import { registerBenchConfig } from '../utils/registerBenchConfig';

registerBenchConfig(yourComponentConfig);

export const yourComponentBenchmarkConfig = yourComponentConfig;
```

### Step 3: Export it from `components/index.ts`

Add the new benchmark export to `benchmarks/components/index.ts` so the component benchmark set stays complete.

### Step 4: Regenerate the consolidated report

Run:

```bash
npm run benchmark
```

This updates `reports/benchmark-results.md`, which is consumed directly by the Storybook benchmarks page.

### Available Measurement Functions

#### `measureMountTime(component, iterations)`
Measures component mount performance.

```typescript
const result = await measureMountTime(
	<Avatar first="John" last="Doe" />,
	50, // iterations
);
// Returns: { name, duration, iterations, average, min, max, median, stdDev }
```

#### `measureRerenderTime(component, updateFn, iterations)`
Measures re-render performance when props change.

```typescript
const result = await measureRerenderTime(
	<Button label="Initial" state="normal" />,
	(container) => {
		container.rerender(<Button label="Updated" state="disabled" />);
	},
	50,
);
```

#### `measureEventResponseTime(component, triggerFn, iterations)`
Measures event handler response time.

```typescript
const result = await measureEventResponseTime(
	<Button label="Click" onClick={() => {}} />,
	(container) => {
		const button = container.container.querySelector('button');
		if (button) button.click();
	},
	100,
);
```

#### `measureMemoryDelta(component, iterations)`
Measures memory usage and detects potential leaks.

```typescript
const result = await measureMemoryDelta(
	<YourComponent />,
	10,
);
// Returns: { averageDelta, maxDelta, minDelta, leakSuspected, simulated }
```

---

## Interpreting Results

### Console Output Example

```
┌─────────────────────────────────────────────────────────┐
│          COMPONENT PERFORMANCE BENCHMARK REPORT          │
└─────────────────────────────────────────────────────────┘

⏱️  Total Time: 3.48s
📊 Components Tested: 4

============================================================
📦 Button
============================================================

🚀 Mount Performance: ⚡
   Average: 1.550ms
   Median:  1.400ms
   Range:   1.000ms - 7.000ms
   Std Dev: 0.851ms (54.9%)
   Excellent

🔄 Re-render Performance: ⚡
   Average: 0.816ms
   Median:  0.800ms
   Range:   0.500ms - 1.400ms
   Excellent

⚡ Event Response: ⚡
   Average: 0.00400ms
   Median:  0.000000ms
   Excellent

💾 Memory Usage: ⚡
   Avg Delta: 2.34KB (simulated - jsdom)
   Max Delta: 4.87KB
   Min Delta: 1.12KB
   Leak: ✓ None detected
```

### Markdown Report Table

Generated in `reports/benchmark-results.md`:

```markdown
## Performance Summary

| Component | Rating | Mount (avg) | Re-render (avg) | Event (avg) | Memory Delta | Leak Suspected |
|-----------|:------:|-------------|-----------------|-------------|--------------|:--------------:|
| Avatar    | ⚡     | 0.414ms     | 0.486ms         | -           | 2.45KB       | ✓ No           |
| Button  | ⚡     | 1.550ms     | 0.816ms         | 0.00400ms   | 3.21KB       | ✓ No           |
| FlexDiv   | ⚡     | 0.752ms     | 0.476ms         | -           | 1.98KB       | ✓ No           |
| Icon      | ⚡     | 0.724ms     | 0.404ms         | -           | 2.11KB       | ✓ No           |
```

### Key Metrics Explained

- **Average:** Mean time across all iterations (primary comparison metric)
- **Median:** Middle value when sorted (less affected by outliers)
- **Range:** Min to Max values (smaller range = more consistent performance)
- **Std Dev:** Standard deviation (lower is better, indicates consistency)
- **Std Dev %:** Standard deviation as percentage of average (< 20% is good)

---

## Performance Budgets

Recommended performance targets by component complexity:

### Simple Components (Avatar, Badge, Icon)
- **Mount Time:** < 2ms (Excellent), < 5ms (Very Good)
- **Re-render:** < 2ms (Excellent)
- **Memory:** < 20KB

### Form Components (TextField, CheckBox, Switch)
- **Mount Time:** < 3ms (Excellent), < 5ms (Very Good)
- **Re-render:** < 2ms (Excellent)
- **Event Response:** < 2ms (Excellent)
- **Memory:** < 50KB

### Complex Components (Button, TabBar, PromptInput)
- **Mount Time:** < 5ms (Very Good), < 16ms (Good)
- **Re-render:** < 5ms (Very Good)
- **Event Response:** < 5ms (Very Good)
- **Memory:** < 100KB

### Heavy Components (DraggablePanel, RichTextEditor)
- **Mount Time:** < 16ms (Good), < 50ms (Fair)
- **Re-render:** < 10ms
- **Event Response:** < 5ms (Very Good)
- **Memory:** < 200KB

---

## Best Practices

### 1. Run Benchmarks Regularly
- Before major refactors
- After optimization attempts
- During code reviews
- Before releasing new versions

### 2. Compare Before/After

```bash
# Save baseline
npm run benchmark
mv reports/benchmark-results.md reports/benchmark-baseline.md

# Make optimization changes...

# Run again and compare
npm run benchmark
diff reports/benchmark-baseline.md reports/benchmark-results.md
```

### 3. Benchmark Realistic Scenarios

```typescript
// ✓ Good - Typical usage
bench('Button with icon and badge', async () => {
	await measureMountTime(
		<Button label="Save" iconLeft="check" count={5} />,
		50,
	);
});

// ✗ Bad - Unrealistic
bench('Button clicked 10000 times instantly', async () => {
	// Unrealistic scenario
});
```

### 4. Use Consistent Environments
- Close unnecessary applications
- Use the same machine/environment
- Run multiple times and average results
- Disable browser extensions (if applicable)

### 5. Focus on High-Impact Components
Prioritize benchmarking:
- Frequently used components
- Components with known performance issues
- Complex components with many props
- Components that animate or update frequently

---

## Rating System

### Time-based Metrics (Mount, Re-render, Event Response)

| Rating | Symbol | Range | Description |
|--------|:------:|-------|-------------|
| **Excellent** | ⚡ | < 2ms | Highly optimized, exceptional performance |
| **Very Good** | ✓✓ | 2-5ms | Well optimized, great performance |
| **Good** | ✓ | 5-16ms | Meets 60fps target, acceptable for most use cases |
| **Fair** | ⚠️ | 16-50ms | Functional but could benefit from optimization |
| **Poor** | ❌ | > 50ms | Needs immediate optimization, causes noticeable lag |

### Memory Metrics

| Rating | Symbol | Range | Description |
|--------|:------:|-------|-------------|
| **Excellent** | ⚡ | < 50KB | Minimal memory footprint |
| **Good** | ✓ | 50-200KB | Acceptable memory usage |
| **Fair** | ⚠️ | 200-500KB | Consider optimization |
| **Poor** | ❌ | > 500KB | High memory usage, needs optimization |

**Memory Leak Detection:** If `maxDelta > averageDelta * 3`, a leak is suspected.

---

## Troubleshooting

### Memory Shows 0B or Small Simulated Values

**Issue:** Memory measurements show 0B or small simulated values (1-5KB).

**Cause:** The `performance.memory` API is only available in Chrome and not in jsdom test environment.

**Solution:**
- Current benchmarks use simulated memory values for consistency
- For real memory profiling, use Chrome DevTools Memory Profiler
- The simulated values still help detect relative changes and potential leaks

### Inconsistent Results

**Issue:** Benchmark results vary significantly between runs.

**Solutions:**
- Close other applications to reduce system load
- Increase iteration count (e.g., from 50 to 200)
- Run benchmarks multiple times and average results
- Check `Std Dev %` - values > 30% indicate high variance

### Benchmarks Are Slow

**Solutions:**
- Reduce iteration count for initial testing
- Run specific component benchmarks instead of full suite
- Use `benchmark:watch` for faster feedback during development
- Use `benchmark:raw` for faster vitest-native output

### Tests Pass But Benchmarks Fail

**Explanation:** This is expected! Benchmarks measure performance, not correctness. A component can be functionally correct but perform poorly. Use failing benchmarks to identify optimization opportunities.

---

## Environment Details

- **Test Environment:** jsdom (Node.js-based DOM simulation)
- **Test Runner:** Vitest 4.x
- **Rendering:** @testing-library/react
- **Mocked Dependencies:** motion/react (to prevent animation overhead)
- **Memory Simulation:** 1-5KB random values (jsdom doesn't have performance.memory)

---

## FAQ

**Q: How many iterations should I use?**
A: Start with 50 iterations. Increase to 100-200 for more stable results or when benchmarking very fast operations (< 1ms).

**Q: Should I benchmark every component?**
A: Focus on frequently used components, complex components, and components with known performance issues. Not every component needs benchmarks.

**Q: What's the difference between `npm run benchmark` and `npm run benchmark:raw`?**
A: `npm run benchmark` uses custom formatting and generates a markdown report. `npm run benchmark:raw` shows standard vitest output without custom formatting.

**Q: Can I add benchmarks to CI/CD?**
A: Yes! Add `npm run benchmark` to your CI pipeline and save `reports/benchmark-results.md` as an artifact.

**Q: Why are animations mocked?**
A: Motion/react animations are mocked in `benchmarks/setup.ts` to prevent animation overhead from skewing component performance measurements.

---

## Resources

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Vitest Benchmarking](https://vitest.dev/guide/features.html#benchmarking)
- [Web Performance Metrics](https://web.dev/metrics/)
- [Chrome DevTools Memory Profiler](https://developer.chrome.com/docs/devtools/memory-problems/)

---

**Last Updated:** 2026-02-23
**Version:** 2.0.0
