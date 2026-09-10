import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { ProgressIndicator } from 'src/components/Progress/ProgressIndicator/ProgressIndicator';
import { runProgressIndicatorPlay } from 'src/components/playHelpers';
import { fn } from 'storybook/test';

const meta: Meta<typeof ProgressIndicator> = {
	title: 'Components/ProgressIndicator',
	component: ProgressIndicator,
	args: {
		size: 24,
		inset: true,
		secondsPerSpin: 1,
		show: true,
		color: undefined,
		stroke: 1.5,
		inline: false,
		duration: undefined,
		didStart: fn(),
		didStop: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof ProgressIndicator> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={0}>
				<ProgressIndicator {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runProgressIndicatorPlay({ canvasElement, args });
	},
};
