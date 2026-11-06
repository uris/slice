import { useNewestVisibleItem, useScrollAmount, useScrollBox, useScrollDirection } from '@/docs/stores/store';
import { surfaceYellow } from '@/src/consts/consts';
import { classNames } from '@/src/utils/misc';
import { motion } from 'motion/react';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './OnThisPage.module.css';

export type TrackedItem = {
	id: string;
	title: string;
	code?: boolean;
	items?: Omit<TrackedItem[], 'items'>;
};

interface OnThisPageProps {
	items?: TrackedItem[];
}

export function OnThisPage(props: Readonly<OnThisPageProps>) {
	const { items = [] } = props;
	const selectedId = useNewestVisibleItem();
	const scrollBox = useScrollBox();
	const scrollAmount = useScrollAmount();
	const scrollDirection = useScrollDirection();
	const [selected, setSelected] = useState<string | null>(null);
	const [amount, setAmount] = useState<number | null>(null);
	const [lastActive, setLastActive] = useState<string | null>(null);

	const isSelected = useCallback(
		(itemId: string) => {
			if (scrollAmount === 0 && !selected) return items[0]?.id === itemId;
			if (amount !== null && scrollAmount !== undefined && Math.abs(amount - scrollAmount) <= 1 && selected)
				return selected === itemId;
			if (selectedId) return selectedId === itemId;
			return lastActive === itemId;
		},
		[selectedId, amount, scrollAmount, selected, items, lastActive],
	);

	const handleScrollToItem = useCallback(
		(itemId?: string) => {
			if (!itemId) return;
			const target = document.getElementById(itemId);
			const container = scrollBox.current;
			if (container && target) {
				const bottomGap = 125;

				const top =
					container.scrollTop +
					target.getBoundingClientRect().bottom -
					container.getBoundingClientRect().top -
					container.clientTop -
					container.clientHeight +
					bottomGap;

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

	// render sub items
	function renderSubItems(items: Omit<TrackedItem[], 'items'> = []) {
		if (items.length === 0) return null;
		return items.map((item) => {
			const { id, title, code } = item;
			const selected = isSelected(id);
			const className = classNames(styles.button, code ? styles.code : styles.section);
			const baseColor = code ? 'var(--core-text-secondary)' : 'var(--core-text-primary)';
			const color = selected ? surfaceYellow : baseColor;
			return (
				<input
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

	if (items.length === 0) return null;
	return (
		<motion.div
			className={classNames(styles.wrapper, 'slice-scrollbars')}
			initial={{ opacity: 0, x: 35 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 35 }}
			transition={{ ease: 'easeInOut', duration: 0.25 }}
		>
			<span className={styles.title}>On this page</span>
			{items.map((item) => {
				const { items: _items, title, code, id } = item;
				const hasItems = Boolean(_items?.length);
				const selected = isSelected(id);
				const className = classNames(styles.button, code ? styles.code : styles.section);
				const baseColor = code ? 'var(--core-text-secondary)' : 'var(--core-text-primary)';
				const color = selected ? surfaceYellow : baseColor;
				return (
					<div className={styles.groupWrapper} key={`group_${id}`}>
						<input
							type={'button'}
							className={className}
							style={{ color }}
							key={`track_${id}`}
							value={title}
							onClick={() => handleScrollToItem(id)}
						/>
						{hasItems && renderSubItems(_items)}
					</div>
				);
			})}
		</motion.div>
	);
}
