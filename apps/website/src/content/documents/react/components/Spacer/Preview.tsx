'use client';

import { Spacer } from '@apple-pie/slice';

const sizes = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'h'] as const;

export function SpacerExample() {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'end',
				justifyContent: 'center',
				flexWrap: 'wrap',
				gap: 'var(--spacing-m)',
			}}
		>
			{sizes.map((size) => (
				<Spacer key={size} size={size} title={size} style={{ backgroundColor: 'var(--core-text-secondary)' }} />
			))}
		</div>
	);
}
