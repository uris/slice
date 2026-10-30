import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { FlexDiv, Preset } from '../../components/FlexDiv';
import { ProgressIndicator } from '../../components/Progress';
import { useInfiniteScroll } from './useInfiniteScroll';

function UseInfiniteScrollDemo() {
	const [root, setRoot] = useState<HTMLDivElement | null>(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const loadProducts = async () => {
		await new Promise<void>((resolve) => setTimeout(resolve, 500));
		const start = (page - 1) * 10;
		const products = Array.from({ length: 10 }, (_, index) => ({
			id: start + index,
			name: `Item ${start + index + 1}`,
		}));
		setPage((current) => current + 1);
		setHasMore(page < 5);
		return products;
	};
	const { items, sentinelRef, isLoading, error, retry, reset, loadMore } = useInfiniteScroll(loadProducts, {
		root,
		hasMore,
	});
	const startAgain = () => {
		setPage(1);
		setHasMore(true);
		reset();
		root?.scrollTo({ top: 0 });
	};

	return (
		<FlexDiv align={'center'} justify={'center'} padding={24} absolute direction={'column'} gap={12}>
			<FlexDiv direction={'column'} align={'center'} height={'auto'} gap={12}>
				<strong>useInfiniteScroll</strong>
				<span>{items.length} of 50 items loaded. Scroll to load more.</span>
				<FlexDiv width={'auto'} height={'auto'} direction={'row'} gap={8} background={'none'} align={'center'}>
					<Button label={'Start again'} variant={'outline'} disabled={isLoading} onClick={startAgain} />
					<Button
						label={'Load more'}
						variant={'outline'}
						disabled={isLoading || !hasMore || !!error}
						onClick={() => loadMore()}
					/>
					{error ? <Button label={'Retry'} variant={'outline'} onClick={() => retry()} /> : null}
				</FlexDiv>
				{error ? <span style={{ color: 'var(--core-error)' }}>{error.message}</span> : null}
			</FlexDiv>
			<FlexDiv
				ref={setRoot}
				preset={Preset.FillScroll}
				width={360}
				height={320}
				border={'1px solid var(--core-outline-primary)'}
				background={'var(--core-surface-secondary)'}
				padding={24}
				gap={8}
			>
				{items.map((item) => (
					<FlexDiv
						key={item.id}
						width={'fill'}
						height={'auto'}
						padding={12}
						border={'1px solid var(--core-outline-primary)'}
						borderRadius={8}
						background={'var(--core-surface-primary)'}
					>
						{item.name}
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
					background={'none'}
					aria-live={'polite'}
				>
					{isLoading ? (
						<ProgressIndicator show inline />
					) : hasMore ? (
						'Scroll here to load more'
					) : (
						'You’ve reached the end.'
					)}
				</FlexDiv>
			</FlexDiv>
		</FlexDiv>
	);
}

const meta: Meta<typeof UseInfiniteScrollDemo> = {
	title: 'Hooks/useInfiniteScroll',
	component: UseInfiniteScrollDemo,
	parameters: {
		a11y: { test: 'todo' },
		layout: 'padded',
	},
};

export default meta;

export const Demo: StoryObj<typeof UseInfiniteScrollDemo> = {};
