// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GlassContentContext } from '../SliceLiquidGlassView/GlassContentContext';
import { SliceIcon } from './SliceIcon.ios';
import type { IconProps } from './_types';

const state = vi.hoisted(() => ({ native: {} as any, wrapper: {} as any, svg: {} as any }));
vi.mock('react-native', async () => ({
    processColor: (await import('../../../tests/helpers/processColor')).processColor,
	StyleSheet: { absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } },
	View: ({ children, ...props }: any) => { state.wrapper = props; return <div data-testid="icon-wrapper">{children}</div>; },
	Pressable: ({ children, ...props }: any) => {
		state.wrapper = props;
		return <button type="button" disabled={props.disabled} onClick={props.onPress}>{children}</button>;
	},
}));
vi.mock('./SliceIconSvg', () => ({ SliceIcon: (props: any) => { state.svg = props; return <span data-testid="svg" />; } }));
vi.mock('./iconRegistry', () => ({ STATIC_ICON_REGISTRY: new Map([['home', {}], ['like', {}]]) }));
vi.mock('../../specs/GlassIconNativeComponent', () => ({ default: (props: any) => { state.native = props; return <span data-testid="native" />; } }));
afterEach(cleanup);

function icon(props: IconProps = {}, supportedGlass = true) {
	return <GlassContentContext.Provider value={supportedGlass}><div><SliceIcon {...props} /></div></GlassContentContext.Provider>;
}

describe('SliceIcon in glass', () => {
	it('uses templates through intermediate views and preserves SVG outside supported glass', () => {
		const view = render(icon());
		expect(screen.getByTestId('native')).toBeTruthy();
		expect(state.native).toMatchObject({ iconName: 'home', tintToken: 'core-icon-primary', accessible: false, pointerEvents: 'none' });
		expect(state.wrapper).toMatchObject({ accessibilityLabel: 'home icon', accessibilityRole: 'image' });
		view.rerender(icon({}, false));
		expect(screen.getByTestId('svg')).toBeTruthy();
	});
	it.each([{ stroke: 2 }, { fill: true }, { fill: true, fillColor: 0.2 }, { coverUp: 'white' }, { viewBox: '0 0 24 24' }, { width: 40 }])(
		'keeps unsupported SVG appearance intact: %j', (props) => {
			render(icon(props));
			expect(screen.getByTestId('svg')).toBeTruthy();
			expect(state.svg).toMatchObject(props);
		},
	);
	it('updates template variants, explicit foregrounds, geometry and accessibility', () => {
		const view = render(icon({ name: 'like', size: 32, toggle: true, fill: true, fillColor: 1, iconColor: '#ff0000', accessibilityLabel: 'Favorite' }));
		expect(state.native).toMatchObject({ iconName: 'like', toggled: true, filled: true, tintToken: 'core-icon-primary' });
		expect(state.wrapper.style[0]).toMatchObject({ width: 32, height: 32 });
		expect(state.wrapper.accessibilityLabel).toBe('Favorite');
		view.rerender(icon({ name: 'home', toggle: false }));
		expect(state.native).toMatchObject({ iconName: 'home', toggled: false, filled: false });
		expect(state.native.foregroundColor).toBeUndefined();
	});
	it('keeps press handlers, disables presses, and applies disabled opacity once', () => {
		const onPress = vi.fn();
		const view = render(icon({ onPress, opacity: 0.8 }));
		fireEvent.click(screen.getByRole('button'));
		expect(onPress).toHaveBeenCalledOnce();
		view.rerender(icon({ onPress, opacity: 0.8, disabled: true }));
		fireEvent.click(screen.getByRole('button'));
		expect(onPress).toHaveBeenCalledOnce();
		expect(state.wrapper.style[0].opacity).toBe(0.4);
		expect(state.wrapper.accessibilityState.disabled).toBe(true);
	});
	it('renders nothing for an unknown icon name', () => {
		render(icon({ name: 'missing' }));
		expect(screen.queryByTestId('native')).toBeNull();
	});
});

it('resolves icon tokens and palette values before falling back to primary', () => {
    const view = render(icon({ iconColor: 'core-icon-secondary' }));
    expect(state.native.tintToken).toBe('core-icon-secondary');
    view.rerender(icon({ iconColor: '#405261' }));
    expect(state.native.tintToken).toBe('core-icon-secondary');
    view.rerender(icon({ iconColor: '#123456' }));
    expect(state.native.tintToken).toBe('core-icon-primary');
    expect(state.native.foregroundColor).toBeUndefined();
});

it('keeps invalid opacity values on the SVG path instead of sending NaN to native styles', () => {
    render(icon({ opacity: 'invalid' }));
    expect(screen.getByTestId('svg')).toBeTruthy();
    expect(state.svg.opacity).toBe('invalid');
});
