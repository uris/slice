import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { TextArea } from 'src/components/TextArea/TextArea';
import {
	runTextAreaNoClearOnSubmitPlay,
	runTextAreaPlay,
	runTextAreaSendButtonPlay,
	runTextAreaWithoutHandlersPlay,
} from 'src/components/playHelpers';
import { fn } from 'storybook/test';

const meta: Meta<typeof TextArea> = {
	title: 'Components/TextArea',
	component: TextArea,
	args: {
		value: '',
		name: 'text_area',
		width: '100%',
		height: 'auto',
		focused: false,
		placeholder: 'Enter your text here',
		rows: 6,
		padding: '16px 4px 16px 16px',
		error: false,
		resizable: false,
		hasSend: false,
		sendOffset: { bottom: 10, right: 10 },
		sendSize: 36,
		border: undefined,
		returnSubmits: false,
		textSize: 'm',
		onChange: fn(),
		onFocus: fn(),
		onBlur: fn(),
		onSubmit: fn(),
		onKeyDown: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof TextArea> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<TextArea {...args} />
			</FlexDiv>
		);
	},
};

export const DefaultTextArea: StoryObj<typeof TextArea> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<TextArea {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runTextAreaPlay({ canvasElement, args });
	},
};

export const ReturnSubmits: StoryObj<typeof TextArea> = {
	tags: ['tests'],
	args: {
		...meta.args,
		returnSubmits: true,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runTextAreaPlay({ canvasElement, args });
	},
};

export const WithSendButton: StoryObj<typeof TextArea> = {
	tags: ['tests'],
	args: {
		...meta.args,
		hasSend: true,
		value: 'Send this',
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runTextAreaSendButtonPlay({ canvasElement, args });
	},
};

export const SendButtonWithoutClearing: StoryObj<typeof TextArea> = {
	tags: ['tests'],
	args: {
		...meta.args,
		hasSend: true,
		submitClears: false,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runTextAreaNoClearOnSubmitPlay({ canvasElement, args });
	},
};

export const WithoutHandlers: StoryObj<typeof TextArea> = {
	tags: ['tests'],
	args: {
		...meta.args,
		onChange: undefined,
		onFocus: undefined,
		onBlur: undefined,
		onSubmit: undefined,
		onKeyDown: undefined,
		returnSubmits: true,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runTextAreaWithoutHandlersPlay({ canvasElement });
	},
};

export const CustomClassName: StoryObj<typeof TextArea> = {
	tags: ['tests'],
	args: { ...meta.args, className: 'ta-custom-class' },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runTextAreaPlay({ canvasElement, args });
	},
};

export const InitiallyFocused: StoryObj<typeof TextArea> = {
	tags: ['tests'],
	args: { ...meta.args, focused: true },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runTextAreaPlay({ canvasElement, args });
	},
};

export const NumericDimensions: StoryObj<typeof TextArea> = {
	tags: ['tests'],
	// numeric width/height/minWidth - exercises setStyleValue's number branch
	// and the `height === 'auto'` false branch
	args: { ...meta.args, width: 320, height: 200, minWidth: 240 },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runTextAreaPlay({ canvasElement, args });
	},
};

export const NoBorder: StoryObj<typeof TextArea> = {
	tags: ['tests'],
	args: { ...meta.args, border: false },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runTextAreaPlay({ canvasElement, args });
	},
};

export const ErrorState: StoryObj<typeof TextArea> = {
	tags: ['tests'],
	// border true (default) + error true, exercises setBorderColor's
	// `border && error` branch on the initial (unfocused) render
	args: { ...meta.args, border: true, error: true },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runTextAreaPlay({ canvasElement, args });
	},
};

export const SmallText: StoryObj<typeof TextArea> = {
	tags: ['tests'],
	args: { ...meta.args, textSize: 's' },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runTextAreaPlay({ canvasElement, args });
	},
};

export const ExtraSmallText: StoryObj<typeof TextArea> = {
	tags: ['tests'],
	args: { ...meta.args, textSize: 'xs' },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runTextAreaPlay({ canvasElement, args });
	},
};

export const LargeText: StoryObj<typeof TextArea> = {
	tags: ['tests'],
	args: { ...meta.args, textSize: 'l' },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runTextAreaPlay({ canvasElement, args });
	},
};
