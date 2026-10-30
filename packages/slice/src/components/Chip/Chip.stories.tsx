import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from 'src/components/Chip';
import { FlexDiv } from 'src/components/FlexDiv';
import {
	runChipButtonVariantPlay,
	runChipDisabledPlay,
	runChipLayoutVariantsPlay,
	runChipPlay,
} from 'src/components/playHelpers';
import { fn } from 'storybook/test';

const meta: Meta<typeof Chip> = {
	title: 'Components/Chip',
	component: Chip,
	argTypes: {
		children: {
			table: {
				disable: true,
			},
		},
	},
	args: {
		label: 'Chip Label',
		icon: 'wand',
		disabled: false,
		focused: false,
		tooltip: 'Chip tooltip',
		onClick: fn(),
		onToolTip: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof Chip> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Chip {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runChipPlay({ canvasElement, args });
	},
};

export const DisabledInteractions: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: {
		disabled: true,
	},
	render: Default.render,
	play: runChipDisabledPlay,
};

export const ButtonVariant: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: {
		variant: 'button',
	},
	// bypass Storybook's args-merge (a defined meta default for `tooltip`
	// isn't cleared by an explicit `undefined` override in `args`) by
	// dropping it directly in JSX to exercise the no-tooltip hover branch
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Chip {...args} tooltip={undefined} className="button-chip" />
		</FlexDiv>
	),
	play: runChipButtonVariantPlay,
};

export const LayoutVariants: StoryObj<typeof Chip> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv direction={'column'} gap={12}>
			<Chip label="Right Icon" icon="wand" iconPosition="right" />
			<Chip className="no-icon-no-label" />
			<Chip icon="wand">Children Label</Chip>
			<Chip className="custom-border" label="Border" borderWidth={3} />
		</FlexDiv>
	),
	play: runChipLayoutVariantsPlay,
};
