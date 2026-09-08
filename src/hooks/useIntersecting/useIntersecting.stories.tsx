import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { FlexDiv, Preset } from '../../components/FlexDiv';
import { Slider } from '../../components/Slider';
import { defaultOptions, useIntersecting } from './useIntersecting';

function UseIntersectingDemo() {
	const [threshold, setThreshold] = useState(0.1);
	const containerRef = useRef<HTMLDivElement>(null);
	const sentinelRef = useRef<HTMLDivElement>(null);

	// sentinel and list items are observed separately -- mixing a ref and a
	// class selector in one entries array made results[i] a fragile stand-in
	// for "which item", since array position depended on entries order.
	const { results: sentinelResults } = useIntersecting({
		...defaultOptions,
		container: containerRef,
		entries: sentinelRef,
		thresholds: threshold,
	});
	const isVisible = sentinelResults[0]?.isIntersecting ?? false;

	const { results: itemResults } = useIntersecting({
		...defaultOptions,
		container: containerRef,
		entries: '.list-item',
		thresholds: threshold,
	});
	const isItemVisible = (item: number) =>
		itemResults.some(
			(result) =>
				result.isIntersecting &&
				result.target.getAttribute('data-item-id') === String(item),
		);

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
						data-item-id={item}
						width={'fill'}
						height={'auto'}
						padding={12}
						border={'1px solid var(--core-outline-primary)'}
						borderRadius={8}
						background={
							isItemVisible(item)
								? 'var(--core-surface-special)'
								: 'var(--core-surface-primary)'
						}
						className={'list-item'}
					>
						Item {item}
					</FlexDiv>
				))}
				<FlexDiv
					ref={sentinelRef}
					width={'fill'}
					height={'auto'}
					padding={12}
					align={'center'}
					justify={'center'}
					border={'1px dashed var(--core-outline-secondary)'}
					borderRadius={8}
					background={isVisible ? 'var(--core-surface-special)' : 'transparent'}
				>
					sentinel
				</FlexDiv>
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
