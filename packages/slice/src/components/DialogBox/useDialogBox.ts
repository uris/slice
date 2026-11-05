'use client';

import { createContext, useContext } from 'react';
import type { DialogBoxControls } from './_types';

export const DialogBoxContext = createContext<DialogBoxControls<unknown> | null>(null);

/** Use inside a descendant of DialogBox. Match T to the parent's action value type. */
export function useDialogBox<T = string>(): DialogBoxControls<T> {
	const context = useContext(DialogBoxContext);
	if (!context) throw new Error('useDialogBox must be used inside DialogBox.');
	return context as DialogBoxControls<T>;
}
