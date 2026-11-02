import { useNewestVisibleItem, useOldestVisibleItem, useScrollAmount, useScrollBox } from '@/docs/stores/store';
import { surfaceYellow } from '@/src/consts/consts';
import { classNames } from '@/src/utils/misc';
import { motion } from 'motion/react';
import React, { useCallback, useState } from 'react';
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
	const firstVisibleItem = useOldestVisibleItem();
	const scrollBox = useScrollBox();
	const scrollAmount = useScrollAmount();
	const [selected, setSelected] = useState<string | null>(null);
	const [amount, setAmount] = useState<number | null>(null);

	const isSelected = useCallback(
		(itemId: string) => {
			if (scrollAmount === 0 && !selected) return firstVisibleItem === itemId;
			if (amount !== null && scrollAmount !== undefined && Math.abs(amount - scrollAmount) <= 1 && selected)
				return selected === itemId;
			return selectedId === itemId;
		},
		[selectedId, amount, scrollAmount, selected, firstVisibleItem],
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

	// render sub items
	function renderSubItems(items: Omit<TrackedItem[], 'items'> = []) {
		if (items.length === 0) return null;
		return items.map((item) => {
			const { id, title, code } = item;
			const selected = isSelected(id);
			const className = classNames(styles.button, code ? styles.code : styles.section);
			const baseColor = code ? 'var(--core-text-disabled)' : 'var(--core-text-primary)';
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
				const baseColor = code ? 'var(--core-text-disabled)' : 'var(--core-text-primary)';
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
