'use client';

import { AvatarGroup, Card, CardContent, type CardProps, CardTitle, FlexBox } from '@apple-pie/slice';
import { useToastActions } from '@apple-pie/slice/stores';
import type { ReactNode } from 'react';
import css from './Overview.module.css';

export const team = [
	{ id: 'maya', first: 'Maya', last: 'Chen', image: '/images/profile-pic-female-1.png' },
	{ id: 'alex', first: 'Alex', last: 'Morgan', image: '/images/profile-pic-male-1.png' },
	{ id: 'sam', first: 'Sam', last: 'Rivera', image: '/images/profile-pic-female-3.png' },
	{ id: 'jamie', first: 'Jamie', last: 'Park', image: '/images/profile-pic-male-3.png' },
];

export function Members() {
	return <AvatarGroup avatars={team} limit={3} size={48} groupName="Project team" />;
}

export function Block({
	title,
	caption,
	children,
	...props
}: CardProps & { title: string; caption?: string; children: ReactNode }) {
	return (
		<Card
			role="group"
			aria-label={title}
			{...props}
			className={css.card}
			padding={20}
			style={{ width: '100%', ...props.style }}
		>
			<CardTitle title={title} caption={caption} />
			<CardContent>
				<FlexBox direction="column" width="fill" gap={16} overflow="visible">
					{children}
				</FlexBox>
			</CardContent>
		</Card>
	);
}

export function Row({ children }: { children: ReactNode }) {
	return (
		<FlexBox
			direction="row"
			width="fill"
			align="center"
			justify="between"
			gap={12}
			overflow="visible"
			className={css.row}
		>
			{children}
		</FlexBox>
	);
}

export function useNotice() {
	const { push } = useToastActions();
	return (message: string) => push({ message, type: 'success' });
}
