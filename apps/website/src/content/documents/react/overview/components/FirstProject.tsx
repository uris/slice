import { Button, Icon } from '@apple-pie/slice';
import { useState } from 'react';
import css from '../Overview.module.css';
import { Block, useNotice } from '../Shared';

export function FirstProject() {
	const [created, setCreated] = useState(false);
	const notice = useNotice();
	return (
		<Block title={created ? 'Your next chapter' : 'A blank page, full of possibility'} caption="FRESH START">
			<div className={css.empty}>
				<Icon name="basic.plus" size={32} decorative />
				<p className={css.muted}>
					{created
						? 'Untitled project is ready for your ideas.'
						: 'Bring your ideas, files, and favorite people together.'}
				</p>
			</div>
			<Button
				label={created ? 'Create another project' : 'Create your first project'}
				variant="primary"
				onClick={() => {
					setCreated(true);
					notice('Demo project created.');
				}}
			/>
		</Block>
	);
}
