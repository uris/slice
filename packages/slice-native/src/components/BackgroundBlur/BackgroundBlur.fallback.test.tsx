// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BackgroundBlur } from './BackgroundBlur';

const state = vi.hoisted(() => ({ props: {} as Record<string, unknown> }));

vi.mock('react-native', () => ({
	StyleSheet: { absoluteFill: { position: 'absolute', inset: 0 } },
	View: (props: Record<string, unknown>) => {
		state.props = props;
		return <div data-testid="blur-fallback" />;
	},
}));

afterEach(cleanup);

describe('BackgroundBlur web/other-platform fallback', () => {
	it('fills its parent with the default tint without intercepting touches', () => {
		render(<BackgroundBlur />);

		expect(screen.getByTestId('blur-fallback')).toBeTruthy();
		expect(state.props.pointerEvents).toBe('none');
		expect(Object.assign({}, ...(state.props.style as object[]))).toEqual({
			position: 'absolute',
			inset: 0,
			backgroundColor: 'rgba(128, 128, 128, 0.18)',
		});
	});

	it('updates geometry and fallback color without remounting or forwarding native blur options', () => {
		const view = render(<BackgroundBlur />);
		const element = screen.getByTestId('blur-fallback');

		view.rerender(
			<BackgroundBlur
				style={{ height: 40, backgroundColor: 'red' }}
				fallbackColor="#123456"
				blurIntensity={80}
				fadeStop={0.5}
				direction="up"
			/>,
		);

		expect(screen.getByTestId('blur-fallback')).toBe(element);
		expect(state.props.pointerEvents).toBe('none');
		expect(Object.assign({}, ...(state.props.style as object[]))).toEqual({
			position: 'absolute',
			inset: 0,
			height: 40,
			backgroundColor: '#123456',
		});
		for (const prop of ['blurIntensity', 'fadeStop', 'direction', 'fallbackColor']) {
			expect(state.props).not.toHaveProperty(prop);
		}

		view.rerender(<BackgroundBlur fallbackColor="transparent" />);
		expect(Object.assign({}, ...(state.props.style as object[])).backgroundColor).toBe('transparent');
		expect(screen.getByTestId('blur-fallback')).toBe(element);
	});
});
