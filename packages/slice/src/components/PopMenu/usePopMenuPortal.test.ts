import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { usePopMenuPortal } from './usePopMenuPortal';

afterEach(() => { cleanup(); document.body.replaceChildren(); });

function callerIn(parent: Node = document.body) {
 const caller = document.createElement('button');
 parent.appendChild(caller);
 return caller;
}

describe('usePopMenuPortal', () => {
 it('shares a body host until the last owner unmounts', () => {
  const caller = callerIn();
  const first = renderHook(() => usePopMenuPortal(caller, 'auto', undefined));
  const second = renderHook(() => usePopMenuPortal(caller, 'auto', undefined));
  const host = first.result.current as HTMLElement;
  expect(host.parentElement).toBe(document.body);
  expect(second.result.current).toBe(host);
  first.unmount();
  expect(host.isConnected).toBe(true);
  second.unmount();
  expect(host.isConnected).toBe(false);
 });
 it('uses the nearest theme or dialog scope', () => {
  const theme = document.createElement('div');
  theme.dataset.sliceThemeScope = '';
  const dialog = document.createElement('dialog');
  theme.append(dialog); document.body.append(theme);
  const caller = callerIn(dialog);
  const { result } = renderHook(() => usePopMenuPortal(caller, 'auto', undefined));
  expect((result.current as HTMLElement).parentElement).toBe(dialog);
 });
 it('keeps automatic hosts inside a shadow root', () => {
  const element = document.createElement('div'); document.body.append(element);
  const shadow = element.attachShadow({ mode: 'open' });
  const caller = callerIn(shadow);
  const { result } = renderHook(() => usePopMenuPortal(caller, 'auto', undefined));
  expect((result.current as HTMLElement).parentNode).toBe(shadow);
 });
 it('inherits inline mode and permits explicit overrides', () => {
  const caller = callerIn();
  const host = document.createElement('div');
  const { result, rerender } = renderHook(({ preference }) => usePopMenuPortal(caller, preference, false), { initialProps: { preference: undefined as HTMLElement | false | 'auto' | undefined } });
  expect(result.current).toBe(false);
  rerender({ preference: host }); expect(result.current).toBe(host);
  rerender({ preference: 'auto' }); expect(result.current).not.toBe(false);
  rerender({ preference: false }); expect(result.current).toBe(false);
  expect(document.querySelector('[data-slice-pop-menu-host]')).toBeNull();
 });
 it('inherits an existing host without acquiring another', () => {
  const host = document.createElement('div');
  const { result } = renderHook(() => usePopMenuPortal(callerIn(), undefined, host));
  expect(result.current).toBe(host);
  expect(document.querySelector('[data-slice-pop-menu-host]')).toBeNull();
 });
 it('waits for a caller before creating an automatic host', () => {
  const { result } = renderHook(() => usePopMenuPortal(undefined, 'auto', undefined));
  expect(result.current).toBeUndefined();
 });
});
