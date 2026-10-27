// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDeviceCapabilities } from './useDeviceCapabilities.native';
import { useDeviceCapabilities as useFallbackCapabilities } from './useDeviceCapabilities';

const state = vi.hoisted(() => ({
 os: 'ios',
 version: '26.1.0' as string | number,
 native: { supportsLiquidGlass: true, supportsNativeBlur: true } as Record<string, boolean | string> | null,
 getConstants: vi.fn(),
}));
vi.mock('react-native', () => ({ Platform: { get OS() { return state.os; }, get Version() { return state.version; } } }));
vi.mock('../../specs/NativeDeviceCapabilities', () => ({
 get default() { return state.native ? { getConstants: state.getConstants } : null; },
}));
afterEach(cleanup);
beforeEach(() => {
 state.os = 'ios';
 state.version = '26.1.0';
 state.native = { supportsLiquidGlass: true, supportsNativeBlur: true };
 state.getConstants.mockReset().mockImplementation(() => state.native);
});

describe('useDeviceCapabilities', () => {
 it.each([
  ['ios', true, true],
  ['ios', false, true],
  ['android', false, true],
  ['android', false, false],
 ])('reports native results for %s (glass=%s, blur=%s)', (os, supportsLiquidGlass, supportsNativeBlur) => {
  state.os = os;
  state.native = { supportsLiquidGlass, supportsNativeBlur };
  const { result, rerender } = renderHook(useDeviceCapabilities);
  expect(result.current).toMatchObject(state.native!);
  const first = result.current;
  rerender();
  expect(result.current).toBe(first);
  expect(state.getConstants).toHaveBeenCalledTimes(1);
 });
 it('returns false when native registration is absent', () => {
  state.native = null;
  const { result } = renderHook(useDeviceCapabilities);
  expect(result.current).toMatchObject({ supportsLiquidGlass: false, supportsNativeBlur: false });
 });
 it('does not query native capabilities on web', () => {
  state.os = 'web';
  const { result } = renderHook(useDeviceCapabilities);
  expect(result.current).toMatchObject({ supportsLiquidGlass: false, supportsNativeBlur: false });
  expect(state.getConstants).not.toHaveBeenCalled();
 });
 it('provides an unsupported-platform fallback without native module access', () => {
  const { result } = renderHook(useFallbackCapabilities);
  expect(result.current).toMatchObject({ supportsLiquidGlass: false, supportsNativeBlur: false });
  expect(state.getConstants).not.toHaveBeenCalled();
 });
 it('preserves the full iOS version and reports the native device name', () => {
  state.native = { supportsLiquidGlass: true, supportsNativeBlur: true, deviceName: 'iPhone', deviceModel: 'iPhone17,1' };
  const { result } = renderHook(useDeviceCapabilities);
  expect(result.current).toMatchObject({ platform: 'ios', iosVersion: '26.1.0', androidSdkVersion: null, deviceName: 'iPhone', deviceModel: 'iPhone17,1' });
 });
 it('reports the numeric Android SDK level and model', () => {
  state.os = 'android';
  state.version = 37;
  state.native = { supportsLiquidGlass: false, supportsNativeBlur: true, deviceName: 'Pixel 10', deviceModel: 'Pixel 10' };
  const { result } = renderHook(useDeviceCapabilities);
  expect(result.current).toMatchObject({ platform: 'android', iosVersion: null, androidSdkVersion: 37, deviceName: 'Pixel 10', deviceModel: 'Pixel 10' });
 });
 it('keeps platform metadata available without the native module', () => {
  state.native = null;
  const { result } = renderHook(useDeviceCapabilities);
  expect(result.current).toMatchObject({ platform: 'ios', iosVersion: '26.1.0', androidSdkVersion: null, deviceName: null, deviceModel: null });
 });
 it('returns null metadata on web', () => {
  state.os = 'web';
  const { result } = renderHook(useDeviceCapabilities);
  expect(result.current).toMatchObject({ platform: 'web', iosVersion: null, androidSdkVersion: null, deviceName: null, deviceModel: null });
 });

});
