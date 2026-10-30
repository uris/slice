import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { StyledText } from '../SliceText';
import { SliceLiquidGlassView } from './index';

const meta = {
	title: 'Components/SliceLiquidGlassView',
	component: SliceLiquidGlassView,
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
} satisfies Meta<typeof SliceLiquidGlassView>;

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
				<StyledText textStyle="body-xl-medium">Primary glass text</StyledText>
				<StyledText textStyle="body-m-regular" textColor="core-text-secondary">
					Secondary glass text
				</StyledText>
				<StyledText textColor="feedback-positive">Native Slice color</StyledText>
			</View>
		),
	},
};
