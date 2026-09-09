import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { FlexDiv, Preset } from '../../components/FlexDiv';
import { Slider } from '../../components/Slider';
import { defaultOptions, useIntersecting } from './useIntersecting';

function UseIntersectingDemo() {
	const [thresholds, setThresholds] = useState(0.1);
	const containerRef = useRef<HTMLDivElement>(null);
	const sentinelRef = useRef<HTMLDivElement>(null);

	// sentinel observer
	const sentinel = useIntersecting({
		...defaultOptions,
		container: containerRef,
		entries: sentinelRef,
		thresholds,
	});
	const isVisible = sentinel.results[0]?.isIntersecting ?? false;

	// list items observer
	const listItems = useIntersecting({
		...defaultOptions,
		container: containerRef,
		entries: '.list-item',
		thresholds,
		margin: 0,
	});

	const enteredIds = listItems.entered
		.map((result) => result.target.dataset.itemId)
		.join(', ');

	const exitedIds = listItems.exited
		.map((result) => result.target.dataset.itemId)
		.join(', ');

	const onScreenIds = listItems.onScreen
		.map((result) => result.target.dataset.itemId)
		.join(', ');

	const offScreenIds = listItems.offScreen
		.map((result) => result.target.dataset.itemId)
		.join(', ');

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
					value={thresholds}
					trackHeadSize={0}
					onChange={(v, _) => setThresholds(v)}
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
				<FlexDiv width={'fit'} height={'auto'} gap={4}>
					<div>Currently intersecting: {onScreenIds || '—'}</div>
					<div>Currently not intersecting: {offScreenIds || '—'}</div>
					<div>Last entered: {enteredIds || '—'}</div>
					<div>Last exited: {exitedIds || '—'}</div>
				</FlexDiv>
			</FlexDiv>
			<FlexDiv
				ref={containerRef}
				preset={Preset.FillScroll}
				width={360}
				height={280}
				border={'1px solid var(--core-outline-primary)'}
				background={'var(--core-surface-secondary)'}
				padding={24}
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
						background={'var(--core-surface-primary)'}
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
