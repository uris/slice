import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Chip } from 'src/components/Chip';
import { FlexDiv } from 'src/components/FlexDiv';
import { runChipButtonVariantPlay, runChipDisabledPlay, runChipLayoutVariantsPlay } from 'src/components/playHelpers';
import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';

const meta: Meta<typeof Chip> = {
	title: 'Components/Chip',
	component: Chip,
	argTypes: {
		selected: { control: 'boolean' },
		textColorSelected: { control: 'text' },
		iconColorSelected: { control: 'text' },
		backgroundColorSelected: { control: 'text' },
		borderColorSelected: { control: 'text' },
		layout: { control: 'boolean' },
		transition: { control: 'object' },
		removeLabel: { control: 'text' },
		onRemove: { control: false },

		label: { control: 'text' },
		textSize: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
		textColor: { control: 'text' },
		textColorHover: { control: 'text' },
		icon: { control: 'text' },
		iconSize: { control: { type: 'number', min: 1 } },
		iconPosition: { control: 'select', options: ['left', 'right'] },
		iconColor: { control: 'text' },
		iconColorHover: { control: 'text' },
		backgroundColor: { control: 'text' },
		backgroundColorHover: { control: 'text' },
		borderColor: { control: 'text' },
		borderColorHover: { control: 'text' },
		borderColorDisabled: { control: 'text' },
		borderWidth: { control: { type: 'number', min: 0 } },
		borderRadius: { control: 'text' },
		padding: { control: { type: 'number', min: 0 } },
		paddingTop: { control: { type: 'number', min: 0 } },
		paddingRight: { control: { type: 'number', min: 0 } },
		paddingBottom: { control: { type: 'number', min: 0 } },
		paddingLeft: { control: { type: 'number', min: 0 } },
		gap: { control: { type: 'number', min: 0 } },
		disabled: { control: 'boolean' },
		tooltip: { control: 'text' },

		children: {
			table: {
				disable: true,
			},
		},
	},
	args: {
		label: 'Chip Label',
		selected: undefined,
		layout: undefined,
		transition: undefined,
		removeLabel: undefined,
		onRemove: undefined,
		textSize: 'm',
		iconSize: 20,
		iconPosition: 'left',
		gap: 4,
		borderWidth: 1,
		borderRadius: 'var(--corner-m)',
		textColor: 'var(--core-text-primary)',
		iconColor: 'var(--core-text-primary)',
		backgroundColor: 'transparent',
		borderColor: 'var(--core-text-primary)',
		borderColorDisabled: 'var(--core-text-disabled)',
		icon: 'wand',
		disabled: false,
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
};

export const DisabledInteractions: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: {
		disabled: true,
		onClick: undefined,
	},
	render: Default.render,
	play: runChipDisabledPlay,
};

export const ButtonVariant: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: {
		onClick: fn(),
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

export const NativeButton: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { onClick: fn() },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const chip = within(canvasElement).getByRole('button', { name: 'Chip Label' });
		await expect(chip.tagName).toBe('BUTTON');
		await expect(chip).toHaveAttribute('type', 'button');
		chip.focus();
		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');
		await expect(args.onClick).toHaveBeenCalledTimes(2);
		await expect(chip.querySelector('svg')).toHaveAttribute('tabindex', '-1');
		await expect(getComputedStyle(chip).boxShadow).not.toBe('none');
	},
};
export const NativeDisabledButton: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { disabled: true },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const chip = within(canvasElement).getByRole('button');
		await expect(chip).toBeDisabled();
		await userEvent.click(chip);
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};
export const LabelPrecedence: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { label: 'Visible label', children: 'Ignored children' },
	render: Default.render,
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByText('Visible label')).toBeInTheDocument();
		await expect(within(canvasElement).queryByText('Ignored children')).toBeNull();
	},
};
export const NumericChildren: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { label: undefined, children: 0 },
	render: Default.render,
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByText('0')).toBeInTheDocument();
	},
};
export const IndependentPadding: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { padding: 10, paddingTop: 2, paddingRight: 3, paddingBottom: 4, paddingLeft: 5 },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const chip = within(canvasElement).getByRole('button', { name: 'Chip Label' });
		await expect(chip).toHaveStyle({
			paddingTop: '2px',
			paddingRight: '3px',
			paddingBottom: '4px',
			paddingLeft: '5px',
		});
		await expect(chip.querySelector('svg')?.parentElement).toHaveStyle({ width: '20px', height: '20px' });
	},
};
export const UniformPadding: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { padding: 6 },
	render: Default.render,
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('button', { name: 'Chip Label' })).toHaveStyle({ padding: '6px' });
	},
};
export const FocusAndNativeHandlers: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { onFocus: fn(), onBlur: fn(), onMouseEnter: fn() },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const chip = within(canvasElement).getByRole('button');
		chip.focus();
		await expect(args.onFocus).toHaveBeenCalled();
		await expect(args.onToolTip).toHaveBeenLastCalledWith(
			expect.objectContaining({ payload: { label: 'Chip tooltip' }, ref: expect.anything() }),
		);
		await userEvent.hover(chip);
		await expect(args.onMouseEnter).toHaveBeenCalled();
		await userEvent.unhover(chip);
		await expect(args.onToolTip).not.toHaveBeenLastCalledWith(null);
		chip.blur();
		await expect(args.onBlur).toHaveBeenCalled();
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null);
	},
};

export const NativeFormBehavior: StoryObj<typeof Chip> = {
	tags: ['tests'],
	render: () => {
		const [submitted, setSubmitted] = useState(false);
		return (
			<form
				onSubmit={(event) => {
					event.preventDefault();
					setSubmitted(true);
				}}
			>
				<Chip label="Default action" onClick={() => {}} />
				<Chip label="Submit action" onClick={() => {}} type="submit" />
				{submitted && <output>Submitted</output>}
			</form>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Default action' }));
		await expect(canvas.queryByText('Submitted')).toBeNull();
		await userEvent.click(canvas.getByRole('button', { name: 'Submit action' }));
		await expect(canvas.getByText('Submitted')).toBeInTheDocument();
	},
};

export const StaticTag: StoryObj<typeof Chip> = {
	args: { onClick: undefined, tooltip: undefined },
	render: Default.render,
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).queryByRole('button')).toBeNull();
	},
};
export const Selectable: StoryObj<typeof Chip> = {
	render: (args) => {
		const [selected, setSelected] = useState(false);
		if (!args.onClick) return <></>;
		return (
			<Chip
				{...args}
				selected={selected}
				label={selected ? 'Following updates' : 'Follow'}
				onClick={() => setSelected((value) => !value)}
			/>
		);
	},
};

export const SelectionSemantics: StoryObj<typeof Chip> = {
	tags: ['tests'],
	render: Selectable.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const chip = canvas.getByRole('button', { name: 'Follow' });
		await expect(chip).toHaveAttribute('aria-pressed', 'false');
		await expect(chip.parentElement).toHaveStyle({ overflow: 'hidden' });
		await userEvent.click(chip);
		await expect(canvas.getByRole('button', { name: 'Following updates' })).toBe(chip);
		await expect(chip).toHaveAttribute('aria-pressed', 'true');
	},
};
export const RemovalSemantics: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { onRemove: fn() },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const action = canvas.getByRole('button', { name: 'Chip Label' });
		const remove = canvas.getByRole('button', { name: 'Remove Chip Label' });
		await expect(remove.querySelector('svg')).toHaveAttribute('aria-label', 'x icon');
		await expect(remove.closest('button')?.parentElement?.closest('button')).toBeNull();
		await userEvent.click(remove);
		await waitFor(() => expect(args.onRemove).toHaveBeenCalledTimes(1));
		await expect(args.onClick).not.toHaveBeenCalled();
		await expect(action).not.toBeInTheDocument();
	},
};
export const RemoveOnly: StoryObj<typeof Chip> = {
	args: { onClick: undefined, onRemove: fn(), removeLabel: 'Clear filter' },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const buttons = within(canvasElement).getAllByRole('button');
		await expect(buttons).toHaveLength(1);
		await expect(buttons[0]).toHaveAccessibleName('Clear filter');
		await userEvent.click(buttons[0]);
		await waitFor(() => expect(args.onRemove).toHaveBeenCalledTimes(1));
	},
};
export const DisabledRemovable: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { disabled: true, onRemove: fn(), selected: true },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		for (const button of within(canvasElement).getAllByRole('button')) {
			await expect(button).toBeDisabled();
			await userEvent.click(button);
		}
		await expect(args.onClick).not.toHaveBeenCalled();
		await expect(args.onRemove).not.toHaveBeenCalled();
	},
};

export const Removable: StoryObj<typeof Chip> = {
	args: { onRemove: fn() },
	render: (args) => {
		const [visible, setVisible] = useState(true);
		return (
			<>
				{visible && (
					<Chip
						{...args}
						key="removable"
						onRemove={(event) => {
							args.onRemove?.(event);
							setVisible(false);
						}}
					/>
				)}
			</>
		);
	},
};
export const ControlledSelection: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { selected: false },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const chip = within(canvasElement).getByRole('button', { name: 'Chip Label' });
		await userEvent.click(chip);
		await expect(args.onClick).toHaveBeenCalledTimes(1);
		await expect(chip).toHaveAttribute('aria-pressed', 'false');
	},
};
export const SelectedColors: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: {
		selected: true,
		backgroundColorSelected: '#123456',
		textColorSelected: '#ffffff',
		borderColorSelected: '#654321',
		iconColorSelected: '#00ff00',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		const chip = within(canvasElement).getByRole('button', { name: 'Chip Label' });
		await expect(chip).toHaveAttribute('aria-pressed', 'true');
		await expect(chip.parentElement).toHaveStyle({
			backgroundColor: 'rgb(18, 52, 86)',
			color: 'rgb(255, 255, 255)',
			borderColor: 'rgb(101, 67, 33)',
		});
		await expect(chip.querySelector('svg')?.parentElement).toHaveStyle({ color: 'rgb(0, 255, 0)' });
	},
};
export const KeyboardRemoval: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { onRemove: fn() },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const remove = within(canvasElement).getByRole('button', { name: 'Remove Chip Label' });
		remove.focus();
		await userEvent.keyboard('{Enter}');
		await waitFor(() => expect(args.onRemove).toHaveBeenCalledTimes(1));
		await expect(remove).not.toBeInTheDocument();
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};

export const OpticalLeftIcon: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { iconPosition: 'left' },
	render: Default.render,
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('button', { name: 'Chip Label' })).toHaveStyle({
			paddingLeft: '12px',
			paddingRight: '16px',
		});
	},
};
export const OpticalRightIcon: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { iconPosition: 'right' },
	render: Default.render,
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('button', { name: 'Chip Label' })).toHaveStyle({
			paddingLeft: '16px',
			paddingRight: '12px',
		});
	},
};
export const OpticalRemoveIcon: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { icon: undefined, onRemove: fn() },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button', { name: 'Chip Label' })).toHaveStyle({ paddingLeft: '16px' });
		await expect(canvas.getByRole('button', { name: 'Remove Chip Label' })).toHaveStyle({ paddingRight: '12px' });
	},
};
export const OpticalCompactIcon: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { textSize: 's', iconPosition: 'left' },
	render: Default.render,
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('button', { name: 'Chip Label' })).toHaveStyle({
			paddingLeft: '6px',
			paddingRight: '8px',
		});
	},
};
export const OpticalIconOnly: StoryObj<typeof Chip> = {
	tags: ['tests'],
	args: { label: undefined, icon: 'home', 'aria-label': 'Home' },
	render: Default.render,
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('button', { name: 'Home' })).toHaveStyle({
			paddingLeft: '12px',
			paddingRight: '12px',
		});
	},
};

export const RemovalTransition: StoryObj<typeof Chip> = {
	tags: ['tests'],
	render: Removable.render,
	args: { onRemove: fn(), transition: { duration: 0.4 } },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Remove Chip Label' });
		const chip = button.parentElement;
		if (!chip) throw new Error('Missing chip wrapper');
		await userEvent.click(button);
		await expect(args.onRemove).not.toHaveBeenCalled();
		await expect(chip).toBeInTheDocument();
		await expect(chip).toHaveAttribute('inert');
		await waitFor(() => expect(Number(getComputedStyle(chip).opacity)).toBeLessThan(1));
		await waitFor(() => expect(chip).not.toBeInTheDocument());
		await expect(args.onRemove).toHaveBeenCalledTimes(1);
		await expect(args.onRemove).toHaveBeenCalledWith(expect.objectContaining({ currentTarget: button }));
	},
};
export const ReducedMotionRemoval: StoryObj<typeof Chip> = {
	tags: ['tests'],
	render: Removable.render,
	args: { onRemove: fn(), transition: { duration: 10 } },
	beforeEach: () => {
		const original = window.matchMedia.bind(window);
		const mock = spyOn(window, 'matchMedia').mockImplementation((query) => {
			const media = original(query);
			if (query !== '(prefers-reduced-motion: reduce)') return media;
			Object.defineProperty(media, 'matches', { value: true });
			return media;
		});
		return () => mock.mockRestore();
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const chip = canvas.getByRole('button', { name: 'Remove Chip Label' }).parentElement;
		if (!chip) throw new Error('Missing chip wrapper');
		await userEvent.click(canvas.getByRole('button', { name: 'Remove Chip Label' }));
		await waitFor(() => expect(chip).not.toBeInTheDocument(), { timeout: 500 });
	},
};
