import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexBox } from '../../components/FlexBox';
import { useObserveTheme } from './useObserveTheme';

function UseObserveThemeDemo() {
	const theme = useObserveTheme();

	return (
		<FlexBox absolute direction={'column'} padding={24} align={'center'} justify={'center'}>
			<h3>{theme.name.includes('light') ? 'Light theme' : 'Dark Theme'} Selected</h3>
			<span className={'body-s-regular'}>Switch themes using the header toolbar or your PC display options</span>
		</FlexBox>
	);
}

const meta: Meta<typeof UseObserveThemeDemo> = {
	title: 'Hooks/useObserveTheme',
	component: UseObserveThemeDemo,
	parameters: {
		a11y: { test: 'todo' },
		layout: 'padded',
	},
};

export default meta;

export const Demo: StoryObj<typeof UseObserveThemeDemo> = {};
