'use client';
import { Chip, FlexBox, Preset } from '@apple-pie/slice';
import { getPresetChildCount } from './code';

export function PresetPreview({ preset }: { preset: Preset }) {
	const children = getPresetChildCount(preset);
	return (
		<FlexBox
			width={300}
			height={300}
			padding={24}
			margin={'24px 48px'}
			borderRadius={24}
			background={'core-surface-secondary'}
		>
			<FlexBox borderRadius={4} preset={preset} gap={16} padding={16} border={'1px dashed var(--core-outline-primary)'}>
				{new Array(children).fill('Child').map((item, index) => {
					return (
						<Chip key={`child_${index + 1}`}>
							{item} {index + 1}
						</Chip>
					);
				})}
			</FlexBox>
		</FlexBox>
	);
}

export function ScrollPreview() {
	return (
		<FlexBox
			preset={Preset.FillScroll}
			gap={16}
			padding={16}
			margin={'24px 48px'}
			border={'1px dashed var(--core-outline-primary)'}
			borderRadius={16}
			height={250}
		>
			{new Array(8).fill('Child').map((item, index) => {
				return (
					<Chip key={`child_${index + 1}`}>
						{item} {index + 1}
					</Chip>
				);
			})}
		</FlexBox>
	);
}
