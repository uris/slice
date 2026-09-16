import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { Label } from 'src/components/Label/Label';
import { runLabelPlay } from 'src/components/playHelpers';
import { fn } from 'storybook/test';

const meta: Meta<typeof Label> = {
	title: 'Components/Label',
	component: Label,
	args: {
		label: 'Label',
		textSize: 'm',
		backgroundColor: 'red',
		padding: undefined,
		borderSize: 1,
	},
};

export default meta;

export const Default: StoryObj<typeof Label> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Label {...args} />
			</FlexDiv>
		);
	},
};

export const Button: StoryObj<typeof Label> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Label {...args} onClick={fn()} />
			</FlexDiv>
		);
	},
};

// *** TESTS ONLY *** //
export const ButtonLabel: StoryObj<typeof Label> = {
	tags: ['tests'],
	args: {
		...meta.args,
		label: 'Button Label',
		onClick: fn(),
	},
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Label {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runLabelPlay({ canvasElement, args });
	},
};
