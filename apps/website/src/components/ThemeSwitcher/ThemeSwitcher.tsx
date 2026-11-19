'use client';

import { useDocsActions, useRightPanelClosed } from '@/docs/stores/store';
import { Button, FlexBox, Preset } from '@apple-pie/slice';
import { useTheme } from '@apple-pie/slice/hooks';
import { useTipActions } from '@apple-pie/slice/stores';
import { opacityFromColor } from '@apple-pie/slice/utils';

export function ThemeSwitcher() {
	const { isDark, set } = useTheme();
	const { push } = useTipActions();
	const { toggleRightPanel } = useDocsActions();
	const rightPanelClosed = useRightPanelClosed();
	const switchTo = isDark ? 'lightMode' : 'darkMode';
	const tip = isDark ? 'Switch to light mode' : 'Switch to dark mode';
	const bgColorSelected = opacityFromColor('core-surface-secondary', 50);
	return (
		<FlexBox preset={Preset.Row} gap={8} overflow={'visible'}>
			<Button
				variant={'outline'}
				round
				backgroundColor={isDark ? bgColorSelected : 'transparent'}
				backgroundColorHover={'transparent'}
				aria-label={tip}
				tooltip={tip}
				onToolTip={push}
				iconStrokeWidth={1.5}
				iconLeft={'basic.yin-yang'}
				onClick={() => set(switchTo)}
			/>
			<Button
				variant={'outline'}
				round
				backgroundColor={rightPanelClosed ? 'transparent' : bgColorSelected}
				backgroundColorHover={'transparent'}
				aria-label="Toggle on this page sidebar"
				aria-expanded={!rightPanelClosed}
				tooltip={'Toggle on this page sidebar'}
				onToolTip={push}
				iconStrokeWidth={1.5}
				iconLeft={'grid.grid-06'}
				onClick={() => toggleRightPanel()}
			/>
		</FlexBox>
	);
}
