'use client';

import { useEffect, useRef } from 'react';

export function useDoubleClick<T, Y>(onClick: (payload?: T) => void, onDblClick: (payload?: Y) => void, delay = 200) {
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (timer.current !== null) clearTimeout(timer.current);
			timer.current = null;
		},
		[],
	);

	const didClick = (payload: T) => {
		if (timer.current !== null) clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			timer.current = null;
			onClick(payload);
		}, delay);
		return () => {
			if (timer.current !== null) clearTimeout(timer.current);
			timer.current = null;
		};
	};

	const didDblClick = (payload: Y) => {
		if (timer.current !== null) clearTimeout(timer.current);
		timer.current = null;
		onDblClick(payload);
	};

	return [didClick, didDblClick] as const;
}
