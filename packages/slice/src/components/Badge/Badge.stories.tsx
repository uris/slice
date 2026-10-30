import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from 'src/components/Badge/Badge';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { runBadgePlay } from 'src/components/playHelpers';

const meta: Meta<typeof Badge> = {
	title: 'Components/Badge',
	component: Badge,
	argTypes: {
		variant: {
			control: { type: 'radio' }, // Dropdown selection
			options: ['dark', 'light', undefined], // Enum values as options
		},
	},
	args: {
		count: 5,
		variant: 'dark',
		hideNull: true,
	},
};

export default meta;

export const Default: StoryObj<typeof Badge> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Badge {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runBadgePlay({ canvasElement, args });
	},
};
