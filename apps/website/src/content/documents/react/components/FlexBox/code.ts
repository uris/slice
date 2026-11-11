import { Preset } from '@apple-pie/slice';

export const rowCode = `
import { Chip, FlexBox, Preset } from '@apple-pie/slice';

export default function Layout() {
    return (
        <FlexBox preset={Preset.Row} gap={12} wrap padding={16}
            background="core-surface-primary-tint" borderRadius={8}>
            <Chip>Design</Chip>
            <Chip>Build</Chip>
            <Chip>Ship</Chip>
        </FlexBox>
    );
}
`;

export const columnCode = `
import { Chip, FlexBox, Preset } from '@apple-pie/slice';

export default function Layout() {
    return (
        <FlexBox preset={Preset.Column} gap={12} padding={16}
            background="core-surface-primary-tint" borderRadius={8}>
            <Chip>Design</Chip>
            <Chip>Build</Chip>
            <Chip>Ship</Chip>
        </FlexBox>
    );
}
`;

export function getPresetChildCount(preset: Preset) {
	if (preset === Preset.FillScroll) return 10;
	if (preset === Preset.RowBetween || preset === Preset.ColumnBetween) return 2;
	if (preset === Preset.Column) return 6;
	return 3;
}

export const presetCode = (preset: Preset) => `
import { Chip, FlexBox, Preset } from '@apple-pie/slice';

export default function Layout() {
	return (
		<FlexBox
			preset={Preset.${Object.entries(Preset).find(([, value]) => value === preset)?.[0]}}
			gap={16}
			padding={16}
			border="1px dashed var(--core-outline-primary)"
		>
			<Chip>Child 1</Chip>
			<Chip>Child 2</Chip>
			<Chip>Child 3</Chip>
		</FlexBox>
    );
}
`;

export const motionCode = `
<FlexBox
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
>
    Content
</FlexBox>
`;
