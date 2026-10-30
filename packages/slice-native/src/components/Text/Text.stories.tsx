import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { lightTheme } from '../../theme';
import { Text } from './index';
const meta = {
	title: 'Components/Text',
	component: Text,
	args: { children: 'Hello Slice', textStyle: 'body-m-regular', textColor: 'core-text-primary' },
	argTypes: {
		textStyle: { control: 'select', options: Object.keys(lightTheme.type) },
		textColor: { control: 'select', options: Object.keys(lightTheme.colors) },
	},
} satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Body: Story = {};
export const Heading: Story = { args: { textStyle: 'h1', children: 'Native typography' } };
export const Secondary: Story = { args: { textColor: 'core-text-secondary' } };

export const TypographyOverrides: Story = {
	args: { children: 'Custom text typography', fontSize: 24, fontWeight: 'semi', lineHeight: 1.2, letterSpacing: 0.5 },
};
