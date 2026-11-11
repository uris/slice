import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { useToolTip } from '../../hooks/useToolTip/useToolTip';
import { Button } from '../Button';
import type { ToolTip } from '../sharedTypes';
import { Tip } from './Tip';

const meta = {
	title: 'Components/Tip',
	component: Tip,
	args: {
		tip: { payload: { label: 'Your changes are saved automatically.' } },
		coords: { x: 24, y: 80 },
		showDelay: 0,
		hideDelay: 60000,
	},
} satisfies Meta<typeof Tip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Demo: Story = {};
function InteractiveTip() {
	const [tip, setTip] = useState<ToolTip | null>(null);
	const ref = useRef<HTMLDivElement>(null);
	const coords = useToolTip(tip, ref);
	return (
		<>
			<Button
				label="Project details"
				tooltip="Saved automatically"
				onToolTip={setTip}
				aria-describedby="existing-description"
			/>
			<span id="existing-description">Project settings</span>
			<Tip ref={ref} tip={tip} coords={coords} showDelay={20} hideDelay={60000} />
		</>
	);
}
export const KeyboardAndAssociation: Story = {
	tags: ['tests'],
	render: () => <InteractiveTip />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Project details' });
		trigger.focus();
		const tip = await canvas.findByRole('tooltip');
		await waitFor(() => expect(trigger.getAttribute('aria-describedby')).toContain(tip.id));
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(tip).not.toBeVisible());
		await expect(trigger).toHaveAttribute('aria-describedby', 'existing-description');
		await expect(trigger).toHaveFocus();
		await expect(tip).toBeInTheDocument();
	},
};
export const ClickCancelsPending: Story = {
	tags: ['tests'],
	args: { showDelay: 100 },
	play: async ({ canvasElement }) => {
		const tip = within(canvasElement).getByRole('tooltip', { hidden: true });
		await userEvent.click(canvasElement);
		await new Promise((resolve) => setTimeout(resolve, 150));
		await expect(tip).not.toBeVisible();
	},
};
export const CoordinatesAtOrigin: Story = {
	tags: ['tests'],
	args: { coords: { x: 0, y: 0 } },
	play: async ({ canvasElement }) => {
		const tip = await within(canvasElement).findByRole('tooltip');
		await expect(tip.style.left).toBe('0px');
		await expect(tip.style.top).toBe('0px');
	},
};
export const PayloadDuration: Story = {
	tags: ['tests'],
	args: { tip: { payload: { label: 'Brief hint', duration: 120 } }, hideDelay: 60000 },
	play: async ({ canvasElement }) => {
		const tip = await within(canvasElement).findByRole('tooltip');
		await waitFor(() => expect(tip).not.toBeVisible());
		await expect(tip).toBeInTheDocument();
	},
};
export const Styles: Story = {
	tags: ['tests'],
	args: {
		textColor: '#123456',
		backgroundColor: '#ffffff',
		border: false,
		borderRadius: 12,
		padding: 0,
		className: 'custom-tip',
	},
	play: async ({ canvasElement }) => {
		const tip = await within(canvasElement).findByRole('tooltip');
		await expect(tip).toHaveClass('custom-tip');
		const style = getComputedStyle(tip);
		await expect(style.color).toBe('rgb(18, 52, 86)');
		await expect(style.padding).toBe('0px');
		await expect(style.borderRadius).toBe('12px');
		await expect(style.borderTopWidth).toBe('0px');
	},
};
export const ReducedMotion: Story = {
	tags: ['tests'],
	args: {
		transition: { duration: 10, delay: 10 },
		motionValues: { animate: { y: 100, transition: { duration: 10 } } },
	},
	beforeEach: () => {
		const original = window.matchMedia.bind(window);
		const mock = spyOn(window, 'matchMedia').mockImplementation((query) => {
			const result = original(query);
			if (query === '(prefers-reduced-motion: reduce)') Object.defineProperty(result, 'matches', { value: true });
			return result;
		});
		return () => mock.mockRestore();
	},
	play: async ({ canvasElement }) => {
		const tip = await within(canvasElement).findByRole('tooltip');
		await waitFor(() => expect(getComputedStyle(tip).opacity).toBe('1'), { timeout: 500 });
		await expect(getComputedStyle(tip).transform).toBe('none');
		await userEvent.click(canvasElement);
		await expect(tip).not.toBeVisible();
	},
};
function ReplayTip() {
	const [tip, setTip] = useState<ToolTip | null>(null);
	return (
		<>
			<button type="button" onClick={() => setTip({ payload: { label: 'Replay hint' } })}>
				Show tip
			</button>
			<Tip
				tip={tip}
				coords={{ x: 24, y: 80 }}
				showDelay={0}
				hideDelay={60000}
				transition={{ duration: 0.15 }}
				onMouseEnter={fn()}
			/>
		</>
	);
}
export const RepeatedReveal: Story = {
	tags: ['tests'],
	render: () => <ReplayTip />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Show tip' });
		await userEvent.click(trigger);
		const tip = await canvas.findByRole('tooltip');
		await waitFor(() => expect(getComputedStyle(tip).opacity).toBe('1'));
		await userEvent.keyboard('{Escape}');
		await expect(tip).not.toBeVisible();
		await userEvent.click(trigger);
		await waitFor(() => expect(tip).toBeVisible());
		await waitFor(() => expect(getComputedStyle(tip).opacity).toBe('1'));
	},
};

let setReducedPreference: ((value: boolean) => void) | undefined;
export const LiveReducedMotion: Story = {
	tags: ['tests'],
	args: { transition: { duration: 10, delay: 10 }, motionValues: { animate: { y: 100, transition: { delay: 10 } } } },
	beforeEach: () => {
		const original = window.matchMedia.bind(window);
		let matches = false;
		const listeners = new Set<EventListener>();
		const query = {
			get matches() {
				return matches;
			},
			media: '(prefers-reduced-motion: reduce)',
			onchange: null,
			addEventListener: (_type: string, listener: EventListener) => listeners.add(listener),
			removeEventListener: (_type: string, listener: EventListener) => listeners.delete(listener),
			addListener: () => {},
			removeListener: () => {},
			dispatchEvent: () => true,
		} as MediaQueryList;
		const mock = spyOn(window, 'matchMedia').mockImplementation((value) =>
			value === query.media ? query : original(value),
		);
		setReducedPreference = (value) => {
			matches = value;
			for (const listener of listeners) listener(new Event('change'));
		};
		return () => {
			setReducedPreference = undefined;
			mock.mockRestore();
		};
	},
	play: async ({ canvasElement }) => {
		const tip = await within(canvasElement).findByRole('tooltip');
		await expect(getComputedStyle(tip).opacity).toBe('0');
		setReducedPreference?.(true);
		await waitFor(() => expect(getComputedStyle(tip).opacity).toBe('1'), { timeout: 500 });
		await expect(getComputedStyle(tip).transform).toBe('none');
		await userEvent.keyboard('{Escape}');
		await expect(tip).not.toBeVisible();
	},
};
export const MotionOverrides: Story = {
	tags: ['tests'],
	args: { transition: { duration: 0 }, motionValues: { animate: { y: 3 } } },
	play: async ({ canvasElement }) => {
		const tip = await within(canvasElement).findByRole('tooltip');
		await waitFor(() => expect(getComputedStyle(tip).transform).toContain('3'));
	},
};
export const LongMessage: Story = {
	tags: ['tests'],
	args: { tip: { payload: { label: 'longhint'.repeat(30) } }, style: { width: 140 } },
	play: async ({ canvasElement }) => {
		const tip = await within(canvasElement).findByRole('tooltip');
		await expect(tip.scrollWidth).toBeLessThanOrEqual(tip.clientWidth);
	},
};
