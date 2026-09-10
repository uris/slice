import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { RadioButton } from 'src/components/RadioButton/RadioButton';
import { runRadioButtonPlay } from 'src/components/playHelpers';
import { fn } from 'storybook/test';

type RadioValue = { id: string; name: string };
const value = { id: '123', name: 'Uris' };

const meta: Meta<typeof RadioButton> = {
	title: 'Components/RadioButton',
	component: RadioButton,
	args: {
		fieldName: 'option',
		label: 'Option',
		value: undefined,
		selected: false,
		deselect: true,
		wrap: false,
		list: true,
		hideRadio: false,
		noFrame: true,
		iconColor: undefined,
		checkedIcon: 'check circle',
		onChange: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof RadioButton> = {
	render: (args) => {
		const value = { id: '123', name: 'Uris' };
		return (
			<FlexDiv
				absolute
				direction={'row'}
				justify={'center'}
				align={'center'}
				width={'fill'}
				height={'fit'}
				padding={64}
			>
				<RadioButton<RadioValue> {...args} value={value} onChange={args.onChange} />
			</FlexDiv>
		);
	},
};

export const RadioButtonTest: StoryObj<typeof RadioButton> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexDiv
				absolute
				direction={'row'}
				justify={'center'}
				align={'center'}
				width={'fill'}
				height={'fit'}
				padding={64}
			>
				<RadioButton<RadioValue> {...args} value={value} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runRadioButtonPlay({ canvasElement, args: { ...args, value } });
	},
};
