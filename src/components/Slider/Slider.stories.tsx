import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { Slider } from 'src/components/Slider/Slider';
import {
	runSliderCollapsedRangePlay,
	runSliderDisabledPlay,
	runSliderEdgeDragPlay,
	runSliderKeyboardPlay,
	runSliderPlay,
	runSliderWithoutHandlersPlay,
} from 'src/components/playHelpers';
import { fn } from 'storybook/test';

const meta: Meta<typeof Slider> = {
	title: 'Components/Slider',
	component: Slider,
	args: {
		value: 25,
		scaleMin: 0,
		scaleMax: 100,
		width: 100,
		height: 2,
		touchHeight: 24,
		trackHeadSize: 12,
		cursor: 'default',
		headColor: undefined,
		progressColor: undefined,
		trackColor: undefined,
		onChange: fn(),
		onDragChange: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof Slider> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Slider {...args} />
			</FlexDiv>
		);
	},
};

export const WithTestingActions: StoryObj<typeof Slider> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Slider {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runSliderPlay({ canvasElement, args });
	},
};

export const WithoutHandlers: StoryObj<typeof Slider> = {
	tags: ['tests'],
	args: { onChange: undefined, onDragChange: undefined },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		await runSliderWithoutHandlersPlay({ canvasElement });
	},
};

export const CustomClassName: StoryObj<typeof Slider> = {
	tags: ['tests'],
	args: { className: 'slider-custom-class' },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runSliderPlay({ canvasElement, args });
	},
};

export const KeyboardControls: StoryObj<typeof Slider> = {
	tags: ['tests'],
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runSliderKeyboardPlay({ canvasElement, args });
	},
};

export const Disabled: StoryObj<typeof Slider> = {
	tags: ['tests'],
	args: { disabled: true },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runSliderDisabledPlay({ canvasElement, args });
	},
};

export const DragBeyondBounds: StoryObj<typeof Slider> = {
	tags: ['tests'],
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runSliderEdgeDragPlay({ canvasElement, args });
	},
};

export const CollapsedRange: StoryObj<typeof Slider> = {
	tags: ['tests'],
	args: { scaleMin: 50, scaleMax: 50, value: 50 },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runSliderCollapsedRangePlay({ canvasElement, args });
	},
};

export const NullableColorAndSizeDefaults: StoryObj<typeof Slider> = {
	tags: ['tests'],
	args: {
		// null (not undefined) bypasses the props' destructuring defaults,
		// exercising the `?? fallback` branches inside cssVars/trackHeadColor
		headColor: null as unknown as string,
		progressColor: null as unknown as string,
		trackColor: null as unknown as string,
		trackHeadSize: null as unknown as number,
	},
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runSliderPlay({ canvasElement, args });
	},
};

export const AutoWidthAndZeroHeight: StoryObj<typeof Slider> = {
	tags: ['tests'],
	args: { width: 'auto', height: 0 },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runSliderPlay({ canvasElement, args });
	},
};
