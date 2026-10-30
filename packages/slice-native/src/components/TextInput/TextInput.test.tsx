// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useImperativeHandle } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SliceThemeProvider } from '../../providers/SliceThemeProvider';
import { darkTheme, lightTheme } from '../../theme';
import { GlassContentContext, useGlassContent } from '../LiquidGlass/GlassContentContext';
import { TextInput } from './TextInput';
import type { TextInputProps } from './_types';

const state = vi.hoisted(() => ({
	props: {} as any,
	wrapper: {} as any,
	focused: false,
	supportsLiquidGlass: false,
	platform: 'ios',
	glass: undefined as any,
	clear: vi.fn(),
	focus: vi.fn(),
	blur: vi.fn(),
}));
vi.mock('./inputColors', () => import('./inputColors.ios'));
vi.mock('react-native', async () => ({
    processColor: (await import('../../../tests/helpers/processColor')).processColor,
    DynamicColorIOS: (variants: any) => ({ dynamic: variants }),
	Platform: { OS: 'web' },
	useColorScheme: () => 'light',
	StyleSheet: { create: (s: unknown) => s, flatten: (style: any) => {
   if (!style) return undefined;
   return Object.assign({}, ...[style].flat(Infinity).filter(Boolean));
  } },
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
vi.mock('../../hooks', async (importOriginal) => ({
    ...await importOriginal<typeof import('../../hooks')>(),
    useDeviceCapabilities: () => ({ supportsLiquidGlass: state.supportsLiquidGlass, platform: state.platform }),
}));
vi.mock('../LiquidGlass', () => ({ LiquidGlass: (props: any) => {
    state.glass = props;
    return <GlassContentContext.Provider value={state.supportsLiquidGlass}><div data-testid="glass">{props.children}</div></GlassContentContext.Provider>;
} }));
vi.mock('react-native-reanimated', () => ({
	default: {
		View: (props: any) => {
			state.wrapper = props;
			return props.children;
		},
	},
}));
vi.mock('../Icon', () => ({
	Icon: (props: any) => {
        const inGlass = useGlassContent();
        return (
		<span
			data-testid="icon"
            data-glass={String(inGlass)}
			data-color={props.iconColor}
			data-size={props.size}
			data-accessible={String(props.accessible)}
		/>
	);
    },
}));
afterEach(cleanup);
beforeEach(() => {
	state.focused = false;
	state.supportsLiquidGlass = false;
	state.platform = 'ios';
	state.glass = undefined;
	vi.clearAllMocks();
});
const tree = (props: TextInputProps = {}, preference: 'light' | 'dark' = 'light') => (
	<SliceThemeProvider preference={preference}>
		<TextInput accessibilityLabel="Search" {...props} />
	</SliceThemeProvider>
);

describe('TextInput', () => {
    it('passes both palette variants as native dynamic colors only for supported glass', () => {
        state.supportsLiquidGlass = true;
        const view = render(tree({ liquidGlassBackground: {} }));
        const text = { dynamic: { light: lightTheme.colors['core-text-primary'], dark: darkTheme.colors['core-text-primary'] } };
        const placeholder = { dynamic: { light: lightTheme.colors['core-text-secondary'], dark: darkTheme.colors['core-text-secondary'] } };
        const resolved = () => Object.assign({}, ...state.props.style.flat(Infinity));
        expect(resolved().color).toEqual(text);
        expect(state.props.placeholderTextColor).toEqual(placeholder);
        const originalText = resolved().color;
        view.rerender(tree({ liquidGlassBackground: {} }, 'dark'));
        expect(resolved().color).toBe(originalText);
        expect(state.props.placeholderTextColor).toEqual(placeholder);
        state.supportsLiquidGlass = false;
        view.rerender(tree({ liquidGlassBackground: {} }, 'dark'));
        expect(resolved().color).toBe(darkTheme.colors['core-text-primary']);
        expect(state.props.placeholderTextColor).toBe(darkTheme.colors['core-text-secondary']);
    });
    it('resolves text and placeholder tokens to their native palette pairs', () => {
        state.supportsLiquidGlass = true;
        const view = render(tree({ liquidGlassBackground: {}, textColor: 'core-text-secondary', placeholderTextColor: 'core-text-tertiary' }));
        expect(Object.assign({}, ...state.props.style.flat(Infinity)).color).toEqual({ dynamic: {
            light: lightTheme.colors['core-text-secondary'], dark: darkTheme.colors['core-text-secondary'],
        } });
        expect(state.props.placeholderTextColor).toEqual({ dynamic: {
            light: lightTheme.colors['core-text-tertiary'], dark: darkTheme.colors['core-text-tertiary'],
        } });
        view.rerender(tree({ liquidGlassBackground: {}, textColor: 'red', placeholderTextColor: 'unknown', style: { color: 'orange' } }));
        const primary = { dynamic: { light: lightTheme.colors['core-text-primary'], dark: darkTheme.colors['core-text-primary'] } };
        expect(Object.assign({}, ...state.props.style.flat(Infinity)).color).toEqual(primary);
        expect(state.props.placeholderTextColor).toEqual(primary);
        view.rerender(tree({ textColor: 'purple', placeholderTextColor: 'pink' }));
        expect(Object.assign({}, ...state.props.style.flat(Infinity)).color).toBe('purple');
        expect(state.props.placeholderTextColor).toBe('pink');
    });
    it('resolves input icon tokens on regular inputs and forwards them to the glass icon renderer', () => {
        const view = render(tree({ icon: 'home', iconColor: 'core-icon-secondary' }));
        expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-icon-secondary']);
        state.supportsLiquidGlass = true;
        view.rerender(tree({ icon: 'home', iconColor: 'core-icon-secondary', liquidGlassBackground: {} }));
        expect(screen.getByTestId('icon').dataset.color).toBe('core-icon-secondary');
    });
    it('leaves glass icon tint with the native renderer across focus and theme updates', () => {
        state.supportsLiquidGlass = true;
        const props = { icon: 'search', hideIconOnFocus: false, textColor: 'purple', liquidGlassBackground: {} };
        const view = render(tree(props));
        expect(screen.getByTestId('icon').dataset.glass).toBe('true');
        expect(screen.getByTestId('icon').dataset.color).toBeUndefined();
        fireEvent.focus(screen.getByRole('textbox'));
        view.rerender(tree(props, 'dark'));
        expect(screen.getByTestId('icon').dataset.color).toBeUndefined();
        fireEvent.blur(screen.getByRole('textbox'));
        expect(screen.getByTestId('icon').dataset.color).toBeUndefined();
        expect(Object.assign({}, ...state.props.style.flat(Infinity)).color).toHaveProperty('dynamic');
    });
    it('preserves explicit glass icon colors and restores native tint when removed', () => {
        state.supportsLiquidGlass = true;
        const props = { icon: 'search', hideIconOnFocus: false, liquidGlassBackground: {} };
        const view = render(tree({ ...props, iconColor: 'red' }));
        expect(screen.getByTestId('icon').dataset.color).toBe('red');
        view.rerender(tree(props));
        expect(screen.getByTestId('icon').dataset.color).toBeUndefined();
        state.supportsLiquidGlass = false;
        view.rerender(tree({ ...props, textColor: 'purple' }));
        expect(screen.getByTestId('icon').dataset.glass).toBe('false');
        expect(screen.getByTestId('icon').dataset.color).toBe('purple');
    });

    it.each([true, {}])('uses default glass and 17pt typography for opt-in %s', (liquidGlassBackground) => {
        state.supportsLiquidGlass = true;
        render(tree({ liquidGlassBackground }));
        expect(screen.getByTestId('glass')).toBeTruthy();
        const resolved = Object.assign({}, ...state.props.style.flat(Infinity));
        expect(resolved.fontSize).toBe(17);
        expect(resolved.lineHeight).toBeCloseTo(20.4);
        expect(resolved.fontWeight).toBe(lightTheme.type['body-xl-bold'].fontWeight);
    });
    it('keeps boolean false on the ordinary input path', () => {
        state.supportsLiquidGlass = true;
        render(tree({ liquidGlassBackground: false }));
        expect(screen.queryByTestId('glass')).toBeNull();
    });

    it.each([false, true])('derives the 1.2 line height from overridden font size with glass=%s', (glass) => {
        state.supportsLiquidGlass = true;
        let liquidGlassBackground;
        if (glass) liquidGlassBackground = {};
        const view = render(tree({ style: [{ fontSize: 24 }, { fontSize: 18 }], liquidGlassBackground }));
        const resolved = Object.assign({}, ...state.props.style.flat(Infinity));
        expect(resolved.fontSize).toBe(18);
        expect(resolved.lineHeight).toBeCloseTo(21.6);
        view.rerender(tree({ style: { fontSize: 18, lineHeight: 30 }, liquidGlassBackground }));
        expect(Object.assign({}, ...state.props.style.flat(Infinity))).toMatchObject({ fontSize: 18, lineHeight: 30 });
    });

    it.each([undefined, 0, 3])('leaves the glass outline to UIKit even with borderWidth=%s', (borderWidth) => {
        state.supportsLiquidGlass = true;
        const view = render(tree({ borderWidth, borderColor: 'red', liquidGlassBackground: {} }));
        let border = Object.assign({}, ...state.wrapper.style.flat(Infinity));
        expect(border.borderWidth).toBe(0);
        expect(border).not.toHaveProperty('borderColor');
        state.supportsLiquidGlass = false;
        view.rerender(tree({ borderWidth, borderColor: 'red', liquidGlassBackground: {} }));
        border = Object.assign({}, ...state.wrapper.style.flat(Infinity));
        expect(border.borderWidth).toBe(borderWidth ?? 1);
        expect(border.borderColor).toBe('red');
    });

    it('nests the icon and editor inside supported glass and preserves them during glass updates', () => {
        state.supportsLiquidGlass = true;
        const view = render(tree({ icon: 'home', hideIconOnFocus: false, defaultValue: 'Keep me', liquidGlassBackground: {} }));
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.closest('[data-testid="glass"]')).toBe(screen.getByTestId('glass'));
        expect(screen.getByTestId('icon').closest('[data-testid="glass"]')).toBe(screen.getByTestId('glass'));
        expect(screen.getByTestId('icon').dataset.glass).toBe('true');
        expect(state.glass.style).toMatchObject({ flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', gap: 8 });
        expect(state.glass.style).not.toHaveProperty('position', 'absolute');
        fireEvent.change(input, { target: { value: 'Edited' } });
        fireEvent.focus(input);
        view.rerender(tree({ icon: 'home', hideIconOnFocus: false, defaultValue: 'Keep me', borderRadius: 12, liquidGlassBackground: {
            glassStyle: 'clear', glassTintColor: 'red', fallbackColor: 'blue',
        } }, 'dark'));
        expect(state.glass).toMatchObject({ cornerRadius: 12, glassStyle: 'clear', glassTintColor: 'red', fallbackColor: 'blue' });
        expect(Object.assign({}, ...state.wrapper.style.flat(Infinity)).backgroundColor).toBe('transparent');
        expect(state.props).not.toHaveProperty('liquidGlassBackground');
        expect(screen.getByRole('textbox')).toBe(input);
        expect(input.value).toBe('Edited');
        expect(state.clear).not.toHaveBeenCalled();
        expect(state.focus).not.toHaveBeenCalled();
    });
    it.each(['ios', 'android', 'web'])('keeps an ordinary editor without glass when not opted in on %s', (platform) => {
        state.platform = platform;
        state.supportsLiquidGlass = true;
        render(tree({ icon: 'home' }));
        expect(screen.queryByTestId('glass')).toBeNull();
        expect(screen.getByRole('textbox')).toBeTruthy();
        expect(screen.getByTestId('icon').dataset.glass).toBe('false');
    });
    it.each(['android', 'web'])('keeps the fallback on %s even if capability is incorrectly reported', (platform) => {
        state.platform = platform;
        state.supportsLiquidGlass = true;
        render(tree({ icon: 'home', liquidGlassBackground: {} }));
        expect(screen.queryByTestId('glass')).toBeNull();
        expect(screen.getByTestId('icon').dataset.glass).toBe('false');
    });
    it('retains controlled text when the glass opt-in changes', () => {
        state.supportsLiquidGlass = true;
        const view = render(tree({ value: 'Controlled' }));
        view.rerender(tree({ value: 'Controlled', liquidGlassBackground: {} }));
        expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Controlled');
        view.rerender(tree({ value: 'Controlled' }));
        expect(screen.queryByTestId('glass')).toBeNull();
        expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Controlled');
    });
    it('uses fallback colors on unsupported devices, with explicit background taking precedence', () => {
        const view = render(tree({ liquidGlassBackground: { fallbackColor: 'blue' } }));
        expect(screen.queryByTestId('glass')).toBeNull();
        expect(Object.assign({}, ...state.wrapper.style.flat(Infinity)).backgroundColor).toBe('blue');
        view.rerender(tree({ backgroundColor: 'pink', liquidGlassBackground: { fallbackColor: 'blue' } }));
        expect(Object.assign({}, ...state.wrapper.style.flat(Infinity)).backgroundColor).toBe('pink');
        state.supportsLiquidGlass = true;
        view.rerender(tree({ backgroundColor: 'pink', liquidGlassBackground: { fallbackColor: 'blue' } }));
        expect(Object.assign({}, ...state.wrapper.style.flat(Infinity)).backgroundColor).toBe('transparent');
    });
    it('preserves explicitly disabled accessibility and avoids redundant blur requests', () => {
        state.focused = false;
        render(tree({ focused: false, accessibilityState: { disabled: true } }));
        expect(state.blur).not.toHaveBeenCalled();
        expect(state.props.accessibilityState.disabled).toBe(true);
    });

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
	it('keeps placeholder overrides separate from the icon foreground across focus changes', () => {
		render(tree({ icon: 'home', hideIconOnFocus: false, placeholderTextColor: 'pink' }));
		expect(state.props.placeholderTextColor).toBe('pink');
		expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-text-primary']);
		fireEvent.focus(screen.getByRole('textbox'));
		expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-text-primary']);
		fireEvent.blur(screen.getByRole('textbox'));
		expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-text-primary']);
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
		expect(Object.assign({}, ...state.props.style.flat(Infinity))).toMatchObject(style);
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
	it('uses the text foreground for icons across focus and theme changes', () => {
		const view = render(tree({ icon: 'home', hideIconOnFocus: false }));
		expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-text-primary']);
		fireEvent.focus(screen.getByRole('textbox'));
		expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-text-primary']);
		view.rerender(tree({ icon: 'home', hideIconOnFocus: false }, 'dark'));
		expect(screen.getByTestId('icon').dataset.color).toBe(darkTheme.colors['core-text-primary']);
		expect(state.props.placeholderTextColor).toBe(darkTheme.colors['core-text-secondary']);
	});
	it('follows textColor overrides unless iconColor is explicitly set', () => {
		const view = render(tree({ icon: 'home', hideIconOnFocus: false, textColor: 'purple' }));
		expect(screen.getByTestId('icon').dataset.color).toBe('purple');
		fireEvent.focus(screen.getByRole('textbox'));
		expect(screen.getByTestId('icon').dataset.color).toBe('purple');
		view.rerender(tree({ icon: 'home', hideIconOnFocus: false, textColor: 'purple', iconColor: 'orange' }));
		expect(screen.getByTestId('icon').dataset.color).toBe('orange');
	});

	it('forwards layout and placeholder overrides and exposes non-editable state', () => {
		const layout = () => undefined;
		render(tree({ layout, placeholderTextColor: 'pink', editable: false }));
		expect(state.wrapper.layout).toBe(layout);
		expect(state.props.placeholderTextColor).toBe('pink');
		expect(state.props.accessibilityState.disabled).toBe(true);
	});
});

describe('regular input style overrides', () => {
 const surface = () => Object.assign({}, ...state.wrapper.style.flat(Infinity));
 const editor = () => Object.assign({}, ...state.props.style.flat(Infinity));
 it('routes box styling to the wrapper and typography to the editor', () => {
  const style = Object.freeze({ borderRadius: 8, borderWidth: 3, borderColor: 'blue', backgroundColor: 'purple', height: 32, width: 180, marginTop: 10, paddingHorizontal: 6, paddingVertical: 4, color: 'red', fontSize: 20, fontWeight: '600' as const });
  render(tree({ style: [false, { opacity: 0.9 }, style] }));
  expect(surface()).toMatchObject({ borderRadius: 8, borderWidth: 3, borderColor: 'blue', backgroundColor: 'purple', height: 32, minHeight: 32, width: 180, marginTop: 10, opacity: 0.9, paddingLeft: 6, paddingRight: 6, paddingTop: 4, paddingBottom: 4 });
  expect(surface()).not.toHaveProperty('fontSize');
  expect(surface()).not.toHaveProperty('color');
  expect(editor()).toMatchObject({ fontSize: 20, fontWeight: '600', color: 'red', lineHeight: 24, paddingLeft: 0, paddingRight: 0 });
  for (const key of ['backgroundColor', 'borderRadius', 'borderWidth', 'width', 'height', 'marginTop', 'paddingHorizontal']) expect(editor()).not.toHaveProperty(key);
 });
 it('prioritizes explicit props over style values, including zero, and restores defaults', () => {
  const style = { borderRadius: 8, borderTopLeftRadius: 16, borderWidth: 2, borderTopWidth: 5, borderColor: 'red', borderTopColor: 'pink', backgroundColor: 'purple', minHeight: 24, color: 'blue' };
  const view = render(tree({ style, borderRadius: 0, borderWidth: 0, borderColor: 'transparent', backgroundColor: 'transparent', size: 64, textColor: 'red', defaultValue: 'Keep me' }));
  expect(surface()).toMatchObject({ borderRadius: 0, borderWidth: 0, borderColor: 'transparent', backgroundColor: 'transparent', minHeight: 64 });
  expect(editor().color).toBe('red');
  for (const key of ['borderTopLeftRadius', 'borderTopWidth', 'borderTopColor']) expect(surface()).not.toHaveProperty(key);
  const element = screen.getByRole('textbox');
  view.rerender(tree({ style, defaultValue: 'Keep me' }));
  expect(surface()).toMatchObject({ borderRadius: 8, borderTopLeftRadius: 16, borderWidth: 2, borderTopWidth: 5, backgroundColor: 'purple', minHeight: 24 });
  expect(editor().color).toBe('blue');
  expect(screen.getByRole('textbox')).toBe(element);
  view.rerender(tree());
  expect(surface()).toMatchObject({ minHeight: 48, borderRadius: 1000, borderWidth: 1, backgroundColor: lightTheme.colors['core-surface-primary'] });
  expect(state.clear).not.toHaveBeenCalled();
 });
 it('preserves the existing glass editor style path and uses wrapper styles on fallback', () => {
  state.supportsLiquidGlass = true;
  const props = { style: { borderRadius: 8, backgroundColor: 'purple', minHeight: 24, color: '#405261', fontSize: 20 }, borderRadius: 12, textColor: 'core-text-primary' as const, liquidGlassBackground: true };
  const view = render(tree(props));
  expect(surface()).toMatchObject({ borderRadius: 12, backgroundColor: 'transparent', minHeight: 48, borderWidth: 0 });
  expect(editor()).toMatchObject({ borderRadius: 8, backgroundColor: 'purple', minHeight: 24, fontSize: 20 });
  expect(editor().color).toEqual({ dynamic: { light: lightTheme.colors['core-text-secondary'], dark: darkTheme.colors['core-text-secondary'] } });
  expect(state.glass.cornerRadius).toBe(12);
  state.supportsLiquidGlass = false;
  view.rerender(tree(props));
  expect(surface()).toMatchObject({ borderRadius: 12, backgroundColor: 'purple', minHeight: 24 });
  expect(editor().color).toBe(lightTheme.colors['core-text-primary']);
  expect(editor()).not.toHaveProperty('borderRadius');
 });
});
