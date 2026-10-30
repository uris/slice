import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { Button } from './index';
const meta = {
	title: 'Components/Button',
	component: Button,
	args: { label: 'Save changes', onPress: fn() },
	argTypes: {
		label: { control: 'text' },
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
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Disabled: Story = { args: { disabled: true } };
export const WithIcon: Story = { args: { icon: 'home', label: 'Go home' } };
export const IconOnly: Story = { args: { label: undefined, icon: 'home', accessibilityLabel: 'Go home' } };

// Browser stories use the regular fallback. Check these on an iOS 26+ native build.
export const GlassLabel: Story = { args: { liquidGlassBackground: true } };
export const GlassWithIcon: Story = {
	args: { liquidGlassBackground: {}, icon: 'home', tintColor: 'core-text-primary' },
};
export const GlassIconOnly: Story = {
	args: { label: undefined, icon: 'home', accessibilityLabel: 'Go home', liquidGlassBackground: {} },
};
export const GlassClear: Story = {
	args: { liquidGlassBackground: { glassStyle: 'clear' }, tintColor: 'core-text-light' },
};
export const GlassTinted: Story = { args: { liquidGlassBackground: { glassTintColor: '#2f45ff' } } };

export const StyledSurface: Story = {
	args: {
		style: {
			borderRadius: 12,
			borderWidth: 2,
			borderColor: '#405261',
			paddingHorizontal: 24,
			minHeight: 40,
			fontSize: 18,
			color: '#405261',
		},
	},
};
