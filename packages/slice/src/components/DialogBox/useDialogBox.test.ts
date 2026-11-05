import { renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { expect, it, vi } from 'vitest';
import { DialogBoxContext, useDialogBox } from './useDialogBox';

it('requires a DialogBox provider', () => {
 expect(() => renderHook(() => useDialogBox())).toThrow('useDialogBox must be used inside DialogBox');
});
it('returns the stable controls supplied by the parent', () => {
 const controls = { close: vi.fn(), resolve: vi.fn(), reject: vi.fn() };
 const wrapper = ({ children }: { children: ReactNode }) => createElement(DialogBoxContext.Provider, { value: controls }, children);
 const { result, rerender } = renderHook(() => useDialogBox<number>(), { wrapper });
 result.current.close();
 result.current.resolve(42);
 const error = new Error('Cancelled');
 result.current.reject(error);
 expect(controls.close).toHaveBeenCalledOnce();
 expect(controls.resolve).toHaveBeenCalledWith(42);
 expect(controls.reject).toHaveBeenCalledWith(error);
 const previous = result.current;
 rerender();
 expect(result.current).toBe(previous);
});
