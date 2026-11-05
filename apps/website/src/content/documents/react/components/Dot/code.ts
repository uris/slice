export const usageCode = `
import { Dot } from '@apple-pie/slice';

<Dot show position="inline" state="green" aria-label="Available" />
`;

export const example1Code = `
<div style={{ position: 'relative', width: 48, height: 48 }}>
    <Dot show state="red" aria-label="New activity" />
</div>
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
