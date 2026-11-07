import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Dot } from 'src/components/Dot/Dot';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { runDotPlay, runDotVariantsPlay } from 'src/components/playHelpers';
import { expect, within } from 'storybook/test';

const meta: Meta<typeof Dot> = {
	title: 'Components/Dot',
	component: Dot,
	argTypes: {
		color: { type: 'string', control: 'text' },
		state: {
			control: { type: 'radio' },
			options: ['red', 'yellow', 'green', 'blue', 'grey', undefined],
		},
	},
	args: {
		size: 8,
		offSet: 2,
		border: 3,
		position: 'inline',
		motionValues: undefined,
		show: true,
		state: 'blue',
	},
};

export default meta;

export const Default: StoryObj<typeof Dot> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Dot {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runDotPlay({ canvasElement, args });
	},
};

export const Variants: StoryObj<typeof Dot> = {
	tags: ['tests'],
	// exercise position/color/state/motion branches together, one Dot per
	// branch, distinguished by an extra className that lands in `rest`
	render: () => (
		<FlexDiv direction={'column'} gap={12}>
			<Dot show className="corner" position="corner" state="blue" />
			<Dot show className="explicit-color" color="#ff0000" state="blue" />
			<Dot show className="state-red" state="red" />
			<Dot show className="state-yellow" state="yellow" />
			<Dot show className="state-green" state="green" />
			<Dot show className="state-grey" state="grey" />
			<Dot show className="no-state" />
			<Dot show className="motion-values" motionValues={{ initial: { opacity: 0 } }} />
			<Dot show className="custom-transition" transition={{ duration: 0.5 }} />
			<Dot show={false} className="hidden" />
		</FlexDiv>
	),
	play: runDotVariantsPlay,
};

export const ToggleVisibility: StoryObj<typeof Dot> = {
	args: {
		transition: { duration: 2, delay: 1 },
		motionValues: {
			initial: { opacity: 0, scale: 0.5 },
			animate: { opacity: 1, scale: 1 },
			exit: { opacity: 0, scale: 0.5 },
		},
	},
	render: (args) => {
		const [show, setShow] = useState(false);
		return (
			<FlexDiv gap={16} align="center">
				<button type="button" onClick={() => setShow((value) => !value)}>
					Toggle dot
				</button>
				<Dot {...args} show={show} />
			</FlexDiv>
		);
	},
};

export const CornerOffsets: StoryObj<typeof Dot> = {
	tags: ['tests'],
	render: () => (
		<div style={{ position: 'relative', width: 100, height: 100 }}>
			<Dot show aria-label="Default offsets" />
			<Dot show offSet={6} aria-label="Shared offset" />
			<Dot show offSet={6} topOffset={0} rightOffset={3} aria-label="Individual offsets" />
			<Dot show offSet={-4} aria-label="Inward offset" />
			<Dot show position="inline" offSet={10} aria-label="Inline offset" />
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const [label, top, right] of [
			['Default offsets', '-2px', '-2px'],
			['Shared offset', '-6px', '-6px'],
			['Individual offsets', '0px', '-3px'],
			['Inward offset', '4px', '4px'],
		]) {
			const dot = canvas.getByRole('status', { name: label });
			await expect(getComputedStyle(dot).top).toBe(top);
			await expect(getComputedStyle(dot).right).toBe(right);
			await expect(dot).not.toHaveAttribute('offSet');
		}
		const inline = canvas.getByRole('status', { name: 'Inline offset' });
		await expect(inline.style.getPropertyValue('--dot-top')).toBe('unset');
		await expect(inline.style.getPropertyValue('--dot-right')).toBe('unset');
	},
};
