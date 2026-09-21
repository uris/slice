import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from '../../components/FlexDiv';
import { useActiveTab } from './useActiveTab';

function ActiveTabDemo() {
	const { isActiveTab: active, isTabFocused, visibilityState } = useActiveTab();
	return (
		<FlexDiv direction={'column'} gap={12} padding={24}>
			<span>
				Focused: {String(isTabFocused)} · Visibility: {visibilityState}
			</span>
			<strong>Tab state: {active ? 'Active' : 'Inactive'}</strong>
			<span>Switch browser tabs or minimize the window to change visibility.</span>
		</FlexDiv>
	);
}

const meta: Meta<typeof ActiveTabDemo> = {
	title: 'Hooks/useActiveTab',
	component: ActiveTabDemo,
	parameters: { a11y: { test: 'todo' }, layout: 'padded' },
};

export default meta;
export const Demo: StoryObj<typeof ActiveTabDemo> = {};
