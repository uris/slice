import { useEffect, useRef, useState } from 'react';
import type { ProgressIndicatorProps } from './_types';

/** Show starts a playback cycle; changing callbacks or expiring its timer cannot restart it. */
export function useSpinnerPlayback({ show = false, duration, onStart, onStop }: ProgressIndicatorProps) {
	const [playing, setPlaying] = useState(show);
	const active = useRef(false);
	const callbacks = useRef({ onStart, onStop });
	useEffect(() => {
		callbacks.current = { onStart, onStop };
	}, [onStart, onStop]);
	useEffect(() => {
		if (show) {
			if (!active.current) {
				active.current = true;
				setPlaying(true);
				callbacks.current.onStart?.();
			}
		} else if (active.current) {
			active.current = false;
			setPlaying(false);
			callbacks.current.onStop?.();
		}
	}, [show]);
	useEffect(() => {
		if (!show || !active.current || duration === undefined || !Number.isFinite(duration) || duration < 0) return;
		const timer = setTimeout(
			() => {
				active.current = false;
				setPlaying(false);
				callbacks.current.onStop?.();
			},
			Math.min(duration * 1000, 2147483647),
		);
		return () => clearTimeout(timer);
	}, [show, duration]);
	return show && playing;
}
