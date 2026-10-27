// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SliceBackgroundBlur } from './SliceBackgroundBlur.native';

const state = vi.hoisted(() => ({ props: {} as Record<string, unknown> }));
vi.mock('react-native', () => ({ StyleSheet: { absoluteFill: { position: 'absolute', inset: 0 } } }));
vi.mock('../../specs/BackgroundBlurNativeComponent', () => ({
	default: (props: Record<string, unknown>) => {
		state.props = props;
		return null;
	},
}));
afterEach(cleanup);

describe('SliceBackgroundBlur native boundary', () => {
	it('defaults to a uniform, non-interactive blur', () => {
		render(<SliceBackgroundBlur />);
		expect(state.props).toMatchObject({ fadeStop: 0, blurIntensity: 12, direction: 'down', pointerEvents: 'none' });
	});

	it.each([
		[-1, 120, 0, 100],
		[2, -10, 1, 0],
		[Number.NaN, Number.POSITIVE_INFINITY, 0, 12],
	])('sanitizes fadeStop=%s and intensity=%s before crossing the native boundary', (fadeStop, blurIntensity, fade, intensity) => {
		render(<SliceBackgroundBlur fadeStop={fadeStop} blurIntensity={blurIntensity} />);
		expect(state.props).toMatchObject({ fadeStop: fade, blurIntensity: intensity });
	});

	it('updates fading, direction and fallback props', () => {
		const { rerender } = render(<SliceBackgroundBlur fadeStop={0.5} direction="up" />);
		expect(state.props).toMatchObject({ fadeStop: 0.5, direction: 'up' });
		rerender(<SliceBackgroundBlur fadeStop={0} direction="right" fallbackColor="#123456" style={{ height: 40 }} />);
		expect(state.props).toMatchObject({ fadeStop: 0, direction: 'right', fallbackColor: '#123456' });
		expect(state.props.style).toEqual([{ position: 'absolute', inset: 0 }, { height: 40 }]);
	});
});
