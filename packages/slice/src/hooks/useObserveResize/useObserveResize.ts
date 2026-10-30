'use client';

import { type RefObject, useCallback, useEffect, useState } from 'react';

type Size = {
	height: number;
	width: number;
};

export function useObserveResize(
	element: RefObject<HTMLElement | null> | undefined,
	options?: { ignore?: 'width' | 'height' },
) {
	const [size, setSize] = useState<Size>({ width: 0, height: 0 });
	const ignore = options?.ignore;

	const handleResize = useCallback(
		(entries: ResizeObserverEntry[]) => {
			if (!entries[0]) return;
			const width = element?.current?.offsetWidth || 0;
			const height = element?.current?.offsetHeight || 0;
			setSize((prev) => {
				const next = {
					width: ignore === 'width' ? prev.width : width,
					height: ignore === 'height' ? prev.height : height,
				};
				if (prev.width === next.width && prev.height === next.height) {
					return prev;
				}
				return next;
			});
		},
		[element, ignore],
	);

	useEffect(() => {
		if (element === undefined) return;
		const el = element.current;
		if (!el) return;

		// Get initial size
		const newWidth = el.offsetWidth || 0;
		const newHeight = el.offsetHeight || 0;

		// set the new size of different to previous
		setSize((prev) => {
			const next = {
				width: ignore === 'width' ? prev.width : newWidth,
				height: ignore === 'height' ? prev.height : newHeight,
			};
			if (prev.width === next.width && prev.height === next.height) {
				return prev; // same so no need to trigger re-renders
			}
			return next;
		});

		// Observe size changes
		const resizeObserver = new ResizeObserver(handleResize);
		resizeObserver.observe(el);

		return () => {
			resizeObserver.unobserve(el);
			resizeObserver.disconnect();
		};
	}, [element, handleResize, ignore]);

	return size;
}
