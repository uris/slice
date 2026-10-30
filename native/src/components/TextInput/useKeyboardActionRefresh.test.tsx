// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react';
import type { TextInputInstance, TextInputProps } from 'react-native';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useKeyboardActionRefresh as useFallbackRefresh } from './useKeyboardActionRefresh';
import { useKeyboardActionRefresh } from './useKeyboardActionRefresh.android';

const state = vi.hoisted(() => ({ focused: true, tag: 42 as number | null, available: true, restart: vi.fn() }));
vi.mock('react-native', () => ({ findNodeHandle: () => state.tag }));
vi.mock('../../specs/NativeTextInputKeyboard', () => ({
 get default() { if (state.available) return { restartInput: state.restart }; return null; },
}));
const ref = { current: { isFocused: () => state.focused } as TextInputInstance | null };
let frames: Map<number, FrameRequestCallback>;
let nextFrame: number;
function flushFrame() {
 const pending = [...frames.values()];
 frames.clear();
 for (const callback of pending) callback(0);
}
beforeEach(() => {
 state.focused = true;
 state.tag = 42;
 state.available = true;
 state.restart.mockReset();
 ref.current = { isFocused: () => state.focused } as TextInputInstance;
 frames = new Map();
 nextFrame = 0;
 vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frames.set(++nextFrame, callback); return nextFrame; });
 vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
type Props = Pick<TextInputProps, 'returnKeyType' | 'returnKeyLabel' | 'enterKeyHint'>;
function renderRefresh(initialProps: Props = {}) {
 return renderHook((props: Props) => useKeyboardActionRefresh(ref, props), { initialProps });
}

describe('Android keyboard action refresh', () => {
 it('skips mount and unchanged props, and refreshes the existing focused input on an action change', () => {
  const { rerender } = renderRefresh({ returnKeyType: 'search' });
  flushFrame();
  rerender({ returnKeyType: 'search' });
  flushFrame();
  expect(state.restart).not.toHaveBeenCalled();
  const input = ref.current;
  rerender({ returnKeyType: 'done' });
  expect(state.restart).not.toHaveBeenCalled();
  flushFrame();
  expect(state.restart).toHaveBeenCalledExactlyOnceWith(42, 'done', null);
  expect(ref.current).toBe(input);
 });
 it('refreshes when a custom label is changed or removed', () => {
  const { rerender } = renderRefresh({ returnKeyType: 'done', returnKeyLabel: 'Add' });
  rerender({ returnKeyType: 'done', returnKeyLabel: 'Save' });
  flushFrame();
  expect(state.restart).toHaveBeenLastCalledWith(42, 'done', 'Save');
  rerender({ returnKeyType: 'done' });
  flushFrame();
  expect(state.restart).toHaveBeenLastCalledWith(42, 'done', null);
 });
 it('honors enterKeyHint precedence and maps enter to the RN default action', () => {
  const { rerender } = renderRefresh({ enterKeyHint: 'search', returnKeyType: 'done' });
  rerender({ enterKeyHint: 'search', returnKeyType: 'next' });
  flushFrame();
  expect(state.restart).not.toHaveBeenCalled();
  rerender({ enterKeyHint: 'enter' });
  flushFrame();
  expect(state.restart).toHaveBeenLastCalledWith(42, 'default', null);
  rerender({});
  flushFrame();
  expect(state.restart).toHaveBeenLastCalledWith(42, 'done', null);
 });
 it('coalesces rapid changes and cancels scheduled refreshes on unmount', () => {
  const { rerender, unmount } = renderRefresh({ returnKeyType: 'search' });
  rerender({ returnKeyType: 'next' });
  rerender({ returnKeyType: 'done', returnKeyLabel: 'Save' });
  flushFrame();
  expect(state.restart).toHaveBeenCalledExactlyOnceWith(42, 'done', 'Save');
  rerender({ returnKeyType: 'go' });
  unmount();
  flushFrame();
  expect(state.restart).toHaveBeenCalledTimes(1);
 });
 it.each(['blurred', 'unmounted', 'missing module', 'missing tag', 'blurred before frame', 'removed before frame'])(
  'does not refresh when %s', (condition) => {
   const { rerender } = renderRefresh({ returnKeyType: 'search' });
   if (condition === 'blurred') state.focused = false;
   if (condition === 'unmounted') ref.current = null;
   if (condition === 'missing module') state.available = false;
   if (condition === 'missing tag') state.tag = null;
   rerender({ returnKeyType: 'done' });
   if (condition === 'blurred before frame') state.focused = false;
   if (condition === 'removed before frame') ref.current = null;
   flushFrame();
   expect(state.restart).not.toHaveBeenCalled();
  },
 );
 it('retains native keyboard behavior outside Android', () => {
  const { rerender } = renderHook((props: Props) => useFallbackRefresh(ref, props), { initialProps: { returnKeyType: 'search' } as Props });
  rerender({ returnKeyType: 'done' });
  flushFrame();
  expect(state.restart).not.toHaveBeenCalled();
 });
});
