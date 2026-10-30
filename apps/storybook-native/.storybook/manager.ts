import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
addons.setConfig({
	theme: create({
		base: 'light',
		brandTitle: 'Slice · React Native',
		brandUrl: 'https://www.slice-uikit.com',
		brandTarget: '_self',
	}),
});
