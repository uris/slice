'use client';
import { AvatarGroup } from '@apple-pie/slice';

export function AvatarGroupTypographyExample() {
	const participants = [
		{ id: 'john', first: 'John', last: 'Wick', image: '/images/jw-profile.png' },
		{ id: 'jane', first: 'Jane', last: 'Smith' },
		{ id: 'morgan', email: 'morgan@example.com' },
	];

	return <AvatarGroup avatars={participants} size={48} textSize="l" />;
}

export function AvatarGroupSpacingExample() {
	const participants = [
		{ id: 'john', first: 'John', last: 'Wick', image: '/images/jw-profile.png' },
		{ id: 'jane', first: 'Jane', last: 'Smith' },
		{ id: 'morgan', email: 'morgan@example.com' },
	];

	return <AvatarGroup avatars={participants} size={44} overlap={24} gap={0} />;
}

export function AvatarGroupUsageExample() {
	const participants = [
		{ id: 'john', first: 'John', last: 'Wick', image: '/images/jw-profile.png' },
		{ id: 'jane', first: 'Jane', last: 'Smith' },
		{ id: 'morgan', email: 'morgan@example.com' },
	];

	return <AvatarGroup borderWidth={1} size={44} avatars={participants} />;
}

export function AvatarGroupColorsExample() {
	return (
		<AvatarGroup
			avatars={[
				{
					id: 'jane',
					first: 'Jane',
					last: 'Smith',
					textColor: 'core-text-light',
					backgroundColor: 'array-cyan-accent',
				},
				{
					id: 'morgan',
					first: 'Morgan',
					last: 'Chen',
					textColor: 'core-text-light',
					backgroundColor: 'array-blue-accent',
				},
			]}
			borderWidth={1}
			size={48}
			outerBorderColor="core-surface-primary"
		/>
	);
}
