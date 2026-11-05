'use client';

import { ButtonBar } from '@apple-pie/slice';

export function ButtonBarPreview() {
	return (
		<ButtonBar
			buttons={[
				{ icon: 'arrows.arrow-left', action: 'previous', tip: 'Previous' },
				{ icon: 'arrows.arrow-right', action: 'next', tip: 'Next' },
			]}
		/>
	);
}
