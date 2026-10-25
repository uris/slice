// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { SliceThemeProvider } from '../../providers/SliceThemeProvider';
import { darkTheme, lightTheme, type SliceNativeTheme } from '../../theme';
import { useCreateThemedStyles } from './useCreateThemedStyles';

vi.mock('react-native', () => ({
 useColorScheme: () => 'light',
 StyleSheet: { create: <T,>(styles: T): T => styles },
}));
afterEach(cleanup);
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
