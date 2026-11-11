export const usageCode = `
import { RadioButton } from '@apple-pie/slice';

export function RadioButtonUsageExample() {
	return (
		<fieldset>
			<legend>Billing</legend>
			<RadioButton label="Monthly" name="billing-basic-example" value="monthly" defaultChecked />
			<RadioButton label="Annual" name="billing-basic-example" value="annual" />
		</fieldset>
	);
}
`;
export const exampleCode = `
import { RadioButton } from '@apple-pie/slice';
import { useState } from 'react';

export function RadioButtonSelectionExample() {
	const [billing, setBilling] = useState('monthly');

	return (
		<RadioButton
			label="Annual"
			name="billing-controlled-example"
			value="annual"
			checked={billing === 'annual'}
			onChange={(option) => {
				if (option.value !== undefined) setBilling(option.value);
			}}
		/>
	);
}
`;
export const typedCode = `
<RadioButton
  label="Annual"
  name="billing-metadata-example"
  value={{ id: 'annual', months: 12 }}
  formValue="annual"
  onChange={myHandler}
/>
`;
