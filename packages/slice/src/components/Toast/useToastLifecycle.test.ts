import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ToastProps } from './_types';
import { useToastLifecycle } from './useToastLifecycle';

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
	cleanup();
	vi.useRealTimers();
});
const tick = (time = 0) => act(() => vi.advanceTimersByTime(time));
function setup(props: ToastProps = {}) {
	const initialProps: ToastProps = { message: 'Saved', notificationId: 'first', duration: 1000, ...props };
	return renderHook((value: ToastProps) => useToastLifecycle(value), { initialProps });
}
describe('useToastLifecycle', () => {
	it('shows after the delay and calls onShow only once', () => {
		const onShow = vi.fn();
		const { result, rerender } = setup({ showDelay: 200, onShow });
		tick(199);
		expect(result.current.notification).toBeUndefined();
		tick(1);
		expect(onShow).toHaveBeenCalledExactlyOnceWith({ notificationId: 'first', message: 'Saved' });
		rerender({ message: 'Saved', notificationId: 'first', duration: 1000, onShow });
		expect(onShow).toHaveBeenCalledTimes(1);
	});
	it('waits for exit completion before reporting a timeout', () => {
		const onHide = vi.fn();
		const { result } = setup({ onHide });
		tick();
		tick(1000);
		expect(result.current.notification).toBeUndefined();
		expect(onHide).not.toHaveBeenCalled();
		act(() => result.current.finishExits());
		act(() => result.current.finishExits());
		expect(onHide).toHaveBeenCalledExactlyOnceWith({ notificationId: 'first', message: 'Saved', reason: 'timeout' });
	});
	it('preserves remaining duration across overlapping hover and focus', () => {
		const { result } = setup();
		tick();
		tick(400);
		act(() => result.current.interaction('hover', true));
		tick(5000);
		act(() => {
			result.current.interaction('focus', true);
			result.current.interaction('hover', false);
		});
		tick(5000);
		expect(result.current.notification).toBeDefined();
		act(() => result.current.interaction('focus', false));
		tick(599);
		expect(result.current.notification).toBeDefined();
		tick(1);
		expect(result.current.notification).toBeUndefined();
	});
	it('replays identical text with a new notification ID and retains old exit metadata', () => {
		const onHide = vi.fn();
		const { result, rerender } = setup({ onHide });
		tick();
		const token = result.current.notification?.token;
		rerender({ message: 'Saved', notificationId: 'second', onHide, duration: 1000 });
		tick();
		expect(result.current.notification?.token).not.toBe(token);
		act(() => result.current.finishExits());
		expect(onHide).toHaveBeenCalledExactlyOnceWith({ notificationId: 'first', message: 'Saved', reason: 'replaced' });
		expect(result.current.notification?.info.notificationId).toBe('second');
	});
	it('clears and can show the same message again without remounting', () => {
		const onHide = vi.fn();
		const { result, rerender } = setup({ onHide });
		tick();
		rerender({ message: null });
		act(() => result.current.finishExits());
		expect(onHide).toHaveBeenCalledWith(expect.objectContaining({ reason: 'cleared' }));
		rerender({ message: 'Saved' });
		tick();
		expect(result.current.notification?.info.message).toBe('Saved');
	});
	it('uses the latest requested message when pending shows are replaced', () => {
		const onShow = vi.fn();
		const { result, rerender } = setup({ showDelay: 200, onShow });
		tick(100);
		rerender({ message: 'New', showDelay: 200, onShow });
		tick(199);
		expect(result.current.notification).toBeUndefined();
		tick(1);
		expect(onShow).toHaveBeenCalledExactlyOnceWith({ notificationId: undefined, message: 'New' });
	});
	it('reschedules pending delay changes without replaying a visible notification', () => {
		const onShow = vi.fn();
		const { result, rerender } = setup({ showDelay: 200, onShow });
		tick(100);
		rerender({ message: 'Saved', notificationId: 'first', showDelay: 50, onShow });
		tick(50);
		expect(result.current.notification).toBeDefined();
		rerender({ message: 'Saved', notificationId: 'first', showDelay: 100, onShow });
		tick(100);
		expect(onShow).toHaveBeenCalledTimes(1);
	});
	it('restarts live duration changes without repeating onShow', () => {
		const onShow = vi.fn();
		const { result, rerender } = setup({ onShow });
		tick();
		tick(300);
		rerender({ message: 'Saved', notificationId: 'first', duration: 200, onShow });
		tick(199);
		expect(result.current.notification).toBeDefined();
		tick(1);
		expect(result.current.notification).toBeUndefined();
		expect(onShow).toHaveBeenCalledTimes(1);
	});
	it('keeps infinite notifications until explicitly dismissed', () => {
		const onHide = vi.fn();
		const { result } = setup({ duration: 'infinite', onHide });
		tick();
		tick(100000);
		expect(result.current.notification).toBeDefined();
		act(() => result.current.dismiss('dismiss'));
		act(() => result.current.dismiss('dismiss'));
		act(() => result.current.finishExits());
		expect(onHide).toHaveBeenCalledExactlyOnceWith({ notificationId: 'first', message: 'Saved', reason: 'dismiss' });
	});
	it('cancels pending work and timers on unmount', () => {
		const onShow = vi.fn(),
			onHide = vi.fn();
		const pending = setup({ showDelay: 100, onShow, onHide });
		pending.unmount();
		tick(10000);
		expect(onShow).not.toHaveBeenCalled();
		expect(onHide).not.toHaveBeenCalled();
		const visible = setup({ onHide });
		tick();
		visible.unmount();
		tick(10000);
		expect(onHide).not.toHaveBeenCalled();
	});
	it('does not revive a dismissed notification when configuration changes', () => {
		const { result, rerender } = setup();
		tick();
		act(() => result.current.dismiss('dismiss'));
		rerender({ message: 'Saved', notificationId: 'first', showDelay: 50, duration: 500 });
		tick(500);
		expect(result.current.notification).toBeUndefined();
	});
});
