export const usageCode = `
import { RadioButton, RadioButtonList } from '@apple-pie/slice';

export function RadioButtonListUsageExample() {
	return (
		<RadioButtonList label="Billing" defaultValue="monthly">
			<RadioButton value="monthly" label="Monthly" />
			<RadioButton value="annual" label="Annual" />
		</RadioButtonList>
	);
}
`;
export const exampleCode = `
<RadioButtonList label="Billing" value={billing} onChange={setBilling}>
  <RadioButton value="monthly" label="Monthly" />
  <RadioButton value="annual" label="Annual" />
</RadioButtonList>
`;
export const optionsCode = `
<RadioButtonList label="Billing" defaultValue="monthly" options={[
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual', label: 'Annual' },
]} />
`;
export const customCode = `
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
`;

export const disabledCode = `
import { RadioButton, RadioButtonList } from '@apple-pie/slice';

export function RadioButtonListDisabledExample() {
	return (
		<RadioButtonList label="Billing" disabled>
			<RadioButton value="monthly" label="Monthly" />
			<RadioButton value="annual" label="Annual" />
		</RadioButtonList>
	);
}
`;
