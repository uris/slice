import React, { useCallback, useMemo, useRef } from 'react';
import type { ToolTip } from 'src';
import { copyToClipboard } from '../../../src/utils';
import css from './ColorTile.module.css';
import type { ColorTileProps } from './types';

const ColorTileBase = (props: Readonly<ColorTileProps>) => {
	const {
		core = undefined,
		token = 'Brand 00',
		hex = '#ffffff',
		width = 150,
		height = 100,
		onCopy = () => null,
		onTooltip = () => null,
	} = props;
	const ref = useRef<HTMLDivElement>(null);

	const cssVars = useMemo(() => {
		return {
			'--tile-bg-color': hex,
			'--tile-width': `${width}px`,
			'--tile-height': `${height}px`,
		} as React.CSSProperties;
	}, [hex, width, height]);

	const copyColorToClipboard = useCallback(async () => {
		onTooltip(null);
		const copied = await copyToClipboard(`token: ${token}, Hex: ${hex}`);
		if (copied) onCopy(token, hex);
	}, [hex, token, onCopy, onTooltip]);

	const onKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (event.key !== 'Enter' && event.key !== ' ') return;
			event.preventDefault();
			void copyColorToClipboard();
		},
		[copyColorToClipboard],
	);

	const handleMouseOver = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			const tip: ToolTip = {
				payload: { label: 'Copy to Clipboard' },
				ref,
				event: e,
			};
			onTooltip(tip);
		},
		[onTooltip],
	);

	const handleMouseOut = useCallback(() => {
		onTooltip(null);
	}, [onTooltip]);

	return (
		<div
			ref={ref}
			className={css.wrapper}
			style={cssVars}
			role={'button'}
			tabIndex={0}
			onMouseOver={handleMouseOver}
			onFocus={() => null}
			onMouseOut={handleMouseOut}
			onBlur={() => null}
			onClick={copyColorToClipboard}
			onKeyDown={onKeyDown}
		>
			<div className={css.tile} />
			<div className={css.tokens}>
				<div className={css.token}>{token}</div>
				{core && <div className={`${css.token} ${css.core}`}>{core}</div>}
				<div className={`${css.token} ${css.hex}`}>{hex}</div>
			</div>
		</div>
	);
};

ColorTileBase.displayName = 'ColorTile';

export const ColorTile = React.memo(ColorTileBase);
