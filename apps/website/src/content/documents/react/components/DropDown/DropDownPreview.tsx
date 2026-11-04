'use client';
import { DropDown } from '@apple-pie/slice';
const options = [
	{ label: '-- Choose a status', value: '' },
	{ label: 'In progress', value: 'active' },
	{ label: 'Complete', value: 'complete' },
];
export function DropDownPreview({
	variant = 'default',
}: { variant?: 'default' | 'labeled' | 'stacked' | 'appear' | 'outlined' | 'underline' | 'disabled' | 'error' }) {
	if (variant === 'default')
		return (
			<DropDown name="status" inputName="Status" width="80%">
				<option value="">-- Choose a status</option>
				<option value="active">In progress</option>
				<option value="complete">Complete</option>
			</DropDown>
		);
	const getVariant = () => {
		if (variant === 'outlined') return 'outlined';
		if (variant === 'stacked' || variant === 'appear' || variant === 'underline') return 'stacked';
		return 'simple';
	};
	const showLabel = ['labeled', 'stacked', 'appear', 'outlined', 'underline'].includes(variant);
	const initialValue = variant === 'appear' ? '' : 'active';
	return (
		<DropDown
			name="status"
			inputName="Status"
			label={showLabel ? 'Status' : undefined}
			width="80%"
			options={options}
			defaultValue={initialValue}
			variant={getVariant()}
			behavior={variant === 'appear' ? 'appear' : 'persistent'}
			borderStyle={variant === 'underline' ? 'underline' : 'box'}
			backgroundColor={variant === 'outlined' ? 'core-surface-primary-tint' : undefined}
			labelBackgroundColor="core-surface-primary-tint"
			disabled={variant === 'disabled'}
			error={variant === 'error'}
			tip={variant === 'stacked' ? 'Choose the current status.' : undefined}
			errorMessage="Choose a status before continuing."
		/>
	);
}
