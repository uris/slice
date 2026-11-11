export const usageCode = `
import { ToggleButton } from '@apple-pie/slice';

<ToggleButton icon="weather.sun" label="Highlight" />
`;
export const exampleCode = `
import { ToggleButton } from '@apple-pie/slice';
import { useState } from 'react';

function Toggle() {
    const [selected, setSelected] = useState(false);

    return (
        <ToggleButton
            icon="weather.sun"
            label="Highlight"
            selected={selected}
            onChange={setSelected}
        />
    );
}

`;
export const motionCode = `
<ToggleButton
  icon="weather.sun"
  label="Highlight"
  labelOutside
  motionValues={{ unselected: { rotate: 0 }, selected: { rotate: 135 } }}
  borderRadius="100%"
  gap={8}
/>
`;

export const outsideCode = `
<ToggleButton
    icon="weather.sun"
    label="Highlight"
    labelOutside
    borderRadius="100%"
    gap={8}
/>
`;

export const textOnly = `
<ToggleButton label="Highlight" />
`;

export const disabledCode = `
<ToggleButton
    icon="weather.sun"
    label="Highlight"
    disabled
/>
`;

export const childrenCode = `
import { Avatar, ToggleButton } from '@apple-pie/slice';

<ToggleButton
    actionName={"John Wick's Profile"}
    buttonSize={"auto"}
    padding={8}
>
    <Avatar name="John Wick" image="/images/jw-profile.png" />
    <span>John Wick's Profile</span>
</ToggleButton>
`;
