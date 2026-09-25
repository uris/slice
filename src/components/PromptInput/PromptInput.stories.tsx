import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import {
	runPromptInputAttachmentsDisabledPlay,
	runPromptInputAttachmentsPlay,
	runPromptInputClickToSubmitPlay,
	runPromptInputEmptySubmitNoopPlay,
	runPromptInputFocusedOnMountPlay,
	runPromptInputHideToolbarPlay,
	runPromptInputPlay,
	runPromptInputRendersPlay,
	runPromptInputSubmitBlockedPlay,
	runPromptInputSubmitWithoutClearingPlay,
	runPromptInputWorkingPlay,
} from 'src/components/playHelpers';
import { fn } from 'storybook/test';
import { corners } from '../../theme/corners/corners';
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
		borderColor: 'transparent',
		borderColorOn: undefined,
		borderAnimate: true,
		borderWidth: 1,
		borderRadius: corners['corner-m'],
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
		onAttachmentsChange: fn(),
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

export const DefaultTest: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runPromptInputPlay({ canvasElement, args });
	},
};

export const PromptTest: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	render: Prompt.render,
	play: async ({ canvasElement, args }) => {
		await runPromptInputAttachmentsPlay({ canvasElement, args });
	},
};

export const WorkingTest: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	render: Working.render,
	play: async ({ canvasElement, args }) => {
		await runPromptInputWorkingPlay({ canvasElement, args });
	},
};

export const NullFocusedState: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		focused: null as unknown as boolean,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runPromptInputRendersPlay({ canvasElement });
	},
};

export const FocusedOnMount: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		focused: true,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runPromptInputFocusedOnMountPlay({ canvasElement });
	},
};

export const SubmitBlockedByStopEnabled: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		stopEnabled: true,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runPromptInputSubmitBlockedPlay({ canvasElement, args });
	},
};

export const SubmitBlockedWhileWorking: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		working: true,
		submitWorking: true,
		stopEnabled: false,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runPromptInputSubmitBlockedPlay({ canvasElement, args });
	},
};

export const SubmitEmptyNoop: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runPromptInputEmptySubmitNoopPlay({ canvasElement, args });
	},
};

export const SubmitWithoutClearing: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		submitClears: false,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runPromptInputSubmitWithoutClearingPlay({ canvasElement, args });
	},
};

export const ClickToSubmit: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runPromptInputClickToSubmitPlay({ canvasElement, args });
	},
};

export const AttachmentsDisabled: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		attachmentsDisabled: true,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runPromptInputAttachmentsDisabledPlay({ canvasElement });
	},
};

export const HideToolbar: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		children: undefined,
		attachButton: false,
		sendButton: false,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runPromptInputHideToolbarPlay({ canvasElement });
	},
};

export const MaxHeightSet: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		maxHeight: 200,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runPromptInputRendersPlay({ canvasElement });
	},
};

export const ZeroBorderWidth: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		borderWidth: 0,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runPromptInputRendersPlay({ canvasElement });
	},
};

export const ZeroBorderRadius: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		borderRadius: corners['corner-none'],
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runPromptInputRendersPlay({ canvasElement });
	},
};

export const NoBorderStyle: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		borderStyle: 'none',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runPromptInputRendersPlay({ canvasElement });
	},
};

export const SolidBorderWorking: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexDiv direction={'row'} justify={'center'} align={'center'} absolute padding={64} gap={16}>
				<PromptInput {...args} borderStyle={'solid'} working borderColorOn={'red'} />
				<PromptInput {...args} borderStyle={'solid'} working borderColorOn={null as unknown as string} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement }) => {
		await runPromptInputRendersPlay({ canvasElement, expectedCount: 2 });
	},
};

export const SolidBorderFocused: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexDiv direction={'row'} justify={'center'} align={'center'} absolute padding={64} gap={16}>
				<PromptInput {...args} borderStyle={'solid'} working={false} focused borderColorOn={'blue'} />
				<PromptInput
					{...args}
					borderStyle={'solid'}
					working={false}
					focused
					borderColorOn={null as unknown as string}
				/>
			</FlexDiv>
		);
	},
	play: async ({ canvasElement }) => {
		await runPromptInputRendersPlay({ canvasElement, expectedCount: 2 });
	},
};

export const SolidBorderIdle: StoryObj<typeof PromptInput> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexDiv direction={'row'} justify={'center'} align={'center'} absolute padding={64} gap={16}>
				<PromptInput {...args} borderStyle={'solid'} working={false} focused={false} borderColor={'green'} />
				<PromptInput
					{...args}
					borderStyle={'solid'}
					working={false}
					focused={false}
					borderColor={null as unknown as string}
				/>
			</FlexDiv>
		);
	},
	play: async ({ canvasElement }) => {
		await runPromptInputRendersPlay({ canvasElement, expectedCount: 2 });
	},
};
