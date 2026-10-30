import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { lightTheme } from '../../theme';
import { StyledText } from './index';
const meta = {
	title: 'Components/StyledText',
	component: StyledText,
	args: { children: 'Hello Slice', textStyle: 'body-m-regular', textColor: 'core-text-primary' },
	argTypes: {
		textStyle: { control: 'select', options: Object.keys(lightTheme.type) },
		textColor: { control: 'select', options: Object.keys(lightTheme.colors) },
	},
} satisfies Meta<typeof StyledText>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Body: Story = {};
export const Heading: Story = { args: { textStyle: 'h1', children: 'Native typography' } };
export const Secondary: Story = { args: { textColor: 'core-text-secondary' } };
