import { createContext, useContext } from 'react';

/**
 * Indicates a supported native glass content hierarchy, including intermediate views.
 * React portals must not use this context as proof of native glass ancestry.
 */
export const GlassContentContext = createContext(false);

/**
 * Whether the nearest Slice glass container supports native glass content.
 */
export function useGlassContent() {
	return useContext(GlassContentContext);
}
