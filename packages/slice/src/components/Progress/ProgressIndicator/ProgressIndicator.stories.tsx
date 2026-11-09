import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { ProgressIndicator } from './ProgressIndicator';
import type { ProgressIndicatorProps } from './_types';
const meta = {
	title: 'Components/ProgressIndicator',
	component: ProgressIndicator,
	args: { show: true, inline: true, label: 'Loading files', transition: { duration: 0 } },
	render: (args) => <ProgressIndicator {...args} data-testid="indicator" />,
} satisfies Meta<typeof ProgressIndicator>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('status')).toHaveTextContent('Loading files');
		await expect(canvas.getByTestId('indicator').querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
	},
};
export const TimedPlayback: Story = {
	tags: ['tests'],
	args: { duration: 0.1, onStart: fn(), onStop: fn() },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await waitFor(() => expect(args.onStop).toHaveBeenCalledOnce());
		await expect(args.onStart).toHaveBeenCalledOnce();
		const root = canvas.getByTestId('indicator');
		await expect(root).toBeVisible();
		const svg = root.querySelector('svg');
		if (!svg) throw Error('Missing spinner');
		await expect(getComputedStyle(svg).animationName).toBe('none');
	},
};
export const Decorative: Story = {
	tags: ['tests'],
	args: { decorative: true },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
		await expect(canvas.getByTestId('indicator')).toHaveAttribute('aria-hidden', 'true');
	},
};
export const InitiallyHidden: Story = {
	tags: ['tests'],
	args: { show: false, onStart: fn(), onStop: fn() },
	play: async ({ canvasElement, args }) => {
		await expect(within(canvasElement).queryByTestId('indicator')).not.toBeInTheDocument();
		await expect(args.onStart).not.toHaveBeenCalled();
		await expect(args.onStop).not.toHaveBeenCalled();
	},
};
export const InvalidGeometry: Story = {
	tags: ['tests'],
	args: { size: -1, stroke: 100, secondsPerSpin: 0 },
	play: async ({ canvasElement }) => {
		const svg = within(canvasElement).getByTestId('indicator').querySelector('svg');
		if (!svg) throw Error('Missing spinner');
		await expect(svg).toHaveAttribute('width', '20');
		await expect(svg.querySelector('path')).toHaveAttribute('stroke-width', '10');
		await expect(getComputedStyle(svg).animationDuration).toBe('1s');
	},
};
export const StringSizeAndMotion: Story = {
	tags: ['tests'],
	args: { size: '2rem', inset: false, motionValues: { animate: { y: 2 } }, color: '#123456' },
	play: async ({ canvasElement }) => {
		const root = within(canvasElement).getByTestId('indicator');
		await waitFor(() => expect(getComputedStyle(root).transform).toContain('2'));
		await expect(root.querySelector('svg')).toHaveAttribute('width', '2rem');
		await expect(root.querySelector('stop')).toHaveAttribute('stop-color', '#123456');
	},
};
function RefAndReplay(props: ProgressIndicatorProps) {
	const [show, setShow] = useState(true);
	const ref = useRef<HTMLDivElement>(null);
	return (
		<>
			<button type="button" onClick={() => setShow((value) => !value)}>
				Toggle loading
			</button>
			<ProgressIndicator {...props} ref={ref} show={show} data-testid="indicator" />
			<button
				type="button"
				onClick={() => {
					if (ref.current) ref.current.dataset.refChecked = 'true';
				}}
			>
				Check ref
			</button>
		</>
	);
}
export const ReplayAndRef: Story = {
	tags: ['tests'],
	args: { onStart: fn(), onStop: fn() },
	render: (args) => <RefAndReplay {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Check ref' }));
		await expect(canvas.getByTestId('indicator')).toHaveAttribute('data-ref-checked', 'true');
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle loading' }));
		await waitFor(() => expect(canvas.queryByTestId('indicator')).not.toBeInTheDocument());
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle loading' }));
		await canvas.findByTestId('indicator');
		await expect(args.onStart).toHaveBeenCalledTimes(2);
		await expect(args.onStop).toHaveBeenCalledOnce();
	},
};
let changePreference: ((value: boolean) => void) | undefined;
function mockPreference(initial: boolean) {
	const original = window.matchMedia.bind(window);
	let reduced = initial;
	const listeners = new Set<EventListener>();
	const query = {
		get matches() {
			return reduced;
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
	changePreference = (value) => {
		reduced = value;
		for (const listener of listeners) listener(new Event('change'));
	};
	return () => {
		changePreference = undefined;
		mock.mockRestore();
	};
}
export const ReducedMotion: Story = {
	tags: ['tests'],
	beforeEach: () => mockPreference(true),
	args: {
		transition: { duration: 10, delay: 10 },
		motionValues: { animate: { opacity: 0, y: 100, transition: { delay: 10 } } },
	},
	play: async ({ canvasElement }) => {
		const root = within(canvasElement).getByTestId('indicator');
		await waitFor(() => expect(getComputedStyle(root).opacity).toBe('1'), { timeout: 500 });
		await expect(getComputedStyle(root).transform).toBe('none');
		const svg = root.querySelector('svg');
		if (!svg) throw Error('Missing spinner');
		await expect(getComputedStyle(svg).animationName).toBe('none');
	},
};
export const LiveReducedMotionDuringExit: Story = {
	tags: ['tests'],
	beforeEach: () => mockPreference(false),
	args: { motionValues: { exit: { opacity: 0, transition: { duration: 10, delay: 10 } } } },
	render: (args) => <RefAndReplay {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const root = canvas.getByTestId('indicator');
		await waitFor(() => expect(getComputedStyle(root).opacity).toBe('1'));
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle loading' }));
		await expect(root).toBeInTheDocument();
		changePreference?.(true);
		await waitFor(() => expect(root).not.toBeInTheDocument(), { timeout: 500 });
	},
};

export const SpinnerOnlyByDefault: Story = {
	tags: ['tests'],
	args: { labelPosition: 'bottom' },
	play: async ({ canvasElement }) => {
		const root = within(canvasElement).getByTestId('indicator');
		await expect(root.querySelector('span')).not.toBeInTheDocument();
		await expect(root).not.toHaveAttribute('data-label-position');
	},
};
export const VisibleLabelDefaults: Story = {
	tags: ['tests'],
	args: { displayLabel: true },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const root = canvas.getByTestId('indicator');
		const label = root.querySelector('span');
		if (!label) throw Error('Expected visible label');
		await expect(label).toHaveTextContent('Loading files');
		await expect(root).toHaveAttribute('data-label-position', 'right');
		await expect(root.style.getPropertyValue('--pi-text-color')).toBe('var(--core-text-primary)');
		await expect(label.className).toMatch(/\bm\b|_m_/);
		await expect(canvas.getAllByRole('status')).toHaveLength(1);
		await expect(label.closest('[aria-hidden="true"]')).toBe(root);
	},
};
export const LabelStyling: Story = {
	tags: ['tests'],
	args: { displayLabel: true, textSize: 'xl', textColor: '#123456', style: { background: '#ffffff', padding: 8 } },
	play: async ({ canvasElement }) => {
		const label = within(canvasElement).getByTestId('indicator').querySelector('span');
		if (!label) throw Error('Expected visible label');
		await expect(getComputedStyle(label).color).toBe('rgb(18, 52, 86)');
		await expect(label.className).toMatch(/xl/);
	},
};
export const LabelPositions: Story = {
	tags: ['tests'],
	render: () => (
		<div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
			{(['left', 'right', 'top', 'bottom'] as const).map((position) => (
				<ProgressIndicator
					key={position}
					show
					inline
					displayLabel
					label={position}
					labelPosition={position}
					transition={{ duration: 0 }}
					data-testid={`position-${position}`}
				/>
			))}
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const position of ['left', 'right', 'top', 'bottom']) {
			const root = canvas.getByTestId(`position-${position}`);
			const text = root.querySelector('span');
			const svg = root.querySelector('svg');
			if (!text || !svg) throw Error('Expected spinner and label');
			const label = text.getBoundingClientRect();
			const icon = svg.getBoundingClientRect();
			if (position === 'left') await expect(label.right).toBeLessThan(icon.left);
			if (position === 'right') await expect(label.left).toBeGreaterThan(icon.right);
			if (position === 'top') await expect(label.bottom).toBeLessThan(icon.top);
			if (position === 'bottom') await expect(label.top).toBeGreaterThan(icon.bottom);
		}
	},
};
