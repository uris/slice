import React from 'react';
import { FlexBox } from '../../../src';

const NoteSection = React.memo((props: { children: React.ReactNode }) => {
	const { children } = props;
	return (
		<FlexBox
			className={'note-section'}
			width={'fill'}
			height={'fit'}
			padding={24}
			background={'var(--core-surface-secondary)'}
			border={'1px solid var(--core-outline-primary)'}
			borderRadius={8}
			margin={'0 0 24px 0'}
		>
			{children}
		</FlexBox>
	);
});

NoteSection.displayName = 'NoteSection';

export default NoteSection;
