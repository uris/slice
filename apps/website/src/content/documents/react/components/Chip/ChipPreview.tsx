'use client';

import { Chip } from '@apple-pie/slice';
import { useState } from 'react';

export function DefaultChipPreview() {
	return <Chip label="Design" />;
}

export function RemovableChipPreview() {
	const [showTag, setShowTag] = useState(true);
	return (
		<>
			{showTag && (
				<Chip
					key="design"
					label="Design"
					textSize="m"
					borderWidth={0}
					backgroundColor="core-surface-secondary"
					onRemove={() => setShowTag(false)}
				/>
			)}
		</>
	);
}

export function SelectableChipPreview() {
	const [following, setFollowing] = useState(false);
	return (
		<Chip
			textSize="m"
			selected={following}
			label={following ? 'Following updates' : 'Follow'}
			onClick={() => setFollowing((value) => !value)}
		/>
	);
}
