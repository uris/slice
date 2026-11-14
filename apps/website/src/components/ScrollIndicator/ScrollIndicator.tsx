import { useOnThisPageItem } from '@/docs/stores/store';
import { type CSSProperties, useMemo } from 'react';
import css from './ScrollIndicator.module.css';

export function ScrollIndicator() {
	const info = useOnThisPageItem();

	const styles = useMemo(() => {
		const { rect } = info ?? {};
		if (!rect) return {};
		const { top, height } = rect;
		return { top, height } as CSSProperties;
	}, [info]);

	if (!info) return null;
	return <div className={css.wrapper} style={styles} />;
}
