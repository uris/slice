import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { Label } from 'src/components/Label/Label';
import { LabelBackground } from 'src/components/Label/_types';
import { runLabelBackgroundVariantsPlay, runLabelPlay } from 'src/components/playHelpers';
import { fn } from 'storybook/test';

const meta: Meta<typeof Label> = {
	title: 'Components/Label',
	component: Label,
	argTypes: {
		textSize: {
			control: { type: 'select' },
			options: ['xs', 's', 'm', 'l', 'xl'],
		},
	},
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

export const SemanticBackgroundVariants: StoryObj<typeof Label> = {
	tags: ['tests'],
	render: () => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={8} wrap>
				<Label backgroundColor={LabelBackground.green}>Green</Label>
				<Label backgroundColor={LabelBackground.yellow}>Yellow</Label>
				<Label backgroundColor={LabelBackground.grey}>Grey</Label>
				<Label backgroundColor={LabelBackground.lightGrey}>Light Grey</Label>
				<Label backgroundColor={LabelBackground.white}>White</Label>
				<Label backgroundColor={LabelBackground.blue}>Blue</Label>
				<Label backgroundColor={''} className={'label-empty-bg-test'}>
					Empty
				</Label>
				<Label padding={12}>Padded</Label>
			</FlexDiv>
		);
	},
	play: async ({ canvasElement }) => {
		await runLabelBackgroundVariantsPlay({ canvasElement });
	},
};
