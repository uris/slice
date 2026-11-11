import { describe, expect, it } from 'vitest';
import { resolvePanelConstraints } from './panelConstraints';
describe('panel constraints', () => {
	it('resolves mixed ratios/pixels and clamps initial widths', () => {
		expect(resolvePanelConstraints({ initial: 0.6, min: 150, max: 0.5 }, 800)).toEqual({
			initial: 400,
			min: 150,
			max: 400,
		});
	});
	it('uses safe bounds for reversed, nonfinite and negative inputs', () => {
		expect(resolvePanelConstraints({ initial: NaN, min: 300, max: 100 }, 800)).toEqual({
			initial: 300,
			min: 300,
			max: 300,
		});
		expect(resolvePanelConstraints({ initial: -1, min: Infinity, max: -1 })).toEqual({
			initial: 250,
			min: 250,
			max: 500,
		});
	});
	it('defers unresolved ratios and preserves the existing minimum pixel size', () => {
		expect(resolvePanelConstraints({ initial: 0.4, min: 0, max: 1 })).toEqual({ initial: 0, min: 0, max: 0 });
		expect(resolvePanelConstraints({ initial: 20, min: 2, max: 40 })).toEqual({ initial: 50, min: 50, max: 50 });
	});
});
