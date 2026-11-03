'use client';
import { createContext, useEffect, useLayoutEffect } from 'react';
import type React from 'react';
import type { TabOption } from '../Tab';
import type { TabBarProps } from './_types';

type TabBarContextValue = {
	value: unknown;
	firstValue: unknown;
	iconFill: boolean;
	disabled: boolean;
	register: (element: HTMLButtonElement, option: TabOption<unknown>) => () => void;
	select: (option: TabOption<unknown>) => void;
	navigate: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
	onToolTip: TabBarProps['onToolTip'];
};
export const TabContext = createContext<TabBarContextValue | null>(null);
// ARIA is derived from the public naming, selection, and panel props.
export const withoutAria = (attributes: object) =>
	Object.fromEntries(Object.entries(attributes).filter(([name]) => !name.startsWith('aria-')));
export const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
