// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { SliceThemeProvider } from '../../providers/SliceThemeProvider';
import { darkTheme, lightTheme, type SliceNativeTheme } from '../../theme';
import { useCreateThemedStyles } from './useCreateThemedStyles';

const platformState = vi.hoisted(() => ({ os: 'ios' }));
vi.mock('react-native', () => ({
 Platform: { get OS() { return platformState.os; } },
 useColorScheme: () => 'light',
 StyleSheet: { create: <T,>(styles: T): T => styles, flatten: (styles: any[]) => Object.assign({}, ...styles.filter(Boolean)) },
}));
afterEach(() => { cleanup(); platformState.os = 'ios'; });
const wrapper = ({ children }: { children: ReactNode }) => <SliceThemeProvider>{children}</SliceThemeProvider>;

describe('useCreateThemedStyles', () => {
 it('resolves themed and static styles while preserving inferred keys', () => {
  const factory = (theme: SliceNativeTheme) => StyleSheet.create({
   container: { backgroundColor: theme.colors['core-surface-primary'], padding: theme.spacing.m },
   text: { color: theme.colors['core-text-primary'], fontSize: 16 },
   image: { resizeMode: 'contain' as const },
   staticStyle: { opacity: 0.5 },
  });
  const { result } = renderHook(() => useCreateThemedStyles(factory), { wrapper });
  expect(result.current).toEqual(factory(lightTheme));
  expectTypeOf(result.current).toEqualTypeOf<ReturnType<typeof factory>>();
 });
 it('reuses styles across rerenders with the same theme and factory', () => {
  const factory = vi.fn((theme: SliceNativeTheme) => ({ text: { color: theme.colors['core-text-primary'] } }));
  const { result, rerender } = renderHook(() => useCreateThemedStyles(factory), { wrapper });
  const first = result.current;
  rerender();
  expect(result.current).toBe(first);
  expect(factory).toHaveBeenCalledTimes(1);
 });
 it('recreates styles when the provider theme changes', () => {
  let preference: 'light' | 'dark' = 'light';
  const factory = vi.fn((theme: SliceNativeTheme) => ({ text: { color: theme.colors['core-text-primary'] } }));
  const provider = ({ children }: { children: ReactNode }) => <SliceThemeProvider preference={preference}>{children}</SliceThemeProvider>;
  const { result, rerender } = renderHook(() => useCreateThemedStyles(factory), { wrapper: provider });
  const first = result.current;
  preference = 'dark';
  rerender();
  expect(result.current).not.toBe(first);
  expect(result.current.text.color).toBe(darkTheme.colors['core-text-primary']);
  expect(factory).toHaveBeenCalledTimes(2);
 });
 it('uses a replacement factory, including factories that ignore the theme', () => {
  const first = () => StyleSheet.create({ text: { fontSize: 12 } });
  const second = () => StyleSheet.create({ text: { fontSize: 20 } });
  const { result, rerender } = renderHook(({ factory }) => useCreateThemedStyles(factory), { wrapper, initialProps: { factory: first } });
  rerender({ factory: second });
  expect(result.current.text.fontSize).toBe(20);
 });
 it('requires a provider', () => {
  expect(() => renderHook(() => useCreateThemedStyles(() => ({ text: { fontSize: 16 } })))).toThrow(/must be used within SliceThemeProvider/);
 });
});

it('accepts an existing stylesheet without changing its identity', () => {
 const styles = StyleSheet.create({ container: { padding: 8 }, text: { fontSize: 18 } });
 const { result } = renderHook(() => useCreateThemedStyles(styles), { wrapper });
 expect(result.current).toBe(styles);
 expectTypeOf(result.current).toEqualTypeOf<typeof styles>();
});

it.each(['ios', 'android', 'macos', 'windows', 'web'])('merges base with %s overrides per named style', (os) => {
 platformState.os = os;
 const styles = {
  base: StyleSheet.create({ container: { padding: 8, opacity: 1 }, text: { fontSize: 18 } }),
  [os]: StyleSheet.create({ container: { padding: 12, marginTop: 4 }, platformOnly: { opacity: 0.5 } }),
 };
 const { result } = renderHook(() => useCreateThemedStyles(styles), { wrapper });
 expect(result.current).toEqual({ container: { padding: 12, opacity: 1, marginTop: 4 }, text: { fontSize: 18 }, platformOnly: { opacity: 0.5 } });
 expect(styles.base.container).toEqual({ padding: 8, opacity: 1 });
});

it('supports a theme factory returning platform styles and updates with the theme', () => {
 let preference: 'light' | 'dark' = 'light';
 const provider = ({ children }: { children: ReactNode }) => <SliceThemeProvider preference={preference}>{children}</SliceThemeProvider>;
 const factory = vi.fn((theme: SliceNativeTheme) => ({
  base: StyleSheet.create({ text: { color: theme.colors['core-text-primary'], fontSize: 18 } }),
  ios: StyleSheet.create({ text: { fontSize: 20 }, iosOnly: { padding: 2 } }),
  android: StyleSheet.create({ androidOnly: { margin: 4 } }),
 }));
 const { result, rerender } = renderHook(() => useCreateThemedStyles(factory), { wrapper: provider });
 expect(result.current.text).toEqual({ color: lightTheme.colors['core-text-primary'], fontSize: 20 });
 expectTypeOf(result.current.text.color).toEqualTypeOf<string | undefined>();
 expectTypeOf(result.current.iosOnly).toEqualTypeOf<{ padding?: number } | undefined>();
 expectTypeOf(result.current.androidOnly).toEqualTypeOf<{ margin?: number } | undefined>();
 const first = result.current;
 rerender();
 expect(result.current).toBe(first);
 expect(factory).toHaveBeenCalledTimes(1);
 preference = 'dark';
 rerender();
 expect(result.current.text.color).toBe(darkTheme.colors['core-text-primary']);
 expect(factory).toHaveBeenCalledTimes(2);
});

it('evaluates only base and the selected platform factories', () => {
 const base = vi.fn((theme: SliceNativeTheme) => ({ text: { color: theme.colors['core-text-primary'], fontSize: 18 } }));
 const ios = vi.fn((theme: SliceNativeTheme) => ({ text: { backgroundColor: theme.colors['core-surface-primary'] } }));
 const android = vi.fn(() => ({ text: { fontSize: 24 } }));
 const styles = { base, ios, android };
 const { result } = renderHook(() => useCreateThemedStyles(styles), { wrapper });
 expect(result.current.text).toEqual({ color: lightTheme.colors['core-text-primary'], fontSize: 18, backgroundColor: lightTheme.colors['core-surface-primary'] });
 expect(base).toHaveBeenCalledWith(lightTheme);
 expect(ios).toHaveBeenCalledWith(lightTheme);
 expect(android).not.toHaveBeenCalled();
});

it('falls back to base, supports platform-only maps, and returns empty styles for a missing platform', () => {
 const base = { container: { padding: 8 } };
 const { result, unmount } = renderHook(() => useCreateThemedStyles({ base, android: { container: { padding: 16 } } }), { wrapper });
 expect(result.current).toEqual(base);
 unmount();
 const platformOnly = renderHook(() => useCreateThemedStyles({ ios: { text: { fontSize: 18 } } }), { wrapper });
 expect(platformOnly.result.current).toEqual({ text: { fontSize: 18 } });
 platformOnly.unmount();
 platformState.os = 'web';
 const missing = renderHook(() => useCreateThemedStyles({ ios: { text: { fontSize: 18 } } }), { wrapper });
 expect(missing.result.current).toEqual({});
});

it('updates for platform and map changes and preserves flat styles named after a platform', () => {
 const ios = { text: { fontSize: 18 } };
 const android = { text: { fontSize: 20 } };
 const { result, rerender } = renderHook(({ styles }) => useCreateThemedStyles(styles), { wrapper, initialProps: { styles: { ios, android } } });
 expect(result.current.text?.fontSize).toBe(18);
 platformState.os = 'android';
 rerender({ styles: { ios, android } });
 expect(result.current.text?.fontSize).toBe(20);
 rerender({ styles: { ios, android: { text: { fontSize: 24 } } } });
 expect(result.current.text?.fontSize).toBe(24);
 const flat = { ios: { padding: 8 } };
 const ordinary = renderHook(() => useCreateThemedStyles(flat), { wrapper });
 expect(ordinary.result.current).toBe(flat);
});

it('replaces nested style values using React Native merge semantics', () => {
 const transform = [{ scale: 2 }];
 const styles = {
  base: { container: { transform, shadowOffset: { width: 2, height: 3 }, opacity: 0.5 } },
  ios: { container: { transform: [{ translateX: 8 }], shadowOffset: { width: 0, height: 1 } } },
 };
 const { result } = renderHook(() => useCreateThemedStyles(styles), { wrapper });
 expect(result.current.container).toEqual({ transform: [{ translateX: 8 }], shadowOffset: { width: 0, height: 1 }, opacity: 0.5 });
 expect(styles.base.container.transform).toBe(transform);
});

it('accepts empty styles and explicitly absent platform entries', () => {
 const empty = {};
 const flat = renderHook(() => useCreateThemedStyles(empty), { wrapper });
 expect(flat.result.current).toBe(empty);
 const absent = renderHook(() => useCreateThemedStyles({ base: { text: { fontSize: 18 } }, ios: undefined }), { wrapper });
 expect(absent.result.current).toEqual({ text: { fontSize: 18 } });
});


it('keeps a named style usable when native flattening returns no style', () => {
 const flatten = vi.spyOn(StyleSheet, 'flatten').mockReturnValueOnce(undefined);
 try {
  const styles = { ios: { container: {} } };
  const { result } = renderHook(() => useCreateThemedStyles(styles), { wrapper });
  expect(result.current).toEqual({ container: {} });
 } finally {
  flatten.mockRestore();
 }
});
