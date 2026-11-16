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

export { springMotionSquareCode as animatableSquareCode } from '../../design-system/motion/code';

export const springAttachmentCode = `
import { Attachment, FlexBox, Preset, motionValues } from '@apple-pie/slice';
import { useReducedMotion } from 'motion/react';
import { useState } from 'react';

export function SpringAttachment() {
	const [state, setState] = useState<'pressed' | 'rest'>('rest');
	const reduceMotion = useReducedMotion();
	const spring = (pressed: boolean) => {
		setState(pressed && !reduceMotion ? 'pressed' : 'rest');
	};

	return (
		<FlexBox
			preset={Preset.Animatable}
			initial="rest"
			animate={reduceMotion ? 'rest' : state}
			variants={{ pressed: { scale: 0.95 }, rest: { scale: 1 } }}
			transition={motionValues['transition-spring']}
			onPointerDown={(event) => {
				if (event.isPrimary && event.button === 0) spring(true);
			}}
			onPointerUp={() => spring(false)}
			onPointerCancel={() => spring(false)}
			onPointerLeave={() => spring(false)}
			style={{ cursor: 'pointer' }}
		>
			<Attachment
				content={{ file: 'Project-brief.pdf' }}
				canRemove={false}
				onOpen={() => spring(false)}
				openLabel="Animate attachment"
			/>
		</FlexBox>
	);
}
`;

export const springPresenceCode = `
import { Button, FlexBox, Preset, motionValues } from '@apple-pie/slice';
import { AnimatePresence } from 'motion/react';
import { useState } from 'react';

export function SpringPresence() {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <FlexBox preset={Preset.Animatable} gap={24}>
            <FlexBox
                preset={Preset.Animatable}
                width={96}
                height={96}
                border={'1px dashed var(--core-outline-primary)'}
                borderRadius={32}
            >
                <AnimatePresence initial={false}>
                    {visible && (
                        <FlexBox
                            width={96}
                            height={96}
                            borderRadius={'var(--corner-xxl)'}
                            background="core-blue"
                            style={{cursor: 'pointer'}}
                            initial={{opacity: 0, scale: 0.7, transition: motionValues['transition-water']}}
                            animate={{opacity: 1, scale: 1, transition: motionValues['transition-spring']}}
                            exit={{opacity: 0, scale: 0.7, transition: motionValues['transition-water']}}
                            key={'Animatable'}
                            onClick={() => setVisible(false)}
                        />
                    )}
                </AnimatePresence>
            </FlexBox>
            <Button iconLeft={visible ? 'security.eye-slash' : 'security.eye'}
                label={visible ? 'Hide' : 'Show'} onClick={() => setVisible((prev) => !prev)}/>
        </FlexBox>
    );
}
`;
