import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv';
import { Switch } from 'src/components/Switch';
import { runSwitchPlay } from 'src/components/playHelpers';
import { fn } from 'storybook/test';

const meta: Meta<typeof Switch> = {
	title: 'Components/Switch',
	component: Switch,
	args: {
		state: false,
		height: 22,
		width: 44,
		padding: 3,
		knobColor: undefined,
		onChange: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof Switch> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Switch {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runSwitchPlay({ canvasElement, args });
	},
};
