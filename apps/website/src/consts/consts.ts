import { darkTheme } from '@apple-pie/slice/theme';
import { addOpacity, tintFromColor } from '@apple-pie/slice/utils';

export enum Package {
	React = 'react',
	ReactNative = 'react-native',
}

// side panel definition
export const sidePanelConstraints = { min: 250, max: 400, initial: 250 };

// content width (on page approx. 230)
export const contentMaxWidth = 740;
export const contentMinWidth = 420;
export const showOnThisPageMinWidth = 820;

// define an absolute min size for the screen
export const minScreenSize = 360;

// content bg color
export const surfaceDark = tintFromColor(darkTheme.colors['core-surface-primary-tint'], -0.2);

// sidebar surface color
export const surfaceDarker = tintFromColor(darkTheme.colors['core-surface-primary-tint'], -0.3);

// modified yellow color
export const surfaceYellow = '#ffd333';

// modified green color
export const surfaceGreen = '#00DAC3';

// outline tertiary
export const outlineTertiary = addOpacity(darkTheme.colors['core-outline-primary'], 0.25);
