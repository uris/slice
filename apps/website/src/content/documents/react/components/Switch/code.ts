export const usageCode = `
import { Switch } from '@apple-pie/slice';
import { useState } from 'react';

export function SwitchUsageExample() {
	const [notificationsEnabled, setNotificationsEnabled] = useState(false);

	return (
		<Switch
			name="Notifications"
			checked={notificationsEnabled}
			onChange={(_, on) => setNotificationsEnabled(on)}
		/>
	);
}
`;

export const example1Code = `
<Switch<{ id: number }>
    name="Email updates"
    value={{ id: 42 }}
    checked={emailEnabled}
    onChange={(setting, on) => updateSetting(setting?.id, on)}
/>
`;

export const example2Code = `
import { Switch } from '@apple-pie/slice';

export function SwitchDisabledExample() {
	return <Switch name="Required setting" checked disabled />;
}
`;

export const motionCode = `
<Switch
    name="Notifications"
    checked={notificationsEnabled}
    onChange={(_, on) => setNotificationsEnabled(on)}
    transition={{ duration: 0.35 }}
/>
`;

export const uncontrolledCode = `
import { Switch } from '@apple-pie/slice';

export function SwitchUncontrolledExample() {
	return <Switch name="Email updates" defaultChecked />;
}
`;

export const shapeCode = `
import { Switch } from '@apple-pie/slice';

export function SwitchShapeExample() {
	return <Switch name="Email updates" width={60} height={34} padding={2} knobWidth={30} knobRadius="50%" borderRadius={17} />;
}
`;
