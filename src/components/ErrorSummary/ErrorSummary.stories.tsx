import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ErrorMessage, ErrorSummary } from 'src/components/ErrorSummary';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { runErrorSummaryPlay } from 'src/components/playHelpers';

const errorMessages: ErrorMessage[] = [
	{
		title: 'Password Format',
		message: ['Needs at least one special character', 'Needs at least one number'],
	},
	{ title: 'An email address is required' },
];
const meta: Meta<typeof ErrorSummary> = {
	title: 'Components/ErrorSummary',
	component: ErrorSummary,
	args: {
		entries: errorMessages,
		textSize: 'm',
	},
};

export default meta;

export const Default: StoryObj<typeof ErrorSummary> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<ErrorSummary {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runErrorSummaryPlay({ canvasElement, args });
	},
};
