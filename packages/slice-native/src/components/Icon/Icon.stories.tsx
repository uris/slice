import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Icon } from './index';
const meta = {
	title: 'Components/Icon',
	component: Icon,
	args: { name: 'home', size: 32, accessibilityLabel: 'Home' },
	parameters: {
		docs: {
			description: {
				component:
					'Native SVG artwork. Set accessible={false} when decorative; label meaningful icons. Use an enclosing Button for an accessible action.',
			},
		},
	},
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Filled: Story = { args: { fill: true } };
export const Toggled: Story = { args: { name: 'view', toggle: true } };
