import type { ElevationShadows, Elevations, ShadowLayer } from './_types';
export type { ElevationLevel, ElevationDefinition, Elevations, ElevationShadows, ShadowLayer } from './_types';

/** Slice shadow geometry. The two layers provide directional and ambient depth. */
export const elevations: Elevations = {
	0: { androidElevation: 0, shadows: [] },
	1: { androidElevation: 1, shadows: [layer(1, 3, 0.12), layer(1, 2, 0.24)] },
	2: { androidElevation: 3, shadows: [layer(3, 6, 0.12), layer(3, 6, 0.16)] },
	3: { androidElevation: 6, shadows: [layer(10, 20, 0.19), layer(6, 6, 0.1)] },
	4: { androidElevation: 8, shadows: [layer(14, 28, 0.16), layer(10, 10, 0.1)] },
	5: { androidElevation: 12, shadows: [layer(19, 38, 0.18), layer(15, 12, 0.1)] },
};

function layer(offsetY: number, blurRadius: number, opacity: number): ShadowLayer {
	return { offsetX: 0, offsetY, blurRadius, spreadDistance: 0, opacity };
}

/** Resolve web shadows without importing CSS or browser APIs. Dark shadows use twice the opacity. */
export function createElevationShadows(mode: 'light' | 'dark'): ElevationShadows {
	const opacityScale = mode === 'dark' ? 2 : 1;
	return Object.fromEntries(
		Object.entries(elevations).map(([level, definition]) => {
			const shadows = definition.shadows.map(
				({ offsetX, offsetY, blurRadius, spreadDistance, opacity }) =>
					`${offsetX}px ${offsetY}px ${blurRadius}px ${spreadDistance}px rgba(0, 0, 0, ${Number((opacity * opacityScale).toFixed(2))})`,
			);
			return [`elevation-${level}`, shadows.join(', ') || 'none'];
		}),
	) as ElevationShadows;
}
