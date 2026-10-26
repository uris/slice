import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { SliceIcon } from '../src/components';
const meta = {
	title: 'Components/SliceIcon',
	component: SliceIcon,
	args: { name: 'home', size: 32, accessibilityLabel: 'Home' },
	parameters: {
		docs: {
			description: {
				component:
					'Native SVG artwork. Set accessible={false} when decorative; label meaningful icons. Use an enclosing SliceButton for an accessible action.',
			},
		},
	},
} satisfies Meta<typeof SliceIcon>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Filled: Story = { args: { fill: true } };
export const Toggled: Story = { args: { name: 'view', toggle: true } };
