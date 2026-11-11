import type { ReactElement } from 'react';
import type { PopMenuProps } from '../../components/PopMenu/_types';

/** A composed menu control, or props used by the controller to create a PopMenu. */
export type PushedPopMenu = ReactElement<PopMenuProps> | PopMenuProps;

export interface PopMenuStore {
	popMenu: PushedPopMenu | null;
	/** Each push starts a fresh menu instance, including repeated pushes of the same value. */
	version: number;
	actions: {
		push: (popMenu: PushedPopMenu | null) => void;
		clear: () => void;
	};
}
