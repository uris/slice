import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dot } from 'src/components/Dot/Dot';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { runDotPlay, runDotVariantsPlay } from 'src/components/playHelpers';

const meta: Meta<typeof Dot> = {
	title: 'Components/Dot',
	component: Dot,
	argTypes: {
		state: {
			control: { type: 'radio' },
			options: ['red', 'yellow', 'green', 'blue', 'grey', undefined],
		},
	},
	args: {
		size: 8,
		topOffset: 2,
		rightOffset: 2,
		border: 3,
		position: 'inline',
		color: undefined,
		motion: undefined,
		motionValues: undefined,
		show: true,
		state: 'blue',
	},
};

export default meta;

export const Default: StoryObj<typeof Dot> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Dot {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runDotPlay({ canvasElement, args });
	},
};

export const Variants: StoryObj<typeof Dot> = {
	tags: ['tests'],
	// exercise position/color/state/motion branches together, one Dot per
	// branch, distinguished by an extra className that lands in `rest`
	render: () => (
		<FlexDiv direction={'column'} gap={12}>
			<Dot show className="corner" position="corner" state="blue" />
			<Dot show className="explicit-color" color="#ff0000" state="blue" />
			<Dot show className="state-red" state="red" />
			<Dot show className="state-yellow" state="yellow" />
			<Dot show className="state-green" state="green" />
			<Dot show className="state-grey" state="grey" />
			<Dot show className="no-state" />
			<Dot show className="motion-values" motionValues={{ initial: { opacity: 0 } }} />
			<Dot show className="custom-transition" transition={{ duration: 0.5 }} />
			<Dot show={false} className="hidden" />
		</FlexDiv>
	),
	play: runDotVariantsPlay,
};
