import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { Pager } from 'src/components/Pager/Pager';
import { runPagerPlay } from 'src/components/playHelpers';
import { fn } from 'storybook/test';

const meta: Meta<typeof Pager> = {
	title: 'Components/Pager',
	component: Pager,
	args: {
		size: 8,
		index: 0,
		color: 'var(--core-text-disabled)',
		colorHover: undefined,
		colorOn: undefined,
		pages: 2,
		gap: 4,
		onChange: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof Pager> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Pager {...args} />
			</FlexDiv>
		);
	},
};

// **** TESTS ONLY **** //
export const DefaultTest: StoryObj<typeof Pager> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Pager {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runPagerPlay({ canvasElement, args });
	},
};
