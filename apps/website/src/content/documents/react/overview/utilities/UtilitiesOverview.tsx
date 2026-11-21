import css from '../Overview.module.css';
import { OpacityExample } from './OpacityExample';
import { TintExample } from './TintExample';

export function UtilitiesOverview() {
	return (
		<div className={css.board}>
			<div className={css.tile}>
				<TintExample />
			</div>
			<div className={css.tile}>
				<OpacityExample />
			</div>
		</div>
	);
}
