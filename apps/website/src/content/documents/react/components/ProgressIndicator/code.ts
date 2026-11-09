export const usageCode = `
import { ProgressIndicator } from '@apple-pie/slice';

export function LoadingIndicator() {
    const [loading] = useState(true);
    return <ProgressIndicator show={loading} inline decorative />;
}
`;
export const overlayCode = `
<div className="box">
    <ProgressIndicator show decorative label="busy"/>
</div>
`;
export const appearanceCode = `
<ProgressIndicator show inline decorative
    size={32}
    stroke={1}
    color="core-text-special"
    secondsPerSpin={1.5}
    inset={false}
/>
`;

export const timedCode = `
<ProgressIndicator show inline
    duration={2}
    label="Preparing preview"
    onStop={() => console.log('Playback stopped')}
/>
`;
export const motionCode = `
<ProgressIndicator show inline label="Loading files"
  motionValues={{ initial: { opacity: 0, y: 2 }, exit: { opacity: 0, y: 2 } }}
  transition={{ duration: 0.15 }} />
`;

export const labelCode = `
<ProgressIndicator show inline displayLabel
    label="Loading files…"
    labelPosition="right"
/>
`;
