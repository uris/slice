import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckBox } from 'src/components/CheckBox/CheckBox';
import { FlexBox } from 'src/components/FlexBox/FlexBox';
import { runCheckBoxPlay } from 'src/components/playHelpers';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta: Meta<typeof CheckBox> = {
	title: 'Components/CheckBox',
	component: CheckBox,
	argTypes: {
		align: { control: 'select', options: ['top', 'middle', 'bottom'] },
		iconColorSelected: { control: 'text' },
		label: { control: 'text', description: 'Visible text and accessible name; replaces children when supplied.' },
		iconChecked: { control: 'text' },
		iconUnChecked: { control: 'text' },
		iconPartial: { control: 'text' },
		iconColor: { control: 'text' },
		iconSize: { control: { type: 'number', min: 1 } },
		gap: { control: { type: 'number', min: 0 } },
		textTopOffset: {
			control: { type: 'number', step: 1 },
			description: 'Signed text adjustment in pixels: positive moves down, negative moves up.',
		},
		textColor: { control: 'text' },
		textSize: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },

		checked: {
			control: { type: 'radio' }, // Dropdown selection
			options: [true, false, 'mixed'], // Enum values as options
		},
		children: {
			table: {
				disable: true,
			},
		},
	},
	args: {
		align: 'middle',
		iconColorSelected: undefined,
		iconSize: 20,
		iconChecked: 'system.checkbox-checked',
		iconUnChecked: 'system.checkbox',
		iconPartial: 'system.checkbox-partial',
		gap: 6,
		textSize: 'm',
		textTopOffset: 0,
		iconColor: undefined,
		textColor: undefined,
		checked: false,
		disabled: false,
		label: 'Checkbox label',
		onChange: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof CheckBox> = {
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<CheckBox {...args} />
			</FlexBox>
		);
	},
};

export const DefaultCheckBox: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<CheckBox {...args} />
			</FlexBox>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runCheckBoxPlay({ canvasElement, args });
	},
};

export const Partial: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: {
		...meta.args,
		checked: 'mixed',
	},
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<CheckBox {...args} />
			</FlexBox>
		);
	},
};

export const Disabled: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: {
		...meta.args,
		disabled: true,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		const checkbox = canvasElement.querySelector('[role="checkbox"]');
		await expect(checkbox).toBeInTheDocument();
		await expect(checkbox).toHaveAttribute('aria-disabled', 'true');
	},
};

export const LabelPrecedence: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { label: 'Email updates', children: 'Ignored child text' },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('checkbox', { name: 'Email updates' })).toBeInTheDocument();
		await expect(canvas.queryByText('Ignored child text')).toBeNull();
	},
};

export const RichChildrenLabel: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { label: undefined, children: <strong>Product updates</strong> },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Product updates' });
		await expect(checkbox).not.toHaveAttribute('aria-label', '[object Object]');
		await expect(checkbox.querySelector('svg')).toHaveAttribute('tabindex', '-1');
	},
};

export const AccessibleLabelOverride: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { label: 'Updates', 'aria-label': 'Receive product updates' },
	render: Default.render,
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('checkbox', { name: 'Receive product updates' })).toBeInTheDocument();
		await expect(within(canvasElement).getByText('Updates')).toBeInTheDocument();
	},
};

export const CustomIcons: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: {
		checked: 'mixed',
		iconPartial: 'arrows.arrow-left',
		iconChecked: 'basic.home',
		iconUnChecked: 'arrows.arrow-right',
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const checkbox = within(canvasElement).getByRole('checkbox');
		await expect(checkbox.querySelector('svg')).toHaveAttribute('aria-label', 'arrows.arrow-left icon');
		await userEvent.click(checkbox);
		await expect(checkbox.querySelector('svg')).toHaveAttribute('aria-label', 'basic.home icon');
		await expect(args.onChange).toHaveBeenLastCalledWith(true);
		await userEvent.click(checkbox);
		await expect(checkbox.querySelector('svg')).toHaveAttribute('aria-label', 'arrows.arrow-right icon');
		await expect(args.onChange).toHaveBeenLastCalledWith(false);
	},
};

export const TypographyAndSpacing: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { iconSize: 28, gap: 12, textSize: 'xl', textColor: '#123456', iconColor: '#654321' },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const checkbox = within(canvasElement).getByRole('checkbox');
		await expect(checkbox).toHaveStyle({ gap: '12px' });
		await expect(checkbox.querySelector('svg')).toHaveAttribute('width', '28');
		const text = within(checkbox).getByText('Checkbox label');
		await expect(text).toHaveStyle({ color: 'rgb(18, 52, 86)' });
		await expect(text.getBoundingClientRect().height).toBeLessThanOrEqual(checkbox.getBoundingClientRect().height);
		await expect(checkbox.querySelector('[stroke]')).toHaveAttribute('stroke', '#654321');
	},
};

export const ComposedNativeHandlers: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { onClick: fn(), onKeyDown: fn() },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const checkbox = within(canvasElement).getByRole('checkbox');
		await userEvent.click(checkbox);
		await expect(args.onClick).toHaveBeenCalledTimes(1);
		await expect(checkbox).toHaveAttribute('aria-checked', 'true');
		await userEvent.keyboard(' ');
		await expect(args.onKeyDown).toHaveBeenCalled();
		await expect(checkbox).toHaveAttribute('aria-checked', 'false');
	},
};

export const CanceledActivation: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { onClick: (event) => event.preventDefault(), onKeyDown: (event) => event.preventDefault() },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const checkbox = within(canvasElement).getByRole('checkbox');
		await userEvent.click(checkbox);
		await userEvent.keyboard(' ');
		await expect(checkbox).toHaveAttribute('aria-checked', 'false');
		await expect(args.onChange).not.toHaveBeenCalled();
	},
};

export const DisabledActivation: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { disabled: true },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const checkbox = within(canvasElement).getByRole('checkbox');
		await userEvent.click(checkbox);
		checkbox.focus();
		await userEvent.keyboard('{Enter}');
		await expect(checkbox).toHaveAttribute('tabindex', '-1');
		await expect(checkbox).toHaveAttribute('aria-checked', 'false');
		await expect(args.onChange).not.toHaveBeenCalled();
	},
};

export const ZeroChildren: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { label: undefined, children: 0 },
	render: Default.render,
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('checkbox', { name: '0' })).toBeInTheDocument();
	},
};

export const KeyboardFocus: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	render: Default.render,
	play: async ({ canvasElement }) => {
		const checkbox = within(canvasElement).getByRole('checkbox');
		checkbox.focus();
		await expect(getComputedStyle(checkbox).boxShadow).not.toBe('none');
	},
};

export const DefaultStateColors: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	render: Default.render,
	play: async ({ canvasElement }) => {
		const checkbox = within(canvasElement).getByRole('checkbox');
		await expect(checkbox.querySelector('[stroke]')).toHaveAttribute('stroke', 'var(--core-icon-secondary)');
		await userEvent.click(checkbox);
		await expect(checkbox.querySelector('path')).toHaveAttribute('fill', 'var(--core-text-special)');
	},
};

export const MixedStateDefaults: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { checked: 'mixed' },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const checkbox = within(canvasElement).getByRole('checkbox');
		await expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
		await expect(checkbox.querySelector('svg')).toHaveAttribute('aria-label', 'system.checkbox-partial icon');
		await expect(checkbox.querySelector('[stroke]')).toHaveAttribute('stroke', 'var(--core-icon-primary)');
		await userEvent.click(checkbox);
		await expect(checkbox).toHaveAttribute('aria-checked', 'true');
		await expect(args.onChange).toHaveBeenLastCalledWith(true);
	},
};

export const SelectedIconColor: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { iconColor: '#123456', iconColorSelected: '#654321' },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const checkbox = within(canvasElement).getByRole('checkbox');
		await expect(checkbox.querySelector('[stroke]')).toHaveAttribute('stroke', '#123456');
		await userEvent.click(checkbox);
		await expect(checkbox.querySelector('path')).toHaveAttribute('fill', '#654321');
		await userEvent.click(checkbox);
		await expect(checkbox.querySelector('[stroke]')).toHaveAttribute('stroke', '#123456');
	},
};

export const MixedIconColor: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { checked: 'mixed', iconColor: '#123456', iconColorSelected: '#654321' },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const checkbox = within(canvasElement).getByRole('checkbox');
		await expect(checkbox.querySelector('[stroke]')).toHaveAttribute('stroke', '#654321');
	},
};

const longLabel =
	'I accept the terms and conditions and confirm that I have read the privacy policy before continuing.';
const multilineRender: StoryObj<typeof CheckBox>['render'] = (args) => (
	<FlexBox absolute justify="center" align="center" padding={64}>
		<CheckBox {...args} style={{ width: 240 }} />
	</FlexBox>
);
const multilinePlay: StoryObj<typeof CheckBox>['play'] = async ({ canvasElement, args }) => {
	const checkbox = within(canvasElement).getByRole('checkbox', { name: longLabel });
	const iconElement = checkbox.querySelector('svg');
	if (!iconElement) throw new Error('Checkbox icon is missing');
	const icon = iconElement.getBoundingClientRect();
	const text = within(checkbox).getByText(longLabel).getBoundingClientRect();
	await expect(text.height).toBeGreaterThan(icon.height * 2);
	const difference =
		args.align === 'top'
			? icon.top - text.top
			: args.align === 'bottom'
				? icon.bottom - text.bottom
				: (icon.top + icon.bottom - text.top - text.bottom) / 2;
	await expect(Math.abs(difference)).toBeLessThan(1);
};

export const MultilineTop: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { label: longLabel, align: 'top' },
	render: multilineRender,
	play: multilinePlay,
};
export const MultilineMiddle: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { label: longLabel, align: 'middle' },
	render: multilineRender,
	play: multilinePlay,
};
export const MultilineBottom: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { label: longLabel, align: 'bottom' },
	render: multilineRender,
	play: multilinePlay,
};

export const MultilineLabel: StoryObj<typeof CheckBox> = {
	args: { label: longLabel, align: 'top' },
	render: multilineRender,
};

const offsetPlay: StoryObj<typeof CheckBox>['play'] = async ({ canvasElement, args }) => {
	const checkboxes = within(canvasElement).getAllByRole('checkbox');
	const textPosition = (checkbox: HTMLElement) => {
		const text = checkbox.querySelector('span[id]');
		const icon = checkbox.querySelector('svg');
		if (!text || !icon) throw new Error('Checkbox text or icon is missing');
		const range = document.createRange();
		range.selectNodeContents(text);
		return range.getBoundingClientRect().top - icon.getBoundingClientRect().top;
	};
	const expectedOffset = args.textTopOffset ?? 0;
	await expect(Math.abs(textPosition(checkboxes[1]) - textPosition(checkboxes[0]) - expectedOffset)).toBeLessThan(1);
	const label = checkboxes[1].querySelector('span[id]');
	if (!label) throw new Error('Checkbox label is missing');
	await expect(label).toHaveStyle({
		paddingTop: `${Math.max(expectedOffset, 0)}px`,
		paddingBottom: `${Math.max(-expectedOffset, 0)}px`,
	});
};
const offsetRender: StoryObj<typeof CheckBox>['render'] = (args) => (
	<FlexBox direction="column" align="center" gap={24} padding={64}>
		<CheckBox {...args} label={longLabel} textTopOffset={0} style={{ width: 240 }} />
		<CheckBox {...args} label={longLabel} style={{ width: 240 }} />
	</FlexBox>
);
export const TextOffsetTopPositive: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { align: 'top', textTopOffset: 4 },
	render: offsetRender,
	play: offsetPlay,
};
export const TextOffsetTopNegative: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { align: 'top', textTopOffset: -4 },
	render: offsetRender,
	play: offsetPlay,
};
export const TextOffsetMiddlePositive: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { align: 'middle', textTopOffset: 4 },
	render: offsetRender,
	play: offsetPlay,
};
export const TextOffsetMiddleNegative: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { align: 'middle', textTopOffset: -4 },
	render: offsetRender,
	play: offsetPlay,
};
export const TextOffsetBottomPositive: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { align: 'bottom', textTopOffset: 4 },
	render: offsetRender,
	play: offsetPlay,
};
export const TextOffsetBottomNegative: StoryObj<typeof CheckBox> = {
	tags: ['tests'],
	args: { align: 'bottom', textTopOffset: -4 },
	render: offsetRender,
	play: offsetPlay,
};
