'use client';

import { ButtonBar } from '@apple-pie/slice';

export function ButtonBarPreview() {
	return (
		<ButtonBar
			buttons={[
				{ icon: 'arrow left', action: 'previous', tip: 'Previous' },
				{ icon: 'arrow right', action: 'next', tip: 'Next' },
			]}
		/>
	);
}
