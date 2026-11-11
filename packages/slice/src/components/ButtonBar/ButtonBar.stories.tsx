import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { FlexBox, Preset } from '../FlexBox';
import { PopMenu } from '../PopMenu';
import { TextField } from '../Textfield';
import { ButtonBar } from './ButtonBar';

const meta = {
	title: 'Components/ButtonBar',
	component: ButtonBar,
	args: {
		'aria-label': 'Document actions',
		buttons: [{ label: 'Edit' }, { label: 'Duplicate' }, { label: 'Archive' }],
	},
	argTypes: {
		orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
		buttonSize: { control: 'select', options: ['s', 'm', 'l', 'xl', 'auto'] },
		borderRadius: { control: 'number' },
		borderWidth: { control: 'number' },
		inset: { control: { type: 'number', min: 0, step: 1 } },
		dividerOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
		hoverTint: { control: { type: 'range', min: 0, max: 100, step: 1 } },
		backgroundColor: { control: 'text' },
		backgroundColorHover: { control: 'text' },
		textColor: { control: 'text' },
		textColorHover: { control: 'text' },
		iconColor: { control: 'text' },
		iconColorHover: { control: 'text' },
	},
	decorators: [
		(Story) => (
			<div style={{ padding: 'var(--spacing-xl)' }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof ButtonBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
	args: { buttons: undefined },
	render: (args) => (
		<div style={{ display: 'grid', justifyItems: 'start', gap: 'var(--spacing-l)' }}>
			{(['s', 'm', 'l', 'xl'] as const).map((size) => (
				<div key={size} style={{ display: 'grid', justifyItems: 'start', gap: 'var(--spacing-s)' }}>
					<span>{size.toUpperCase()}</span>
					<ButtonBar {...args} buttonSize={size} aria-label={`${size} document actions`}>
						<Button label="Edit" iconLeft="editor.edit" />
						<Button>composed</Button>
						<Button label="Options" iconRight="arrows.chevron-down" />
						<Button iconLeft="basic.more-horiz-fill" iconFill aria-label="More actions" />
					</ButtonBar>
					<ButtonBar {...args} buttonSize={size} aria-label={`${size} increase or decrease`}>
						<Button iconLeft="basic.plus" aria-label="Increase" />
						<Button iconLeft="basic.minus" aria-label="Decrease" />
					</ButtonBar>
				</div>
			))}
		</div>
	),
};

export const ButtonDefaults: Story = {
	args: { buttons: undefined },
	render: function ButtonDefaultsStory(args) {
		const [caller, setCaller] = useState<HTMLButtonElement>();
		const [selectedAction, setSelectedAction] = useState('');
		return (
			<div style={{ display: 'grid', justifyItems: 'start', gap: 'var(--spacing-m)' }}>
				<Button label="Standalone outline button" />
				<Button round iconLeft="arrows.chevron-down" aria-label="More actions" />
				<ButtonBar {...args} aria-label="Default button styles">
					<Button label="Label" />
					<Button label="With icon" iconLeft="basic.home" iconSize={20} />
					<Button>composed</Button>
					<Button
						label="Icon right"
						iconRight="arrows.chevron-down"
						aria-haspopup="menu"
						aria-expanded={Boolean(caller)}
						onClick={(event) => {
							if (event) setCaller(caller ? undefined : event.currentTarget);
						}}
					/>
					<Button label="Working" working />
					<Button round iconLeft="basic.more-horiz-fill" iconFill aria-label="More actions" />
				</ButtonBar>
				<ButtonBar {...args} buttonSize={24} iconSize={14} aria-label="Increase or decrease">
					<Button iconLeft="basic.plus" aria-label="Increase" />
					<Button iconLeft="basic.minus" aria-label="Decrease" />
				</ButtonBar>
				{caller && (
					<PopMenu
						caller={caller}
						offset="bottom"
						gap={8}
						minWidth={160}
						options={[{ label: 'Edit' }, { label: 'Duplicate' }, { label: 'Archive' }]}
						onClickItem={(_, item) => setSelectedAction(item.label ?? '')}
						onDismiss={() => setCaller(undefined)}
					/>
				)}
				{selectedAction && <output aria-live="polite">Selected: {selectedAction}</output>}
			</div>
		);
	},
};

export const UniformColors: Story = {
	args: {
		buttons: undefined,
		backgroundColor: '#e0e7ff',
		backgroundColorHover: '#c7d2fe',
		textColor: '#312e81',
		textColorHover: '#4338ca',
		borderColor: '#818cf8',
		dividerColor: '#818cf8',
	},
	render: (args) => (
		<ButtonBar {...args}>
			<Button label="Edit" backgroundColor="#fee2e2" borderRadius={100} />
			<Button label="Duplicate" backgroundColor="#dcfce7" buttonSize="s" />
			<Button label="Archive" backgroundColor="#fef3c7" />
		</ButtonBar>
	),
};

export const IndividualColors: Story = {
	args: {
		borderRadius: 1000,
		buttons: [
			{ label: 'Edit', backgroundColor: '#dbeafe', backgroundColorHover: '#bfdbfe', textColor: '#1e3a8a' },
			{ label: 'Duplicate', backgroundColor: '#dcfce7', backgroundColorHover: '#bbf7d0', textColor: '#14532d' },
			{ label: 'Archive', backgroundColor: '#fef3c7', backgroundColorHover: '#fde68a', textColor: '#78350f' },
		],
	},
};

export const Vertical: Story = {
	args: {
		...IndividualColors.args,
		orientation: 'vertical',
		borderRadius: undefined,
		width: '220px',
		dividerWidth: 2,
	},
};

export const ComposedEvents: Story = {
	args: { buttons: undefined },
	render: function ComposedEventsStory(args) {
		const [childClicks, setChildClicks] = useState(0);
		const [barClicks, setBarClicks] = useState(0);
		return (
			<div style={{ display: 'grid', justifyItems: 'start', gap: 'var(--spacing-m)' }}>
				<ButtonBar {...args} onClick={() => setBarClicks((count) => count + 1)}>
					<Button label="Child + bar callback" onClick={() => setChildClicks((count) => count + 1)} />
					<Button label="Bar callback" />
					<span>This non-Button child is ignored.</span>
				</ButtonBar>
				<output aria-live="polite">
					Child callbacks: {childClicks}; bar callbacks: {barClicks}
				</output>
			</div>
		);
	},
};

export const Composition: Story = {
	tags: ['tests'],
	args: { buttons: [{ label: 'From props' }] },
	render: (args) => (
		<ButtonBar {...args}>
			<Button>From children</Button>
			<span>Ignored</span>
			{false}
			{null}
		</ButtonBar>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getAllByRole('button').map((button) => button.textContent)).toEqual([
			'From props',
			'From children',
		]);
		await expect(canvas.queryByText('Ignored')).not.toBeInTheDocument();
	},
};

export const ParentPrecedence: Story = {
	tags: ['tests'],
	args: {
		buttons: undefined,
		backgroundColor: '#123456',
		borderRadius: 12,
		borderWidth: 2,
		buttonSize: 'l',
		padding: 8,
	},
	render: (args) => (
		<ButtonBar {...args}>
			<Button label="Override" backgroundColor="#ffffff" buttonSize="s" borderRadius={99} borderWidth={5} />
		</ButtonBar>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('group')).toHaveStyle({ borderRadius: '12px', borderWidth: '2px' });
		await expect(canvas.getByRole('button')).toHaveStyle({
			backgroundColor: 'rgb(18, 52, 86)',
			borderRadius: '0px',
			borderWidth: '0px',
			height: '44px',
			padding: '8px',
		});
	},
};

export const ChildColors: Story = {
	tags: ['tests'],
	args: {
		buttons: [
			{ label: 'Red', backgroundColor: '#ff0000' },
			{ label: 'Blue', backgroundColor: '#0000ff' },
		],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button', { name: 'Red' })).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
		await expect(canvas.getByRole('button', { name: 'Blue' })).toHaveStyle({ backgroundColor: 'rgb(0, 0, 255)' });
	},
};

export const EventForwarding: Story = {
	tags: ['tests'],
	args: { buttons: undefined, onClick: fn(), onFocus: fn(), onToolTip: fn() },
	render: (args) => (
		<ButtonBar {...args}>
			<Button label="Activate" tooltip="Action tooltip" onClick={fn()} />
		</ButtonBar>
	),
	play: async ({ canvasElement, args }) => {
		const button = within(canvasElement).getByRole('button');
		await userEvent.hover(button);
		await expect(args.onToolTip).toHaveBeenCalledWith(
			expect.objectContaining({ payload: { label: 'Action tooltip' } }),
		);
		await userEvent.click(button);
		await expect(args.onClick).toHaveBeenCalledTimes(1);
		await expect(args.onClick).toHaveBeenCalledWith(expect.objectContaining({ target: button }), {
			index: 0,
			label: 'Activate',
			id: undefined,
		});
		await expect(args.onFocus).toHaveBeenCalled();
		await expect(args.onToolTip).toHaveBeenCalledWith(null);
	},
};

export const ChildAndParentCallbacks: Story = {
	tags: ['tests'],
	args: { buttons: undefined },
	render: function CallbackOrder(args) {
		const [calls, setCalls] = useState<string[]>([]);
		return (
			<>
				<ButtonBar {...args} onClick={() => setCalls((calls) => [...calls, 'parent'])}>
					<Button label="Activate" onClick={() => setCalls((calls) => [...calls, 'child'])} />
				</ButtonBar>
				<output>{calls.join(', ')}</output>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button'));
		await expect(canvas.getByRole('status')).toHaveTextContent('child, parent');
	},
};

export const DisabledButtons: Story = {
	tags: ['tests'],
	args: { disabled: true, onClick: fn() },
	play: async ({ canvasElement, args }) => {
		for (const button of within(canvasElement).getAllByRole('button')) {
			await expect(button).toBeDisabled();
			await userEvent.click(button);
		}
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};

export const KeyboardActivation: Story = {
	tags: ['tests'],
	args: { buttons: [{ label: 'Keyboard action' }], onClick: fn() },
	play: async ({ canvasElement, args }) => {
		const button = within(canvasElement).getByRole('button');
		button.focus();
		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');
		await expect(args.onClick).toHaveBeenCalledTimes(2);
	},
};

export const HoverTint: Story = {
	tags: ['tests'],
	args: { buttons: [{ label: 'Tinted' }], backgroundColor: '#000000', hoverTint: 20 },
	play: async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button');
		await userEvent.hover(button);
		await waitFor(() => expect(button).toHaveStyle({ backgroundColor: 'rgb(51, 51, 51)' }));
		await userEvent.unhover(button);
		await waitFor(() => expect(button).toHaveStyle({ backgroundColor: 'rgb(0, 0, 0)' }));
	},
};

export const ExplicitHoverColor: Story = {
	tags: ['tests'],
	args: { buttons: [{ label: 'Explicit', backgroundColorHover: '#ff0000' }], backgroundColorHover: '#00ff00' },
	play: async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button');
		await userEvent.hover(button);
		await waitFor(() => expect(button).toHaveStyle({ backgroundColor: 'rgb(0, 255, 0)' }));
	},
};

export const VerticalLayout: Story = {
	tags: ['tests'],
	args: { orientation: 'vertical', dividerOpacity: 0.3, dividerWidth: 2, width: '220px' },
	play: async ({ canvasElement }) => {
		const group = within(canvasElement).getByRole('group');
		await expect(group).toHaveStyle({ flexDirection: 'column', width: '220px', overflow: 'hidden' });
		const dividers = group.querySelectorAll(':scope > span');
		await expect(dividers).toHaveLength(2);
		for (const divider of Array.from(dividers))
			await expect(divider).toHaveStyle({ opacity: '0.3', borderTopWidth: '2px', borderLeftWidth: '0px' });
		for (const button of within(group).getAllByRole('button')) await expect(button.style.width).toBe('100%');
	},
};

export const SizeDefaults: Story = {
	tags: ['tests'],
	args: { buttons: undefined },
	render: (args) => (
		<>
			{(['s', 'm', 'l', 'xl'] as const).map((size) => (
				<ButtonBar {...args} key={size} buttonSize={size} aria-label={size}>
					<Button label={size} />
				</ButtonBar>
			))}
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const [size, height, inset, radius] of [
			['s', 28, 4, 12],
			['m', 36, 4, 18],
			['l', 44, 6, 22],
			['xl', 56, 10, 28],
		] as const) {
			const group = canvas.getByRole('group', { name: size });
			await expect(within(group).getByRole('button')).toHaveStyle({ height: `${height}px` });
			await expect(group).toHaveStyle({ borderRadius: `${radius}px` });
			await expect(getComputedStyle(within(group).getByRole('button'), '::before').width).toBe(`${inset}px`);
		}
	},
};

export const ExplicitZeroPadding: Story = {
	tags: ['tests'],
	args: { buttonSize: 's', paddingTop: 0, paddingBottom: 0, inset: 0, divider: false, buttons: [{ label: 'Zero' }] },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button')).toHaveStyle({ paddingTop: '0px', paddingBottom: '0px', height: '24px' });
		await expect(canvas.getByRole('group').querySelectorAll(':scope > span')).toHaveLength(0);
	},
};

export const IconMinimum: Story = {
	tags: ['tests'],
	args: { buttons: [{ iconLeft: 'basic.plus', 'aria-label': 'Increase' }], iconSize: 10 },
	play: async ({ canvasElement }) => {
		const svg = within(canvasElement).getByRole('button').querySelector('svg');
		await expect(svg).toHaveAttribute('width', '14');
		await expect(svg?.querySelector('[stroke-width]')).toHaveAttribute('stroke-width', '1.5');
	},
};

export const LabelAlignment: Story = {
	tags: ['tests'],
	args: { buttons: undefined },
	render: (args) => (
		<ButtonBar {...args}>
			<Button label="Label" />
			<Button label="With icon" iconLeft="basic.home" />
			<Button>composed</Button>
		</ButtonBar>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const tops = ['Label', 'With icon', 'composed'].map((label) => canvas.getByText(label).getBoundingClientRect().top);
		await expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(0.5);
	},
};

export const IconCentering: Story = {
	tags: ['tests'],
	args: { buttons: undefined, inset: 0 },
	render: (args) => (
		<>
			{(['horizontal', 'vertical'] as const).map((orientation) => (
				<ButtonBar {...args} key={orientation} orientation={orientation} aria-label={orientation}>
					<Button iconLeft="basic.plus" aria-label="Increase" />
					<Button iconRight="basic.minus" aria-label="Decrease" />
				</ButtonBar>
			))}
		</>
	),
	play: async ({ canvasElement }) => {
		for (const button of within(canvasElement).getAllByRole('button')) {
			const frame = button.getBoundingClientRect();
			const svg = button.querySelector('svg');
			if (!svg) throw new Error('Expected an icon in the button');
			const icon = svg.getBoundingClientRect();
			await expect(Math.abs((frame.left + frame.right) / 2 - (icon.left + icon.right) / 2)).toBeLessThan(0.5);
		}
	},
};

export const StrokeOverride: Story = {
	tags: ['tests'],
	args: { buttons: [{ iconLeft: 'basic.plus', 'aria-label': 'Increase' }], iconSize: 14, iconStrokeWidth: 2 },
	play: async ({ canvasElement }) => {
		const path = within(canvasElement).getByRole('button').querySelector('[stroke-width]');
		await expect(path).toHaveAttribute('stroke-width', '2');
	},
};

export const MenuInteraction: Story = {
	...ButtonDefaults,
	tags: ['tests'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Icon right' });
		await userEvent.click(trigger);
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		const page = within(canvasElement.ownerDocument.body);
		const item = await page.findByRole('menuitem', { name: 'Duplicate' });
		await waitFor(() => expect(item.closest('[role="menu"]')).not.toHaveAttribute('inert'));
		await userEvent.click(item);
		await expect(canvas.getByRole('status')).toHaveTextContent('Selected: Duplicate');
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	},
};

export const WithInput: Story = {
	args: { buttons: undefined },
	render: (args) => (
		<FlexBox preset={Preset.FillCenterMiddle}>
			<FlexBox preset={Preset.ButtonBar}>
				<ButtonBar {...args} aria-label="Zoom">
					<Button iconLeft="basic.plus" aria-label="Increase" />
					<Button iconLeft="basic.minus" aria-label="Decrease" />
				</ButtonBar>
				<TextField inputName="Find" placeholder="Find" iconLeft={{ name: 'basic.search' }} />
			</FlexBox>
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox', { name: 'Find' });
		const field = input.closest('[data-variant]');
		const row = field?.parentElement?.parentElement;
		if (!field || !row) throw new Error('Expected the field and grouped bar');
		const bounds = field.getBoundingClientRect();
		const container = row.getBoundingClientRect();
		expect(bounds.width).toBeGreaterThan(100);
		expect(bounds.right).toBeLessThanOrEqual(container.right + 1);
		expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 1);
		const bar = within(canvasElement).getByRole('group', { name: 'Zoom' });
		for (const button of within(bar).getAllByRole('button')) {
			expect(button.getBoundingClientRect().right).toBeLessThanOrEqual(bar.getBoundingClientRect().right);
		}
	},
};

export const WithInputNarrow: Story = {
	...WithInput,
	tags: ['tests'],
	decorators: [
		(Story) => (
			<div style={{ width: 320 }}>
				<Story />
			</div>
		),
	],
};

export const WithMaxContentInput: Story = {
	...WithInput,
	tags: ['tests'],
	render: (args) => (
		<FlexBox preset={Preset.ButtonBar}>
			<ButtonBar {...args} aria-label="Zoom">
				<Button iconLeft="basic.plus" aria-label="Increase" />
				<Button iconLeft="basic.minus" aria-label="Decrease" />
			</ButtonBar>
			<TextField inputName="Find" placeholder="Find" width="max-content" iconLeft={{ name: 'basic.search' }} />
		</FlexBox>
	),
};

export const InputComposition: Story = {
	args: { buttons: undefined },
	render: function InputCompositionStory(args) {
		const [value, setValue] = useState('100');
		const [lastChange, setLastChange] = useState('');
		const [lastButton, setLastButton] = useState('');
		const adjust = (amount: number) => setValue(String((Number(value) || 0) + amount));
		return (
			<div style={{ display: 'grid', justifyItems: 'start', gap: 'var(--spacing-m)' }}>
				<ButtonBar
					{...args}
					aria-label="Adjust quantity"
					onChange={(value, item) =>
						setLastChange(`${value} (index ${item.index}, label ${item.label}, id ${item.id})`)
					}
					onClick={(_, item) => setLastButton(`${item.label} (index ${item.index}, id ${item.id})`)}
				>
					<Button round id="increase" iconLeft="basic.plus" aria-label="Increase" onClick={() => adjust(1)} />
					<TextField
						inputName="Quantity"
						inputId="quantity"
						value={value}
						onChange={setValue}
						width={120}
						inputAttributes={{ inputMode: 'numeric' }}
						textAlign="center"
					/>
					<Button round id="decrease" iconLeft="basic.minus" aria-label="Decrease" onClick={() => adjust(-1)} />
				</ButtonBar>
				<output aria-live="polite">
					Last field change: {lastChange || '—'}; last button: {lastButton || '—'}
				</output>
			</div>
		);
	},
};

export const InputAtEdges: Story = {
	args: { buttons: undefined },
	render: (args) => (
		<div style={{ display: 'grid', justifyItems: 'start', gap: 'var(--spacing-m)' }}>
			<ButtonBar {...args} aria-label="Search actions">
				<TextField inputName="Search first" placeholder="Find" width={120} />
				<Button iconLeft="basic.plus" aria-label="Add" />
			</ButtonBar>
			<ButtonBar {...args} aria-label="Search actions with trailing input">
				<Button iconLeft="basic.plus" aria-label="Add" />
				<TextField inputName="Search last" placeholder="Find" width={120} />
			</ButtonBar>
			<ButtonBar {...args} aria-label="Search input">
				<TextField inputName="Search only" defaultValue="Search text" width={120} />
			</ButtonBar>
		</div>
	),
};

export const MultipleInputEvents: Story = {
	tags: ['tests'],
	args: { buttons: [{ id: 'apply', label: 'Apply' }], onChange: fn(), onClick: fn() },
	render: (args) => (
		<ButtonBar {...args}>
			<span>Ignored</span>
			<TextField inputId="width" inputName="Width" width={80} defaultValue="" />
			<TextField inputId="height" label="Height" width={100} defaultValue="" />
			<Button id="reset" aria-label="Reset" iconLeft="basic.minus" />
		</ButtonBar>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.type(canvas.getByRole('textbox', { name: 'Width' }), '12');
		await expect(args.onChange).toHaveBeenLastCalledWith('12', { index: 1, label: 'Width', id: 'width' });
		await userEvent.type(canvas.getByRole('textbox', { name: 'Height' }), '9');
		await expect(args.onChange).toHaveBeenLastCalledWith('9', { index: 2, label: 'Height', id: 'height' });
		await expect(args.onClick).not.toHaveBeenCalled();
		await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
		await expect(args.onClick).toHaveBeenLastCalledWith(expect.anything(), { index: 3, label: 'Reset', id: 'reset' });
		await expect(args.onChange).toHaveBeenCalledTimes(3);
	},
};

export const InputCallbackOrder: Story = {
	tags: ['tests'],
	args: { buttons: undefined },
	render: function InputOrder(args) {
		const [calls, setCalls] = useState<string[]>([]);
		return (
			<>
				<ButtonBar
					{...args}
					onChange={(value, item) => setCalls((calls) => [...calls, `parent:${item.index}:${value}`])}
				>
					<TextField
						inputName="Value"
						width={120}
						onChange={(value) => setCalls((calls) => [...calls, `child:${value}`])}
					/>
				</ButtonBar>
				<output>{calls.join(', ')}</output>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(canvas.getByRole('textbox'), '7');
		await expect(canvas.getByRole('status')).toHaveTextContent('child:7, parent:0:7');
	},
};

export const InputLayoutContract: Story = {
	tags: ['tests'],
	args: { buttons: undefined, buttonSize: 'l', padding: 2 },
	render: (args) => (
		<ButtonBar {...args}>
			<TextField
				inputName="First"
				width={120}
				height={90}
				variant="stacked"
				behavior="appear"
				label="First"
				padding={12}
			/>
			<TextField inputName="Second" width={160} height={90} variant="outlined" label="Second" />
		</ButtonBar>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const [name, width, padding] of [
			['First', 120, '12px'],
			['Second', 160, '8px 16px'],
		] as const) {
			const input = canvas.getByRole('textbox', { name });
			const frame = input.closest<HTMLElement>('[data-variant]');
			if (!frame?.parentElement) throw new Error('Missing field frame');
			await expect(frame).toHaveAttribute('data-variant', 'simple');
			await expect(frame).not.toHaveAttribute('data-appear');
			await expect(frame).toHaveStyle({ height: '44px', borderWidth: '0px', borderRadius: '0px', padding });
			await expect(frame.parentElement.getBoundingClientRect().width).toBe(width);
		}
		const bar = canvas.getByRole('group');
		await expect(bar.getBoundingClientRect().width).toBeGreaterThanOrEqual(282);
	},
};

export const InputFocusBorder: Story = {
	tags: ['tests'],
	args: { buttons: undefined, borderColor: '#123456', borderColorFocused: '#abcdef' },
	render: (args) => (
		<>
			<ButtonBar {...args}>
				<TextField inputName="Value" width={120} />
			</ButtonBar>
			<button type="button">Outside</button>
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const bar = canvas.getByRole('group');
		const input = canvas.getByRole('textbox');
		await expect(bar).toHaveStyle({ borderColor: 'rgb(18, 52, 86)' });
		await userEvent.click(input);
		await waitFor(() => expect(bar).toHaveStyle({ borderColor: 'rgb(171, 205, 239)' }));
		const slot = input.closest('[data-variant]')?.parentElement?.parentElement;
		await expect(slot).toHaveStyle({ outlineStyle: 'none' });
		await userEvent.click(canvas.getByRole('button', { name: 'Outside' }));
		await waitFor(() => expect(bar).toHaveStyle({ borderColor: 'rgb(18, 52, 86)' }));
	},
};

export const InputDisabledAndClear: Story = {
	tags: ['tests'],
	args: { buttons: undefined, onChange: fn() },
	render: (args) => (
		<ButtonBar {...args}>
			<TextField inputName="Locked" inputId="locked" width={100} disabled defaultValue="Locked" />
			<TextField inputName="Editable" inputId="editable" width={120} defaultValue="Text" clearButton={{ size: 20 }} />
		</ButtonBar>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('textbox', { name: 'Locked' })).toBeDisabled();
		await userEvent.click(canvas.getByRole('textbox', { name: 'Editable' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Clear text' }));
		await expect(args.onChange).toHaveBeenCalledTimes(1);
		await expect(args.onChange).toHaveBeenCalledWith('', { index: 1, label: 'Editable', id: 'editable' });
	},
};

export const InputSizesAndOrientation: Story = {
	tags: ['tests'],
	args: { buttons: undefined },
	render: (args) => (
		<>
			{(['horizontal', 'vertical'] as const).flatMap((orientation) =>
				(['s', 'm', 'l', 'xl'] as const).map((size) => (
					<ButtonBar
						{...args}
						key={`${orientation}-${size}`}
						orientation={orientation}
						buttonSize={size}
						aria-label={`${orientation}-${size}`}
					>
						<TextField inputName={`${orientation}-${size}`} width={120} />
						<Button label="Apply" />
					</ButtonBar>
				)),
			)}
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const orientation of ['horizontal', 'vertical']) {
			for (const [size, height] of [
				['s', 28],
				['m', 36],
				['l', 44],
				['xl', 56],
			] as const) {
				const bar = canvas.getByRole('group', { name: `${orientation}-${size}` });
				const field = within(bar).getByRole('textbox').closest('[data-variant]');
				await expect(field).toHaveStyle({ height: `${height}px` });
				await expect(within(bar).getByRole('button')).toHaveStyle({ height: `${height}px` });
			}
		}
	},
};
