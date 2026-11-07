'use client';
import { Button, type ErrorMessage, ErrorSummary, FlexDiv, Preset, TextField } from '@apple-pie/slice';
import { useState } from 'react';

export function ErrorSummaryUsageExample() {
	return (
		<ErrorSummary
			entries={[{ id: 'email', title: 'Email address required', message: 'Add an email address to continue.' }]}
		/>
	);
}

function ContactForm({ validateEmail }: Readonly<{ validateEmail: (value: string) => ErrorMessage | undefined }>) {
	const [email, setEmail] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const error = submitted ? validateEmail(email) : undefined;
	const errors = error ? [error] : [];

	return (
		<form
			noValidate
			style={{ width: '100%', maxWidth: 440, marginTop: 24 }}
			onSubmit={(event) => {
				event.preventDefault();
				setSubmitted(true);
			}}
		>
			<FlexDiv preset={Preset.Column} gap={16} width="100%">
				<ErrorSummary entries={errors} />
				<TextField
					name="email"
					inputAttributes={{ autoComplete: 'email', inputMode: 'email' }}
					label="Email address"
					placeholder="jane@example.com"
					value={email}
					error={errors.length > 0}
					onChange={(next) => setEmail(next ?? '')}
				/>
				<Button type="submit" label="Continue" />
			</FlexDiv>
		</form>
	);
}

function validatePreviewEmail(value: string): ErrorMessage | undefined {
	if (!value.trim()) {
		return {
			id: 'email-required',
			title: 'Email address required',
			message: 'Add an email address to continue.',
			fieldName: 'email',
		};
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
		return {
			id: 'email-invalid',
			title: 'Check your email address',
			message: 'Enter an address such as jane@example.com.',
			fieldName: 'email',
		};
	}
	return undefined;
}

export function ErrorSummaryFieldsExample() {
	return <ContactForm validateEmail={validatePreviewEmail} />;
}

export function ErrorSummaryLiveExample() {
	const [value, setValue] = useState('');
	const errors: ErrorMessage[] =
		value.length > 0
			? [
					{
						id: 'example-value',
						title: 'Value not accepted',
						message: 'Choose a different value.',
						fieldName: 'example-value',
					},
				]
			: [];

	return (
		<form style={{ width: '100%', maxWidth: 440, marginTop: 24 }} onSubmit={(event) => event.preventDefault()}>
			<FlexDiv preset={Preset.Column} gap={16} width="100%">
				<ErrorSummary entries={errors} />
				<TextField
					name="example-value"
					inputName="Example value"
					placeholder="Enter a value"
					value={value}
					onChange={(next) => setValue(next ?? '')}
					error={errors.length > 0}
				/>
			</FlexDiv>
		</form>
	);
}
