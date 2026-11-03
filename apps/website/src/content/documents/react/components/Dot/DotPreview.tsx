'use client';

import { Dot } from '@apple-pie/slice';

export function DotPreview() {
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
			<Dot show position="inline" state="green" aria-label="Available" />
			<Dot show position="inline" state="yellow" aria-label="Away" />
			<Dot show position="inline" state="red" aria-label="Busy" />
		</div>
	);
}
