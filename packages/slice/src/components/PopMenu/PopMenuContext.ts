import { createContext, useContext } from 'react';
import type { PopMenuItemProps } from './_types';

export interface PopMenuActions<T = unknown> {
	dismissAll: () => void;
	onClickItem?: PopMenuItemProps<T>['onClick'];
	onHoverItem?: PopMenuItemProps<T>['onHover'];
}

// Actions stay separate from expansion state so opening a submenu does not replace group callback chains.
export const PopMenuContext = createContext<PopMenuActions<never> | undefined>(undefined);
export const PopMenuActiveSubMenuContext = createContext<string | undefined>(undefined);
export const noopDismiss = () => {};

// React context erases generics; composed items/groups use the containing menu's payload type.
export function usePopMenuActions<T>() {
	return useContext(PopMenuContext) as PopMenuActions<T> | undefined;
}
