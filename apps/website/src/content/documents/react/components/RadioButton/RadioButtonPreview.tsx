'use client';
import { RadioButton } from '@apple-pie/slice';
import { useId } from 'react';
export function RadioButtonPreview({
	variant = 'default',
}: { variant?: 'default' | 'framed' | 'multiline' | 'disabled' }) {
	const name = useId();
	if (variant === 'disabled') return <RadioButton label="Annual billing" name={name} value="annual" disabled />;
	if (variant === 'multiline')
		return (
			<RadioButton
				label="Choose annual billing for everyone on my team, with one renewal date for all seats."
				name={name}
				value="annual"
				align="top"
				textTopOffset={2}
				style={{ maxWidth: 300 }}
			/>
		);
	const framed = variant === 'framed';
	return (
		<div
			role="radiogroup"
			aria-label="Billing"
			style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}
		>
			<RadioButton
				label="Monthly"
				name={name}
				value="monthly"
				defaultChecked
				borderWidth={framed ? 1 : 0}
				padding={framed ? '8px 16px' : 0}
				backgroundColorSelected={framed ? 'core-surface-secondary' : 'transparent'}
			/>
			<RadioButton
				label="Annual"
				name={name}
				value="annual"
				borderWidth={framed ? 1 : 0}
				padding={framed ? '8px 16px' : 0}
				backgroundColorSelected={framed ? 'core-surface-secondary' : 'transparent'}
			/>
		</div>
	);
}
