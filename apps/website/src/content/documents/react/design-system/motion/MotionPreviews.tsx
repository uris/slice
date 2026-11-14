'use client';

import { FlexBox, motionValues } from '@apple-pie/slice';
import { useState } from 'react';
import css from './Motion.module.css';

export function SpringSquarePreview() {
	const [expanded, setExpanded] = useState(false);

	return (
		<FlexBox
			width={96}
			height={96}
			borderRadius={'var(--corner-xxl)'}
			background="core-blue"
			role="button"
			tabIndex={0}
			aria-label="Animate spring square"
			style={{ cursor: 'pointer' }}
			onKeyDown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					event.currentTarget.click();
				}
			}}
			aria-pressed={expanded}
			className={expanded ? `${css.springSquare} ${css.expanded}` : css.springSquare}
			onClick={() => setExpanded((value) => !value)}
		/>
	);
}

export function SpringMotionSquarePreview() {
	const [expanded, setExpanded] = useState(false);

	return (
		<FlexBox
			width={96}
			height={96}
			borderRadius={'var(--corner-xxl)'}
			background="core-blue"
			role="button"
			tabIndex={0}
			aria-label="Animate spring square"
			style={{ cursor: 'pointer' }}
			onKeyDown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					event.currentTarget.click();
				}
			}}
			aria-pressed={expanded}
			initial="rest"
			animate={expanded ? 'expanded' : 'rest'}
			variants={{ rest: { scale: 1, rotate: 0 }, expanded: { scale: 1.2, rotate: 90 } }}
			transition={motionValues['transition-spring']}
			onClick={() => setExpanded((value) => !value)}
		/>
	);
}
