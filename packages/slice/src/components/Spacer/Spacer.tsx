'use client';

import React from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import type { SpacerProps } from './_types';

export const Spacer = React.memo((props: SpacerProps) => {
	const { size = 's', ...divAttributes } = props;
	const { className, style, ...rest } = divAttributes;

	// derive the fixed spacer dimensions from the configured size
	const dimension = `var(--spacing-${size})`;
	const spacerStyle: React.CSSProperties = {
		width: dimension,
		minWidth: dimension,
		maxWidth: dimension,
		height: dimension,
		minHeight: dimension,
		maxHeight: dimension,
		flexShrink: 0,
	};

	/* START.DEBUG */
	useTrackRenders(props, 'Spacer');
	/* END.DEBUG */

	return <div className={className} style={{ ...style, ...spacerStyle }} {...rest} />;
});
