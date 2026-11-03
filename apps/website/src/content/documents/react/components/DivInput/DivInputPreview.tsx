'use client';
import { DivInput } from '@apple-pie/slice';
export function DivInputPreview({ variant = 'default' }: { variant?: 'default' | 'empty' | 'readonly' }) {
	return (
		<DivInput
			name="Project title"
			value={variant === 'empty' ? '' : 'Quarterly planning'}
			placeholder="Project title"
			width={320}
			padding="8px 12px"
			isEditable={variant !== 'readonly'}
		/>
	);
}
