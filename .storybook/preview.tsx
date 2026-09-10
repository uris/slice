import { DocsContainer } from '@storybook/addon-docs/blocks';
import type { Preview } from '@storybook/react-vite';
import React from 'react';
import '../src/theme.css';
import { FlexDiv, ThemeProvider, darkTheme, lightTheme } from '../src';
import './funnel-sans.css';

// options for theme selector
const items = [
	{ value: lightTheme.name, icon: 'circlehollow', title: 'Light theme' },
	{ value: darkTheme.name, icon: 'circle', title: 'Dark theme' },
] as any;

// get system theme
const darkModeMediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');
const isDark = darkModeMediaQuery.matches;

const preview: Preview = {
	globalTypes: {
		theme: {
			name: 'Theme',
			description: 'Global theme for components',
			defaultValue: isDark ? darkTheme.name : lightTheme.name,
			toolbar: {
				icon: 'circlehollow',
				items,
			},
		},
	},
	initialGlobals: {
		theme: isDark ? darkTheme.name : lightTheme.name,
	},
	decorators: [
		(Story, context) => {
			const theme = context.globals.theme;

			return (
				<ThemeProvider theme={theme} system={true} global={true}>
					<Story />
				</ThemeProvider>
			);
		},
	],
	parameters: {
		layout: 'fullscreen',
		docs: {
			container: ({ children, context }: { children: any; context: any }) => {
				const theme = context.store.userGlobals.globals.theme;
				return (
					<DocsContainer context={context}>
						<ThemeProvider theme={theme} system={true} global={true}>
							<FlexDiv padding={'64px 88px'} absolute={true} centerSelf={true} scrollY={true}>
								{children}
							</FlexDiv>
						</ThemeProvider>
					</DocsContainer>
				);
			},
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		options: {
			storySort: {
				order: [
					'Welcome',
					['Welcome', 'Quick Start', '*'],
					'Colors',
					['Core Colors', '*'],
					'Typography',
					['Funnel Sans', '*'],
					'Icons',
					'Motion',
					'Hooks',
					['*', ['Docs', '*']],
					'Providers',
					['*', ['Docs', '*']],
					'*',
					'Stores',
					['About Slice Stores', '*'],
				],
			},
		},
	},
};

export default preview;
