import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { FlexDiv, Preset } from '../../components/FlexDiv';
import { Slider } from '../../components/Slider';
import { defaultOptions, useIntersecting } from './useIntersecting';

function UseIntersectingDemo() {
	const [threshold, setThreshold] = useState(0.1);
	const containerRef = useRef<HTMLDivElement>(null);
	const sentinelRef = useRef<HTMLDivElement>(null);

	const [result] = useIntersecting({
		...defaultOptions,
		container: containerRef,
		entries: sentinelRef,
		thresholds: threshold,
	});
	const isVisible = result?.isIntersecting ?? false;
	const items = Array.from({ length: 20 }, (_, index) => index + 1);

	return (
		<FlexDiv
			align={'center'}
			justify={'center'}
			padding={24}
			absolute
			direction={'column'}
			gap={12}
		>
			<FlexDiv direction={'column'} align={'center'} height={'auto'} gap={12}>
				Change Threshold
				<Slider
					width={300}
					scaleMin={0}
					scaleMax={1}
					step={0.05}
					value={threshold}
					trackHeadSize={0}
					onChange={(v, _) => setThreshold(v)}
				/>
				<FlexDiv
					width={'fit'}
					height={'auto'}
					padding={'4px 12px'}
					borderRadius={999}
					background={
						isVisible
							? 'var(--core-surface-special)'
							: 'var(--core-surface-secondary)'
					}
				>
					{isVisible ? 'Sentinel is intersecting' : 'Sentinel is off-screen'}
				</FlexDiv>
			</FlexDiv>
			<FlexDiv
				ref={containerRef}
				preset={Preset.FillScroll}
				width={360}
				height={280}
				border={'1px solid var(--core-outline-primary)'}
				background={'var(--core-surface-secondary)'}
				padding={12}
				gap={8}
			>
				{items.map((item) => (
					<FlexDiv
						key={item}
						width={'fill'}
						height={'auto'}
						padding={12}
						border={'1px solid var(--core-outline-primary)'}
						borderRadius={8}
						background={'var(--core-surface-primary)'}
					>
						Item {item}
					</FlexDiv>
				))}
				<div ref={sentinelRef} style={{ height: 1, flexShrink: 0 }} />
			</FlexDiv>
		</FlexDiv>
	);
}

const meta: Meta<typeof UseIntersectingDemo> = {
	title: 'Hooks/useIntersecting',
	component: UseIntersectingDemo,
	parameters: {
		layout: 'padded',
	},
};

export default meta;

export const Demo: StoryObj<typeof UseIntersectingDemo> = {};
