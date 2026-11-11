'use client';
import { Switch } from '@apple-pie/slice';
import { useState } from 'react';

export function SwitchUsageExample() {
	const [notificationsEnabled, setNotificationsEnabled] = useState(false);

	return (
		<Switch name="Notifications" checked={notificationsEnabled} onChange={(_, on) => setNotificationsEnabled(on)} />
	);
}

export function SwitchUncontrolledExample() {
	return <Switch name="Email updates" defaultChecked />;
}

export function SwitchShapeExample() {
	return (
		<Switch name="Email updates" width={60} height={34} padding={2} knobWidth={30} knobRadius="50%" borderRadius={17} />
	);
}

export function SwitchDisabledExample() {
	return <Switch name="Required setting" checked disabled />;
}
