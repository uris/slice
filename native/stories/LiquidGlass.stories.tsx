import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { LiquidGlass, Text } from '../src/components';

const meta = {
	title: 'Components/LiquidGlass',
	component: LiquidGlass,
	args: {
		glassStyle: 'regular',
		interactive: false,
		cornerRadius: 24,
		fallbackColor: 'rgba(90, 120, 180, 0.18)',
		style: { padding: 24, width: 280 },
		children: <Text>Content inside the glass</Text>,
	},
	argTypes: {
		glassStyle: { control: 'select', options: ['regular', 'clear'] },
		glassTintColor: { control: 'color' },
		fallbackColor: { control: 'color' },
		interactive: { control: 'boolean' },
		cornerRadius: { control: 'number' },
	},
	parameters: {
		docs: {
			description: {
				component:
					'Native Liquid Glass on iOS 26+. Browser stories display the plain-view fallback; verify the glass and interaction on an iOS device or simulator.',
			},
		},
	},
} satisfies Meta<typeof LiquidGlass>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Regular: Story = {};
export const Clear: Story = { args: { glassStyle: 'clear' } };
export const Tinted: Story = { args: { glassTintColor: '#3484FF44' } };

/**
 * On iOS this also exercises glass context through an intermediate layout view.
 */
export const AdaptiveText: Story = {
	args: {
		children: (
			<View style={{ gap: 12 }}>
				<Text textStyle="body-xl-medium">Primary glass text</Text>
				<Text textStyle="body-m-regular" textColor="core-text-secondary">
					Secondary glass text
				</Text>
				<Text textColor="feedback-positive">Native Slice color</Text>
			</View>
		),
	},
};
