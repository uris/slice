import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useToast, useToastActions, useToastStore } from './toastStore';

beforeEach(() => {
	useToastStore.setState({ toast: null });
});

describe('toastStore', () => {
	it('push() sets the active toast', () => {
		useToastStore.getState().actions.push({ message: 'hello' });
		expect(useToastStore.getState().toast).toEqual({ message: 'hello' });
	});

	it('push(null) clears the toast', () => {
		useToastStore.getState().actions.push({ message: 'hello' });
		useToastStore.getState().actions.push(null);
		expect(useToastStore.getState().toast).toBeNull();
	});

	it('clear() resets the toast to null', () => {
		useToastStore.getState().actions.push({ message: 'hello' });
		useToastStore.getState().actions.clear();
		expect(useToastStore.getState().toast).toBeNull();
	});

	it('exposes atomic selector hooks', () => {
		useToastStore.getState().actions.push({ message: 'hi' });
		const { result: toastResult } = renderHook(() => useToast());
		const { result: actionsResult } = renderHook(() => useToastActions());

		expect(toastResult.current?.message).toBe('hi');
		expect(typeof actionsResult.current.push).toBe('function');
	});
});
