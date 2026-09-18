import { isValidElement } from 'react';
import { describe, expect, it } from 'vitest';
import { type IconRenderProps, STATIC_ICON_REGISTRY } from './iconRegistry';

const sampleProps: IconRenderProps = {
	stroke: 1.5,
	strokeColor: '#000000',
	fillColor: 1,
	coverUp: '#ffffff',
};

describe('STATIC_ICON_REGISTRY', () => {
	it('is not empty', () => {
		expect(STATIC_ICON_REGISTRY.size).toBeGreaterThan(0);
	});

	it('renders a valid line element for every registered icon', () => {
		for (const [name, definition] of STATIC_ICON_REGISTRY) {
			const element = definition.line(sampleProps);
			expect(isValidElement(element), `"${name}".line() did not return a valid element`).toBe(true);
		}
	});

	it('renders a valid lineOn element for every icon that defines one', () => {
		const withLineOn = [...STATIC_ICON_REGISTRY.entries()].filter(([, def]) => def.lineOn);
		expect(withLineOn.length).toBeGreaterThan(0);

		for (const [name, definition] of withLineOn) {
			const element = definition.lineOn?.(sampleProps);
			expect(isValidElement(element), `"${name}".lineOn() did not return a valid element`).toBe(true);
		}
	});
});
