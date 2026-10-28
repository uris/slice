// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SliceThemeProvider } from '../../providers/SliceThemeProvider';
import { darkTheme, lightTheme } from '../../theme';
import { SliceButton } from './SliceButton';
import type { SliceButtonProps } from './_types';

const state = vi.hoisted(() => ({ supportsLiquidGlass: true, pressable: {} as any, glass: {} as any, views: [] as any[] }));
vi.mock('../../hooks', () => ({ useDeviceCapabilities: () => ({ supportsLiquidGlass: state.supportsLiquidGlass }) }));
vi.mock('react-native', () => ({
	useColorScheme: () => 'light',
	StyleSheet: { create: (styles: unknown) => styles, compose: (a: unknown, b: unknown) => [a, b] },
	Pressable: (props: any) => {
		state.pressable = props;
		return (
			<button disabled={props.disabled} aria-label={props.accessibilityLabel} onClick={props.onPress}>
				{props.children}
			</button>
		);
	},
}));
vi.mock('react-native-reanimated', () => ({
	default: {
		View: (props: any) => {
			state.views.push(props);
			return props.children;
		},
	},
}));
vi.mock('../SliceLiquidGlassView', () => ({
 SliceLiquidGlassView: (props: any) => { state.glass = props; return null; },
}));
vi.mock('../SliceIcon', () => ({
	SliceIcon: (props: any) => (
		<span
			data-testid="icon"
			data-name={props.name}
			data-size={props.size}
			data-color={props.iconColor}
			data-accessible={String(props.accessible)}
		/>
	),
}));
vi.mock('../SliceText/SliceText', () => ({
	StyledText: (props: any) => (
		<span data-testid="label" data-color={props.style.color}>
			{props.children}
		</span>
	),
}));

afterEach(cleanup);
beforeEach(() => {
	state.supportsLiquidGlass = true;
 state.glass = {};
 state.views = [];
	state.pressable = {};
});
function button(
	children: ReactNode,
	props: Omit<SliceButtonProps, 'children'> = {},
	preference: 'light' | 'dark' = 'light',
) {
	return (
		<SliceThemeProvider preference={preference}>
			<SliceButton {...props}>{children}</SliceButton>
		</SliceThemeProvider>
	);
}
function wrapperStyle() {
	return Object.assign({}, ...state.views.at(-1).style.flat(Infinity));
}
function pressableStyle() {
	return Object.assign({}, ...[state.pressable.style].flat(Infinity));
}

describe('SliceButton', () => {
 it('uses solid backgrounds on unsupported devices and respects fallback and explicit overrides', () => {
  state.supportsLiquidGlass = false;
  const view = render(button('Save', { liquidGlassBackground: {} }));
  expect(wrapperStyle().backgroundColor).toBe(lightTheme.colors['core-button-primary']);
  expect(state.glass).toEqual({});
  view.rerender(button('Save', { liquidGlassBackground: { fallbackColor: 'blue' } }));
  expect(wrapperStyle().backgroundColor).toBe('blue');
  view.rerender(button('Save', { liquidGlassBackground: { fallbackColor: 'blue' }, backgroundColor: 'red' }));
  expect(wrapperStyle().backgroundColor).toBe('red');
  view.rerender(button('Save', { liquidGlassBackground: { fallbackColor: 'blue' }, disabled: true }));
  expect(wrapperStyle().backgroundColor).toBe(lightTheme.colors['core-surface-secondary']);
  expect(state.glass).toEqual({});
 });
 it('updates fallback color and theme without remounting the button', () => {
  const view = render(button('Save', { backgroundColor: 'red' }));
  const element = screen.getByRole('button');
  expect(wrapperStyle().backgroundColor).toBe('red');
  view.rerender(button('Save', { backgroundColor: 'blue' }));
  expect(wrapperStyle().backgroundColor).toBe('blue');
  expect(state.pressable).not.toHaveProperty('backgroundColor');
  view.rerender(button('Save', { liquidGlassBackground: {} }));
  expect(wrapperStyle().backgroundColor).toBe(lightTheme.colors['core-button-primary']);
  state.supportsLiquidGlass = false;
  view.rerender(button('Save', { liquidGlassBackground: {} }, 'dark'));
  expect(wrapperStyle().backgroundColor).toBe(darkTheme.colors['core-button-primary']);
  view.rerender(button('Save', { variant: 'secondary' }, 'dark'));
  expect(wrapperStyle().backgroundColor).toBe(darkTheme.colors['core-surface-primary']);
  expect(screen.getByRole('button')).toBe(element);
 });

 it.each(['primary', 'secondary'] as const)('supports border widths for %s without leaking props to Pressable', (variant) => {
  const view = render(button('Save', { variant }));
  expect(wrapperStyle()).toMatchObject({ borderWidth: variant === 'primary' ? 0 : 1, borderColor: lightTheme.colors['core-outline-secondary'] });
  for (const [borderWidth, expected] of [[0, 0], [2.5, 2.5], [-1, 0], [NaN, 0], [Infinity, 0], [-Infinity, 0]] as const) {
   view.rerender(button('Save', { variant, borderWidth, borderColor: 'red' }));
   expect(wrapperStyle()).toMatchObject({ borderWidth: expected, borderColor: 'red' });
   expect(state.pressable).not.toHaveProperty('borderWidth');
   expect(state.pressable).not.toHaveProperty('borderColor');
  }
 });
 it('updates color alone and restores theme defaults without replacing the button', () => {
  const view = render(button('Save', { variant: 'secondary', borderWidth: 2, borderColor: 'red' }));
  const element = screen.getByRole('button');
  view.rerender(button('Save', { variant: 'secondary', borderWidth: 2, borderColor: 'blue' }));
  expect(wrapperStyle()).toMatchObject({ borderWidth: 2, borderColor: 'blue' });
  view.rerender(button('Save', { variant: 'secondary' }, 'dark'));
  expect(wrapperStyle()).toMatchObject({ borderWidth: 1, borderColor: darkTheme.colors['core-outline-secondary'] });
  expect(screen.getByRole('button')).toBe(element);
  view.rerender(button('Save', { variant: 'primary' }));
  expect(wrapperStyle().borderWidth).toBe(0);
 });
 it('preserves regular fallback borders across theme and disabled updates', () => {
  const view = render(button('Save', { borderWidth: 3, borderColor: 'transparent', borderRadius: 8, liquidGlassBackground: {} }));
  view.rerender(button('Save', { borderWidth: 3, borderColor: 'transparent', borderRadius: 8, liquidGlassBackground: {}, disabled: true }, 'dark'));
  expect(wrapperStyle()).toMatchObject({ borderWidth: 3, borderColor: 'transparent', borderRadius: 8, pointerEvents: 'none' });
  expect(state.glass).toEqual({});
 });

 it.each([
  [undefined, 1000], ['pill', 1000], ['rectangular', 4], [0, 0], [12.5, 12.5], [-4, 0], [Number.NaN, 0], [Infinity, 0],
 ] as const)('resolves regular fallback radii for %s', (borderRadius, expected) => {
  render(button('Save', { borderRadius, liquidGlassBackground: { glassStyle: 'clear', fallbackColor: 'blue' } }));
  expect(wrapperStyle()).toMatchObject({ borderRadius: expected });
  expect(state.glass).toEqual({});
  expect(state.pressable).not.toHaveProperty('borderRadius');
 });
 it('updates the fallback radius without losing button behavior', () => {
  const onPress = vi.fn();
  const view = render(button('Save', { onPress, borderRadius: 'pill', liquidGlassBackground: {} }));
  const element = screen.getByRole('button');
  view.rerender(button('Save', { onPress, borderRadius: 'rectangular', liquidGlassBackground: {} }));
  expect(wrapperStyle().borderRadius).toBe(4);
  expect(state.glass).toEqual({});
  expect(screen.getByRole('button')).toBe(element);
  fireEvent.click(element);
  expect(onPress).toHaveBeenCalledOnce();
  view.rerender(button('Save', { borderRadius: 0, liquidGlassBackground: {} }));
  expect(wrapperStyle().borderRadius).toBe(0);
  expect(state.glass).toEqual({});
 });

	it.each([
		{ size: undefined, height: 48 },
		{ size: 's' as const, height: 40 },
		{ size: 'm' as const, height: 48 },
		{ size: 'l' as const, height: 56 },
		{ size: 64, height: 64 },
	])('uses size $size as a minimum height while preserving label and icon sizing', ({ size, height }) => {
		render(button('Save', { size, icon: 'home', iconSize: 18 }));
		expect(wrapperStyle()).toMatchObject({ minHeight: height, width: 'auto' });
		expect(wrapperStyle()).not.toHaveProperty('height');
		expect(screen.getByTestId('icon').dataset.size).toBe('18');
		expect(state.pressable).not.toHaveProperty('size');
	});
	it.each([
		{ size: 's' as const, height: 40 },
		{ size: 'm' as const, height: 48 },
		{ size: 'l' as const, height: 56 },
		{ size: 60, height: 60 },
	])('matches icon-only width to size $size', ({ size, height }) => {
		render(button(undefined, { size, icon: 'home', accessibilityLabel: 'Go home' }));
		expect(wrapperStyle()).toMatchObject({ minHeight: height, width: height, borderRadius: 1000 });
		expect(screen.getByTestId('icon').dataset.size).toBe('24');
	});
	it('updates size and label-dependent width when props change', () => {
		const view = render(button('Save', { size: 's', icon: 'home' }));
		expect(wrapperStyle()).toMatchObject({ minHeight: 40, width: 'auto' });
		view.rerender(button(undefined, { size: 'l', icon: 'home', accessibilityLabel: 'Save' }));
		expect(wrapperStyle()).toMatchObject({ minHeight: 56, width: 56 });
		expect(pressableStyle()).toMatchObject({ paddingLeft: 0, paddingRight: 0 });
		view.rerender(button(0, { size: 72, icon: 'home' }));
		expect(wrapperStyle()).toMatchObject({ minHeight: 72, width: 'auto' });
		expect(screen.getByTestId('label').textContent).toBe('0');
	});

	it('uses primary styling, native button semantics, and forwards presses', () => {
		const onPress = vi.fn();
		render(button('Save', { onPress, testID: 'save', accessibilityHint: 'Saves changes' }));
		fireEvent.click(screen.getByRole('button'));
		expect(onPress).toHaveBeenCalledTimes(1);
		expect(state.pressable).toMatchObject({
			accessibilityRole: 'button',
			accessibilityState: { disabled: false },
			testID: 'save',
			accessibilityHint: 'Saves changes',
		});
		expect(wrapperStyle()).toMatchObject({
			backgroundColor: lightTheme.colors['core-button-primary'],
			borderWidth: 0,
			minHeight: 48,
		});
	});
	it.each(['primary', 'secondary'] as const)('disables %s presses and uses disabled theme colors', (variant) => {
		const onPress = vi.fn();
		render(button('Save', { variant, disabled: true, onPress, accessibilityState: { busy: true } }));
		fireEvent.click(screen.getByRole('button'));
		expect(onPress).not.toHaveBeenCalled();
		expect(state.pressable).toMatchObject({
			disabled: true,
			onPress: undefined,
			accessibilityState: { busy: true, disabled: true },
		});
		expect(wrapperStyle().backgroundColor).toBe(lightTheme.colors['core-surface-secondary']);
		expect(screen.getByTestId('label').dataset.color).toBe(lightTheme.colors['core-text-disabled']);
	});
	it('uses secondary styling and updates colors when the theme changes', () => {
		const view = render(button('Save', { variant: 'secondary', icon: 'home' }));
		expect(wrapperStyle()).toMatchObject({
			backgroundColor: lightTheme.colors['core-surface-primary'],
			borderWidth: 1,
			borderColor: lightTheme.colors['core-outline-secondary'],
		});
		expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-icon-primary']);
		view.rerender(button('Save', { variant: 'secondary', icon: 'home' }, 'dark'));
		expect(wrapperStyle().backgroundColor).toBe(darkTheme.colors['core-surface-primary']);
		expect(screen.getByTestId('label').dataset.color).toBe(darkTheme.colors['core-text-primary']);
		expect(screen.getByTestId('icon').dataset.color).toBe(darkTheme.colors['core-link-primary']);
	});
	it.each(['left', 'right'] as const)('places the icon on the %s with matching padding', (iconPosition) => {
		render(button('Save', { icon: 'home', iconPosition, iconSize: 20 }));
		const children = screen.getByRole('button').children;
		expect(children[iconPosition === 'left' ? 0 : 1]).toBe(screen.getByTestId('icon'));
		expect(screen.getByTestId('icon').dataset).toMatchObject({ name: 'home', size: '20', accessible: 'false' });
		expect(pressableStyle()).toMatchObject({
			paddingLeft: iconPosition === 'left' ? 16 : 22,
			paddingRight: iconPosition === 'right' ? 16 : 22,
		});
	});
	it('supports an accessible icon-only button and disabled icon colors', () => {
		render(button(undefined, { icon: 'home', disabled: true, accessibilityLabel: 'Go home' }));
		expect(screen.getByRole('button', { name: 'Go home' })).toBeTruthy();
		expect(screen.queryByTestId('label')).toBeNull();
		expect(wrapperStyle()).toMatchObject({ width: 48, minHeight: 48, borderRadius: 1000 });
		expect(pressableStyle()).toMatchObject({ paddingLeft: 0, paddingRight: 0 });
		expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-text-disabled']);
	});


	it.each([true, false])('uses the regular theme fallback for boolean glass=%s on non-iOS', (liquidGlassBackground) => {
		render(button(undefined, { label: 'Save', liquidGlassBackground }));
		expect(screen.getByTestId('label').textContent).toBe('Save');
		expect(wrapperStyle().backgroundColor).toBe(lightTheme.colors['core-button-primary']);
		expect(state.pressable).not.toHaveProperty('liquidGlassBackground');
	});
	it('supports label, typography, tint and logical insets on the regular fallback', () => {
		render(button(undefined, { label: 'Save', labelTextStyle: 'body-xl-medium', tintColor: 'core-text-special', contentInsets: { leading: 9, trailing: 11, top: 5, bottom: 7 }, iconGap: 10, liquidGlassBackground: { fallbackColor: 'blue' } }));
		expect(screen.getByTestId('label').textContent).toBe('Save');
		expect(screen.getByTestId('label').dataset.color).toBe(lightTheme.colors['core-text-special']);
		expect(pressableStyle()).toMatchObject({ paddingStart: 9, paddingEnd: 11, paddingTop: 5, paddingBottom: 7, gap: 10 });
		expect(wrapperStyle().backgroundColor).toBe('blue');
		for (const name of ['label', 'labelTextStyle', 'tintColor', 'contentInsets', 'iconGap']) expect(state.pressable).not.toHaveProperty(name);
	});
	it('renders a zero label with the regular button layout', () => {
		render(button(0));
		expect(screen.getByTestId('label').textContent).toBe('0');
		expect(wrapperStyle().width).toBe('auto');
		expect(pressableStyle().paddingHorizontal).toBe(16);
	});
	it('forwards transitions, animated styles, and native ripple overrides', () => {
		const layout = () => undefined;
		const entering = () => undefined;
		const exiting = () => undefined;
		const animatedStyle = { opacity: 0.4 };
		render(
			button('Save', { layout, presence: { entering, exiting }, animatedStyle, android_ripple: { color: 'red' } }),
		);
		expect(state.views[0].layout).toBe(layout);
		expect(state.views[1]).toMatchObject({ entering, exiting });
		expect(state.views[2].style.at(-1)).toBe(animatedStyle);
		expect(state.pressable.android_ripple).toEqual({ color: 'red' });
	});
});

it('resolves independent text and icon colors with shared tint as their fallback', () => {
    const view = render(button(undefined, { label: 'Save', icon: 'home', tintColor: 'core-text-primary',
        iconColor: 'core-icon-secondary', textColor: 'red' }));
    expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-icon-secondary']);
    expect(screen.getByTestId('label').dataset.color).toBe('red');
    expect(state.pressable).not.toHaveProperty('iconColor');
    expect(state.pressable).not.toHaveProperty('textColor');
    view.rerender(button(undefined, { label: 'Save', icon: 'home', tintColor: 'core-text-secondary', textColor: 'core-text-tertiary' }));
    expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-text-secondary']);
    expect(screen.getByTestId('label').dataset.color).toBe(lightTheme.colors['core-text-tertiary']);
    view.rerender(button(undefined, { label: 'Save', icon: 'home', disabled: true, iconColor: 'red', textColor: 'blue' }));
    expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-text-disabled']);
    expect(screen.getByTestId('label').dataset.color).toBe(lightTheme.colors['core-text-disabled']);
});
