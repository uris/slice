export const usageCode = `
import { Slider } from '@apple-pie/slice';

export function SliderUsageExample() {
	return <Slider width={300} aria-label="Volume" />;
}
`;
export const controlledCode = `
import { useState } from 'react';

function VolumeControl() {
    const [volume, setVolume] = useState(50);
    return <Slider aria-label="Volume" value={volume} onChange={setVolume} />;
}
`;
export const stepCode = `
import { Slider } from '@apple-pie/slice';

export function SliderStepExample() {
	return <Slider width={300} aria-label="Zoom" min={0} max={200} step={10} />;
}
`;
export const hoverCode = `
import { Slider } from '@apple-pie/slice';

export function SliderHoverExample() {
	return <Slider width={300} aria-label="Volume" trackHeadOnHover trackHeadSize={16} />;
}
`;
export const commitCode = `
<Slider
    aria-label="Playback position"
    min={0}
    max={duration}
    value={position}
    onChange={setPosition}
    onChangeEnd={myHandler}
/>
`;

export const disabledCode = `
import { Slider } from '@apple-pie/slice';

export function SliderDisabledExample() {
	return <Slider width={300} aria-label="Volume" disabled defaultValue={50} />;
}
`;
