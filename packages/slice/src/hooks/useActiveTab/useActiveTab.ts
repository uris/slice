'use client';

import { useEffect, useState } from 'react';

export type UseActiveTabReturn = {
	isActiveTab: boolean;
	isTabFocused: boolean;
	visibilityState: DocumentVisibilityState;
};

/** Observes document visibility and focus. Defaults to hidden and unfocused until mounted. */
export function useActiveTab(): UseActiveTabReturn {
	const [state, setState] = useState<UseActiveTabReturn>({
		isActiveTab: false,
		isTabFocused: false,
		visibilityState: 'hidden',
	});

	useEffect(() => {
		if (typeof document === 'undefined') return;
		const target = document;
		const win = target.defaultView;
		const handleChange = () => {
			const visibilityState = target.visibilityState;
			const isActiveTab = visibilityState === 'visible';
			const isTabFocused = target.hasFocus();
			setState((previous) =>
				previous.visibilityState === visibilityState && previous.isTabFocused === isTabFocused
					? previous
					: { isActiveTab, isTabFocused, visibilityState },
			);
		};
		target.addEventListener('visibilitychange', handleChange);
		win?.addEventListener('focus', handleChange);
		win?.addEventListener('blur', handleChange);
		handleChange();
		return () => {
			target.removeEventListener('visibilitychange', handleChange);
			win?.removeEventListener('focus', handleChange);
			win?.removeEventListener('blur', handleChange);
		};
	}, []);

	return state;
}
