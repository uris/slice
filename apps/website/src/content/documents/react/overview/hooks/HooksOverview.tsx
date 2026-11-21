import css from '../Overview.module.css';
import { ClipboardExample } from './ClipboardExample';
import { ViewportExample } from './ViewportExample';

export function HooksOverview() {
	return (
		<div className={css.board}>
			<div className={css.tile}>
				<ClipboardExample />
			</div>
			<div className={css.tile}>
				<ViewportExample />
			</div>
		</div>
	);
}
