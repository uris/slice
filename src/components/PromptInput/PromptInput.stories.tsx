import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { fn } from 'storybook/test';
import { PromptInput } from './PromptInput';

const attachments = [{ file: 'document.doc' }, { file: 'presentation.ppt' }, { file: 'spreadsheet.xls' }];

const meta: Meta<typeof PromptInput> = {
	title: 'Components/PromptInput',
	component: PromptInput,
	args: {
		width: '100%',
		maxWidth: 720,
		value: '',
		attachments: [],
		working: false,
		borderStyle: 'gradient',
		borderColor: undefined,
		borderColorOn: undefined,
		borderAnimate: true,
		borderWidth: 1,
		borderRadius: 8,
		focused: false,
		placeholder: 'Ask me anything ...',
		placeholderWorking: 'Working ...',
		toolbarGap: 8,
		textSize: 'm',
		submitClears: true,
		enterSubmits: true,
		sendButton: true,
		attachButton: true,
		stopEnabled: false,
		onChange: fn(),
		onBlur: fn(),
		onFocus: fn(),
		onSubmit: fn(),
		onStop: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof PromptInput> = {
	render: (args) => {
		return (
			<FlexDiv direction={'row'} justify={'center'} align={'center'} absolute padding={64}>
				<PromptInput {...args} />
			</FlexDiv>
		);
	},
};

export const Prompt: StoryObj<typeof PromptInput> = {
	render: (args) => {
		return (
			<FlexDiv direction={'row'} justify={'center'} align={'center'} absolute padding={64}>
				<PromptInput {...args} value={'This is my question to you ...'} attachments={attachments} />
			</FlexDiv>
		);
	},
};

export const Working: StoryObj<typeof PromptInput> = {
	render: (args) => {
		return (
			<FlexDiv direction={'row'} justify={'center'} align={'center'} absolute padding={64}>
				<PromptInput {...args} working stopEnabled />
			</FlexDiv>
		);
	},
};
