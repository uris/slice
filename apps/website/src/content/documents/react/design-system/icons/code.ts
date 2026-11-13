export const iconStylesCode = `
import { Icon } from '@apple-pie/slice';

<>
    {/* Outline: adjust size, stroke weight, and color. */}
    <Icon
        name="media.play"
        size={24}
        stroke={1.5}
        strokeColor="core-icon-primary"
        iconName="Play, outline"
    />

    {/* Filled: select the solid variant and use the same size and color. */}
    <Icon
        name="media.play-filled"
        size={24}
        strokeColor="core-icon-primary"
        iconName="Play, filled"
    />
    {/* Optional translucent layer on artwork that supports dual tone. */}
    <Icon
        name="ai.sparkle"
        size={24}
        dualTone
        fillOpacity={0.2}
        strokeColor="core-icon-primary"
        iconName="Sparkle, dual tone"
    />
</>
`;
