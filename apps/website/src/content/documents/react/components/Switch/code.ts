export const usageCode = `
import { Switch } from '@apple-pie/slice';

<Switch
    aria-label="Notifications"
    checked={notificationsEnabled}
    onChange={(_, on) => setNotificationsEnabled(on)}
/>
`;

export const example1Code = `
<Switch<{ id: number }>
    aria-label="Email updates"
    value={{ id: 42 }}
    checked={emailEnabled}
    onChange={(setting, on) => updateSetting(setting?.id, on)}
/>
`;

export const example2Code = `
<Switch aria-label="Required setting" checked disabled />
`;

export const motionCode = `
<Switch
    aria-label="Notifications"
    checked={notificationsEnabled}
    onChange={(_, on) => setNotificationsEnabled(on)}
    transition={{ duration: 0.35 }}
/>
`;

export const uncontrolledCode = `
<Switch aria-label="Email updates" defaultChecked />
`;

export const shapeCode = `
<Switch
    aria-label="Email updates"
    width={64}
    knobWidth={30}
/>
`;
