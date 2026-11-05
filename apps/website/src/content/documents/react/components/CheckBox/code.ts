export const usageCode = `
import { CheckBox } from '@apple-pie/slice';

<CheckBox label="Email updates" checked={subscribed} onChange={setSubscribed} />
`;

export const mixedCode = `
<CheckBox label="Select all" checked="mixed" onChange={setAllSelected} />
`;

export const customCode = `
<CheckBox
    label="Email updates"
    iconChecked="home"
    iconUnChecked="arrow right"
    iconPartial="arrow left"
    iconColor="core-icon-secondary"
    iconColorSelected="core-text-special"
    iconSize={24}
    gap={10}
    textColor="core-text-primary"
    textSize="l"
/>
`;

export const disabledCode = `
<CheckBox label="Required setting" checked disabled />
`;

export const multilineCode = `
<CheckBox
    label="I accept the terms and conditions and confirm that I have read the privacy policy before continuing."
    align="top"
    textTopOffset={-2}
    style={{ maxWidth: 320 }}
/>
`;
