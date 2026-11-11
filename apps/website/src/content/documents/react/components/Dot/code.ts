export const usageCode = `
import { Dot } from '@apple-pie/slice';

export function DotUsageExample() {
	return <Dot show position="inline" state="green" aria-label="Available" />;
}
`;

export const example1Code = `
import { Dot } from '@apple-pie/slice';

export function DotExample1Example() {
	return (
		<div style={{ position: 'relative', width: 24, height: 24, background: 'var(--core-fill-primary)' }}>
			<Dot show state="blue" offSet={2} aria-label="New activity" />
		</div>
	);
}
`;

export const motionCode = `
<Dot
    show={hasActivity}
    position="inline"
    aria-label="New activity"
    transition={{ duration: 0.2 }}
    motionValues={{ initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 } }}
/>
`;
