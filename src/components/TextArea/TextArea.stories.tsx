import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { TextArea } from 'src/components/TextArea/TextArea';
import { runTextAreaPlay } from 'src/components/playHelpers';
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
		await runTextAreaPlay({ canvasElement, args });
	},
};
