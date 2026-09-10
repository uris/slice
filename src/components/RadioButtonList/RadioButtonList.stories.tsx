import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import type { RadioButtonOption } from 'src/components/RadioButton';
import { RadioButtonList } from 'src/components/RadioButtonList/RadioButtonList';
import { runRadioButtonListPlay } from 'src/components/playHelpers';
import { fn } from 'storybook/test';

const options: RadioButtonOption[] = [
	{
		fieldName: 'option',
		value: 'option1',
		label: 'Option 1',
	},
	{
		fieldName: 'option',
		value: 'option2',
		label: 'Option 2',
	},
];

const meta: Meta<typeof RadioButtonList> = {
	title: 'Components/RadioButtonList',
	component: RadioButtonList,
	args: {
		options: options,
		selectedIndexes: null,
		selectedOptions: null,
		label: null,
		deselect: true,
		multiSelect: false,
		wrap: false,
		tabIndexSeed: 0,
		spacer: 'none',
		custom: 0,
		gap: 16,
		hideRadio: false,
		noFrame: true,
		toggleIcon: true,
		iconColor: undefined,
		checkedIcon: 'check circle',
		iconSelectedColor: undefined,
		onChange: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof RadioButtonList> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64} width={'fill'} height={'fit'}>
				<RadioButtonList {...args} />
			</FlexDiv>
		);
	},
};

export const SingleSelect: StoryObj<typeof RadioButtonList> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64} width={'fill'} height={'fit'}>
				<RadioButtonList {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runRadioButtonListPlay({ canvasElement, args });
	},
};

export const MultiSelect: StoryObj<typeof RadioButtonList> = {
	tags: ['tests'],
	args: {
		...meta.args,
		multiSelect: true,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runRadioButtonListPlay({ canvasElement, args });
	},
};
