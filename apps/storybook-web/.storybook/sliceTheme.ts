import type { ThemeVars } from 'storybook/theming';
import { create } from 'storybook/theming/create';

export const sliceLightTheme: ThemeVars = create({
	base: 'light',
	brandTitle: 'Slice UIKit',
	brandUrl: 'https://slice-uikit.com',
	brandImage: '/public/images/slice-s.svg',
	brandTarget: '_self',
});

export const sliceDarkTheme: ThemeVars = create({
	base: 'dark',
	brandTitle: 'Slice UIKit',
	brandUrl: 'https://slice-uikit.com',
	brandImage: '/public/images/slice-s-white.svg',
	brandTarget: '_self',
});
