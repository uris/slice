import type { SliceLiquidGlassViewProps } from '../components';

/**
 * Size type exposed in components
 */
export type Size = 's' | 'm' | 'l' | number;

/**
 * Used for props in components that implement an optional liquid glass background
 * Other props of the liquid glass components are inferred by the parent component
 */
export type LiquidGlassBackground = Omit<
	SliceLiquidGlassViewProps,
	'cornerRadius' | 'removeClippedSubviews' | 'interactive'
>;

/**
 * Border radius exposed for components that apply it
 */
export type BorderRadius = 'pill' | 'rectangular' | number;
