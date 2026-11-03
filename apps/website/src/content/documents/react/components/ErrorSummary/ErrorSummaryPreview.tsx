'use client';
import { ErrorSummary } from '@apple-pie/slice';
export function ErrorSummaryPreview({ variant = 'default' }: { variant?: 'default' | 'multiple' }) {
	const entries = [{ title: 'Email address required', message: 'Add an email address to continue.' }];
	if (variant === 'multiple')
		entries.push({ title: 'Choose a project', message: 'Select the project this update belongs to.' });
	return (
		<div style={{ width: 340, maxWidth: '100%' }}>
			<ErrorSummary entries={entries} />
		</div>
	);
}
