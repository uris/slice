'use client';

import { Switch } from '@apple-pie/slice';
import { useState } from 'react';

export function SwitchPreview() {
	const [enabled, setEnabled] = useState(false);
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
			<Switch name="Notifications" checked={enabled} onChange={(_, on) => setEnabled(on)} />
		</div>
	);
}

export function RoundSwitchPreview() {
	const [enabled, setEnabled] = useState(false);
	return (
		<Switch name="Notifications" width={44} knobWidth={18} checked={enabled} onChange={(_, on) => setEnabled(on)} />
	);
}
