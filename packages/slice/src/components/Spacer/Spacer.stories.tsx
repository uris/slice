import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexBox } from 'src/components/FlexBox/FlexBox';
import { Spacer } from 'src/components/Spacer/Spacer';
import { runSpacerPlay } from 'src/components/playHelpers';
import { expect, within } from 'storybook/test';

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
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<Spacer {...args} />
			</FlexBox>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runSpacerPlay({ canvasElement, args });
	},
};

export const CustomGridAndFlex: StoryObj<typeof Spacer> = {
	tags: ['tests'],
	render: () => (
		<div style={{ '--spacing-l': '29px' } as React.CSSProperties}>
			{(['row', 'column'] as const).map((direction) => (
				<div key={direction} style={{ display: 'flex', flexDirection: direction, width: 10, height: 10 }}>
					<Spacer size="l" data-testid={direction} className="custom-spacer" style={{ width: 1, height: 1 }} />
				</div>
			))}
		</div>
	),
	play: async ({ canvasElement }) => {
		for (const direction of ['row', 'column']) {
			const spacer = within(canvasElement).getByTestId(direction);
			await expect(spacer).toHaveClass('custom-spacer');
			await expect(getComputedStyle(spacer).width).toBe('29px');
			await expect(getComputedStyle(spacer).height).toBe('29px');
		}
	},
};
