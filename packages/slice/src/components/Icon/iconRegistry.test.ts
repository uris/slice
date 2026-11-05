import { Children, isValidElement } from 'react';
import { SliceIcons, type SliceIcon } from './_types';
import { describe, expect, expectTypeOf, it } from 'vitest';
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

describe('consolidated icon catalog', () => {
 it('registers every catalog name exactly once, with no hidden legacy entries', () => {
 const names = Object.values(SliceIcons).flatMap(group => Object.values(group));
 expect(new Set(names).size).toBe(names.length);
 expect(new Set(STATIC_ICON_REGISTRY.keys())).toEqual(new Set(names));
 for (const name of names) expect(name).toMatch(/^[a-z]+\.[a-z0-9-]+$/);
 });
 it('keeps the imported anchor stroke configurable in 20px coordinates', () => {
  const element = STATIC_ICON_REGISTRY.get('basic.anchor')?.line({ ...sampleProps, stroke: 2, strokeColor: '#123456' });
  expect(element?.type).toBe('path');
  expect(element?.props).toMatchObject({ stroke: '#123456', strokeWidth: 2, fill: 'none' });
  expect(element?.props).not.toHaveProperty('transform');
 });
});


describe('converted artwork', () => {
 it('flattens primitive shapes and preserves mixed artwork opacity', () => {
  for (const name of ['media.stop', 'media.record']) {
   const element = STATIC_ICON_REGISTRY.get(name)?.line(sampleProps);
   expect(element?.type).toBe('path');
   expect(element?.props).toMatchObject({ fill: 'none', strokeWidth: 1.5 });
  }
  const cocktail = STATIC_ICON_REGISTRY.get('food.glass-cocktail')?.line(sampleProps);
  const children = Children.toArray(cocktail?.props.children);
  expect(isValidElement(children[0]) && children[0].props).toMatchObject({ opacity: 0.32, fill: '#000000' });
 });
});


it('exports one icon-name type for all artwork', () => {
 expectTypeOf<'basic.home' | 'ai.wand' | 'brands.google' | 'system.check-circle'>().toExtend<SliceIcon>();
 expectTypeOf<Extract<SliceIcon, 'home' | 'wand' | 'check circle'>>().toEqualTypeOf<never>();
});
