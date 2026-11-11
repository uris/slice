import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexBox } from '../../components/FlexBox';
import { useActiveTab } from './useActiveTab';

function ActiveTabDemo() {
	const { isActiveTab: active, isTabFocused, visibilityState } = useActiveTab();
	return (
		<FlexBox direction={'column'} gap={12} padding={24}>
			<span>
				Focused: {String(isTabFocused)} · Visibility: {visibilityState}
			</span>
			<strong>Tab state: {active ? 'Active' : 'Inactive'}</strong>
			<span>Switch browser tabs or minimize the window to change visibility.</span>
		</FlexBox>
	);
}

const meta: Meta<typeof ActiveTabDemo> = {
	title: 'Hooks/useActiveTab',
	component: ActiveTabDemo,
	parameters: { a11y: { test: 'todo' }, layout: 'padded' },
};

export default meta;
export const Demo: StoryObj<typeof ActiveTabDemo> = {};
