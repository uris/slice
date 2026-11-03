'use client';
import { RadioButton, RadioButtonList } from '@apple-pie/slice';
export function RadioButtonListPreview({ variant = 'default' }: { variant?: 'default' | 'custom' | 'disabled' }) {
	if (variant === 'custom')
		return (
			<RadioButtonList label="Billing" defaultValue="annual" textSize="s">
				<RadioButton value="monthly" label="Monthly" />
				<RadioButton value="annual" align="top" padding={12} borderWidth={1}>
					<span>
						<strong>Annual</strong>
						<br />
						One renewal for your team.
					</span>
				</RadioButton>
			</RadioButtonList>
		);
	return (
		<RadioButtonList
			label="Billing"
			defaultValue={variant === 'disabled' ? null : 'monthly'}
			disabled={variant === 'disabled'}
		>
			<RadioButton value="monthly" label="Monthly" />
			<RadioButton value="annual" label="Annual" />
		</RadioButtonList>
	);
}
