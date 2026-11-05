'use client';
import { TextField } from '@apple-pie/slice';

export function TextFieldPreview({
	variant = 'default',
}: Readonly<{
	variant?:
		| 'simple'
		| 'labeled'
		| 'icon'
		| 'default'
		| 'password'
		| 'error'
		| 'stacked'
		| 'appear'
		| 'outlined'
		| 'underline';
}>) {
	const icon = variant === 'icon' ? { name: 'person', size: 16 } : undefined;
	const stacked = variant === 'stacked' || variant === 'appear' || variant === 'underline';
	const label = variant === 'simple' ? undefined : 'First name';
	const placeholder = variant === 'default' ? 'Search projects' : 'Enter first name';
	const labelColor = variant === 'appear' ? 'core-text-tertiary' : undefined;
	const background = 'core-surface-primary-tint';
	const borderRadius = variant === 'underline' ? 0 : undefined;
	const borderStyle = variant === 'underline' ? 'underline' : undefined;
	const error = variant === 'error' ? 'You need to provide a first name' : undefined;
	if (variant === 'password')
		return (
			<TextField
				name="password"
				label={'Password'}
				inputType="password"
				placeholder="Enter a password"
				clearButton={null}
				width={'80%'}
				variant={'outlined'}
				labelColor={labelColor}
				labelBackgroundColor={background}
				backgroundColorBlurred={background}
				backgroundColorFocused={background}
				tip={'Tip: Passwords need to be at least 8 characters long'}
			/>
		);
	return (
		<TextField
			name="first_name"
			label={label}
			placeholder={placeholder}
			iconLeft={icon}
			defaultValue={''}
			error={variant === 'error'}
			errorMessage={error}
			width={'80%'}
			variant={stacked ? 'stacked' : variant === 'outlined' ? 'outlined' : 'simple'}
			behavior={variant === 'appear' ? 'appear' : 'persistent'}
			labelBackgroundColor={background}
			backgroundColorBlurred={background}
			backgroundColorFocused={background}
			labelColor={labelColor}
			borderRadius={borderRadius}
			borderStyle={borderStyle}
		/>
	);
}
