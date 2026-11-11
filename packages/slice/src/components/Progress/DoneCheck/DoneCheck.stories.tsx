import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { FlexBox } from 'src/components/FlexBox';
import { DoneCheck } from 'src/components/Progress';
import { expect, fn, spyOn, within } from 'storybook/test';
import {
	runDoneCheckAnimatesAndFiresCallbacksPlay,
	runDoneCheckNoPlayPlay,
	runDoneCheckWithoutCallbacksPlay,
} from '../../playHelpers';

const meta: Meta<typeof DoneCheck> = {
	title: 'Components/DoneCheck',
	component: DoneCheck,
	args: {
		size: 128,
		stroke: 0.5,
		duration: 1,
		delay: 0,
		play: true,
		didStart: fn(),
		didEnd: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof DoneCheck> = {
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<DoneCheck {...args} />
			</FlexBox>
		);
	},
};

export const AnimatesAndFiresCallbacks: StoryObj<typeof DoneCheck> = {
	tags: ['tests'],
	args: {
		duration: 0.05,
		delay: 0,
	},
	render: Default.render,
	play: runDoneCheckAnimatesAndFiresCallbacksPlay,
};

export const NoPlay: StoryObj<typeof DoneCheck> = {
	tags: ['tests'],
	args: {
		play: false,
	},
	render: Default.render,
	play: runDoneCheckNoPlayPlay,
};

export const WithoutCallbacks: StoryObj<typeof DoneCheck> = {
	tags: ['tests'],
	args: {
		duration: 0.05,
		delay: 0,
	},
	// bypass Storybook's args-merge (an explicit `undefined` override in
	// `args` doesn't clear a defined meta default) by dropping the
	// callbacks directly in JSX instead
	render: (args) => (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<DoneCheck {...args} didStart={undefined} didEnd={undefined} />
		</FlexBox>
	),
	play: runDoneCheckWithoutCallbacksPlay,
};

export const NativeAttributes: StoryObj<typeof DoneCheck> = {
	tags: ['tests'],
	args: {
		play: false,
		size: 40,
		statusLabel: 'Saved',
		id: 'saved-check',
		className: 'custom-check',
		style: { margin: 7, width: 200 },
		onClick: fn(),
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const root = within(canvasElement).getByRole('status', { name: 'Saved' });
		await expect(root).toHaveAttribute('id', 'saved-check');
		await expect(root).toHaveClass('custom-check');
		await expect(root).toHaveStyle({ width: '40px', height: '40px', margin: '7px' });
		root.click();
		await expect(args.onClick).toHaveBeenCalledTimes(1);
		await expect(within(canvasElement).queryByRole('img')).toBeNull();
	},
};
export const Decorative: StoryObj<typeof DoneCheck> = {
	tags: ['tests'],
	args: { decorative: true, play: false },
	render: (args) => <DoneCheck {...args} data-testid="decorative-check" />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.queryByRole('status')).toBeNull();
		await expect(canvas.getByTestId('decorative-check')).toHaveAttribute('aria-hidden', 'true');
	},
};
export const ReducedMotion: StoryObj<typeof DoneCheck> = {
	tags: ['tests'],
	args: { delay: 10, duration: 10 },
	render: Default.render,
	beforeEach: () => {
		const original = window.matchMedia.bind(window);
		const mock = spyOn(window, 'matchMedia').mockImplementation((query) => {
			const result = original(query);
			if (query === '(prefers-reduced-motion: reduce)') Object.defineProperty(result, 'matches', { value: true });
			return result;
		});
		return () => mock.mockRestore();
	},
	play: async ({ canvasElement, args }) => {
		const root = within(canvasElement).getByRole('status');
		const icon = root.firstElementChild as HTMLElement;
		await expect(getComputedStyle(icon).scale).toBe('1');
		await expect(getComputedStyle(icon).transitionDuration).toBe('0s');
		await expect(args.didStart).not.toHaveBeenCalled();
		await expect(args.didEnd).not.toHaveBeenCalled();
	},
};
export const ZeroDuration: StoryObj<typeof DoneCheck> = {
	tags: ['tests'],
	args: { duration: 0, delay: 10 },
	render: Default.render,
	play: ReducedMotion.play,
};
export const FiltersTransitionEvents: StoryObj<typeof DoneCheck> = {
	tags: ['tests'],
	args: { delay: 10 },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const root = within(canvasElement).getByRole('status');
		const icon = root.firstElementChild as HTMLElement;
		icon.dispatchEvent(new TransitionEvent('transitionend', { bubbles: true, propertyName: 'opacity' }));
		root
			.querySelector('svg')
			?.dispatchEvent(new TransitionEvent('transitionend', { bubbles: true, propertyName: 'scale' }));
		await expect(args.didEnd).not.toHaveBeenCalled();
		icon.dispatchEvent(new TransitionEvent('transitionend', { bubbles: true, propertyName: 'scale' }));
		await expect(args.didEnd).toHaveBeenCalledTimes(1);
	},
};
