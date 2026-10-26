import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { SliceButton } from '../src/components';
const meta = {
	title: 'Components/SliceButton',
	component: SliceButton,
	args: { children: 'Save changes', onPress: fn() },
	argTypes: {
		children: { control: 'text' },
		disabled: { control: 'boolean' },
		icon: { control: 'text' },
		iconSize: { control: 'number' },
		accessibilityLabel: { control: 'text' },
		variant: { control: 'select', options: ['primary', 'secondary'] },
		iconPosition: { control: 'select', options: ['left', 'right'] },
	},
	parameters: {
		docs: {
			description: {
				component:
					'A themed button. Use accessibilityLabel for icon-only actions. Import from @apple-pie/slice-native/components.',
			},
		},
	},
} satisfies Meta<typeof SliceButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Disabled: Story = { args: { disabled: true } };
export const WithIcon: Story = { args: { icon: 'home', children: 'Go home' } };
export const IconOnly: Story = { args: { children: undefined, icon: 'home', accessibilityLabel: 'Go home' } };
