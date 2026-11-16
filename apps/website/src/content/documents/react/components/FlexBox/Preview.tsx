'use client';
import { Attachment, Button, Chip, FlexBox, Preset, motionValues } from '@apple-pie/slice';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import { useState } from 'react';
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

export { SpringMotionSquarePreview as AnimatableSquarePreview } from '../../design-system/motion/MotionPreviews';

export function SpringAttachmentPreview() {
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

export function AnimatePresenceExample() {
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
							background={'core-blue'}
							style={{ cursor: 'pointer' }}
							initial={{ opacity: 0, scale: 0.7, transition: motionValues['transition-water'] }}
							animate={{ opacity: 1, scale: 1, transition: motionValues['transition-spring'] }}
							exit={{ opacity: 0, scale: 0.7, transition: motionValues['transition-water'] }}
							key={'Animatable'}
							onClick={() => setVisible(false)}
						/>
					)}
				</AnimatePresence>
			</FlexBox>
			<Button
				iconLeft={visible ? 'security.eye-slash' : 'security.eye'}
				label={visible ? 'Hide' : 'Show'}
				onClick={() => setVisible((prev) => !prev)}
			/>
		</FlexBox>
	);
}
