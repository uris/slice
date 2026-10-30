import { useMemo } from 'react';
import { type ImageStyle, Platform, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { useSliceTheme } from '../../providers';
import type { SliceNativeTheme } from '../../theme';

type NativeStyle = ViewStyle | TextStyle | ImageStyle;
type NamedStyles = Record<string, NativeStyle>;
type ThemedStyles<T> = T | ((theme: SliceNativeTheme) => T);
/**
 * Optional base styles and overrides keyed by React Native platform.
 */
export type PlatformStyles = Partial<Record<typeof Platform.OS | 'base', ThemedStyles<NamedStyles>>>;
type ResolveStyles<T> = T extends (theme: SliceNativeTheme) => infer S ? S : T;
type PlatformSheets<T> = ResolveStyles<NonNullable<T[keyof T]>>;
type KeysOfUnion<T> = T extends unknown ? keyof T : never;
type StyleAt<T, K extends PropertyKey> = T extends unknown ? (K extends keyof T ? T[K] : never) : never;
type CombinedStyle<T> = { [K in KeysOfUnion<T>]?: StyleAt<T, K> };
type BaseStyles<T> = T extends { base: infer B } ? ResolveStyles<B> : Record<never, never>;
/**
 * Base keys are always present; keys supplied only by a platform are optional.
 */
export type ResolvedPlatformStyles<T> = {
	[K in keyof BaseStyles<T>]: CombinedStyle<StyleAt<PlatformSheets<T>, K>>;
} & {
	[K in Exclude<KeysOfUnion<PlatformSheets<T>>, keyof BaseStyles<T>>]?: CombinedStyle<StyleAt<PlatformSheets<T>, K>>;
};

const platformKeys = new Set(['base', 'ios', 'android', 'macos', 'windows', 'web']);

function isPlatformStyles(styles: NamedStyles | PlatformStyles): styles is PlatformStyles {
	const entries = Object.entries(styles);
	if (entries.length === 0) return false;
	return entries.every(([key, sheet]) => {
		if (!platformKeys.has(key)) return false;
		if (sheet === undefined || typeof sheet === 'function') return true;
		// A flat style named "ios" remains an ordinary named style.
		return Object.values(sheet).every((value) => value === undefined || typeof value === 'object');
	});
}

function resolveStyles<T>(styles: ThemedStyles<T>, theme: SliceNativeTheme): T {
	if (typeof styles === 'function') return (styles as (theme: SliceNativeTheme) => T)(theme);
	return styles;
}

/**
 * Resolve memoized native styles from the provider theme. Accept a stylesheet,
 * a theme factory, or a platform map (directly or returned by a theme factory).
 * Keep factories and maps stable to reuse styles across renders.
 */
export function useCreateThemedStyles<T extends PlatformStyles>(styles: ThemedStyles<T>): ResolvedPlatformStyles<T>;
export function useCreateThemedStyles<T extends { [K in keyof T]: NativeStyle }>(styles: ThemedStyles<T>): T;
export function useCreateThemedStyles(styles: ThemedStyles<NamedStyles | PlatformStyles>): NamedStyles {
	const sliceTheme = useSliceTheme();
	const platform = Platform.OS;
	return useMemo(() => {
		const resolved = resolveStyles(styles, sliceTheme);
		if (!isPlatformStyles(resolved)) return resolved;
		const base = resolveStyles(resolved.base ?? {}, sliceTheme);
		const overrides = resolveStyles(resolved[platform] ?? {}, sliceTheme);
		const merged: NamedStyles = { ...base };
		for (const [key, style] of Object.entries(overrides)) {
			merged[key] = StyleSheet.flatten([base[key], style]) ?? {};
		}
		return StyleSheet.create(merged);
	}, [sliceTheme, styles, platform]);
}
