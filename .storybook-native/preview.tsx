import type { Preview } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { SliceThemeProvider } from '../native/src/providers';
import { darkTheme, lightTheme } from '../native/src/theme';
import '../.storybook/funnel-sans.css';

const preview: Preview = {
	tags: ['autodocs'],
	globalTypes: {
		theme: {
			description: 'Native theme',
			toolbar: { icon: 'circlehollow', items: ['light', 'dark'], dynamicTitle: true },
		},
	},
	initialGlobals: { theme: 'light' },
	decorators: [
		(Story, context) => {
			const preference = context.globals.theme === 'dark' ? 'dark' : 'light';
			const theme = preference === 'dark' ? darkTheme : lightTheme;
			return (
				<SliceThemeProvider preference={preference}>
					<View
						style={{
							padding: 32,
							minHeight: 180,
							backgroundColor: theme.colors['core-surface-primary'],
							alignItems: 'flex-start',
							justifyContent: 'center',
						}}
					>
						<Story />
					</View>
				</SliceThemeProvider>
			);
		},
	],
	parameters: {
		layout: 'fullscreen',
		controls: { matchers: { color: /(color|background)$/i } },
		docs: {
			description: {
				component:
					'React Native components rendered in the browser using React Native Web. Verify platform behavior and accessibility on iOS and Android devices.',
			},
		},
	},
};
export default preview;
