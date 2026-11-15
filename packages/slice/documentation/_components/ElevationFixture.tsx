import { type ReactNode, useState } from 'react';
import type { ElevationLevel } from '../../src/theme/elevations/_types';

/** Exercise omitted, raised, and explicitly flat values without remounting the surface. */
export function ElevationFixture({ children }: { children: (elevation: ElevationLevel | undefined) => ReactNode }) {
	const [elevation, setElevation] = useState<ElevationLevel>();
	return (
		<div style={{ padding: 32, display: 'grid', gap: 32 }}>
			<div style={{ display: 'flex', gap: 16 }}>
				<button type="button" onClick={() => setElevation(3)}>
					Raise surface
				</button>
				<button type="button" onClick={() => setElevation(0)}>
					Flatten surface
				</button>
			</div>
			<div data-testid="elevation-surface" style={{ position: 'relative', minHeight: 180 }}>
				{children(elevation)}
			</div>
		</div>
	);
}
