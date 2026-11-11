import type { Meta, StoryObj } from '@storybook/react-vite';
import { createRef } from 'react';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';
import { Button } from '../Button';
import { FileIcon, FileIconTypes } from './index';

const meta = {
	title: 'Components/FileIcon',
	component: FileIcon,
	argTypes: { type: { control: 'select', options: Object.values(FileIconTypes) } },
	args: { filename: 'report.PDF', size: 24 },
} satisfies Meta<typeof FileIcon>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Categories: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: 24 }}>
			{Object.values(FileIconTypes).map((type) => (
				<FileIcon key={type} type={type} />
			))}
		</div>
	),
};
export const KeyboardAndClickInteractions: Story = {
	tags: ['tests'],
	args: { onClick: fn(), pointer: false, label: 'Open report' },
	play: async ({ canvasElement, args }) => {
		const icon = within(canvasElement).getByRole('button', { name: 'Open report' });
		await userEvent.tab();
		await expect(icon).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		await expect(args.onClick).toHaveBeenCalledTimes(1);
		await fireEvent.keyDown(icon, { key: 'Enter', repeat: true });
		await expect(args.onClick).toHaveBeenCalledTimes(1);
		await fireEvent.keyDown(icon, { key: ' ' });
		await expect(args.onClick).toHaveBeenCalledTimes(1);
		await fireEvent.keyUp(icon, { key: ' ' });
		await expect(args.onClick).toHaveBeenCalledTimes(2);
		await expect(args.onClick).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'click', detail: 0 }));
		await userEvent.click(icon);
		await expect(args.onClick).toHaveBeenCalledTimes(3);
	},
};
export const Disabled: Story = {
	tags: ['tests'],
	args: { disabled: true, onClick: fn(), style: { opacity: 1 } },
	play: async ({ canvasElement, args }) => {
		const icon = within(canvasElement).getByRole('button');
		await expect(icon).toHaveAttribute('aria-disabled', 'true');
		await expect(icon).not.toHaveAttribute('tabindex');
		await expect(icon).toHaveStyle({ opacity: '0.5' });
		await fireEvent.click(icon);
		await fireEvent.keyDown(icon, { key: 'Enter' });
		await fireEvent.keyUp(icon, { key: ' ' });
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};
export const ResolutionAndSemantics: Story = {
	tags: ['tests'],
	render: () => (
		<>
			<FileIcon data-testid="fallback" />
			<FileIcon type="image" filename="report.pdf" />
			<FileIcon filename={new File([''], 'report.PDF', { type: 'image/png' })} />
			<FileIcon filename="unknown.bin" decorative data-testid="decoration" />
			<FileIcon decorative onClick={fn()} label="Open image" />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('fallback')).toHaveAccessibleName('File');
		await expect(canvas.getByRole('img', { name: 'Image file' })).not.toHaveAttribute('tabindex');
		await expect(canvas.getByRole('img', { name: 'PDF file' })).toBeVisible();
		await expect(canvas.getByTestId('decoration')).toHaveAttribute('aria-hidden', 'true');
		await expect(canvas.getByRole('button', { name: 'Open image' })).not.toHaveAttribute('aria-hidden');
	},
};
export const ComposedKeyHandlers: Story = {
	tags: ['tests'],
	args: {
		onClick: fn(),
		onKeyDown: fn((event) => {
			if (event.key === 'Enter') event.preventDefault();
		}),
		onKeyUp: fn((event) => event.preventDefault()),
		onBlur: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const icon = within(canvasElement).getByRole('button');
		await fireEvent.keyDown(icon, { key: 'Enter' });
		await expect(args.onKeyDown).toHaveBeenCalled();
		await fireEvent.keyDown(icon, { key: ' ' });
		await fireEvent.keyUp(icon, { key: ' ' });
		await expect(args.onKeyUp).toHaveBeenCalled();
		await userEvent.tab();
		await userEvent.tab();
		await expect(args.onBlur).toHaveBeenCalled();
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};
const iconRef = createRef<SVGSVGElement>();
export const RefAndSizing: Story = {
	tags: ['tests'],
	args: { ref: iconRef, size: Number.NaN, className: 'custom-icon', label: ' Custom file ', style: { marginTop: 8 } },
	play: async ({ canvasElement }) => {
		const icon = within(canvasElement).getByRole('img', { name: 'Custom file' });
		await expect(iconRef.current).toBe(icon);
		await expect(icon).toHaveAttribute('width', '24');
		await expect(icon).toHaveClass('custom-icon');
		await expect(icon).toHaveStyle({ marginTop: '8px' });
	},
};
export const ButtonComposition: Story = {
	tags: ['tests'],
	render: () => (
		<Button variant="outline">
			<FileIcon filename="report.pdf" decorative />
			<span>Open report.pdf</span>
		</Button>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getAllByRole('button')).toHaveLength(1);
		await expect(canvas.queryByRole('img')).not.toBeInTheDocument();
		await userEvent.tab();
		await expect(canvas.getByRole('button', { name: 'Open report.pdf' })).toHaveFocus();
	},
};

export const BlurCancelsSpace: Story = {
	tags: ['tests'],
	args: { onClick: fn() },
	play: async ({ canvasElement, args }) => {
		const icon = within(canvasElement).getByRole('button');
		await userEvent.tab();
		await fireEvent.keyDown(icon, { key: ' ' });
		await userEvent.tab();
		await fireEvent.keyUp(icon, { key: ' ' });
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};
