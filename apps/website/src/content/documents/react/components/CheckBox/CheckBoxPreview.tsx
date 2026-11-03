'use client';

import { CheckBox } from '@apple-pie/slice';
import { useState } from 'react';

export function SingleLineCheckBoxPreview() {
	const [checked, setChecked] = useState(false);
	return <CheckBox label="Email updates" checked={checked} onChange={setChecked} />;
}

export function MixedCheckBoxPreview() {
	const [checked, setChecked] = useState<boolean | 'mixed'>('mixed');
	return <CheckBox label="Partial select" checked={checked} onChange={setChecked} />;
}

export function RequiredCheckBoxPreview() {
	return <CheckBox label="Required setting" checked disabled />;
}

export function MultilineCheckBoxPreview() {
	return (
		<CheckBox
			label="I accept the terms and conditions and confirm that I have read the privacy policy before continuing."
			align="top"
			style={{ maxWidth: 320 }}
		/>
	);
}
