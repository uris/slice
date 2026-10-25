import { describe, expect, it } from 'vitest';
import { lightTheme as webLight, darkTheme as webDark } from '../../src/theme/themes';
import { createTypography, darkTheme, lightTheme, motion } from './index';

describe('native themes', () => {
	it('preserves shared tokens and separates shadows from colors', () => {
		for (const [native, web] of [[lightTheme, webLight], [darkTheme, webDark]] as const) {
			expect(native.spacing).toEqual(web.spacing);
			expect(native.corners).toEqual(web.corners);
			expect(native.elevations).toEqual(web.elevations);
			for (const [key, value] of Object.entries(native.colors)) {
				expect(value).toBe(web.colors[key as keyof typeof web.colors]);
				expect(value).toMatch(/^(#|rgba?\()/);
			}
			expect(native.shadows['surface-shadow-soft'].boxShadow).toEqual([
				{ offsetX: 0, offsetY: 4, blurRadius: 24, color: web.colors['core-drop-shadow'] },
			]);
		}
	});
	it('converts all typography styles to numeric native dimensions', () => {
		expect(Object.keys(lightTheme.type)).toEqual(Object.keys(webLight.type));
		expect(lightTheme.type['body-m-regular']).toMatchObject({ fontSize: 15, lineHeight: 21, fontWeight: 360, letterSpacing: 0.140625 });
		expect(createTypography('AppFont').h1.fontFamily).toBe('AppFont');
		for (const style of Object.values(lightTheme.type)) {
			for (const property of ['fontSize', 'lineHeight', 'letterSpacing'] as const) expect(Number.isFinite(style[property])).toBe(true);
		}
	});
	it('converts durations and preserves curve endpoints and spring overshoot', () => {
		expect(motion['motion-magnet-duration']).toBe(500);
		expect(motion['motion-water-duration']).toBe(250);
		expect(motion['motion-spring-duration']).toBe(1000);
		for (const key of ['motion-magnet', 'motion-water', 'motion-spring'] as const) {
			expect(motion[key](0)).toBe(0);
			expect(motion[key](1)).toBe(1);
			expect(Number.isFinite(motion[key](0.5))).toBe(true);
		}
		expect(motion['motion-water'](0.5)).toBeCloseTo(0.5);
		expect(motion['motion-spring'](0.2)).toBeCloseTo(1.15);
	});
});
