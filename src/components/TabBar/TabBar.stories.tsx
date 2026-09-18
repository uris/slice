import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FlexDiv } from 'src/components/FlexDiv';
import { TabBar } from 'src/components/TabBar';
import type { TabOption } from 'src/components/TabBar/_types';
import { placeholderOptions } from 'src/components/TabBar/_types';
import {
	runTabBarCompactWidthPlay,
	runTabBarCustomClassPlay,
	runTabBarMemoComparatorFullPassPlay,
	runTabBarNoBorderPlay,
	runTabBarNullIconGapPlay,
	runTabBarNumericWidthPlay,
	runTabBarPlay,
	runTabBarRendersPlay,
	runTabBarSelectedValueNoMatchPlay,
	runTabBarTooltipAndCountPlay,
	runTabBarWithoutHandlersPlay,
} from 'src/components/playHelpers';
import { expect, fn } from 'storybook/test';

const meta: Meta<typeof TabBar> = {
	title: 'Components/TabBar',
	component: TabBar,
	argTypes: {
		tabWidth: {
			control: { type: 'radio' },
			options: ['fill', 'compact'],
		},
		justify: {
			control: { type: 'radio' },
			options: ['start', 'center', 'end'],
		},
		textSize: {
			control: { type: 'radio' },
			options: ['xs', 's', 'm', 'l', 'xl'],
		},
	},
	args: {
		options: placeholderOptions,
		selected: 0,
		border: true,
		underline: true,
		height: 44,
		width: '100%',
		padding: 8,
		iconSize: 20,
		iconGap: 4,
		tabGap: 0,
		iconFill: true,
		disabled: false,
		hasClose: false,
		closeWidth: 'auto',
		tabWidth: 'fill',
		justify: 'start',
		borderColor: 'var(--core-outline-secondary)',
		textSize: 'm',
		onChange: fn(),
		onTabChange: fn(),
		onClose: fn(),
		onToolTip: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof TabBar> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<TabBar {...args} />
			</FlexDiv>
		);
	},
};

export const DefaultTabBar: StoryObj<typeof TabBar> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<TabBar {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runTabBarPlay({ canvasElement, args });
	},
};

export const WithClose: StoryObj<typeof TabBar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		hasClose: true,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runTabBarPlay({ canvasElement, args });
	},
};

export const SelectedByValue: StoryObj<typeof TabBar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		selectedValue: 'Option 2',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toHaveTextContent('Dark');
	},
};

export const SelectedValueNoMatch: StoryObj<typeof TabBar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		selected: 1,
		selectedValue: 'does-not-exist',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runTabBarSelectedValueNoMatchPlay({ canvasElement });
	},
};

export const DisabledOptions: StoryObj<typeof TabBar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		disabled: true,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runTabBarRendersPlay({ canvasElement });
	},
};

const optionsWithExtras: TabOption[] = [
	{ name: 'Light', value: 'Option 1', icon: 'sun', toolTip: 'Light mode', count: 3 },
	{ name: 'Dark', value: 'Option 2', icon: 'moon full' },
];

export const WithTooltipAndCount: StoryObj<typeof TabBar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		options: optionsWithExtras,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runTabBarTooltipAndCountPlay({ canvasElement, args });
	},
};

export const WithoutHandlers: StoryObj<typeof TabBar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		onChange: undefined,
		onTabChange: undefined,
		onClose: undefined,
		onToolTip: undefined,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runTabBarWithoutHandlersPlay({ canvasElement });
	},
};

export const CustomClassName: StoryObj<typeof TabBar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		className: 'story-tabbar-class',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runTabBarCustomClassPlay({ canvasElement });
	},
};

export const NoBorder: StoryObj<typeof TabBar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		border: false,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runTabBarNoBorderPlay({ canvasElement });
	},
};

export const CompactTabs: StoryObj<typeof TabBar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		tabWidth: 'compact',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runTabBarCompactWidthPlay({ canvasElement });
	},
};

export const NumericTabWidth: StoryObj<typeof TabBar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		tabWidth: 120 as unknown as 'fill',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runTabBarNumericWidthPlay({ canvasElement });
	},
};

export const NullIconGap: StoryObj<typeof TabBar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		iconGap: null as unknown as number,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runTabBarNullIconGapPlay({ canvasElement });
	},
};

// toggling iconFill isn't one of Option's own React.memo-compared fields, but
// it IS in renderedOptions' useMemo deps, so this forces fresh Option
// elements down with every *compared* field unchanged - walking the custom
// comparator's entire `&&` chain to a final `true`.
function TabBarMemoComparatorDemo(args: Parameters<Exclude<StoryObj<typeof TabBar>['render'], undefined>>[0]) {
	const [iconFill, setIconFill] = useState(false);
	return (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64} direction={'column'} gap={16}>
			<button type={'button'} onClick={() => setIconFill((f) => !f)}>
				toggle icon fill
			</button>
			<TabBar {...args} iconFill={iconFill} />
		</FlexDiv>
	);
}

export const MemoComparatorFullPass: StoryObj<typeof TabBar> = {
	tags: ['tests'],
	args: {
		...meta.args,
	},
	render: (args) => <TabBarMemoComparatorDemo {...args} />,
	play: async ({ canvasElement }) => {
		await runTabBarMemoComparatorFullPassPlay({ canvasElement });
	},
};
