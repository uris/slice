import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from 'src/components/Button/Button';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import {
	runButtonDisabledInteractionsPlay,
	runButtonFillAndCustomWidthPlay,
	runButtonLinkOpensWindowPlay,
	runButtonOutlineDestructiveHoverPlay,
	runButtonPlay,
	runButtonProgressFlowPlay,
	runButtonRoundIconOnlyPlay,
	runButtonShowDotAndCountPlay,
	runButtonTextVariantChildrenPlay,
} from 'src/components/playHelpers';
import { fn } from 'storybook/test';

const meta: Meta<typeof Button> = {
	title: 'Components/Button',
	component: Button,
	argTypes: {
		labelColor: { type: 'string', control: 'text' },
		iconColor: { type: 'string', control: 'text' },
		children: {
			table: {
				disable: true,
			},
		},
	},
	args: {
		size: 'large',
		variant: 'solid',
		label: 'Button Label',
		labelSize: 'm',
		iconRight: 'arrow right',
		iconLeft: undefined,
		count: undefined,
		showDot: undefined,
		tooltip: undefined,
		round: false,
		state: 'normal',
		fill: false,
		iconSize: undefined,
		width: 'min-content',
		underline: false,
		borderRadius: undefined,
		transition: undefined,
		variants: undefined,
		initial: undefined,
		animate: undefined,
		exit: undefined,
		progress: false,
		working: false,
		duration: undefined,
		trigger: false,
		destructive: false,
		link: undefined,
		target: undefined,
		onClick: fn(),
		onToolTip: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof Button> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Button {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runButtonPlay({ canvasElement, args });
	},
};

export const Small: StoryObj<typeof Button> = {
	args: {
		size: 'small',
		label: 'Small Button',
		iconRight: undefined,
	},
	render: Default.render,
	play: Default.play,
};

export const DisabledInteractions: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: {
		state: 'disabled',
		tooltip: 'Disabled tip',
	},
	render: Default.render,
	play: runButtonDisabledInteractionsPlay,
};

export const OutlineDestructiveHover: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: {
		variant: 'outline',
		destructive: true,
		tooltip: 'Danger',
	},
	render: Default.render,
	play: runButtonOutlineDestructiveHoverPlay,
};

export const TextVariantChildren: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: {
		variant: 'text',
	},
	// children take priority over `label`, and the meta default label isn't
	// cleared by an `undefined` override in args, so drop it directly in JSX
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Button {...args} label={undefined}>
				Children Label
			</Button>
		</FlexDiv>
	),
	play: runButtonTextVariantChildrenPlay,
};

export const RoundIconOnly: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: {
		round: true,
		iconLeft: 'home',
		iconRight: undefined,
	},
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Button {...args} label={undefined} />
		</FlexDiv>
	),
	play: runButtonRoundIconOnlyPlay,
};

export const ShowDotAndCount: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: {
		showDot: true,
		count: 5,
	},
	render: Default.render,
	play: runButtonShowDotAndCountPlay,
};

export const FillAndCustomWidth: StoryObj<typeof Button> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv direction={'column'} gap={12}>
			<Button className="fill-button" label="Fill" fill width={'fill'} />
			<Button className="custom-width-button" label="Fixed" width={'200px'} />
		</FlexDiv>
	),
	play: runButtonFillAndCustomWidthPlay,
};

export const LinkOpensWindow: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: {
		link: 'https://example.com',
		target: '_blank',
	},
	render: Default.render,
	play: runButtonLinkOpensWindowPlay,
};

export const ProgressFlow: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: {
		progress: true,
		duration: 0.05,
		iconRight: undefined,
	},
	render: Default.render,
	play: runButtonProgressFlowPlay,
};
