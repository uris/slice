'use client';
import { Dot } from '@apple-pie/slice';

export function DotUsageExample() {
	return <Dot show position="inline" state="green" aria-label="Available" />;
}

export function DotExample1Example() {
	return (
		<div style={{ position: 'relative', width: 24, height: 24, background: 'var(--core-fill-primary)' }}>
			<Dot show state="blue" offSet={2} aria-label="New activity" />
		</div>
	);
}
