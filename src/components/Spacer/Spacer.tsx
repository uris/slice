'use client';

import React, { useMemo } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import type { SpacerProps } from './_types';

export const Spacer = React.memo((props: SpacerProps) => {
	const { size = 's', ...divAttributes } = props;
	const { id: divId, className, style, ...rest } = divAttributes;

	// derive the fixed spacer dimensions from the configured size
	const spacerStyle = useMemo(() => {
		const dimension = `var(--spacing-${size})`;
		return {
			width: dimension,
			minWidth: dimension,
			maxWidth: dimension,
			height: dimension,
			minHeight: dimension,
			maxHeight: dimension,
			flexShrink: 0,
		};
	}, [size]);
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';

	/* START.DEBUG */
	useTrackRenders(props, 'Spacer');
	/* END.DEBUG */

	return <div id={divId} className={divClass.trim()} style={{ ...divStyle, ...spacerStyle }} {...rest} />;
});
