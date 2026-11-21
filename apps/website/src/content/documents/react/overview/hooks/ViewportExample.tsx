import { useWindow } from '@apple-pie/slice/hooks';
import css from '../Overview.module.css';
import { Block } from '../Shared';

export function ViewportExample() {
	const { viewportWidth, viewportHeight, formFactor } = useWindow();
	return (
		<Block title="Room to adapt" caption="USE WINDOW">
			<span className={css.metric}>
				{viewportWidth ?? '—'} × {viewportHeight ?? '—'}
			</span>
			<p className={css.muted}>Resize your window to see the viewport update.</p>
			<span className={css.small}>{formFactor}</span>
		</Block>
	);
}
