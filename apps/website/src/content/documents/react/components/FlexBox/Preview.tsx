'use client';
import { Chip, FlexBox, Preset } from '@apple-pie/slice';
export function RowPreview() {
	return (
		<FlexBox preset={Preset.Row} gap={12} wrap padding={16} background="core-surface-primary-tint" borderRadius={8}>
			<Chip>Design</Chip>
			<Chip>Build</Chip>
			<Chip>Ship</Chip>
		</FlexBox>
	);
}
export function ColumnPreview() {
	return (
		<FlexBox preset={Preset.Column} gap={12} padding={16} background="core-surface-primary-tint" borderRadius={8}>
			<Chip>Design</Chip>
			<Chip>Build</Chip>
			<Chip>Ship</Chip>
		</FlexBox>
	);
}
export function ScrollPreview() {
	return (
		<FlexBox
			preset={Preset.FillScroll}
			width={240}
			height={140}
			gap={12}
			padding={16}
			background="core-surface-primary-tint"
			borderRadius={8}
		>
			{['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'].map((item) => (
				<Chip key={item} style={{ flexShrink: 0 }}>
					{item}
				</Chip>
			))}
		</FlexBox>
	);
}
