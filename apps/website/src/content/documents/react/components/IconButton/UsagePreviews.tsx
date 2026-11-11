'use client';
import { IconButton } from '@apple-pie/slice';
import { useState } from 'react';

export function IconButtonExampleExample() {
	const [selected, setSelected] = useState(false);

	return <IconButton icon="weather.sun" actionName="Highlight" toggle selected={selected} onChange={setSelected} />;
}

export function IconButtonMotionExample() {
	return (
		<IconButton
			icon="weather.sun"
			actionName="Highlight"
			toggle
			motionValues={{ unselected: { rotate: 0 }, selected: { rotate: 135 } }}
			transition={{ duration: 0.2 }}
		/>
	);
}

export function IconButtonUsageExample() {
	return (
		<IconButton icon="basic.more-horiz-fill" actionName="More options" onClick={() => console.log('Action clicked')} />
	);
}
