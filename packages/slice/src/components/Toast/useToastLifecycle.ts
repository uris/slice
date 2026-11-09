import { useCallback, useEffect, useRef, useState } from 'react';
import type { ToastHideInfo, ToastHideReason, ToastInfo, ToastProps } from './_types';

interface Notification {
	token: number;
	info: ToastInfo;
	onShow: ToastProps['onShow'];
	onHide: ToastProps['onHide'];
}
const delay = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0);
const lifetime = (value: ToastProps['duration']) => {
	if (value === 'infinite') return Number.POSITIVE_INFINITY;
	if (typeof value === 'number' && Number.isFinite(value) && value >= 0) return value;
	return 5000;
};

/** Own notification identity, visibility timing, and remaining-time pause/resume independently of animation. */
export function useToastLifecycle<T>({
	message,
	notificationId,
	showDelay = 0,
	duration = 5000,
	onShow,
	onHide,
}: ToastProps<T>) {
	const [notification, setNotification] = useState<Notification>();
	const active = useRef<Notification | undefined>(undefined);
	const callbacks = useRef({ onShow, onHide });
	callbacks.current = { onShow, onHide };
	const durationRef = useRef(duration);
	durationRef.current = duration;
	const sequence = useRef(0);
	const showTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const remaining = useRef(0);
	const started = useRef<number | undefined>(undefined);
	const hovered = useRef(false);
	const focused = useRef(false);
	const pendingShow = useRef(false);
	const lastInput = useRef<{ message?: string | null; notificationId?: string } | undefined>(undefined);
	const exits = useRef(new Map<number, { info: ToastHideInfo; callback: ToastProps['onHide'] }>());
	const lastShown = useRef<number | undefined>(undefined);

	const stopTimer = useCallback(() => {
		clearTimeout(hideTimer.current);
		hideTimer.current = undefined;
		if (started.current !== undefined)
			remaining.current = Math.max(0, remaining.current - (Date.now() - started.current));
		started.current = undefined;
	}, []);
	const dismiss = useCallback(
		(reason: ToastHideReason) => {
			stopTimer();
			const current = active.current;
			if (!current) return;
			active.current = undefined;
			exits.current.set(current.token, { info: { ...current.info, reason }, callback: current.onHide });
			setNotification(undefined);
		},
		[stopTimer],
	);
	const startTimer = useCallback(() => {
		stopTimer();
		if (!active.current || hovered.current || focused.current || remaining.current === Number.POSITIVE_INFINITY) return;
		started.current = Date.now();
		hideTimer.current = setTimeout(() => dismiss('timeout'), remaining.current);
	}, [dismiss, stopTimer]);
	const interaction = useCallback(
		(kind: 'hover' | 'focus', value: boolean) => {
			if (kind === 'hover') hovered.current = value;
			else focused.current = value;
			if (hovered.current || focused.current) stopTimer();
			else startTimer();
		},
		[startTimer, stopTimer],
	);

	// A new ID or message starts a new notification; changing a pending delay reschedules only that pending show.
	useEffect(() => {
		const changed =
			!lastInput.current ||
			lastInput.current.message !== message ||
			lastInput.current.notificationId !== notificationId;
		lastInput.current = { message, notificationId };
		if (!changed && !pendingShow.current) return;
		clearTimeout(showTimer.current);
		if (changed) {
			pendingShow.current = false;
			dismiss(message ? 'replaced' : 'cleared');
			hovered.current = false;
			focused.current = false;
		}
		if (!message) return;
		pendingShow.current = true;
		showTimer.current = setTimeout(() => {
			pendingShow.current = false;
			const current: Notification = {
				token: ++sequence.current,
				info: { notificationId, message },
				...callbacks.current,
			};
			active.current = current;
			remaining.current = lifetime(durationRef.current);
			setNotification(current);
			startTimer();
		}, delay(showDelay));
		return () => clearTimeout(showTimer.current);
	}, [message, notificationId, showDelay, dismiss, startTimer]);

	// Live duration changes restart the current lifetime, respecting any overlapping hover/focus pause.
	useEffect(() => {
		stopTimer();
		remaining.current = lifetime(duration);
		if (active.current) startTimer();
	}, [duration, startTimer, stopTimer]);
	useEffect(() => {
		if (!notification || lastShown.current === notification.token) return;
		lastShown.current = notification.token;
		notification.onShow?.(notification.info);
	}, [notification]);
	useEffect(
		() => () => {
			clearTimeout(showTimer.current);
			clearTimeout(hideTimer.current);
		},
		[],
	);

	// Keep each exiting notification's callback and identity so old exits cannot dismiss replacements.
	const finishExits = useCallback(() => {
		const pending = Array.from(exits.current.values());
		exits.current.clear();
		for (const { info, callback } of pending) callback?.(info);
	}, []);
	return { notification, dismiss, interaction, finishExits };
}
