'use client';

import type { CSSProperties } from 'react';
import { useTheme } from '../../hooks';
import { resolveRadius, resolveSize } from '../../theme/resolveSize';
import { tintFromColor } from '../../utils/functions/colors';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { getElevationStyle } from '../../utils/styling/getElevationStyle';
import { TabBarLayout } from '../TabBar/TabBar';
import type { PillButtonBarProps } from './_types';

export function PillButtonBar<T = string>(rawProps: PillButtonBarProps<T>) {
	const { isDark } = useTheme();
	const {
		elevation = 0,
		backgroundColor = tintFromColor('core-surface-secondary', -2),
		border = true,
		borderColor = tintFromColor('core-surface-secondary', isDark ? 4 : -4),
		borderRadius = 'var(--corner-l)',
		borderWidth = 1,
		pillBackgroundColor = 'var(--core-surface-primary)',
		pillBorderColor = 'var(--core-outline-primary)',
		pillBorderRadius = 'var(--corner-m)',
		pillBorderWidth = 0,
		pillInset = 4,
		pillElevation = 1,
		padding = '1px 10px',
		tabGap = 4,
		iconSize = 18,
		iconGap = 4,
		textSize = 'l',
		textColor = 'core-text-secondary',
		textColorSelected = 'core-text-primary',
		iconStrokeWidth = 1.5,
		...props
	} = resolveColorProps(rawProps);

	const pillStyle = {
		...getElevationStyle(elevation),
		'--pill-track-background': backgroundColor,
		'--pill-track-border-color': borderColor,
		'--pill-track-border-width': setStyle(border ? borderWidth : 0),
		'--pill-track-radius': resolveRadius(borderRadius),
		'--pill-background': pillBackgroundColor,
		'--pill-border-color': pillBorderColor,
		'--pill-border-width': setStyle(pillBorderWidth),
		'--pill-radius': resolveRadius(pillBorderRadius),
		'--pill-inset': resolveSize(pillInset),
		'--pill-shadow': getElevationStyle(pillElevation).boxShadow,
	} as CSSProperties;

	return (
		<TabBarLayout
			{...props}
			border={false}
			padding={padding}
			iconSize={iconSize}
			iconStrokeWidth={iconStrokeWidth}
			textSize={textSize}
			textColor={textColor}
			textColorSelected={textColorSelected}
			width="fit-content"
			tabWidth="compact"
			tabGap={tabGap}
			pillStyle={pillStyle}
			iconGap={iconGap}
		/>
	);
}
