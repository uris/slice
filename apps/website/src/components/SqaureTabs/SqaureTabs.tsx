import { SquareButton, SquareButtonType } from '@/src/components/SqaureButton/SquareButton';
import { useCallback } from 'react';
import styles from './SqaureTabs.module.css';

export type Tab<T extends string | number> = {
	id: T;
	name: string;
	value?: string;
};

export interface SquareTabsProps<T extends string | number> {
	tabs: readonly Tab<T>[];
	selected?: NoInfer<T> | null;
	onChange?: (tab: Tab<T>) => void;
}

export function SquareTabs<T extends string | number>(props: Readonly<SquareTabsProps<T>>) {
	const { tabs, selected, onChange } = props;
	const selectedIndex = tabs.findIndex((item) => item.id === selected);

	const buttonType = useCallback(
		(index: number) => {
			return selectedIndex === index ? SquareButtonType.Primary : SquareButtonType.Text;
		},
		[selectedIndex],
	);

	return (
		<div className={styles.tabs}>
			{tabs.map((tab, index) => {
				return (
					<SquareButton key={tab.id} label={tab.name} variant={buttonType(index)} onClick={() => onChange?.(tab)} />
				);
			})}
		</div>
	);
}
