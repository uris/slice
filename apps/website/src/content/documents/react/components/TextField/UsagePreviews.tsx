'use client';
import { TextField } from '@apple-pie/slice';
import { useState } from 'react';

export function TextFieldActionExample() {
	const [query, setQuery] = useState('');

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '80%' }}>
			<TextField
				label="Search"
				actionButton
				actionLabel="Search"
				onChange={setQuery}
				onAction={() => console.log('Search', query)}
			/>
		</div>
	);
}

export function TextFieldPasswordExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '80%' }}>
			<TextField
				name="password"
				label="Password"
				inputType="password"
				clearButton={null}
				onChange={(value) => console.log(value)}
			/>
		</div>
	);
}

export function TextFieldLabelsExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', paddingTop: 24, gap: 24, width: '80%' }}>
			<TextField label="Email" variant="simple" placeholder="Enter your email" />
			<TextField label="Email" variant="stacked" placeholder="Enter your email" />
			<TextField label="Email" variant="stacked" behavior="appear" />
			<TextField
				label="Email"
				variant="outlined"
				placeholder="Enter your email"
				backgroundColorBlurred={'core-srface-primary'}
			/>
		</div>
	);
}

export function TextFieldUnderlineExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '80%' }}>
			<TextField label="Email" variant="stacked" borderStyle={'underline'} placeholder="Enter your email" />
		</div>
	);
}

export function TextFieldUsageExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '60%' }}>
			<TextField
				name="Search"
				label="Search"
				placeholder="Search projects"
				iconLeft={{ name: 'basic.search' }}
				onChange={(value) => console.log(value)}
			/>
		</div>
	);
}

export function TextFieldIconUsageExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '60%' }}>
			<TextField
				name="Search"
				iconLeft={{ name: 'basic.search' }}
				placeholder="Search projects"
				onChange={(value) => console.log(value)}
			/>
		</div>
	);
}

export function TextFieldErrorExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '80%' }}>
			<TextField name="first-name" label="First name" error errorMessage="Enter your first name." />
		</div>
	);
}
