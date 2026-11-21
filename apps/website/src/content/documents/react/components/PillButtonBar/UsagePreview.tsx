'use client';

import { FlexBox, PillButtonBar, Preset, type SliceIcon, Tab } from '@apple-pie/slice';
import { useId, useState } from 'react';

const ranges: { value: string; label: string; summary: string; icon: SliceIcon }[] = [
	{ value: 'day', label: 'Day', icon: 'weather.sun', summary: '8 new visits today' },
	{ value: 'week', label: 'Week', icon: 'time.calendar-dates', summary: '54 new visits this week' },
	{ value: 'month', label: 'Month', icon: 'time.calendar', summary: '212 new visits this month' },
];

export function PillButtonBarExample({ showIcons = false }: { showIcons?: boolean }) {
	const id = useId();
	const [range, setRange] = useState('week');

	return (
		<FlexBox preset={Preset.Column} width="100%" maxWidth={360} gap={12}>
			<PillButtonBar tabBarName="Activity range" value={range} onChange={setRange}>
				{ranges.map(({ value, label, icon }) => (
					<Tab
						key={value}
						value={value}
						label={label}
						icon={showIcons ? icon : undefined}
						id={`${id}-${value}`}
						panelId={`${id}-${value}-panel`}
					/>
				))}
			</PillButtonBar>
			{ranges.map(({ value, summary }) => (
				<div
					key={value}
					role="tabpanel"
					id={`${id}-${value}-panel`}
					aria-labelledby={`${id}-${value}`}
					hidden={range !== value}
				>
					{summary}
				</div>
			))}
		</FlexBox>
	);
}
