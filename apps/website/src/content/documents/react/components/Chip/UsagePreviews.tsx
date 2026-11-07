'use client';
import { Chip } from '@apple-pie/slice';
import { useState } from 'react';

export function ChipUsageExample() {
	return <Chip label="Colors" icon="basic.swatchbook" textSize={'m'} />;
}

export function ChipStylingExample() {
	return (
		<Chip
			label="New"
			textSize="s"
			textColor="core-text-primary"
			backgroundColor="feedback-warning"
			borderWidth={0}
			borderRadius={4}
			padding={'4px 8px'}
		/>
	);
}

export function ChipSelectionExample() {
	const [selected, setSelected] = useState(false);

	return (
		<Chip
			icon={selected ? 'basic.star-slash' : 'basic.star'}
			label={selected ? 'Unfollow' : 'Follow'}
			selected={selected}
			onClick={() => setSelected((value) => !value)}
		/>
	);
}

export function ChipRemoveExample() {
	const [tags, setTags] = useState([{ id: 'design', label: 'Design' }]);
	return (
		<>
			{tags.map((tag) => (
				<Chip
					key={tag.id}
					label={tag.label}
					onRemove={() => setTags((items) => items.filter((item) => item.id !== tag.id))}
				/>
			))}
		</>
	);
}
