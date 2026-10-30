// @vitest-environment jsdom
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SliceThemeProvider } from '../../providers/SliceThemeProvider';
import { lightTheme } from '../../theme';
import { Button } from './Button.ios';

const state = vi.hoisted(() => ({
	platform: 'ios',
	supported: true,
	native: {} as any,
	regular: {} as any,
	views: [] as any[],
	typographyOverride: undefined as Record<string, unknown> | undefined,
}));
vi.mock('../../hooks', () => ({
	useDeviceCapabilities: () => ({ platform: state.platform, supportsLiquidGlass: state.supported }),
}));
vi.mock('../../providers', async (importOriginal) => {
	const actual = await importOriginal<typeof import('../../providers')>();
	return {
		...actual,
		useSliceContext: () => {
			const context = actual.useSliceContext();
			if (!state.typographyOverride) return context;
			return {
				...context,
				theme: {
					...context.theme,
					type: { ...context.theme.type, 'body-xl-bold': state.typographyOverride },
				},
			};
		},
	};
});
vi.mock('react-native', async () => ({
    processColor: (await import('../../../tests/helpers/processColor')).processColor,
	useColorScheme: () => 'light',
	StyleSheet: { absoluteFill: { position: 'absolute', inset: 0 } },
}));
vi.mock('react-native-reanimated', () => ({
	default: {
		View: (props: any) => {
			state.views.push(props);
			return props.children;
		},
	},
}));
vi.mock('./ButtonRegular', () => ({
	ButtonRegular: (props: any) => {
		state.regular = props;
		return <div data-testid="regular">{props.label ?? props.children}</div>;
	},
}));
vi.mock('../../specs/GlassButtonNativeComponent', () => ({
	default: (props: any) => {
		state.native = props;
		return (
			<button data-testid="native" disabled={props.disabled}>
				{props.label}
			</button>
		);
	},
}));
afterEach(cleanup);
beforeEach(() => {
	state.platform = 'ios';
	state.supported = true;
	state.native = {};
	state.regular = {};
	state.views = [];
	state.typographyOverride = undefined;
});
function button(props: any = {}, preference: 'light' | 'dark' | 'system' = 'system') {
	return (
		<SliceThemeProvider preference={preference}>
			<Button label="Save" liquidGlassBackground={{}} {...props} />
		</SliceThemeProvider>
	);
}
const wrapperStyle = () => Object.assign({}, ...state.views.at(-1).style);
function emit(kind: string) {
	state.native.onButtonEvent({
		currentTarget: 42,
		nativeEvent: { kind, locationX: 2, locationY: 3, pageX: 12, pageY: 13, timestamp: 100 },
		persist: () => undefined,
	});
}
describe('native Liquid Glass Button', () => {
	it.each([
		['ios', false, {}],
		['android', true, {}],
		['web', true, {}],
		['ios', true, undefined],
		['ios', true, false],
	])('uses regular rendering on %s when unsupported or not opted in', (platform, supported, liquidGlassBackground) => {
		state.platform = platform;
		state.supported = supported;
		render(button({ liquidGlassBackground }));
		expect(screen.getByTestId('regular').textContent).toBe('Save');
		expect(state.native).toEqual({});
	});

	it('accepts boolean shorthand and switches back to regular rendering when false', () => {
		const view = render(button({ liquidGlassBackground: true }));
		expect(screen.getByTestId('native').textContent).toBe('Save');
		expect(state.native).toMatchObject({ glassStyle: 'regular' });
		view.rerender(button({ liquidGlassBackground: { glassStyle: 'clear', glassTintColor: 'red' } }));
		expect(state.native).toMatchObject({ glassStyle: 'clear', glassTintColor: 'red' });
		view.rerender(button({ liquidGlassBackground: false, children: 'Legacy content', label: undefined }));
		expect(screen.getByTestId('regular').textContent).toBe('Legacy content');
		expect(screen.queryByTestId('native')).toBeNull();
	});
	it('uses native label/icon assets and excludes solid background, borders, variant and children', () => {
		render(
			button({
				icon: 'home',
				iconPosition: 'right',
				iconSize: 18,
				size: 'l',
				variant: 'secondary',
				backgroundColor: 'red',
				borderWidth: 4,
				borderColor: 'blue',
			}),
		);
		expect(state.native).toMatchObject({
			label: 'Save',
			iconName: 'home',
			iconPosition: 'right',
			iconSize: 18,
			minimumSize: 56,
			paddingLeading: 22,
			paddingTrailing: 16,
		});
		for (const prop of ['backgroundColor', 'borderWidth', 'borderColor', 'children', 'variant'])
			expect(state.native).not.toHaveProperty(prop);
		expect(wrapperStyle()).not.toHaveProperty('backgroundColor');
		expect(wrapperStyle()).not.toHaveProperty('borderWidth');
		expect(state.regular).toEqual({});
	});
	it('preserves native identity while updating theme, typography, tint, insets, clear glass and radius', () => {
		const view = render(button());
		const control = screen.getByTestId('native');
		view.rerender(
			button(
				{
					label: 'Done',
					liquidGlassBackground: { glassStyle: 'clear', glassTintColor: 'red' },
					tintColor: 'core-text-primary',
					labelTextStyle: 'body-xl-medium',
					contentInsets: { leading: 8, trailing: 10, top: 4, bottom: 6 },
					iconGap: 9,
					borderRadius: 12,
				},
				'dark',
			),
		);
		expect(screen.getByTestId('native')).toBe(control);
		expect(state.native).toMatchObject({
			themePreference: 'dark',
			glassStyle: 'clear',
			glassTintColor: 'red',
			tintToken: 'core-text-primary',
			cornerRadius: 12,
			paddingLeading: 8,
			paddingTrailing: 10,
			paddingTop: 4,
			paddingBottom: 6,
			iconGap: 9,
			fontFamily: lightTheme.type['body-xl-medium'].fontFamily,
			fontSize: lightTheme.type['body-xl-medium'].fontSize,
			fontWeight: String(lightTheme.type['body-xl-medium'].fontWeight),
		});
	});
	it('forwards press callbacks with touch-shaped native coordinates and suppresses disabled actions', () => {
		const handlers = { onPress: vi.fn(), onPressIn: vi.fn(), onPressOut: vi.fn(), onLongPress: vi.fn() };
		const view = render(button(handlers));
		for (const kind of ['press', 'pressIn', 'pressOut', 'longPress']) emit(kind);
		for (const handler of Object.values(handlers)) expect(handler).toHaveBeenCalledOnce();
		expect(handlers.onPress.mock.calls[0][0].nativeEvent).toMatchObject({
			locationX: 2,
			locationY: 3,
			pageX: 12,
			pageY: 13,
			target: 42,
			touches: [],
		});
		expect(state.native.hasLongPress).toBe(true);
		view.rerender(button({ ...handlers, disabled: true, accessibilityState: { busy: true } }));
		for (const kind of ['press', 'pressIn', 'pressOut', 'longPress']) emit(kind);
		for (const handler of Object.values(handlers)) expect(handler).toHaveBeenCalledOnce();
		expect(state.native).toMatchObject({ disabled: true, accessibilityState: { busy: true, disabled: true } });
	});

	it.each([
		['press', 'onPress'],
		['pressIn', 'onPressIn'],
		['pressOut', 'onPressOut'],
		['longPress', 'onLongPress'],
	])('adapts getter-only native events for %s without mutating the source event', (kind, handlerName) => {
		class ReadonlyNativeEvent {
			#payload = { kind, locationX: 2, locationY: 3, pageX: 12, pageY: 13, timestamp: 100 };
			#target = 42;
			#defaultPrevented = false;
			#propagationStopped = false;
			#persisted = false;

			get nativeEvent() {
				return this.#payload;
			}
			get currentTarget() {
				return this.#target;
			}
			get defaultPrevented() {
				return this.#defaultPrevented;
			}
			get persisted() {
				return this.#persisted;
			}
			preventDefault() {
				this.#defaultPrevented = true;
			}
			stopPropagation() {
				this.#propagationStopped = true;
			}
			isDefaultPrevented() {
				return this.#defaultPrevented;
			}
			isPropagationStopped() {
				return this.#propagationStopped;
			}
			persist() {
				this.#persisted = true;
			}
		}

		const handler = vi.fn();
		render(button({ [handlerName]: handler }));
		const source = Object.freeze(new ReadonlyNativeEvent());
		const sourcePayload = source.nativeEvent;
		expect(() => state.native.onButtonEvent(source)).not.toThrow();
		expect(handler).toHaveBeenCalledOnce();

		const adapted = handler.mock.calls[0][0];
		expect(adapted.nativeEvent).toMatchObject({
			kind,
			locationX: 2,
			locationY: 3,
			pageX: 12,
			pageY: 13,
			target: 42,
			touches: [],
		});
		expect(adapted.nativeEvent.changedTouches).toHaveLength(1);
		expect(adapted.currentTarget).toBe(42);
		expect(adapted.isDefaultPrevented()).toBe(false);
		expect(adapted.isPropagationStopped()).toBe(false);
		adapted.preventDefault();
		adapted.stopPropagation();
		adapted.persist();
		expect(adapted.defaultPrevented).toBe(true);
		expect(adapted.isDefaultPrevented()).toBe(true);
		expect(adapted.isPropagationStopped()).toBe(true);
		expect(source.defaultPrevented).toBe(true);
		expect(source.isPropagationStopped()).toBe(true);
		expect(source.persisted).toBe(true);
		expect(source.nativeEvent).toBe(sourcePayload);
		expect(source.nativeEvent).not.toHaveProperty('touches');
	});
	it('sizes to native content and keeps the minimum size without remounting', () => {
		render(button({ size: 's' }));
		const control = screen.getByTestId('native');
		act(() => state.native.onIntrinsicSizeChange({ nativeEvent: { width: 128, height: 52 } }));
		expect(wrapperStyle()).toMatchObject({ width: 128, minHeight: 52, maxWidth: '100%' });
		expect(screen.getByTestId('native')).toBe(control);
		act(() => state.native.onIntrinsicSizeChange({ nativeEvent: { width: Number.NaN, height: 52 } }));
		expect(wrapperStyle().width).toBe(128);
	});

	it('keeps layout stable when native measurements repeat', () => {
		render(button());
		const control = screen.getByTestId('native');
		const onSizeChange = state.native.onIntrinsicSizeChange;
		act(() => onSizeChange({ nativeEvent: { width: 128, height: 52 } }));
		act(() => onSizeChange({ nativeEvent: { width: 128, height: 52 } }));
		expect(wrapperStyle()).toMatchObject({ width: 128, minHeight: 52 });
		expect(state.native.onIntrinsicSizeChange).toBe(onSizeChange);
		expect(screen.getByTestId('native')).toBe(control);
	});

	it.each([
		{ width: Number.NaN, height: 52 },
		{ width: 128, height: Number.NaN },
		{ width: Number.POSITIVE_INFINITY, height: 52 },
		{ width: 128, height: Number.NEGATIVE_INFINITY },
		{ width: -1, height: 52 },
		{ width: 128, height: -1 },
	])('ignores malformed native size $width × $height without disturbing valid layout', (measurement) => {
		render(button());
		act(() => state.native.onIntrinsicSizeChange({ nativeEvent: { width: 128, height: 52 } }));
		act(() => state.native.onIntrinsicSizeChange({ nativeEvent: measurement }));
		expect(wrapperStyle()).toMatchObject({ width: 128, minHeight: 52 });
	});

	it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
		'falls back to 48 points for non-finite size %s',
		(size) => {
			render(button({ size }));
			expect(state.native.minimumSize).toBe(48);
			expect(wrapperStyle()).toMatchObject({ width: 48, minHeight: 48 });
		},
	);

	it('clamps negative requested sizes and accepts a zero native measurement', () => {
		render(button({ size: -8 }));
		expect(state.native.minimumSize).toBe(0);
		act(() => state.native.onIntrinsicSizeChange({ nativeEvent: { width: 0, height: 0 } }));
		expect(wrapperStyle()).toMatchObject({ width: 0, minHeight: 0 });
	});

	it('supplies native defaults when the typography token omits optional fields', () => {
		state.typographyOverride = { fontSize: 18 };
		render(button());
		expect(state.native).toMatchObject({ fontSize: 18, fontWeight: '400', letterSpacing: 0 });
	});

	it('preserves explicit accessibility overrides and custom long-press timing', () => {
		render(
			button({
				accessible: false,
				accessibilityRole: 'link',
				accessibilityLabel: 'Save document',
				accessibilityValue: { text: 'Ready' },
				delayLongPress: 750,
			}),
		);
		expect(state.native).toMatchObject({
			accessible: false,
			accessibilityRole: 'link',
			accessibilityLabel: 'Save document',
			accessibilityValue: { text: 'Ready' },
			delayLongPress: 750,
			hasLongPress: false,
		});
	});

	it('safely ignores native events when no handler is registered or the event kind is unknown', () => {
		render(button());
		expect(() => {
			emit('press');
			emit('pressIn');
			emit('pressOut');
			emit('longPress');
			emit('unknown');
		}).not.toThrow();
		expect(screen.getByTestId('native').textContent).toBe('Save');
	});
	it('supports icon-only sizing, accessibility and animation wrappers', () => {
		const layout = vi.fn(),
			entering = vi.fn(),
			exiting = vi.fn();
		const animatedStyle = { opacity: 0.5 };
		render(
			button({
				label: undefined,
				icon: 'home',
				accessibilityLabel: 'Go home',
				accessibilityHint: 'Opens home',
				testID: 'home',
				layout,
				presence: { entering, exiting },
				animatedStyle,
			}),
		);
		expect(state.native).toMatchObject({
			label: '',
			iconName: 'home',
			accessibilityLabel: 'Go home',
			accessibilityHint: 'Opens home',
			accessibilityRole: 'button',
			testID: 'home',
			paddingLeading: 0,
			paddingTrailing: 0,
			themePreference: 'system',
		});
		expect(wrapperStyle()).toMatchObject({ width: 48, minHeight: 48, opacity: 0.5 });
		expect(state.views[0].layout).toBe(layout);
		expect(state.views[1]).toMatchObject({ entering, exiting });
	});
	it('rejects arbitrary children on native glass', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		expect(() => render(button({ children: <span>Unsupported</span> }))).toThrow(
			'accepts label and icon, not children',
		);
		error.mockRestore();
	});
});

it('resolves button foreground literals to assets and falls back for unmatched colors', () => {
    const view = render(button({ tintColor: 'core-text-secondary' }));
    expect(state.native.tintToken).toBe('core-text-secondary');
    view.rerender(button({ tintColor: '#405261' }));
    expect(state.native.tintToken).toBe('core-text-secondary');
    view.rerender(button({ tintColor: 'red' }));
    expect(state.native.tintToken).toBe('core-text-primary');
});

it('resolves separate native label/icon tokens and uses tintColor only as their fallback', () => {
    const view = render(button({ icon: 'home', tintColor: 'core-text-primary', iconColor: 'core-icon-secondary', textColor: 'core-text-tertiary' }));
    expect(state.native).toMatchObject({ textTintToken: 'core-text-tertiary', iconTintToken: 'core-icon-secondary' });
    view.rerender(button({ icon: 'home', tintColor: 'core-text-secondary' }));
    expect(state.native).toMatchObject({ textTintToken: 'core-text-secondary', iconTintToken: 'core-text-secondary' });
    view.rerender(button({ icon: 'home', textColor: 'red', iconColor: 'red' }));
    expect(state.native).toMatchObject({ textTintToken: 'core-text-primary', iconTintToken: 'core-icon-primary' });
});

it('keeps regular style overrides off the native glass surface', () => {
 render(button({ label: 'Save', liquidGlassBackground: true, style: { borderRadius: 0, backgroundColor: 'red', minHeight: 12, padding: 30 } }));
 expect(state.native).toMatchObject({ cornerRadius: 1000, minimumSize: 48, paddingTop: 0, paddingLeading: 16 });
 expect(state.native.style).toEqual({ position: 'absolute', inset: 0 });
 expect(state.views[2].style[0].minHeight).toBe(48);
});
