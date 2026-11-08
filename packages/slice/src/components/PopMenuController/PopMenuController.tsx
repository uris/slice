'use client';

import { cloneElement, isValidElement } from 'react';
import { usePopMenu, usePopMenuStore } from '../../stores/popMenu';
import { PopMenu } from '../PopMenu';
import type { PopMenuProps } from '../PopMenu';

/** Mount once to render the store's single active menu. Composed controls must forward dismissal props. */
export function PopMenuController() {
	const menu = usePopMenu();
	const version = usePopMenuStore((state) => state.version);
	if (!menu) return null;

	const composed = isValidElement<PopMenuProps>(menu);
	const props = composed ? menu.props : menu;

	const clearCurrentMenu = () => {
		const state = usePopMenuStore.getState();
		if (state.version === version) state.actions.clear();
	};
	const onDismiss = () => {
		props.onDismiss?.();
		clearCurrentMenu();
	};
	const dismissAll = () => {
		props.dismissAll?.();
		clearCurrentMenu();
	};

	if (composed) return cloneElement(menu, { key: version, onDismiss, dismissAll });
	return <PopMenu {...props} key={version} onDismiss={onDismiss} dismissAll={dismissAll} />;
}
