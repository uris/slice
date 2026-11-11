import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { FlexBox } from '../../components/FlexBox';
import { useInitializeActiveTab, useIsActiveTab, useIsTabFocused, useTabVisibilityState } from './activeTabStore';

function ActiveTabDemo() {
	const initialize = useInitializeActiveTab();
	useEffect(() => initialize(), [initialize]);
	const active = useIsActiveTab();
	const focused = useIsTabFocused();
	const visibility = useTabVisibilityState();
	return (
		<FlexBox direction={'column'} gap={12} padding={24}>
			<span>
				Focused: {String(focused)} · Visibility: {visibility}
			</span>
			<strong>Tab state: {active ? 'Active' : 'Inactive'}</strong>
			<span>Switch browser tabs or minimize the window to change visibility.</span>
		</FlexBox>
	);
}

const meta: Meta<typeof ActiveTabDemo> = {
	title: 'Stores/activeTab',
	component: ActiveTabDemo,
	parameters: { a11y: { test: 'todo' }, layout: 'padded' },
};

export default meta;
export const Demo: StoryObj<typeof ActiveTabDemo> = {};
