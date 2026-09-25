import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv';
import { Icon, SliceIcons } from 'src/components/Icon';
import { runIconPlay } from 'src/components/playHelpers';
import { expect, fn, userEvent, within } from 'storybook/test';

const iconCategories = Object.values(SliceIcons);
const icons = iconCategories.flatMap((category) => Object.values(category));
const meta: Meta<typeof Icon> = {
	title: 'Components/Icon',
	component: Icon,
	argTypes: {
		name: {
			control: { type: 'select' }, // Dropdown selection
			options: icons, // Enum values as options
		},
	},
	args: {
		name: 'home',
		size: 20,
		stroke: 1.5,
		strokeColor: 'var(--core-icon-primary)',
		toggle: false,
		pointer: true,
		disabled: false,
		onClick: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof Icon> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Icon {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runIconPlay({ canvasElement, args });
	},
};
