import { useCallback, useEffect, useRef, useState } from 'react';
import type { ToolTip } from '../sharedTypes';

const milliseconds = (value: number, fallback: number) => (Number.isFinite(value) ? Math.max(0, value) : fallback);

/** Coordinate updates do not restart a request's show delay or visible lifetime. */
export function useTipVisibility(
	tip: ToolTip | null | undefined,
	enabled: boolean,
	showDelay: number,
	hideDelay: number,
) {
	const [shown, setShown] = useState<ToolTip | null>(null);
	const showTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const clearTimers = useCallback(() => {
		clearTimeout(showTimer.current);
		clearTimeout(hideTimer.current);
	}, []);
	const dismiss = useCallback(() => {
		clearTimers();
		setShown(null);
	}, [clearTimers]);
	const lifetime = tip?.payload?.duration ?? hideDelay;
	useEffect(() => {
		dismiss();
		if (!enabled || !tip?.payload?.label) return;
		showTimer.current = setTimeout(
			() => {
				setShown(tip);
				hideTimer.current = setTimeout(() => setShown(null), milliseconds(lifetime, 2500));
			},
			milliseconds(showDelay, 500),
		);
		return clearTimers;
	}, [tip, enabled, showDelay, lifetime, dismiss, clearTimers]);
	return { visible: enabled && Boolean(tip) && shown === tip, dismiss };
}
