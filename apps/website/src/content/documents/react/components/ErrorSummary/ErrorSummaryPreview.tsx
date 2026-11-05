'use client';
import { type ErrorMessage, ErrorSummary, TextField } from '@apple-pie/slice';
import { useState } from 'react';

export function ErrorSummaryPreview({
	variant = 'default',
}: { variant?: 'default' | 'multiple' | 'fields' | 'validation' }) {
	const [email, setEmail] = useState('');
	const [project, setProject] = useState('');
	const getEntries = (): ErrorMessage[] => {
		if (variant === 'validation') {
			if (!email.length) return [];
			return [
				{
					id: 'example-value',
					title: 'Value not accepted',
					message: 'Choose a different value.',
					fieldName: 'preview-value',
				},
			];
		}
		const entries: ErrorMessage[] = [];
		if (variant !== 'fields' || !email.trim())
			entries.push({
				id: 'email',
				title: 'Email address required',
				message: 'Add an email address to continue.',
				fieldName: variant === 'fields' ? 'preview-email' : undefined,
			});
		if (variant === 'multiple' || (variant === 'fields' && !project.trim()))
			entries.push({
				id: 'project',
				title: 'Choose a project',
				message: 'Select the project this update belongs to.',
				fieldName: variant === 'fields' ? 'preview-project' : undefined,
			});
		return entries;
	};
	return (
		<form
			onSubmit={(event) => event.preventDefault()}
			style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)' }}
		>
			<ErrorSummary entries={getEntries()} />
			{variant === 'validation' && (
				<TextField
					name="preview-value"
					inputName="Example value"
					placeholder="Enter a value"
					value={email}
					onChange={(next) => setEmail(next ?? '')}
					error={email.length > 0}
				/>
			)}
			{variant === 'fields' && (
				<>
					<TextField
						name="preview-email"
						inputName="Email address"
						placeholder="Email address"
						value={email}
						onChange={(next) => setEmail(next ?? '')}
					/>
					<TextField
						name="preview-project"
						inputName="Project"
						placeholder="Project name"
						value={project}
						onChange={(next) => setProject(next ?? '')}
					/>
				</>
			)}
		</form>
	);
}
