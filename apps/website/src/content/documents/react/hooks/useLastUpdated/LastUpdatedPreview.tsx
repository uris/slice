'use client';

import { Code } from '@/components/Type/Type';
import { Slider, useLastUpdated } from '@apple-pie/slice';
import { useCallback, useEffect, useState } from 'react';

export function LastUpdatedPreview() {
	const [minutes, setMinutes] = useState(5);
	const [timestamp, setTimestamp] = useState<string>();
	const { lastUpdated } = useLastUpdated(timestamp, 'Last updated ');
	const localTimestamp = timestamp
		? new Date(timestamp).toLocaleString(undefined, {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
				hour: 'numeric',
				minute: '2-digit',
				timeZoneName: 'short',
			})
		: '—';

	useEffect(() => {
		setTimestamp(new Date(Date.now() - 5 * 60_000).toISOString());
	}, []);

	const selectMinutes = useCallback((value: number) => {
		setMinutes(value);
		setTimestamp(new Date(Date.now() - value * 60_000).toISOString());
	}, []);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: 360 }}>
			<span style={{ minHeight: '1.5em' }}>{lastUpdated}</span>
			<Code>{localTimestamp}</Code>
			<div role="group" aria-label="Timestamp offset in minutes" style={{ width: '100%' }}>
				<Slider
					aria-label="Timestamp offset in minutes"
					value={2880 - minutes}
					min={0}
					max={2880}
					step={1}
					trackHeadSize={16}
					width="100%"
					onChange={(value) => selectMinutes(2880 - value)}
				/>
				<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
					<span>2 days ago</span>
					<span>Now</span>
				</div>
			</div>
		</div>
	);
}
