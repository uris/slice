'use client';

import { useEffect, useRef } from 'react';
import { debug } from '../../utils/functions/misc';

/**
 * Hook to log component renders, mounts, and unmounts
 * Note: wrap in comments with START.DEBUG ... {hook} ... END.DEBUG to remove from build
 */

export function useTrackRenders(props: any, componentName = 'Component') {
	const prev = useRef<{ props: any; mount: boolean; unmount: boolean } | undefined>({
		props,
		mount: true,
		unmount: false,
	});

	// 5 random letters (uppercase)
	const id = crypto
		.getRandomValues(new Uint8Array(5))
		.reduce((acc, val) => acc + String.fromCodePoint(65 + (val % 26)), '');

	// name the component
	const name = `${componentName} {${id}}`;

	// Track re-renders w/o dependency array
	useEffect(() => {
		prev.current = debug(prev, props, name);
	});

	// Track unmount with empty array on return
	// biome-ignore lint/correctness/useExhaustiveDependencies: track unmount only
	useEffect(() => {
		return () => {
			if (prev.current) {
				prev.current.unmount = true;
				debug(prev, prev, name);
			}
		};
	}, []);
}
