export const usageCode = `
import { ErrorSummary } from '@apple-pie/slice';

export function ErrorSummaryUsageExample() {
	return (
		<ErrorSummary
			entries={[
				{ id: 'email', title: 'Email address required', message: 'Add an email address to continue.' },
				{ id: 'project', title: 'Choose a project' },
			]}
		/>
	);
}
`;
export const fieldsCode = `
import { Button, type ErrorMessage, ErrorSummary, FlexDiv, Preset, TextField } from '@apple-pie/slice';
import { useState } from 'react';

export function ContactForm({ validateEmail }: { validateEmail: (value: string) => ErrorMessage | undefined }) {
	const [email, setEmail] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const error = submitted ? validateEmail(email) : undefined;
	const errors = error ? [error] : [];

	return (
		<form
			noValidate
			onSubmit={(event) => {
				event.preventDefault();
				setSubmitted(true);
			}}
		>
			<FlexDiv preset={Preset.Column}>
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
`;
export const announcementCode = `
<ErrorSummary
  entries={errors}
  summaryName="Check your details"
  announcement="assertive"
/>
`;
export const focusCode = `
import { Button } from '@apple-pie/slice';
import { useRef } from 'react';

const summaryRef = useRef<HTMLDivElement>(null);

<>
  <ErrorSummary ref={summaryRef} entries={errors} />
  <Button label="Review errors" onClick={() => summaryRef.current?.focus()} />
</>
`;
export const entryCode = `
type ErrorMessage = {
  id?: string;
  title: string;
  message?: string | string[];
  fieldName?: string;
};
`;

export const liveCode = `
import { type ErrorMessage, ErrorSummary, FlexDiv, Preset, TextField } from '@apple-pie/slice';
import { useState } from 'react';

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
		<form style={{ width: '100%', maxWidth: 440 }} onSubmit={(event) => event.preventDefault()}>
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
`;

export const motionCode = `
<ErrorSummary
  entries={errors}
  transition={{ duration: 0.35 }}
  motionValues={{
    initial: { y: -8 },
    animate: { y: 0 },
    exit: { y: -8 },
  }}
/>
`;
