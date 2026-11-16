import {
	useDocsActions,
	useNewestVisibleItem,
	useOnThisPageItem,
	useScrollAmount,
	useScrollBox,
	useScrollDirection,
	useTrackedItems,
} from '@/docs/stores/store';
import { surfaceYellow } from '@/src/consts/consts';
import { classNames } from '@/src/utils/misc';
import { motion } from 'motion/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './OnThisPage.module.css';

export type TrackedItem = {
	id: string;
	title: string;
	code?: boolean;
	items?: Omit<TrackedItem[], 'items'>;
};

export function OnThisPage() {
	const { setOnThisPageId, setMinTop } = useDocsActions();
	const items = useTrackedItems();
	const selectedId = useNewestVisibleItem();
	const onThisPageItem = useOnThisPageItem();
	const scrollBox = useScrollBox();
	const scrollAmount = useScrollAmount();
	const scrollDirection = useScrollDirection();
	const [selected, setSelected] = useState<string | null>(null);
	const [amount, setAmount] = useState<number | null>(null);
	const [lastActive, setLastActive] = useState<string | null>(null);
	const [scroll, setScroll] = useState<number>(0);
	const ref = useRef<HTMLDivElement>(null);

	const handleScrollToItem = useCallback(
		(itemId?: string) => {
			if (!itemId) return;
			const target = document.getElementById(itemId);
			const container = scrollBox.current;
			if (container && target) {
				const bottomGap = 125;

				const getDestination = () => {
					const targetBounds = target.getBoundingClientRect();
					const containerBounds = container.getBoundingClientRect();
					if (target.dataset.trackBlock === 'true') {
						return container.scrollTop + targetBounds.top - containerBounds.top - container.clientTop - 112;
					}
					return (
						container.scrollTop +
						targetBounds.bottom -
						containerBounds.top -
						container.clientTop -
						container.clientHeight +
						bottomGap
					);
				};
				const top = getDestination();

				// Browsers clamp scrollTo to the available range.
				const destination = Math.max(0, Math.min(top, container.scrollHeight - container.clientHeight));
				container.scrollTo({
					top: destination,
					behavior: 'smooth',
				});
				setSelected(itemId);
				setAmount(destination);
			}
		},
		[scrollBox],
	);

	const scrollSelectedIntoView = useCallback((targetBounds: DOMRect | null | undefined) => {
		if (!targetBounds) return;
		const container = ref.current;
		if (!container) return;
		const getDestination = () => {
			const containerBounds = container.getBoundingClientRect();
			return (
				container.scrollTop + targetBounds.bottom - containerBounds.top - container.clientTop - container.clientHeight
			);
		};
		const top = getDestination();

		// Browsers clamp scrollTo to the available range.
		const destination = Math.max(0, Math.min(top, container.scrollHeight - container.clientHeight));
		container.scrollTo({
			top: destination,
			behavior: 'smooth',
		});
	}, []);

	// when this element is scrolled or the window is resized, the position updates
	const handleUpdateOnThisPageItemId = useCallback(() => {
		// update state with new item selected and its rect
		const id = onThisPageItem?.id;
		if (!id) return;
		const element = document.getElementById(`tracked-item.${id}`);
		const rect = element?.getBoundingClientRect();
		setOnThisPageId(id, rect);
	}, [onThisPageItem, setOnThisPageId]);

	// save the last active id for situation where a section spans more than the scroll box height
	// where the visibility of the tracked item becomes null since it's target is off-screen
	// scrolling upwards sets lastActive as the previous item in the list
	useEffect(() => {
		if (selectedId && selectedId !== lastActive) {
			if (scrollDirection === 'down') setLastActive(selectedId);
			if (scrollDirection === 'up') {
				const index = items.findIndex((item) => item.id === selectedId);
				if (index > 0) {
					const previousItemId = items[index - 1].id;
					setLastActive(previousItemId);
				}
			}
		}
	}, [selectedId, lastActive, scrollDirection, items]);

	// update state of the item that is selected in the on this page sidebar
	// this will enable showing scroll location on the sidebar
	useEffect(() => {
		// determine item selected
		let selectedItemId = null;
		if (scrollAmount === 0 && !selected) selectedItemId = items[0]?.id;
		else if (amount !== null && scrollAmount !== undefined && Math.abs(amount - scrollAmount) <= 1 && selected)
			selectedItemId = selected;
		else if (selectedId) selectedItemId = selectedId;
		else selectedItemId = lastActive;
		// if no change, no need to update state
		if (onThisPageItem?.id === selectedItemId) return;
		// update state with new item selected and its rect
		const element = document.getElementById(`tracked-item.${selectedItemId}`);
		const rect = element?.getBoundingClientRect();
		setOnThisPageId(selectedItemId, rect);
		scrollSelectedIntoView(rect);
	}, [
		selectedId,
		amount,
		scrollAmount,
		selected,
		items,
		lastActive,
		onThisPageItem,
		setOnThisPageId,
		scrollSelectedIntoView,
	]);

	// listen to window resize
	useEffect(() => {
		window.addEventListener('resize', handleUpdateOnThisPageItemId);
		return () => {
			window.removeEventListener('resize', handleUpdateOnThisPageItemId);
		};
	}, [handleUpdateOnThisPageItemId]);

	// render sub items
	function renderSubItems(items: Omit<TrackedItem[], 'items'> = []) {
		if (items.length === 0) return null;
		return items.map((item) => {
			const { id, title, code } = item;
			const selected = onThisPageItem?.id === id;
			const className = classNames(styles.button, code ? styles.code : styles.section);
			const baseColor = code ? 'var(--core-text-secondary)' : 'var(--core-text-primary)';
			const color = selected ? surfaceYellow : baseColor;
			return (
				<input
					id={`tracked-item.${id}`}
					type={'button'}
					className={className}
					style={{ color }}
					key={`track_${id}`}
					value={title}
					onClick={() => handleScrollToItem(id)}
				/>
			);
		});
	}

	// register top so we can hide scroll indicator scrolls above viewable area
	// biome-ignore lint/correctness/useExhaustiveDependencies: only need to set this once
	useEffect(() => {
		const top = ref.current?.getBoundingClientRect().top;
		setMinTop(top);
	}, []);

	if (items.length === 0) return null;
	return (
		<motion.div
			ref={ref}
			className={classNames(styles.wrapper, 'slice-scrollbars')}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ ease: 'easeInOut', duration: 0.25 }}
			onScroll={() => {
				console.log('scroll start');
				handleUpdateOnThisPageItemId();
			}}
			onScrollEnd={() => console.log('scroll end')}
			onScrollCapture={() => console.log('scroll capture')}
			onScrollEndCapture={() => console.log('scroll end capture')}
		>
			{items.map((item) => {
				const { items: _items, title, code, id } = item;
				const hasItems = Boolean(_items?.length);
				const selected = onThisPageItem?.id === id;
				const className = classNames(styles.button, code ? styles.code : styles.section);
				const baseColor = code ? 'var(--core-text-secondary)' : 'var(--core-text-primary)';
				const color = selected ? surfaceYellow : baseColor;
				return (
					<div className={styles.groupWrapper} key={`group_${id}`}>
						<input
							id={`tracked-item.${id}`}
							type={'button'}
							className={className}
							style={{ color }}
							key={`track_${id}`}
							value={title}
							onClick={() => handleScrollToItem(id)}
						/>
						{hasItems && <div className={styles.groupItems}>{renderSubItems(_items)}</div>}
					</div>
				);
			})}
		</motion.div>
	);
}
