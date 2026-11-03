export const usageCode = `
import { RadioButton } from '@apple-pie/slice';

<fieldset>
  <legend>Billing</legend>
  <RadioButton label="Monthly" name="billing" value="monthly" defaultChecked />
  <RadioButton label="Annual" name="billing" value="annual" />
</fieldset>
`;
export const exampleCode = `
<RadioButton
  label="Annual"
  name="billing"
  value="annual"
  checked={billing === 'annual'}
  onChange={(option) => {
    if (option.value !== undefined) setBilling(option.value);
  }}
/>
`;
export const typedCode = `
<RadioButton
  label="Annual"
  name="billing"
  value={{ id: 'annual', months: 12 }}
  formValue="annual"
  onChange={myHandler}
/>
`;
