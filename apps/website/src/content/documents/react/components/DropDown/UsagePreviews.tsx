'use client';
import { DropDown } from '@apple-pie/slice';

export function DropDownGuidanceExample() {
	const statusOptions = [
		{ label: '-- Choose a status', value: '' },
		{ label: 'In progress', value: 'active' },
		{ label: 'Complete', value: 'complete' },
	];
	const hasError = true;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
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
		</div>
	);
}

export function DropDownLabelsExample() {
	const statusOptions = [
		{ label: '-- Choose a status', value: '' },
		{ label: 'In progress', value: 'active' },
		{ label: 'Complete', value: 'complete' },
	];

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<DropDown label="Status" variant="simple" options={statusOptions} />
			<DropDown label="Status" variant="stacked" options={statusOptions} />
			<DropDown label="Status" variant="stacked" behavior="appear" options={statusOptions} />
			<DropDown label="Status" variant="outlined" options={statusOptions} backgroundColor={'core-surface-primary'} />
		</div>
	);
}

export function DropDownUsageExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<DropDown name="status" inputName="Status" onChange={(value) => console.log(value)}>
				<option value="">-- Choose a status</option>
				<option value="active">In progress</option>
				<option value="complete">Complete</option>
			</DropDown>
		</div>
	);
}

export function DropDownUnderlineExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<DropDown label="Status" variant="stacked" borderStyle={'underline'}>
				<option value="">-- Choose a status</option>
				<option value="active">In progress</option>
				<option value="complete">Complete</option>
			</DropDown>
		</div>
	);
}
