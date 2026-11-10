import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { BarButton } from 'src/components/ButtonBar';
import { ButtonBar } from 'src/components/ButtonBar/ButtonBar';
import { FlexBox } from 'src/components/FlexBox/FlexBox';
import {
	runButtonBarCustomClassPlay,
	runButtonBarMissingTipPlay,
	runButtonBarNoTogglePlay,
	runButtonBarPlay,
	runButtonBarSizeEdgeCasesPlay,
	runButtonBarWithoutHandlersPlay,
} from 'src/components/playHelpers';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from '../Button';

const listView: BarButton[] = [
	{ icon: 'arrows.arrow-left', action: 'previous', tip: 'Previous' },
	{ icon: 'arrows.arrow-right', action: 'next', tip: 'Next' },
];

// Explicit three-item fixture for selection regressions; the public demo stays two actions.
const selectionButtons: BarButton[] = [
	{ icon: 'arrows.arrow-left', action: 'previous', tip: 'Previous' },
	{ icon: 'basic.home', action: 'home', tip: 'Home' },
	{ icon: 'arrows.arrow-right', action: 'next', tip: 'Next' },
];

const meta: Meta<typeof ButtonBar> = {
	title: 'Components/ButtonBar',
	component: ButtonBar,
	argTypes: {
		buttons: { control: 'object', description: 'Icon records. tip is the accessible name and tooltip text.' },
		buttonSize: {
			control: 'select',
			options: ['s', 'm', 'l', 'xl', 28, 32, 40, 48, 64],
			description: 'Overall height preset, or an explicit inner button diameter in pixels.',
		},
		buttonGap: {
			control: { type: 'number', step: 1 },
			description: 'Pixels between buttons; negative values overlap them.',
		},
		padding: { control: { type: 'number', min: 0, step: 1 }, description: 'Uniform wrapper inset in pixels.' },
		selectionRadius: { control: 'text', description: 'CSS radius: 50% for circles, 8px for rounded corners, or 0.' },
		iconSize: { control: { type: 'number', min: 1, step: 1 } },
		borderRadius: { control: 'text', description: 'Outer bar radius, independent of selectionRadius.' },
		borderWidth: { control: { type: 'number', min: 0, step: 1 } },
		borderColor: { control: 'text', description: 'Slice color token or CSS color.' },
		backgroundColor: { control: 'text', description: 'Bar background: Slice token or CSS color.' },
		backgroundColorHover: { control: 'text', description: 'Hovered highlight: Slice token or CSS color.' },
		backgroundColorSelected: { control: 'text', description: 'Selected highlight: Slice token or CSS color.' },
		toggle: { control: 'boolean' },
		selectedIndex: {
			control: { type: 'select', labels: { uncontrolled: 'Uncontrolled', none: 'None' } },
			options: ['uncontrolled', 'none', 0, 1],
			mapping: { uncontrolled: undefined, none: null },
			description: 'Controlled index, or None to clear. Uncontrolled lets the bar manage selection.',
		},
		defaultSelectedIndex: {
			control: { type: 'number', min: 0, step: 1 },
			description: 'Initial local index. The preview resets when this control changes.',
		},
		onClick: { control: false },
		onChange: { control: false },
		onToolTip: { control: false },
	},
	args: {
		buttons: listView,
		defaultSelectedIndex: null,
		selectedIndex: undefined,
		toggle: false,
		buttonSize: 'm',
		buttonGap: -2,
		padding: 4,
		selectionRadius: '50%',
		iconSize: 20,
		borderRadius: 1000,
		borderWidth: 0,
		borderColor: 'var(--core-outline-primary)',
		backgroundColor: 'var(--core-surface-secondary)',
		backgroundColorHover: 'var(--core-outline-primary)',
		backgroundColorSelected: 'var(--core-outline-primary)',
		onClick: fn(),
		onChange: fn(),
		onToolTip: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof ButtonBar> = {
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<ButtonBar key={args.defaultSelectedIndex ?? 'none'} {...args} />
			</FlexBox>
		);
	},
};

export const SmallSize: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: { buttonSize: 's' },
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<ButtonBar {...args} />
		</FlexBox>
	),
	play: async ({ canvasElement, args }) => {
		await runButtonBarPlay({ canvasElement, args });
	},
};

export const LargeSize: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: { buttonSize: 'l' },
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<ButtonBar {...args} />
		</FlexBox>
	),
	play: async ({ canvasElement, args }) => {
		await runButtonBarPlay({ canvasElement, args });
	},
};

export const ExtraLargeSize: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: { buttonSize: 'xl' },
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<ButtonBar {...args} />
		</FlexBox>
	),
	play: async ({ canvasElement, args }) => {
		await runButtonBarPlay({ canvasElement, args });
	},
};

export const SizeEdgeCases: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64} gap={24}>
			{/* Invalid runtime values fall back to the medium frame. */}
			<ButtonBar {...args} buttonSize={'' as unknown as 's'} />
			{/* Unknown string presets also use medium. */}
			<ButtonBar {...args} buttonSize={'huge' as unknown as 's'} />
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		await runButtonBarSizeEdgeCasesPlay({ canvasElement });
	},
};

export const NoToggle: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: { toggle: false },
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<ButtonBar {...args} />
		</FlexBox>
	),
	play: async ({ canvasElement, args }) => {
		await runButtonBarNoTogglePlay({ canvasElement, args });
	},
};

export const WithoutHandlers: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: { onClick: undefined, onChange: undefined, onToolTip: undefined },
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<ButtonBar {...args} />
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		await runButtonBarWithoutHandlersPlay({ canvasElement });
	},
};

export const CustomClassName: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: { className: 'bb-custom-class' },
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<ButtonBar {...args} />
		</FlexBox>
	),
	play: async ({ canvasElement, args }) => {
		await runButtonBarCustomClassPlay({ canvasElement, args });
	},
};

export const MissingTipFallback: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: {
		buttons: [{ icon: 'basic.home', action: 'gallery' } as unknown as BarButton, ...listView],
	},
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<ButtonBar {...args} />
		</FlexBox>
	),
	play: async ({ canvasElement, args }) => {
		await runButtonBarMissingTipPlay({ canvasElement, args });
	},
};

export const SelectionSemantics: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: { buttons: selectionButtons, toggle: true, defaultSelectedIndex: 1 },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const previous = canvas.getByRole('button', { name: 'Previous' });
		const home = canvas.getByRole('button', { name: 'Home' });
		await expect(home).toHaveAttribute('aria-pressed', 'true');
		await userEvent.click(previous);
		await expect(previous).toHaveAttribute('aria-pressed', 'true');
		await expect(home).toHaveAttribute('aria-pressed', 'false');
		await userEvent.click(previous);
		await expect(args.onClick).toHaveBeenCalledTimes(2);
		await expect(args.onChange).toHaveBeenCalledTimes(1);
		await expect(args.onChange).toHaveBeenCalledWith(args.buttons?.[0]);
		await expect(previous).toHaveStyle({ borderRadius: '50%' });
		await expect(previous.querySelector('span')).toHaveStyle({ borderRadius: '50%' });
		await expect(previous.parentElement).toHaveStyle({ overflow: 'visible' });
		const box = previous.getBoundingClientRect();
		await expect(box.width).toBe(box.height);
		await expect(previous.querySelector('svg')).toHaveAttribute('tabindex', '-1');
	},
};

export const ControlledSelection: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: { buttons: selectionButtons, toggle: true, defaultSelectedIndex: 1, selectedIndex: 1 },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Previous' }));
		await expect(args.onChange).toHaveBeenCalledWith(args.buttons?.[0]);
		await expect(canvas.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-pressed', 'true');
		await expect(canvas.getByRole('button', { name: 'Previous' })).toHaveAttribute('aria-pressed', 'false');
	},
};

export const ControlledWithClear: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: { buttons: selectionButtons, toggle: true, defaultSelectedIndex: 1 },
	render: (args) => {
		const [selectedIndex, setSelectedIndex] = useState<number | null>(1);
		return (
			<>
				<ButtonBar
					{...args}
					selectedIndex={selectedIndex}
					onChange={(button) => {
						args.onChange?.(button);
						setSelectedIndex(args.buttons?.indexOf(button) ?? null);
					}}
				/>
				<button type="button" onClick={() => setSelectedIndex(null)}>
					Clear selection
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
		await expect(canvas.getByRole('button', { name: 'Next' })).toHaveAttribute('aria-pressed', 'true');
		await userEvent.click(canvas.getByRole('button', { name: 'Clear selection' }));
		for (const button of canvas.getAllByRole('button').slice(0, 3)) {
			await expect(button).toHaveAttribute('aria-pressed', 'false');
		}
	},
};

export const CustomSizeAndSelectedColor: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: {
		buttons: selectionButtons,
		toggle: true,
		defaultSelectedIndex: 1,
		buttonSize: 40,
		backgroundColorSelected: '#123456',
		borderWidth: 2,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const home = canvas.getByRole('button', { name: 'Home' });
		await expect(home).toHaveStyle({ width: '40px', height: '40px' });
		await expect(home.querySelector('span')).toHaveStyle({ backgroundColor: 'rgb(18, 52, 86)', borderRadius: '50%' });
		await expect(canvas.getByRole('group', { name: 'Actions' })).toHaveStyle({ borderTopWidth: '2px' });
	},
};

export const FocusTooltip: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Previous' });
		button.focus();
		await expect(button).toHaveFocus();
		await expect(args.onToolTip).toHaveBeenLastCalledWith(expect.objectContaining({ payload: { label: 'Previous' } }));
		await expect(button).toHaveStyle({ outlineStyle: 'none' });
		await expect(getComputedStyle(button).boxShadow).not.toBe('none');
		await userEvent.keyboard('{Enter}');
		await expect(args.onClick).toHaveBeenCalledWith(args.buttons?.[0]);
		button.blur();
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null);
	},
};

export const IndependentActionSemantics: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: { toggle: false },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Previous' });
		await userEvent.click(button);
		await expect(button).not.toHaveAttribute('aria-pressed');
		await expect(args.onClick).toHaveBeenCalledTimes(1);
		await expect(args.onChange).not.toHaveBeenCalled();
	},
};

export const OverlappingButtons: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: { buttons: selectionButtons, toggle: true, defaultSelectedIndex: 1, buttonGap: -8, selectionRadius: 12 },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const previous = canvas.getByRole('button', { name: 'Previous' });
		const home = canvas.getByRole('button', { name: 'Home' });
		const first = previous.getBoundingClientRect();
		const second = home.getBoundingClientRect();
		await expect(second.x - first.right).toBe(-8);
		await expect(home.querySelector('span')).toHaveStyle({ borderRadius: '12px' });
		await expect(home).toHaveStyle({ zIndex: '1' });
		await userEvent.click(previous);
		await expect(previous).toHaveAttribute('aria-pressed', 'true');
		await expect(home).toHaveAttribute('aria-pressed', 'false');
	},
};

export const SquareSelection: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: { selectionRadius: 0, buttonGap: 0 },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const buttons = within(canvasElement).getAllByRole('button');
		await expect(buttons[0].querySelector('span')).toHaveStyle({ borderRadius: '0px' });
		await expect(buttons[1].getBoundingClientRect().left).toBe(buttons[0].getBoundingClientRect().right);
	},
};

export const WrapperPadding: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: { padding: 12, borderWidth: 0 },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const group = canvas.getByRole('group', { name: 'Actions' });
		const buttons = canvas.getAllByRole('button');
		const wrapper = group.getBoundingClientRect();
		const first = buttons[0].getBoundingClientRect();
		const last = buttons[buttons.length - 1].getBoundingClientRect();
		await expect(first.left - wrapper.left).toBe(12);
		await expect(first.top - wrapper.top).toBe(12);
		await expect(wrapper.right - last.right).toBe(12);
		await expect(wrapper.bottom - first.bottom).toBe(12);
		await expect(buttons[1].getBoundingClientRect().left - first.right).toBe(-2);
	},
};

export const NoWrapperPadding: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: { padding: 0, borderWidth: 0 },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const wrapper = canvas.getByRole('group', { name: 'Actions' }).getBoundingClientRect();
		const first = canvas.getAllByRole('button')[0].getBoundingClientRect();
		await expect(first.left).toBe(wrapper.left);
		await expect(first.top).toBe(wrapper.top);
		await expect(first.bottom).toBe(wrapper.bottom);
	},
};

export const DefaultActionBehavior: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	render: () => <ButtonBar buttons={listView} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const buttons = canvas.getAllByRole('button');
		await expect(buttons).toHaveLength(2);
		await expect(canvas.queryByRole('button', { name: 'Home' })).toBeNull();
		await expect(canvas.getByRole('group', { name: 'Actions' })).toHaveStyle({ borderWidth: '0px', padding: '4px' });
		await expect(buttons[1].getBoundingClientRect().left - buttons[0].getBoundingClientRect().right).toBe(-2);
		await userEvent.click(buttons[0]);
		for (const button of buttons) await expect(button).not.toHaveAttribute('aria-pressed');
	},
};

const matchingButtonSizes = [
	{ bar: 's', button: 's' },
	{ bar: 'm', button: 'm' },
	{ bar: 'l', button: 'l' },
] as const;
export const MatchesButtonHeights: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
			{matchingButtonSizes.map((size) => (
				<div key={size.bar} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
					<Button label={size.button} buttonSize={size.button} />
					<ButtonBar buttons={listView} buttonSize={size.bar} aria-label={size.button} />
				</div>
			))}
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const size of matchingButtonSizes) {
			const button = canvas.getByRole('button', { name: size.button });
			const bar = canvas.getByRole('group', { name: size.button });
			await expect(Math.abs(bar.getBoundingClientRect().height - button.getBoundingClientRect().height)).toBeLessThan(
				0.1,
			);
			const inner = within(bar).getByRole('button', { name: 'Previous' });
			await expect(inner.getBoundingClientRect().width).toBe(inner.getBoundingClientRect().height);
		}
	},
};
export const BorderCompensatedHeight: StoryObj<typeof ButtonBar> = {
	tags: ['tests'],
	args: { borderWidth: 2 },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const group = within(canvasElement).getByRole('group', { name: 'Actions' });
		await expect(group.getBoundingClientRect().height).toBe(36);
		await expect(within(group).getByRole('button', { name: 'Previous' })).toHaveStyle({ height: '24px' });
	},
};
