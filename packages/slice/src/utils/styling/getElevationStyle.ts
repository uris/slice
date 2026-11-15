import type { CSSProperties } from 'react';
import type { ElevationLevel } from '../../theme/elevations/_types';

/** Apply a surface's own shadow without changing stacking order or child elevation. */
export function getElevationStyle(elevation: ElevationLevel = 0): CSSProperties {
	return { boxShadow: `var(--elevation-${elevation})` };
}
