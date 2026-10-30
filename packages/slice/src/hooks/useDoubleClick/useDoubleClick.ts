'use client';

import { useRef } from 'react';

export function useDoubleClick<T, Y>(onClick: (payload?: T) => void, onDblClick: (payload?: Y) => void, delay = 200) {
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const didClick = (payload: T) => {
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			onClick(payload);
		}, delay);
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	};

	const didDblClick = (payload: Y) => {
		if (timer.current) clearTimeout(timer.current);
		onDblClick(payload);
	};

	return [didClick, didDblClick] as const;
}
