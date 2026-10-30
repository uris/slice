import React, { useCallback, useRef, useState } from 'react';
import { type Colors, FlexDiv, Tip, Toast, type ToolTip, lightTheme, useToolTip } from 'src';
import { colorClass, coreColors } from '../../../src/theme/colors/colors';
import { ColorTile } from '../ColorTile/ColorTile';
import type { ColorTileGroupProps } from '../ColorTile/types';

const BaseColorTileGroup = (props: Readonly<ColorTileGroupProps>) => {
	const { pattern, theme = lightTheme } = props;
	const [tip, setTip] = useState<ToolTip | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const tipRef = useRef<HTMLDivElement>(null);
	const coords = useToolTip(tip, tipRef);

	// get all color tokens
	const allColorTokens = Object.keys(colorClass) ?? [];

	// create arrays to hold colors
	const groupTokens = [];
	const colors = [];

	// extract patterns to match
	const patterns = typeof pattern === 'string' ? [pattern] : (pattern ?? []);

	// fill group array with tokens
	for (const p of patterns) {
		const tokens = allColorTokens.filter((token) => token.startsWith(p));
		groupTokens.push(...tokens);
	}

	// iterate group tokens to set color values based on theme
	for (const token of groupTokens) {
		const themeToken = token as keyof Colors;
		const hex = theme.colors[themeToken];
		const core = Object.entries(coreColors).find(([, value]) => value === hex)?.[0] ?? undefined;
		colors.push({ token, hex, core });
	}

	const handleCopy = useCallback((token: string, hex: string) => {
		setMessage('Copied to clipboard');
	}, []);

	const handleToolTip = useCallback((tip: ToolTip | null) => {
		setTip(tip);
	}, []);

	return (
		<>
			<FlexDiv width={'fill'} height={'fit'} direction={'row'} wrap={true} gap={16}>
				{colors.map((color) => {
					return (
						<ColorTile
							token={color.token}
							hex={color.hex}
							core={color.core}
							key={color.token}
							onCopy={handleCopy}
							onTooltip={handleToolTip}
						/>
					);
				})}
			</FlexDiv>
			<Tip ref={tipRef} coords={coords} tip={tip} />
			<Toast message={message} didHide={() => setMessage(null)} close={false} />
		</>
	);
};

BaseColorTileGroup.displayName = 'ColorTileGroup';

export const ColorTileGroup = React.memo(BaseColorTileGroup);
