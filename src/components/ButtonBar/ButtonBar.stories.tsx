import type { Meta, StoryObj } from '@storybook/react';
import type { BarButton } from 'src/components/ButtonBar';
import { ButtonBar } from 'src/components/ButtonBar/ButtonBar';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import {
	runButtonBarCustomClassPlay,
	runButtonBarMissingTipPlay,
	runButtonBarNoTogglePlay,
	runButtonBarPlay,
	runButtonBarSizeEdgeCasesPlay,
	runButtonBarWithoutHandlersPlay,
} from 'src/components/playHelpers';
import { fn } from 'storybook/test';

const listView: BarButton[] = [
	{ icon: 'arrow left', action: 'list', tip: 'List View' },
	{ icon: 'home', action: 'gallery', tip: 'Gallery View' },
	{ icon: 'arrow right', action: 'gallery', tip: 'Gallery View' },
];

const meta: Meta<typeof ButtonBar> = {
	title: 'Components/ButtonBar',
	component: ButtonBar,
	args: {
		buttons: listView,
		selected: 0,
		onClick: fn(),
		onChange: fn(),
		onToolTip: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof ButtonBar> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<ButtonBar {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runButtonBarPlay({ canvasElement, args });
	},
};

export const SmallSize: StoryObj<typeof ButtonBar> = {
	args: { buttonSize: 's' },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<ButtonBar {...args} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runButtonBarPlay({ canvasElement, args });
	},
};

export const LargeSize: StoryObj<typeof ButtonBar> = {
	args: { buttonSize: 'l' },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<ButtonBar {...args} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runButtonBarPlay({ canvasElement, args });
	},
};

export const ExtraLargeSize: StoryObj<typeof ButtonBar> = {
	args: { buttonSize: 'xl' },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<ButtonBar {...args} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runButtonBarPlay({ canvasElement, args });
	},
};

export const SizeEdgeCases: StoryObj<typeof ButtonBar> = {
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={24}>
			{/* a falsy buttonSize at runtime falls back to frameSize, bypassing the typed 's' | 'm' | 'l' | 'xl' union */}
			<ButtonBar {...args} buttonSize={'' as unknown as 's'} />
			{/* a value outside the union falls through every size check to an implicit undefined */}
			<ButtonBar {...args} buttonSize={'huge' as unknown as 's'} />
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		await runButtonBarSizeEdgeCasesPlay({ canvasElement });
	},
};

export const NoToggle: StoryObj<typeof ButtonBar> = {
	args: { toggle: false },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<ButtonBar {...args} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runButtonBarNoTogglePlay({ canvasElement, args });
	},
};

export const WithoutHandlers: StoryObj<typeof ButtonBar> = {
	args: { onClick: undefined, onChange: undefined, onToolTip: undefined },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<ButtonBar {...args} />
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		await runButtonBarWithoutHandlersPlay({ canvasElement });
	},
};

export const CustomClassName: StoryObj<typeof ButtonBar> = {
	args: { className: 'bb-custom-class' },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<ButtonBar {...args} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runButtonBarCustomClassPlay({ canvasElement, args });
	},
};

export const MissingTipFallback: StoryObj<typeof ButtonBar> = {
	args: {
		buttons: [{ icon: 'home', action: 'gallery' } as unknown as BarButton, ...listView],
	},
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<ButtonBar {...args} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runButtonBarMissingTipPlay({ canvasElement, args });
	},
};
