'use client';
import { RadioButton, RadioButtonList } from '@apple-pie/slice';

export function RadioButtonListCustomExample() {
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
}

export function RadioButtonListUsageExample() {
	return (
		<RadioButtonList label="Billing" defaultValue="monthly">
			<RadioButton value="monthly" label="Monthly" />
			<RadioButton value="annual" label="Annual" />
		</RadioButtonList>
	);
}

export function RadioButtonListDisabledExample() {
	return (
		<RadioButtonList label="Billing" disabled>
			<RadioButton value="monthly" label="Monthly" />
			<RadioButton value="annual" label="Annual" />
		</RadioButtonList>
	);
}
