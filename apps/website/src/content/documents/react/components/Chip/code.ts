export const usageCode = `
import { Chip } from '@apple-pie/slice';

export function ChipUsageExample() {
	return <Chip label="Colors" icon="basic.swatchbook" textSize="m" />;
}
`;

export const actionCode = `
<Chip label="Open tag" onClick={myHandler} />
`;

export const selectionCode = `
import { Chip } from '@apple-pie/slice';
import { useState } from 'react';

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
`;

export const removeCode = `
import { Chip } from '@apple-pie/slice';
import { useState } from 'react';

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
`;

export const stylingCode = `
import { Chip } from '@apple-pie/slice';

export function ChipStylingExample() {
	return (
		<Chip
			label="New"
			textSize="s"
			textColor="core-text-primary"
			backgroundColor="feedback-warning"
			borderWidth={0}
			borderRadius={4}
			padding="4px 8px"
		/>
	);
}
`;

export const tooltipCode = `
<Chip label="Open tag" tooltip="View items with this tag" onToolTip={handleTooltip} />
`;
