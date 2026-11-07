'use client';
import { CheckBox } from '@apple-pie/slice';
import { useState } from 'react';

export function CheckBoxMultilineExample() {
	return (
		<CheckBox
			label="I accept the terms and conditions and confirm that I have read the privacy policy before continuing."
			align="top"
			textTopOffset={-2}
			style={{ maxWidth: 320 }}
		/>
	);
}

export function CheckBoxMixedExample() {
	const [checked, setAllSelected] = useState<boolean | 'mixed'>('mixed');

	return <CheckBox label="Select all" checked={checked} onChange={setAllSelected} />;
}

export function CheckBoxUsageExample() {
	const [subscribed, setSubscribed] = useState(false);

	return <CheckBox label="Email updates" checked={subscribed} onChange={setSubscribed} />;
}

export function CheckBoxDisabledExample() {
	return <CheckBox label="Required setting" checked disabled />;
}

export function CheckBoxCustomExample() {
	return (
		<CheckBox
			label="Email updates"
			iconChecked="basic.home"
			iconUnChecked="arrows.arrow-right"
			iconPartial="arrows.arrow-left"
			iconColor="core-icon-secondary"
			iconColorSelected="core-text-special"
			iconSize={24}
			gap={10}
			textColor="core-text-primary"
			textSize="l"
		/>
	);
}
