import type { LiquidGlassProps } from '../components';

/**
 * Size type exposed in components
 */
export type Size = 's' | 'm' | 'l' | number;

/**
 * Used for props in components that implement an optional liquid glass background
 * Other props of the liquid glass components are inferred by the parent component
 */
export type LiquidGlassBackground = Omit<LiquidGlassProps, 'cornerRadius' | 'removeClippedSubviews' | 'interactive'>;

/**
 * Border radius exposed for components that apply it
 */
export type BorderRadius = 'pill' | 'rectangular' | number;

export type FontWeight =
	| 'thin'
	| 'extra light'
	| 'light'
	| 'normal'
	| 'medium'
	| 'semi'
	| 'bold'
	| 'extra'
	| 'heavy'
	| number;
