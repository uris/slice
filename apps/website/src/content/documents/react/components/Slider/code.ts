export const usageCode = `
import { Slider } from '@apple-pie/slice';

<Slider aria-label="Volume" />
`;
export const controlledCode = `
import { useState } from 'react';

function VolumeControl() {
    const [volume, setVolume] = useState(50);
    return <Slider aria-label="Volume" value={volume} onChange={setVolume} />;
}
`;
export const stepCode = `
<Slider aria-label="Zoom" min={0} max={200} step={10} />
`;
export const hoverCode = `
<Slider aria-label="Volume" trackHeadOnHover trackHeadSize={16} />
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
