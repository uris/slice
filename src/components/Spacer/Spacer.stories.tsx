import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { Spacer } from 'src/components/Spacer/Spacer';
import { runSpacerPlay } from 'src/components/playHelpers';

const meta: Meta<typeof Spacer> = {
	title: 'Components/Spacer',
	component: Spacer,
	argTypes: {
		size: {
			control: { type: 'select' },
			options: ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'h'],
		},
	},
	args: {
		size: 's',
	},
};

export default meta;

export const Default: StoryObj<typeof Spacer> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Spacer {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runSpacerPlay({ canvasElement, args });
	},
};
