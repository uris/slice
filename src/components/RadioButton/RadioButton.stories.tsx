import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { RadioButton } from 'src/components/RadioButton/RadioButton';
import {
	runRadioButtonNoDeselectPlay,
	runRadioButtonNoLabelPlay,
	runRadioButtonPlay,
	runRadioButtonWithoutHandlerPlay,
} from 'src/components/playHelpers';
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

export const WithoutHandler: StoryObj<typeof RadioButton> = {
	tags: ['tests'],
	args: { onChange: undefined },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<RadioButton<RadioValue> {...args} value={value} />
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		await runRadioButtonWithoutHandlerPlay({ canvasElement });
	},
};

export const CustomClassName: StoryObj<typeof RadioButton> = {
	tags: ['tests'],
	args: { className: 'rb-custom-class' },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<RadioButton<RadioValue> {...args} value={value} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runRadioButtonPlay({ canvasElement, args: { ...args, value } });
	},
};

export const AlreadySelectedNoDeselect: StoryObj<typeof RadioButton> = {
	tags: ['tests'],
	args: { selected: true, deselect: false },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<RadioButton<RadioValue> {...args} value={value} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runRadioButtonNoDeselectPlay({ canvasElement, args });
	},
};

export const CustomIconColor: StoryObj<typeof RadioButton> = {
	tags: ['tests'],
	args: { iconColor: 'var(--core-text-special)' },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<RadioButton<RadioValue> {...args} value={value} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runRadioButtonPlay({ canvasElement, args: { ...args, value } });
	},
};

export const NotListItem: StoryObj<typeof RadioButton> = {
	tags: ['tests'],
	args: { list: false },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<RadioButton<RadioValue> {...args} value={value} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runRadioButtonPlay({ canvasElement, args: { ...args, value } });
	},
};

export const WrapLayout: StoryObj<typeof RadioButton> = {
	tags: ['tests'],
	args: { wrap: true },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<RadioButton<RadioValue> {...args} value={value} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runRadioButtonPlay({ canvasElement, args: { ...args, value } });
	},
};

export const WithFrame: StoryObj<typeof RadioButton> = {
	tags: ['tests'],
	args: { noFrame: false },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<RadioButton<RadioValue> {...args} value={value} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runRadioButtonPlay({ canvasElement, args: { ...args, value } });
	},
};

export const WithoutLabelStringChildren: StoryObj<typeof RadioButton> = {
	tags: ['tests'],
	args: { label: undefined },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<RadioButton<RadioValue> {...args} value={value}>
				String Children
			</RadioButton>
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runRadioButtonNoLabelPlay({ canvasElement, args: { ...args, value } });
	},
};

export const WithoutLabelOrChildren: StoryObj<typeof RadioButton> = {
	tags: ['tests'],
	args: { label: undefined },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<RadioButton<RadioValue> {...args} value={value} />
		</FlexDiv>
	),
	play: async ({ canvasElement, args }) => {
		await runRadioButtonNoLabelPlay({ canvasElement, args: { ...args, value } });
	},
};
