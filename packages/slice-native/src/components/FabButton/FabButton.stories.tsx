import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { FabButton } from './index';

const meta = {
	title: 'Components/FabButton',
	component: FabButton,
	args: { accessibilityLabel: 'Add task' },
} satisfies Meta<typeof FabButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Labeled: Story = { args: { label: 'Create task' } };
export const Larger: Story = { args: { size: 72 } };
export const Rounded: Story = { args: { borderRadius: 16 } };
export const Disabled: Story = { args: { disabled: true } };
export const ShadowOverride: Story = { args: { viewStyle: { elevation: 10, shadowOpacity: 0.4 } } };
