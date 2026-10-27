// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useImperativeHandle } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SliceThemeProvider } from '../../providers/SliceThemeProvider';
import { darkTheme, lightTheme } from '../../theme';
import { SliceTextInput } from './SliceTextInput';
import type { SliceTextInputProps } from './_types';

const state = vi.hoisted(() => ({
	props: {} as any,
	wrapper: {} as any,
	focused: false,
	clear: vi.fn(),
	focus: vi.fn(),
	blur: vi.fn(),
}));
vi.mock('react-native', () => ({
	useColorScheme: () => 'light',
	StyleSheet: { create: (s: unknown) => s },
	View: ({ children }: any) => children,
	TextInput: ({ ref, ...props }: any) => {
		state.props = props;
		useImperativeHandle(ref, () => ({
			clear: state.clear,
			focus: state.focus,
			blur: state.blur,
			isFocused: () => state.focused,
		}));
		return (
			<input
				aria-label={props.accessibilityLabel}
				placeholder={props.placeholder}
				value={props.value}
				defaultValue={props.defaultValue}
				onChange={(e) => props.onChangeText?.(e.target.value)}
				onFocus={props.onFocus}
				onBlur={props.onBlur}
			/>
		);
	},
}));
vi.mock('react-native-reanimated', () => ({
	default: {
		View: (props: any) => {
			state.wrapper = props;
			return props.children;
		},
	},
}));
vi.mock('../SliceIcon', () => ({
	SliceIcon: (props: any) => (
		<span
			data-testid="icon"
			data-color={props.strokeColor}
			data-size={props.size}
			data-accessible={String(props.accessible)}
		/>
	),
}));
afterEach(cleanup);
beforeEach(() => {
	state.focused = false;
	vi.clearAllMocks();
});
const tree = (props: SliceTextInputProps = {}, preference: 'light' | 'dark' = 'light') => (
	<SliceThemeProvider preference={preference}>
		<SliceTextInput accessibilityLabel="Search" {...props} />
	</SliceThemeProvider>
);

describe('SliceTextInput', () => {
 it('updates wrapper backgrounds and theme defaults without losing text or focus', () => {
  const view = render(tree({ defaultValue: 'Initial' }));
  const input = screen.getByRole('textbox') as HTMLInputElement;
  const wrapperStyle = () => Object.assign({}, ...state.wrapper.style.flat(Infinity));
  expect(wrapperStyle().backgroundColor).toBe(lightTheme.colors['core-surface-primary']);
  fireEvent.change(input, { target: { value: 'Edited' } });
  fireEvent.focus(input);
  for (const backgroundColor of ['red', 'blue', 'transparent']) {
   view.rerender(tree({ defaultValue: 'Initial', backgroundColor }, 'dark'));
   expect(wrapperStyle().backgroundColor).toBe(backgroundColor);
   expect(state.props).not.toHaveProperty('backgroundColor');
   expect(screen.getByRole('textbox')).toBe(input);
   expect(input.value).toBe('Edited');
  }
  view.rerender(tree({ defaultValue: 'Initial' }, 'dark'));
  expect(wrapperStyle().backgroundColor).toBe(darkTheme.colors['core-surface-primary']);
  expect(state.clear).not.toHaveBeenCalled();
  expect(state.focus).not.toHaveBeenCalled();
  expect(state.blur).not.toHaveBeenCalled();
 });

 it('preserves default borders and follows theme changes', () => {
  const view = render(tree());
  expect(Object.assign({}, ...state.wrapper.style.flat(Infinity))).toMatchObject({ borderWidth: 1, borderColor: lightTheme.colors['core-outline-secondary'] });
  view.rerender(tree({}, 'dark'));
  expect(Object.assign({}, ...state.wrapper.style.flat(Infinity))).toMatchObject({ borderWidth: 1, borderColor: darkTheme.colors['core-outline-secondary'] });
 });
 it.each([[0, 0], [2.5, 2.5], [-1, 0], [NaN, 0], [Infinity, 0], [-Infinity, 0]])('normalizes border width %s and keeps border props off TextInput', (borderWidth, expected) => {
  render(tree({ borderWidth, borderColor: 'red' }));
  expect(Object.assign({}, ...state.wrapper.style.flat(Infinity))).toMatchObject({ borderWidth: expected, borderColor: 'red' });
  expect(state.props).not.toHaveProperty('borderWidth');
  expect(state.props).not.toHaveProperty('borderColor');
 });
 it('updates color alone without losing text or focus and restores defaults', () => {
  const view = render(tree({ defaultValue: 'Keep me', borderWidth: 2, borderColor: 'red' }));
  const input = screen.getByRole('textbox') as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'Edited' } });
  fireEvent.focus(input);
  state.focused = true;
  view.rerender(tree({ defaultValue: 'Keep me', borderWidth: 2, borderColor: 'blue' }));
  expect(Object.assign({}, ...state.wrapper.style.flat(Infinity))).toMatchObject({ borderWidth: 2, borderColor: 'blue' });
  view.rerender(tree({ defaultValue: 'Keep me', borderWidth: 2, borderColor: 'blue' }, 'dark'));
  expect(Object.assign({}, ...state.wrapper.style.flat(Infinity)).borderColor).toBe('blue');
  view.rerender(tree({ defaultValue: 'Keep me' }, 'dark'));
  expect(Object.assign({}, ...state.wrapper.style.flat(Infinity))).toMatchObject({ borderWidth: 1, borderColor: darkTheme.colors['core-outline-secondary'] });
  expect(screen.getByRole('textbox')).toBe(input);
  expect(input.value).toBe('Edited');
  expect(state.clear).not.toHaveBeenCalled();
  expect(state.focus).not.toHaveBeenCalled();
  expect(state.blur).not.toHaveBeenCalled();
 });

 it.each([
  [undefined, 1000], ['pill', 1000], ['rectangular', 4], [0, 0], [12.5, 12.5], [-4, 0], [Number.NaN, 0], [Infinity, 0],
 ] as const)('applies radius %s to the wrapper only', (borderRadius, expected) => {
  render(tree({ borderRadius }));
  expect(Object.assign({}, ...state.wrapper.style.flat(Infinity)).borderRadius).toBe(expected);
  expect(state.props).not.toHaveProperty('borderRadius');
 });
 it('changes radius without remounting, clearing text, or driving focus', () => {
  const view = render(tree({ borderRadius: 'pill', defaultValue: 'Keep me' }));
  const input = screen.getByRole('textbox') as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'Edited' } });
  for (const [borderRadius, expected] of [['rectangular', 4], [0, 0], [undefined, 1000]] as const) {
   view.rerender(tree({ borderRadius, defaultValue: 'Keep me' }));
   expect(Object.assign({}, ...state.wrapper.style.flat(Infinity)).borderRadius).toBe(expected);
   expect(screen.getByRole('textbox')).toBe(input);
   expect(input.value).toBe('Edited');
  }
  expect(state.clear).not.toHaveBeenCalled();
  expect(state.focus).not.toHaveBeenCalled();
  expect(state.blur).not.toHaveBeenCalled();
 });

	it.each([
		{ size: undefined, height: 48 },
		{ size: 's' as const, height: 40 },
		{ size: 'm' as const, height: 48 },
		{ size: 'l' as const, height: 56 },
		{ size: 68, height: 68 },
	])('uses size $size as a minimum height without fixing multiline height', ({ size, height }) => {
		render(tree({ size, multiline: true, icon: 'home', iconSize: 18 }));
		const wrapperStyle = Object.assign({}, ...state.wrapper.style.flat(Infinity));
		expect(wrapperStyle.minHeight).toBe(height);
		expect(wrapperStyle).not.toHaveProperty('height');
		expect(state.props.multiline).toBe(true);
		expect(state.props).not.toHaveProperty('size');
		expect(screen.getByTestId('icon').dataset.size).toBe('18');
	});
	it('updates size without remounting or clearing the input', () => {
		const view = render(tree({ size: 's', defaultValue: 'Keep this text' }));
		const input = screen.getByRole('textbox') as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'Edited text' } });
		view.rerender(tree({ size: 64, defaultValue: 'Keep this text' }));
		expect(Object.assign({}, ...state.wrapper.style.flat(Infinity)).minHeight).toBe(64);
		expect(screen.getByRole('textbox')).toBe(input);
		expect(input.value).toBe('Edited text');
		expect(state.clear).not.toHaveBeenCalled();
		view.rerender(tree({ defaultValue: 'Keep this text' }));
		expect(Object.assign({}, ...state.wrapper.style.flat(Infinity)).minHeight).toBe(48);
	});
	it('uses an overridden placeholder color for the idle icon and restores it after blur', () => {
		render(tree({ icon: 'home', hideIconOnFocus: false, placeholderTextColor: 'pink' }));
		expect(screen.getByTestId('icon').dataset.color).toBe('pink');
		fireEvent.focus(screen.getByRole('textbox'));
		expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-icon-primary']);
		fireEvent.blur(screen.getByRole('textbox'));
		expect(screen.getByTestId('icon').dataset.color).toBe('pink');
	});

	it('preserves initial text without clearing or forcing focus', () => {
		render(tree({ defaultValue: 'Initial' }));
		expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Initial');
		expect(state.clear).not.toHaveBeenCalled();
		expect(state.focus).not.toHaveBeenCalled();
		expect(state.blur).not.toHaveBeenCalled();
	});
	it('forwards accessibility and native input props, style overrides, and text changes', () => {
		const onChangeText = vi.fn();
		const style = { fontSize: 24 };
		render(
			tree({
				onChangeText,
				style,
				accessibilityHint: 'Search your tasks',
				accessibilityState: { busy: true },
				keyboardType: 'email-address',
				secureTextEntry: true,
			}),
		);
		fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: 'Hello' } });
		expect(onChangeText).toHaveBeenCalledWith('Hello');
		expect(state.props).toMatchObject({
			accessibilityHint: 'Search your tasks',
			accessibilityState: { busy: true },
			keyboardType: 'email-address',
			secureTextEntry: true,
		});
		expect(state.props.style.at(-1)).toBe(style);
	});
	it('composes focus callbacks and shows the icon again after blur without clearing by default', () => {
		const onFocus = vi.fn(),
			onBlur = vi.fn(),
			didFocus = vi.fn();
		render(tree({ icon: 'home', onFocus, onBlur, didFocus }));
		expect(screen.getByTestId('icon').dataset.accessible).toBe('false');
		fireEvent.focus(screen.getByRole('textbox'));
		expect(screen.queryByTestId('icon')).toBeNull();
		expect(onFocus).toHaveBeenCalledTimes(1);
		expect(didFocus).toHaveBeenLastCalledWith(true);
		fireEvent.blur(screen.getByRole('textbox'));
		expect(screen.getByTestId('icon')).toBeTruthy();
		expect(onBlur).toHaveBeenCalledTimes(1);
		expect(didFocus).toHaveBeenLastCalledWith(false);
		expect(state.clear).not.toHaveBeenCalled();
	});
	it('clears only on blur when requested and notifies controlled consumers', () => {
		const onChangeText = vi.fn();
		render(tree({ blurClears: true, value: 'Saved', onChangeText }));
		expect(state.clear).not.toHaveBeenCalled();
		fireEvent.blur(screen.getByRole('textbox'));
		expect(state.clear).toHaveBeenCalledTimes(1);
		expect(onChangeText).toHaveBeenCalledWith('');
	});
	it('drives native focus only when requested and avoids redundant focus calls', () => {
		const view = render(tree({ focused: true }));
		expect(state.focus).toHaveBeenCalledTimes(1);
		state.focused = true;
		view.rerender(tree({ focused: false }));
		expect(state.blur).toHaveBeenCalledTimes(1);
		view.rerender(tree({ focused: true }));
		expect(state.focus).toHaveBeenCalledTimes(1);
	});
	it('keeps icons visible on focus when requested and supports explicit colors and sizes', () => {
		render(tree({ icon: 'home', hideIconOnFocus: false, iconColor: 'red', iconSize: 20 }));
		fireEvent.focus(screen.getByRole('textbox'));
		expect(screen.getByTestId('icon').dataset).toMatchObject({ color: 'red', size: '20' });
	});
	it('uses placeholder color while idle and theme color while focused', () => {
		const view = render(tree({ icon: 'home', hideIconOnFocus: false }));
		expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-text-tertiary']);
		fireEvent.focus(screen.getByRole('textbox'));
		expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-icon-primary']);
		view.rerender(tree({ icon: 'home', hideIconOnFocus: false }, 'dark'));
		expect(screen.getByTestId('icon').dataset.color).toBe(darkTheme.colors['core-link-primary']);
		expect(state.props.placeholderTextColor).toBe(darkTheme.colors['core-text-tertiary']);
	});
	it('forwards layout and placeholder overrides and exposes non-editable state', () => {
		const layout = () => undefined;
		render(tree({ layout, placeholderTextColor: 'pink', editable: false }));
		expect(state.wrapper.layout).toBe(layout);
		expect(state.props.placeholderTextColor).toBe('pink');
		expect(state.props.accessibilityState.disabled).toBe(true);
	});
});
