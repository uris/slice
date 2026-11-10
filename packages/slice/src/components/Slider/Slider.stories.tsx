import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FlexBox } from 'src/components/FlexBox/FlexBox';
import { Slider } from 'src/components/Slider/Slider';
import {
	runSliderCollapsedRangePlay,
	runSliderDisabledPlay,
	runSliderEdgeDragPlay,
	runSliderKeyboardPlay,
	runSliderPlay,
	runSliderWithoutHandlersPlay,
} from 'src/components/playHelpers';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';

const meta: Meta<typeof Slider> = {
	title: 'Components/Slider',
	component: Slider,
	argTypes: {
		value: { control: 'number' },
		defaultValue: { control: 'number' },
		min: { control: 'number' },
		max: { control: 'number' },
		step: { control: 'number', description: 'Keyboard increment only; pointer dragging stays continuous.' },
		disabled: { control: 'boolean' },
		trackHeadBorderRadius: { control: 'text' },
		trackHeadBorderWidth: { control: 'number' },
		trackHeadOnHover: { control: 'select', options: [undefined, true] },
		trackHeadColor: { type: 'string', control: 'text' },
		progressColor: { type: 'string', control: 'text' },
		trackColor: { type: 'string', control: 'text' },
	},
	args: {
		'aria-label': 'Value',
		defaultValue: 50,
		min: 0,
		max: 100,
		width: 100,
		height: 2,
		touchHeight: 24,
		trackHeadSize: 12,
		trackHeadBorderWidth: 1,
		trackHeadBorderColor: 'var(--core-outline-secondary)',
		cursor: 'grabbing',
		trackHeadColor: 'var(--core-text-light)',
		progressColor: 'var(--core-text-tertiary)',
		trackColor: 'var(--core-surface-secondary)',
		onChange: fn(),
		onChangeEnd: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof Slider> = {
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<Slider {...args} />
			</FlexBox>
		);
	},
};

export const WithTestingActions: StoryObj<typeof Slider> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<Slider {...args} />
			</FlexBox>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runSliderPlay({ canvasElement, args });
	},
};

export const WithoutHandlers: StoryObj<typeof Slider> = {
	tags: ['tests'],
	args: { onChange: undefined, onChangeEnd: undefined },
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		await runSliderWithoutHandlersPlay({ canvasElement });
	},
};

export const CustomClassName: StoryObj<typeof Slider> = {
	tags: ['tests'],
	args: { className: 'slider-custom-class' },
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexBox>
	),
	play: async ({ canvasElement, args }) => {
		await runSliderPlay({ canvasElement, args });
	},
};

export const KeyboardControls: StoryObj<typeof Slider> = {
	tags: ['tests'],
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexBox>
	),
	play: async ({ canvasElement, args }) => {
		await runSliderKeyboardPlay({ canvasElement, args });
	},
};

export const Disabled: StoryObj<typeof Slider> = {
	tags: ['tests'],
	args: { disabled: true },
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexBox>
	),
	play: async ({ canvasElement, args }) => {
		await runSliderDisabledPlay({ canvasElement, args });
	},
};

export const DragBeyondBounds: StoryObj<typeof Slider> = {
	tags: ['tests'],
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexBox>
	),
	play: async ({ canvasElement, args }) => {
		await runSliderEdgeDragPlay({ canvasElement, args });
	},
};

export const CollapsedRange: StoryObj<typeof Slider> = {
	tags: ['tests'],
	args: { min: 50, max: 50, value: 50 },
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexBox>
	),
	play: async ({ canvasElement, args }) => {
		await runSliderCollapsedRangePlay({ canvasElement, args });
	},
};

export const NullableColorAndSizeDefaults: StoryObj<typeof Slider> = {
	tags: ['tests'],
	args: {
		// null (not undefined) bypasses the props' destructuring defaults,
		// exercising the `?? fallback` branches inside cssVars/trackHeadColor
		trackHeadColor: null as unknown as string,
		progressColor: null as unknown as string,
		trackColor: null as unknown as string,
		trackHeadSize: null as unknown as number,
	},
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexBox>
	),
	play: async ({ canvasElement, args }) => {
		await runSliderPlay({ canvasElement, args });
	},
};

export const AutoWidthAndZeroHeight: StoryObj<typeof Slider> = {
	tags: ['tests'],
	args: { width: 'auto', height: 0 },
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<Slider {...args} />
		</FlexBox>
	),
	play: async ({ canvasElement, args }) => {
		await runSliderPlay({ canvasElement, args });
	},
};

export const HeadOnHover: StoryObj<typeof Slider> = {
	args: { trackHeadOnHover: true, width: 240 },
	render: Default.render,
};
export const HiddenHead: StoryObj<typeof Slider> = {
	args: { trackHeadOnHover: true, trackHeadSize: 0, width: 240 },
	render: Default.render,
};

const liveChanged = fn();
const committed = fn();
const lockedChanged = fn();
const canceledChanged = fn();
const disabledChanged = fn();
export const NativeSemantics: StoryObj<typeof Slider> = {
	tags: ['tests'],
	render: () => {
		const [controlled, setControlled] = useState(25);
		const [initial, setInitial] = useState(25);
		return (
			<form style={{ display: 'grid', gap: 20 }}>
				<Slider
					aria-label="Continuous"
					defaultValue={initial}
					step={10}
					width={240}
					onChange={liveChanged}
					onChangeEnd={committed}
				/>
				<Slider aria-label="Controlled" value={controlled} onChange={setControlled} />
				<Slider aria-label="Locked" value={25} onChange={lockedChanged} />
				<Slider
					aria-label="Canceled"
					onKeyDown={(event) => event.preventDefault()}
					onPointerDown={(event) => event.preventDefault()}
					onChange={canceledChanged}
				/>
				<Slider aria-label="Disabled" name="disabled-value" disabled defaultValue={40} onChange={disabledChanged} />
				<label htmlFor="named-slider">Volume</label>
				<Slider id="named-slider" name="volume" defaultValue={0.5} min={0} max={1} />
				<button
					type="button"
					onClick={() => {
						setControlled(80);
						setInitial(90);
					}}
				>
					Update props
				</button>
			</form>
		);
	},
	play: async ({ canvasElement }) => {
		for (const callback of [liveChanged, committed, lockedChanged, canceledChanged, disabledChanged])
			callback.mockClear();
		const c = within(canvasElement);
		const slider = c.getByRole('slider', { name: 'Continuous' }) as HTMLInputElement;
		await expect(slider).toHaveAttribute('step', 'any');
		fireEvent.pointerDown(slider, { pointerId: 1, button: 0, isPrimary: true });
		fireEvent.input(slider, { target: { value: '37.25' } });
		await expect(slider).toHaveValue('37.25');
		await expect(liveChanged).toHaveBeenLastCalledWith(37.25, 0.3725);
		await expect(committed).not.toHaveBeenCalled();
		fireEvent.pointerUp(slider, { pointerId: 1 });
		await expect(committed).toHaveBeenCalledTimes(1);
		await expect(committed).toHaveBeenLastCalledWith(37.25, 0.3725);
		slider.focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect(slider).toHaveValue('47.25');
		await userEvent.keyboard('{PageUp}');
		await expect(slider).toHaveValue('57.25');
		await expect(committed).toHaveBeenCalledTimes(3);
		await userEvent.click(c.getByRole('button', { name: 'Update props' }));
		await expect(slider).toHaveValue('57.25');
		await expect(c.getByRole('slider', { name: 'Controlled' })).toHaveValue('80');
		const locked = c.getByRole('slider', { name: 'Locked' });
		fireEvent.input(locked, { target: { value: '60' } });
		await expect(locked).toHaveValue('25');
		await expect(lockedChanged).toHaveBeenLastCalledWith(60, 0.6);
		const canceled = c.getByRole('slider', { name: 'Canceled' });
		canceled.focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect(canceled).toHaveValue('50');
		await expect(canceledChanged).not.toHaveBeenCalled();
		const disabled = c.getByRole('slider', { name: 'Disabled' });
		await expect(disabled).toBeDisabled();
		await expect(disabled).toHaveAttribute('tabindex', '-1');
		await expect(disabled).toHaveAttribute('aria-disabled', 'true');
		fireEvent.input(disabled, { target: { value: '80' } });
		await expect(disabledChanged).not.toHaveBeenCalled();
		const named = c.getByRole('slider', { name: 'Volume' }) as HTMLInputElement;
		await expect(named).toHaveAttribute('name', 'volume');
		if (!named.form) throw new Error('Slider form is missing');
		const data = new FormData(named.form);
		await expect(data.get('volume')).toBe('0.5');
		await expect(data.has('disabled-value')).toBe(false);
	},
};

export const PointerAndCommit: StoryObj<typeof Slider> = {
	render: () => {
		const [value, setValue] = useState(25);
		const [lastCommit, setCommit] = useState<number | null>(null);
		return (
			<div style={{ display: 'grid', gap: 16 }}>
				<Slider
					aria-label="Pointer value"
					width={300}
					value={value}
					step={10}
					trackHeadSize={16}
					trackHeadOnHover
					onChange={setValue}
					onChangeEnd={setCommit}
				/>
				<output data-testid="slider-value">{value}</output>
				<output data-testid="slider-commit">{lastCommit ?? 'none'}</output>
			</div>
		);
	},
};
const canceledCommit = fn();
export const Cancellation: StoryObj<typeof Slider> = {
	tags: ['tests'],
	render: () => {
		const [disabled, setDisabled] = useState(false);
		return (
			<div>
				<Slider aria-label="Cancelable" disabled={disabled} onChangeEnd={canceledCommit} />
				<button type="button" onClick={() => setDisabled(true)}>
					Disable slider
				</button>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		canceledCommit.mockClear();
		const c = within(canvasElement);
		const slider = c.getByRole('slider', { name: 'Cancelable' });
		fireEvent.pointerDown(slider, { pointerId: 1, button: 0, isPrimary: true });
		fireEvent.input(slider, { target: { value: '40' } });
		fireEvent.pointerCancel(slider, { pointerId: 1 });
		await expect(canceledCommit).not.toHaveBeenCalled();
		fireEvent.pointerDown(slider, { pointerId: 2, button: 0, isPrimary: true });
		fireEvent.input(slider, { target: { value: '50' } });
		await userEvent.click(c.getByRole('button', { name: 'Disable slider' }));
		fireEvent.pointerUp(slider, { pointerId: 2 });
		await expect(canceledCommit).not.toHaveBeenCalled();
	},
};
