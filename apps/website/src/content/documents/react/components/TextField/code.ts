export const usageCode = `
import { TextField } from '@apple-pie/slice';

export function TextFieldUsageExample() {
	return (
		<TextField
		    name="Search"
		    label="Search"
		    placeholder="Search projects"
		    onChange={(value) => console.log(value)}
		/>
	);
}
`;

export const usageCodeIcon = `
import { TextField } from '@apple-pie/slice';

export function TextFieldUsageExample() {
	return (
		<TextField
		    name="Search"
		    iconLeft={{name:"basic.search"}}
		    label="Search"
		    placeholder="Search projects"
		    onChange={(value) => console.log(value)}
		/>
	);
}
`;

export const passwordCode = `
import { TextField } from '@apple-pie/slice';

export function TextFieldPasswordExample() {
	return (
		<TextField
			name="password"
			label="Password"
			inputType="password"
			clearButton={null}
			onChange={(value) => console.log(value)}
		/>
	);
}
`;

export const controlledCode = `
import { useState } from 'react';

function SearchField() {
  const [query, setQuery] = useState('');
  return <TextField name="query" label="Search" value={query} onChange={setQuery} />;
}
`;

export const actionCode = `
import { TextField } from '@apple-pie/slice';
import { useState } from 'react';

export function TextFieldActionExample() {
	const [query, setQuery] = useState('');

	return (
		<TextField
			label="Search"
			actionButton
			actionLabel="Search"
			onChange={setQuery}
			onAction={() => console.log('Search', query)}
		/>
	);
}
`;

export const labelsCode = `
import { TextField } from '@apple-pie/slice';

export function TextFieldLabelsExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '80%' }}>
			<TextField label="Email" variant="stacked" placeholder="Enter your email" />
			<TextField label="Email" variant="stacked" behavior="appear" />
			<TextField label="Email" variant="outlined" placeholder="Enter your email" />
		</div>
	);
}
`;

export const underlineCode = `
import { TextField } from '@apple-pie/slice';

export function TextFieldUnderline() {
	return (
		<TextField label="Email" variant="stacked" borderStyle="underline" placeholder="Enter your email" />
	);
}
`;

export const errorCode = `
import { TextField } from '@apple-pie/slice';

export function TextFieldErrorExample() {
	return <TextField name="first-name" label="First name" error errorMessage="Enter your first name." />;
}
`;
