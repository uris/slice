import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import type { SvgProps } from 'react-native-svg';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STATIC_ICON_REGISTRY as webRegistry } from '../../../../src/components/Icon/iconRegistry';
import { Icon as PublicIcon, Text, SliceThemeProvider, useSliceTheme } from '../../index';
import { lightTheme, darkTheme, type SliceNativeTheme } from '../../theme';
import type { IconProps } from './_types';
import { Icon } from './Icon';
import { STATIC_ICON_REGISTRY } from './iconRegistry';

const state = vi.hoisted(() => ({ scheme: 'light', theme: undefined as SliceNativeTheme | undefined }));
vi.mock('../../providers/SliceThemeProvider', async (importOriginal) => ({
    ...await importOriginal<typeof import('../../providers/SliceThemeProvider')>(),
    useOptionalSliceTheme: () => state.theme,
}));
vi.mock('react-native-reanimated', () => ({ default: { View: () => null } }));
vi.mock('react-native', () => ({ useColorScheme: () => state.scheme, StyleSheet: { create: (styles: unknown) => styles } }));
vi.mock('react-native-svg', () => {
	const component = (tag: string) => Object.assign(() => null, { svgTag: tag });
	return {
		default: component('svg'),
		...Object.fromEntries(
			['Circle', 'ClipPath', 'Defs', 'G', 'Line', 'Path', 'Polygon', 'Polyline', 'Rect', 'Use'].map((name) => [
				name,
				component(name[0].toLowerCase() + name.slice(1)),
			]),
		),
	};
});

// Inspect the wrapper output with native dependencies mocked; no DOM renderer is used.
const render = (Icon as unknown as { type: (props: IconProps) => ReactElement<SvgProps> | null }).type;
const shapeProps = { stroke: 1.5, strokeColor: '#123456', fillColor: 0.2, coverUp: '#ffffff' };

function normalize(node: ReactNode, native: boolean): unknown {
	if (!isValidElement<Record<string, unknown>>(node)) return node;
	if (native) expect(typeof node.type).not.toBe('string');
	const { children, xlinkHref, strokeDasharray, ...props } = node.props;
	if (xlinkHref !== undefined) props.href = xlinkHref;
	if (strokeDasharray) props.strokeDasharray = strokeDasharray;
	return {
		tag: typeof node.type === 'function' ? (node.type as unknown as { svgTag: string }).svgTag : node.type,
		props,
		children: Children.toArray(children as ReactNode).map((child) => normalize(child, native)),
	};
}

describe('Icon', () => {
	it('exports the renamed component and themed components from the package root', () => {
		expect(PublicIcon).toBe(Icon);
		expect(Text).toBeTypeOf('function');
		expect(SliceThemeProvider).toBeTypeOf('function');
		expect(useSliceTheme).toBeTypeOf('function');
	});
	beforeEach(() => { state.scheme = 'light'; state.theme = undefined; });

	it('preserves every icon and variant without browser elements', () => {
		expect([...STATIC_ICON_REGISTRY.keys()]).toEqual([...webRegistry.keys()]);
		for (const [name, definition] of webRegistry) {
			const native = STATIC_ICON_REGISTRY.get(name)!;
			for (const variant of ['line', 'lineOn'] as const) {
				expect(normalize(native[variant]?.(shapeProps), true)).toEqual(normalize(definition[variant]?.(shapeProps), false));
			}
		}
	});

	it('uses native sizing and accessibility defaults and permits overrides', () => {
		expect(render({})?.props).toMatchObject({ width: 20, height: 20, viewBox: '0 0 20 20', accessibilityRole: 'image' });
		expect(render({ size: 32, accessibilityLabel: 'Go home', testID: 'home' })?.props).toMatchObject({
			width: 32, height: 32, accessibilityLabel: 'Go home', testID: 'home',
		});
		expect(render({ name: 'missing' })).toBeNull();
	});

	it('uses the toggled variant and falls back when none exists', () => {
		for (const name of ['view', 'home']) {
			const definition = STATIC_ICON_REGISTRY.get(name)!;
			expect(render({ name, toggle: true, stroke: shapeProps.stroke, iconColor: shapeProps.strokeColor, fillColor: shapeProps.fillColor, coverUp: shapeProps.coverUp, fill: true })?.props.children).toEqual(
				(definition.lineOn ?? definition.line)(shapeProps),
			);
		}
	});

	it('uses scheme defaults and preserves an explicit zero fill opacity', () => {
		const line = vi.spyOn(STATIC_ICON_REGISTRY.get('home')!, 'line');
		state.scheme = 'dark';
		render({ fill: true });
		expect(line).toHaveBeenLastCalledWith({ stroke: 1.5, strokeColor: '#ffffff', fillColor: 0.2, coverUp: '#000000' });
		render({ fill: true, fillColor: 0 });
		expect(line.mock.lastCall?.[0].fillColor).toBe(0);
		render({ fill: false, fillColor: 0.7 });
		expect(line.mock.lastCall?.[0].fillColor).toBe(0);
		line.mockRestore();
	});

	it('disables touch callbacks, dims opacity, and exposes disabled accessibility state', () => {
		const onPress = vi.fn();
		expect(render({ onPress })?.props.onPress).toBe(onPress);
		expect(render({ onPress })?.props.accessibilityRole).toBe('button');
		expect(render({ disabled: true, onPress, onLongPress: onPress, onPressIn: onPress, onPressOut: onPress, opacity: 0.8 })?.props).toMatchObject({
			onPress: undefined, onLongPress: undefined, onPressIn: undefined, onPressOut: undefined,
			opacity: 0.4, accessibilityState: { disabled: true },
		});
	});
});

it('uses the provider appearance for palette tokens, cover-ups and default fill opacity', () => {
    const line = vi.spyOn(STATIC_ICON_REGISTRY.get('home')!, 'line');
    state.scheme = 'light';
    state.theme = darkTheme;
    render({ fill: true, iconColor: 'core-icon-secondary' });
    expect(line).toHaveBeenLastCalledWith({ stroke: 1.5, strokeColor: darkTheme.colors['core-icon-secondary'], fillColor: 0.2, coverUp: '#000000' });
    state.scheme = 'dark';
    state.theme = lightTheme;
    render({ fill: true });
    expect(line).toHaveBeenLastCalledWith({ stroke: 1.5, strokeColor: '#000000', fillColor: 0.125, coverUp: '#ffffff' });
    line.mockRestore();
});
it('preserves enabled long-press and press lifecycle handlers without requiring onPress', () => {
    const onLongPress = vi.fn(), onPressIn = vi.fn(), onPressOut = vi.fn();
    const output = render({ onLongPress, onPressIn, onPressOut });
    expect(output?.props).toMatchObject({ accessibilityRole: 'button', onLongPress, onPressIn, onPressOut });
});
it('renders the active compound search artwork using the requested semantic foreground', () => {
    state.theme = lightTheme;
    const output = render({ name: 'search', iconColor: 'core-icon-secondary' });
    const shape = output?.props.children as ReactElement<{ fill: string; fillRule: string; d: string }>;
    expect(shape.props.fill).toBe(lightTheme.colors['core-icon-secondary']);
    expect(shape.props.fillRule).toBe('evenodd');
    expect(shape.props.d).toContain('M9 14.5');
    expect(shape.props.d).toContain('M10 9');
});
