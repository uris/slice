import { useMinTop, useOnThisPageItem } from '@/docs/stores/store';
import { type CSSProperties, useMemo } from 'react';
import css from './ScrollIndicator.module.css';

export function ScrollIndicator() {
	const info = useOnThisPageItem();
	const minTop = useMinTop();
	const { rect } = info ?? {};
	const { top, height } = rect ?? {};
	const hidden = top && minTop ? top < minTop : false;

	// set top and height
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const styles = useMemo(() => {
		if (!top || !height) return {};
		return { top, height } as CSSProperties;
	}, [info]);

	if (!info || hidden) return null;
	return <div className={css.wrapper} style={styles} />;
}
