import { createContext } from 'react';
import type { PopMenuItemProps } from './_types';

export interface PopMenuActions {
	dismissAll: () => void;
	onClickItem?: PopMenuItemProps['onClick'];
	onHoverItem?: PopMenuItemProps['onHover'];
}

// Actions stay separate from expansion state so opening a submenu does not replace group callback chains.
export const PopMenuContext = createContext<PopMenuActions | undefined>(undefined);
export const PopMenuActiveSubMenuContext = createContext<string | undefined>(undefined);
export const noopDismiss = () => {};
