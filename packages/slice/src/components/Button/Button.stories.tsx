import type { Meta, StoryObj } from '@storybook/react-vite';
import { StrictMode, useRef, useState } from 'react';
import { Button } from 'src/components/Button/Button';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { SliceIcons } from 'src/components/Icon/_types';
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
import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { Avatar } from '../Avatar';
import type { ButtonHandle } from './_types';

const meta: Meta<typeof Button> = {
	title: 'Components/Button',
	component: Button,
	argTypes: {
		textColor: { type: 'string', control: 'text' },
		iconColor: { type: 'string', control: 'text' },
		children: {
			table: {
				disable: true,
			},
		},
	},
	args: {
		buttonSize: 'l',
		variant: 'solid',
		label: 'Button Label',
		textSize: 'm',
		iconRight: SliceIcons.arrows.arrowRight,
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

export const AutoChildren: StoryObj<typeof Button> = {
	args: {
		buttonSize: 'auto',
		variant: 'solid',
		iconLeft: undefined,
		iconRight: undefined,
		children: (
			<>
				<Avatar name="John Wick" />
				<span>Profile Info</span>
			</>
		),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: /Profile Info/ }).getBoundingClientRect();
		const avatar = canvas.getByLabelText('User Avatar - John Wick').getBoundingClientRect();
		const text = canvas.getByText('Profile Info').getBoundingClientRect();
		expect(avatar.top - button.top).toBeCloseTo(6, 1);
		expect(button.bottom - avatar.bottom).toBeCloseTo(6, 1);
		expect(text.left - avatar.right).toBeCloseTo(4, 1);
		expect(text.top + text.height / 2).toBeCloseTo(avatar.top + avatar.height / 2, 1);
	},
};

export const ChildrenPaddingAndGap: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: {
		buttonSize: 'auto',
		variant: 'solid',
		iconLeft: undefined,
		iconRight: undefined,
		padding: '2px 10px',
		paddingTop: 8,
		paddingBottom: 4,
		paddingLeft: 20,
		gap: 0,
		children: (
			<>
				<span style={{ display: 'block' }}>First</span>
				<span style={{ display: 'block' }}>Second</span>
			</>
		),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button');
		expect(getComputedStyle(button).padding).toBe('8px 10px 4px 20px');
		const first = canvas.getByText('First').getBoundingClientRect();
		const second = canvas.getByText('Second').getBoundingClientRect();
		expect(second.left - first.right).toBeCloseTo(0, 1);
	},
};

export const SharedSizes: StoryObj<typeof Button> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv gap={12}>
			{(['s', 'm', 'l', 'xl', 52] as const).map((buttonSize) => (
				<Button key={buttonSize} label={String(buttonSize)} buttonSize={buttonSize} />
			))}
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const [name, height] of [
			['s', 24],
			['m', 36],
			['l', 44],
			['xl', 56],
			['52', 52],
		] as const) {
			expect(canvas.getByRole('button', { name }).getBoundingClientRect().height).toBeCloseTo(height, 1);
		}
	},
};

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
		buttonSize: 's',
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
		iconLeft: 'basic.home',
		iconRight: undefined,
	},
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Button {...args} label={undefined} aria-label="Home" />
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

export const NativeDisabledGuardsRef: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: { disabled: true },
	render: function DisabledExample(args) {
		const ref = useRef<ButtonHandle>(null);
		return (
			<>
				<Button {...args} ref={ref} />
				<button type="button" onClick={() => ref.current?.triggerClick()}>
					Trigger method
				</button>
			</>
		);
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button', { name: 'Button Label' })).toBeDisabled();
		await userEvent.click(canvas.getByRole('button', { name: 'Trigger method' }));
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};

export const StateDisabledCannotBeOverridden: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: { state: 'disabled', disabled: false },
	render: Default.render,
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('button')).toBeDisabled();
	},
};

export const TriggerRisingEdge: StoryObj<typeof Button> = {
	tags: ['tests'],
	render: function TriggerExample(args) {
		const [trigger, setTrigger] = useState(false);
		const [version, setVersion] = useState(0);
		return (
			<>
				<Button {...args} trigger={trigger} title={String(version)} onClick={(event) => args.onClick?.(event)} />
				<button type="button" onClick={() => setTrigger(true)}>
					Fire trigger
				</button>
				<button type="button" onClick={() => setVersion((value) => value + 1)}>
					Rerender
				</button>
				<button type="button" onClick={() => setTrigger(false)}>
					Reset trigger
				</button>
			</>
		);
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Fire trigger' }));
		await expect(args.onClick).toHaveBeenCalledTimes(1);
		await userEvent.hover(canvas.getByRole('button', { name: 'Button Label' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Rerender' }));
		await expect(args.onClick).toHaveBeenCalledTimes(1);
		await userEvent.click(canvas.getByRole('button', { name: 'Reset trigger' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Fire trigger' }));
		await expect(args.onClick).toHaveBeenCalledTimes(2);
	},
};

export const ControlledWorking: StoryObj<typeof Button> = {
	tags: ['tests'],
	render: function WorkingExample(args) {
		const [working, setWorking] = useState(false);
		return (
			<>
				<Button
					{...args}
					label="Save changes"
					iconRight={undefined}
					working={working}
					onClick={(event) => {
						args.onClick?.(event);
						setWorking(true);
					}}
				/>
				<button type="button" onClick={() => setWorking(false)}>
					Finish work
				</button>
			</>
		);
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Save changes' });
		const width = button.getBoundingClientRect().width;
		await userEvent.click(button);
		await expect(button).toHaveAttribute('aria-busy', 'true');
		await expect(button).toBeDisabled();
		await expect(button.getBoundingClientRect().width).toBeCloseTo(width, 0);
		await expect(canvas.getByRole('button', { name: 'Save changes' })).toBe(button);
		await userEvent.click(canvas.getByRole('button', { name: 'Finish work' }));
		await expect(button).toHaveAttribute('aria-busy', 'false');
		await expect(button).toBeEnabled();
		await expect(args.onClick).toHaveBeenCalledTimes(1);
	},
};

export const TimedProgressWithBothIcons: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: { progress: true, duration: 0.1, iconLeft: 'basic.home' },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const button = within(canvasElement).getByRole('button');
		await userEvent.click(button);
		await expect(button).toHaveAttribute('aria-busy', 'true');
		await expect(button).toBeDisabled();
		await expect(args.onClick).not.toHaveBeenCalled();
		await waitFor(() => expect(args.onClick).toHaveBeenCalledTimes(1));
		await expect(args.onClick).toHaveBeenCalledWith(undefined);
		await expect(button).toBeEnabled();
	},
};

export const ComposedTooltipHandlers: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: { tooltip: 'Save your changes', onMouseEnter: fn(), onMouseLeave: fn(), onFocus: fn(), onBlur: fn() },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const button = within(canvasElement).getByRole('button');
		await userEvent.hover(button);
		await expect(args.onMouseEnter).toHaveBeenCalled();
		await expect(args.onToolTip).toHaveBeenLastCalledWith(
			expect.objectContaining({ payload: { label: 'Save your changes' } }),
		);
		await userEvent.unhover(button);
		await expect(args.onMouseLeave).toHaveBeenCalled();
		button.focus();
		await expect(args.onFocus).toHaveBeenCalled();
		await expect(args.onToolTip).toHaveBeenLastCalledWith(
			expect.objectContaining({ payload: { label: 'Save your changes' } }),
		);
		button.blur();
		await expect(args.onBlur).toHaveBeenCalled();
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null);
	},
};

export const DecorativeIconsAndKeyboardFocus: StoryObj<typeof Button> = {
	tags: ['tests'],
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Button Label' });
		await userEvent.tab();
		await expect(button).toHaveFocus();
		await expect(getComputedStyle(button).outlineStyle).toBe('solid');
		for (const icon of Array.from(button.querySelectorAll('svg'))) await expect(icon).toHaveAttribute('tabindex', '-1');
		await userEvent.keyboard('{Enter}');
		await expect(args.onClick).toHaveBeenCalledTimes(1);
	},
};

export const ZeroCountHasNoStrayText: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: { count: 0 },
	render: Default.render,
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).queryByText('0')).toBeNull();
	},
};

export const SmallRoundGeometry: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: { round: true, buttonSize: 's', iconLeft: 'basic.home', iconRight: undefined },
	render: (args) => <Button {...args} label={undefined} aria-label="Home" />,
	play: async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Home' });
		await expect(button.getBoundingClientRect().width).toBe(button.getBoundingClientRect().height);
	},
};

export const AutoRoundGeometry: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: { ...SmallRoundGeometry.args, buttonSize: 'auto' },
	render: SmallRoundGeometry.render,
	play: SmallRoundGeometry.play,
};

export const ActualFillWidth: StoryObj<typeof Button> = {
	tags: ['tests'],
	render: () => (
		<div style={{ display: 'flex', width: 320 }}>
			<Button label="Continue" width="fill" />
		</div>
	),
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('button').getBoundingClientRect().width).toBe(320);
	},
};

export const TextVariantColorOverrides: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: { variant: 'text', backgroundColor: '#2563eb', textColor: '#ffffff', textSize: 'l' },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button');
		await expect(button.style.backgroundColor).toBe('rgb(37, 99, 235)');
		await expect(button.style.color).toBe('rgb(255, 255, 255)');
	},
};

export const InitialTriggerInStrictMode: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: { trigger: true },
	render: (args) => (
		<StrictMode>
			<Button {...args} />
		</StrictMode>
	),
	play: async ({ args }) => {
		await expect(args.onClick).toHaveBeenCalledTimes(1);
	},
};

export const InitialTimedTriggerInStrictMode: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: { trigger: true, progress: true, duration: 0.1 },
	render: (args) => (
		<StrictMode>
			<Button {...args} />
		</StrictMode>
	),
	play: async ({ args }) => {
		await waitFor(() => expect(args.onClick).toHaveBeenCalledTimes(1));
	},
};

export const NativeFormBehavior: StoryObj<typeof Button> = {
	tags: ['tests'],
	render: (args) => (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				args.onClick?.(undefined);
			}}
		>
			<Button label="Regular action" />
			<Button label="Submit form" type="submit" />
		</form>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Regular action' }));
		await expect(args.onClick).not.toHaveBeenCalled();
		await userEvent.click(canvas.getByRole('button', { name: 'Submit form' }));
		await expect(args.onClick).toHaveBeenCalledTimes(1);
	},
};

export const CanceledLink: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: { link: 'https://example.com', onClick: fn((event) => event?.preventDefault()) },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const open = spyOn(window, 'open').mockImplementation(() => null);
		try {
			await userEvent.click(within(canvasElement).getByRole('button'));
			await expect(args.onClick).toHaveBeenCalled();
			await expect(open).not.toHaveBeenCalled();
		} finally {
			open.mockRestore();
		}
	},
};

export const DisabledCancelsTimedAction: StoryObj<typeof Button> = {
	tags: ['tests'],
	render: function CancelExample(args) {
		const [disabled, setDisabled] = useState(false);
		return (
			<>
				<Button {...args} label="Timed action" progress duration={0.25} disabled={disabled} />
				<button type="button" onClick={() => setDisabled(true)}>
					Disable action
				</button>
			</>
		);
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Timed action' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Disable action' }));
		await new Promise((resolve) => setTimeout(resolve, 300));
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};

export const MotionEventSignatures: StoryObj<typeof Button> = {
	tags: ['tests'],
	args: {
		initial: 'hidden',
		animate: 'visible',
		variants: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
		transition: { duration: 0.05 },
		onAnimationStart: fn(),
	},
	render: Default.render,
	play: async ({ args }) => {
		await waitFor(() => expect((args.onAnimationStart as ReturnType<typeof fn>).mock.calls[0]?.[0]).toBe('visible'));
	},
};

export const BorderOverrides: StoryObj<typeof Button> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv gap={12}>
			{(['solid', 'outline', 'text'] as const).flatMap((variant) =>
				(['s', 'auto', 52] as const).map((buttonSize) => (
					<Button
						key={`${variant}-${buttonSize}`}
						label={`${variant}-${buttonSize}`}
						variant={variant}
						buttonSize={buttonSize}
						borderWidth={2}
						borderColor="#123456"
					/>
				)),
			)}
			<Button label="Disabled border" variant="solid" disabled borderWidth="3px" borderColor="#123456" />
			<Button label="Destructive border" destructive fill borderWidth={2} borderColor="core-text-primary" />
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const variant of ['solid', 'outline', 'text']) {
			for (const size of ['s', 'auto', 52]) {
				const button = canvas.getByRole('button', { name: `${variant}-${size}` });
				await expect(getComputedStyle(button).borderTopWidth).toBe('2px');
				await expect(getComputedStyle(button).backgroundClip).toBe('padding-box');
				await expect(getComputedStyle(button).borderTopColor).toBe('rgb(18, 52, 86)');
				await userEvent.hover(button);
				await expect(getComputedStyle(button).borderTopColor).toBe('rgb(18, 52, 86)');
				await expect(button).not.toHaveAttribute('borderWidth');
				await expect(button).not.toHaveAttribute('borderColor');
			}
		}
		const disabled = canvas.getByRole('button', { name: 'Disabled border' });
		await expect(getComputedStyle(disabled).borderTopWidth).toBe('3px');
		await expect(getComputedStyle(disabled).borderTopColor).toBe('rgb(18, 52, 86)');
		const destructive = canvas.getByRole('button', { name: 'Destructive border' });
		await expect(destructive.style.borderColor).toBe('var(--core-text-primary)');
	},
};

export const ZeroAndRoundBorders: StoryObj<typeof Button> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv gap={12}>
			<Button label="Borderless outline" borderWidth={0} borderColor="transparent" />
			<Button label="Color only" borderColor="#123456" />
			<Button label="Width only" variant="solid" borderWidth={2} />
			<Button buttonSize="auto" round iconLeft="basic.home" aria-label="Round bordered" borderWidth={3} />
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(getComputedStyle(canvas.getByRole('button', { name: 'Borderless outline' })).borderTopWidth).toBe(
			'0px',
		);
		const colorOnly = canvas.getByRole('button', { name: 'Color only' });
		await expect(getComputedStyle(colorOnly).borderTopWidth).toBe('1px');
		await expect(getComputedStyle(colorOnly).borderTopColor).toBe('rgb(18, 52, 86)');
		const widthOnly = canvas.getByRole('button', { name: 'Width only' });
		await expect(getComputedStyle(widthOnly).borderTopWidth).toBe('2px');
		await expect(getComputedStyle(widthOnly).borderTopColor).toBe('rgba(0, 0, 0, 0)');
		const round = canvas.getByRole('button', { name: 'Round bordered' }).getBoundingClientRect();
		await expect(round.width).toBe(round.height);
		await expect(round.width).toBe(38);
	},
};

export const BodyTextSizes: StoryObj<typeof Button> = {
	tags: ['tests'],
	parameters: {
		docs: {
			description: {
				story:
					'Compare all body text sizes at the default 36px button height. Each row compares labels without descenders (Button Label) and with descenders (Typography), paired in solid and outline variants.',
			},
		},
	},
	render: () => (
		<FlexDiv direction="column" gap={16} padding={24}>
			{(['xs', 's', 'm', 'l', 'xl'] as const).map((textSize) => (
				<FlexDiv key={textSize} align="center" gap={16}>
					<span style={{ width: 24 }}>{textSize}</span>
					<Button variant="solid" buttonSize="m" textSize={textSize} label="Button Label" width="160px" />
					<Button variant="solid" buttonSize="m" textSize={textSize} label="Typography" width="160px" />
					<Button variant="outline" buttonSize="m" textSize={textSize} label="Button Label" width="160px" />
					<Button variant="outline" buttonSize="m" textSize={textSize} label="Typography" width="160px" />
				</FlexDiv>
			))}
		</FlexDiv>
	),
};
