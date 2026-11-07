export const usageCode = `
import { DropDown } from '@apple-pie/slice';

export function DropDownUsageExample() {
	return (
		<DropDown name="status" inputName="Status" onChange={(value) => console.log(value)}>
			<option value="">-- Choose a status</option>
			<option value="active">In progress</option>
			<option value="complete">Complete</option>
		</DropDown>
	);
}
`;

export const underlineCode = `
<DropDown label="Status" variant="stacked" borderStyle={'underline'}>
    <option value="">-- Choose a status</option>
    <option value="active">In progress</option>
    <option value="complete">Complete</option>
</DropDown>
`;

export const optionsCode = `
<DropDown name="status" inputName="Status" options={[
  { label: '-- Choose a status', value: '' },
  { label: 'In progress', value: 'active' },
  { label: 'Complete', value: 'complete' },
]} onChange={myHandler} />;
`;

export const controlledCode = `
import { useState } from 'react';

function StatusField() {
  const [status, setStatus] = useState('active');
  return <DropDown name="status" label="Status" value={status} onChange={setStatus} options={[
    { label: 'In progress', value: 'active' },
    { label: 'Complete', value: 'complete' },
  ]} placeholder={false} />;
}
`;
export const typedCode = `
<DropDown<{ number }>
  name="owner"
  inputName="Owner"
  valueKey="id"
  defaultValue={{ 2 }}
  placeholder={false}
  options={[
    { label: 'Alex', value: { id: 1 } },
    { 'Sam', value: { 2 } },
  ]}
  onChange={myHandler}
/>;
`;

export const labelsCode = `
import { DropDown } from '@apple-pie/slice';

export function DropDownLabelsExample() {
	const statusOptions = [
		{ label: 'In progress', value: 'active' },
		{ label: 'Complete', value: 'complete' },
	];

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '80%' }}>
			<DropDown label="Status" variant="simple" options={statusOptions} />
			<DropDown label="Status" variant="stacked" options={statusOptions} />
			<DropDown label="Status" variant="stacked" behavior="appear" options={statusOptions} />
			<DropDown label="Status" variant="outlined" options={statusOptions} />
		</div>
	);
}
`;
export const guidanceCode = `
import { DropDown } from '@apple-pie/slice';

export function DropDownGuidanceExample() {
	const statusOptions = [
		{ label: 'In progress', value: 'active' },
		{ label: 'Complete', value: 'complete' },
	];
	const hasError = true;

	return (
		<DropDown
			name="status"
			label="Status"
			variant="stacked"
			options={statusOptions}
			tip="Choose the current status."
			error={hasError}
			errorMessage="Choose a status before continuing."
			onChange={(value) => console.log(value)}
		/>
	);
}
`;
