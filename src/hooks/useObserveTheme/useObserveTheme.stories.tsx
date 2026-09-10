import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from '../../components/FlexDiv';
import { useObserveTheme } from './useObserveTheme';

function UseObserveThemeDemo() {
	const theme = useObserveTheme();

	return (
		<FlexDiv absolute direction={'column'} padding={24} align={'center'} justify={'center'}>
			<h3>{theme.name.includes('light') ? 'Light theme' : 'Dark Theme'} Selected</h3>
			<span className={'body-s-regular'}>Switch themes using the header toolbar or your PC display options</span>
		</FlexDiv>
	);
}

const meta: Meta<typeof UseObserveThemeDemo> = {
	title: 'Hooks/useObserveTheme',
	component: UseObserveThemeDemo,
	parameters: {
		layout: 'padded',
	},
};

export default meta;

export const Demo: StoryObj<typeof UseObserveThemeDemo> = {};
