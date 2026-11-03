'use client';
import { DropDown } from '@apple-pie/slice';
const options = [
	{ label: '-- Choose a status', value: 'none' },
	{ label: 'In progress', value: 'active' },
	{ label: 'Complete', value: 'complete' },
];
export function DropDownPreview({ variant = 'default' }: { variant?: 'default' | 'labeled' | 'bottom' }) {
	return (
		<DropDown
			name="Status"
			label={variant === 'labeled' ? 'Status' : undefined}
			width="340px"
			options={options}
			selectedIndex={variant === 'default' ? 0 : 1}
			borderStyle={variant === 'bottom' ? 'bottom' : 'box'}
		/>
	);
}
