import type React from 'react';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useToast, useToastActions, useToastStore } from './toastStore';

beforeEach(() => {
	useToastStore.setState({ toast: null });
});

describe('toastStore', () => {
	it('push() sets the active toast', () => {
		useToastStore.getState().actions.push({ message: 'hello' });
		expect(useToastStore.getState().toast).toEqual({ message: 'hello', notificationId: expect.any(String) });
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

it('assigns fresh identity to repeated identical pushes and ignores stale hide callbacks', () => {
	const actions = useToastStore.getState().actions;
	actions.push({ message: 'Same' });
	const first = useToastStore.getState().toast;
	actions.push({ message: 'Same' });
	const second = useToastStore.getState().toast;
	expect(second?.notificationId).not.toBe(first?.notificationId);
	actions.clear({ notificationId: first?.notificationId, message: 'Same', reason: 'replaced' });
	expect(useToastStore.getState().toast).toBe(second);
	actions.clear({ notificationId: second?.notificationId, message: 'Same', reason: 'dismiss' });
	expect(useToastStore.getState().toast).toBeNull();
});

it('preserves typed payload actions through direct store composition', () => {
	const onClick = vi.fn();
	const data = { documentId: 'doc-42' };
	useToastStore.getState().actions.push({
		message: 'Open document',
		data,
		onClick: (event, value) => onClick(event, value?.documentId),
	});
	const stored = useToastStore.getState().toast;
	const event = { type: 'click' } as React.MouseEvent<HTMLDivElement>;
	stored?.onClick?.(event, stored.data);
	expect(stored?.data).toBe(data);
	expect(onClick).toHaveBeenCalledExactlyOnceWith(event, 'doc-42');
});
