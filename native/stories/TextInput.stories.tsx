import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { TextInput } from '../src/components';
const meta = {
	title: 'Components/TextInput',
	component: TextInput,
	args: { accessibilityLabel: 'Search', placeholder: 'Search tasks', onChangeText: fn() },
	argTypes: {
		placeholder: { control: 'text' },
		accessibilityLabel: { control: 'text' },
		blurClears: { control: 'boolean' },
		hideIconOnFocus: { control: 'boolean' },
		icon: { control: 'text' },
	},
	decorators: [
		(Story) => (
			<View style={{ width: '100%', maxWidth: 440 }}>
				<Story />
			</View>
		),
	],
	parameters: {
		docs: {
			description: {
				component:
					'Native TextInput props are forwarded. Provide an accessibilityLabel; placeholders are supplemental. Clearing on blur is opt-in.',
			},
		},
	},
} satisfies Meta<typeof TextInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithIcon: Story = { args: { icon: 'home' } };
export const ReadOnly: Story = { args: { editable: false, defaultValue: 'Read-only text' } };
export const Controlled: Story = {
	render: function ControlledInput(args) {
		const [value, setValue] = useState('');
		return (
			<TextInput
				{...args}
				value={value}
				onChangeText={(next) => {
					setValue(next);
					args.onChangeText?.(next);
				}}
			/>
		);
	},
};
export const ClearOnBlur: Story = { ...Controlled, args: { blurClears: true } };

export const StyledSurface: Story = {
	args: { style: { borderRadius: 12, borderWidth: 2, borderColor: '#405261', paddingHorizontal: 12, fontSize: 18 } },
};
