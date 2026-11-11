import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { toastActions, useToast } from '../../stores/toast';
import { Button } from '../Button';
import { Toast } from './Toast';
import { type ToastProps, ToastType } from './_types';

const meta = {
	title: 'Components/Toast',
	component: Toast,
	render: (args) => <Toast {...args} data-testid="toast" />,
	args: { container: 'parent', duration: 'infinite', transition: { duration: 0 } },
	decorators: [
		(Story) => (
			<div style={{ position: 'relative', minHeight: 180, width: '100%' }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

function Replay(args: ToastProps) {
	const [version, setVersion] = useState(0);
	return (
		<>
			<Button label="Show toast" onClick={() => setVersion((value) => value + 1)} />
			<Toast
				data-testid="toast"
				{...args}
				notificationId={String(version)}
				message={version ? (args.message ?? 'Saved successfully') : null}
			/>
		</>
	);
}
export const Demo: Story = {
	args: { message: 'Saved successfully', type: ToastType.Success },
	render: (args) => <Replay {...args} />,
};
export const Lifecycle: Story = {
	tags: ['tests'],
	args: { message: 'Saved', notificationId: 'saved', onShow: fn(), onHide: fn() },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Saved'));
		await expect(args.onShow).toHaveBeenCalledWith({ notificationId: 'saved', message: 'Saved' });
		await userEvent.click(canvas.getByRole('button', { name: 'Dismiss notification' }));
		await waitFor(() =>
			expect(args.onHide).toHaveBeenCalledWith({ notificationId: 'saved', message: 'Saved', reason: 'dismiss' }),
		);
		await expect(args.onHide).toHaveBeenCalledTimes(1);
		await expect(canvas.getByRole('status')).toBeEmptyDOMElement();
	},
};
export const ReplayIdenticalMessage: Story = {
	tags: ['tests'],
	args: { message: 'Same message', onShow: fn(), onHide: fn() },
	render: (args) => <Replay {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const open = canvas.getByRole('button', { name: 'Show toast' });
		await userEvent.click(open);
		await waitFor(() => expect(args.onShow).toHaveBeenCalledTimes(1));
		await userEvent.click(canvas.getByRole('button', { name: 'Dismiss notification' }));
		await waitFor(() => expect(canvas.queryByTestId('toast')).not.toBeInTheDocument());
		await userEvent.click(open);
		await waitFor(() => expect(args.onShow).toHaveBeenCalledTimes(2));
		await expect(canvas.getByRole('status')).toHaveTextContent('Same message');
	},
};
export const PersistentWithoutCloseOrProgress: Story = {
	tags: ['tests'],
	args: { message: 'Persistent update', close: false, progress: false },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await canvas.findByTestId('toast');
		await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
		await expect(canvas.getByTestId('toast').querySelector('svg')).toBeNull();
	},
};
export const KeyboardDismiss: Story = {
	tags: ['tests'],
	args: { message: 'Keyboard update', closeLabel: 'Close update', onHide: fn() },
	render: (args) => <Replay {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Show toast' });
		await userEvent.click(trigger);
		const close = await canvas.findByRole('button', { name: 'Close update' });
		await expect(close.tagName).toBe('BUTTON');
		close.focus();
		await userEvent.keyboard(' ');
		await waitFor(() => expect(args.onHide).toHaveBeenCalledTimes(1));
		await expect(trigger).toHaveFocus();
	},
};
export const Timed: Story = {
	tags: ['tests'],
	args: { message: 'Timed update', duration: 150, onHide: fn() },
	play: async ({ canvasElement, args }) => {
		await within(canvasElement).findByTestId('toast');
		await waitFor(() => expect(args.onHide).toHaveBeenCalledWith(expect.objectContaining({ reason: 'timeout' })));
	},
};
export const AssertiveAnnouncement: Story = {
	tags: ['tests'],
	args: { message: 'Upload failed', type: ToastType.Error, urgency: 'assertive' },
	play: async ({ canvasElement }) => {
		await waitFor(() => expect(within(canvasElement).getByRole('alert')).toHaveTextContent('Upload failed'));
	},
};
export const LongMessage: Story = {
	tags: ['tests'],
	args: {
		message: 'A very long notification '.repeat(30),
		position: 'top',
		border: false,
		padding: 0,
		className: 'custom-toast',
		progress: true,
		type: ToastType.Warning,
	},
	render: (args) => (
		<div style={{ position: 'relative', width: 260, height: 240 }}>
			<Toast {...args} data-testid="toast" />
		</div>
	),
	play: async ({ canvasElement }) => {
		const toast = await within(canvasElement).findByTestId('toast');
		await expect(toast).toHaveClass('custom-toast');
		await expect(getComputedStyle(toast).padding).toBe('0px');
		await expect(getComputedStyle(toast).borderTopWidth).toBe('0px');
		await expect(toast.getBoundingClientRect().width).toBeLessThanOrEqual(212);
		await expect(toast.scrollWidth).toBeLessThanOrEqual(toast.clientWidth);
	},
};
export const MotionOverrides: Story = {
	tags: ['tests'],
	args: { message: 'Custom motion', offset: 12, motionValues: { animate: { y: 0.5 } }, transition: { duration: 0 } },
	play: async ({ canvasElement }) => {
		const toast = await within(canvasElement).findByTestId('toast');
		await waitFor(() => expect(getComputedStyle(toast).transform).toContain('0.5'));
		await expect(getComputedStyle(toast).bottom).toBe('12px');
	},
};
export const ReducedMotion: Story = {
	tags: ['tests'],
	args: {
		message: 'Reduced motion',
		progress: true,
		transition: { duration: 10, delay: 10 },
		motionValues: { animate: { y: 100, transition: { duration: 10 } } },
		onHide: fn(),
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
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const toast = await canvas.findByTestId('toast');
		await waitFor(() => expect(getComputedStyle(toast).opacity).toBe('1'), { timeout: 500 });
		await expect(getComputedStyle(toast).transform).toBe('none');
		await userEvent.click(canvas.getByRole('button', { name: 'Dismiss notification' }));
		await waitFor(() => expect(args.onHide).toHaveBeenCalledTimes(1), { timeout: 500 });
	},
};
function StoredToast() {
	const toast = useToast();
	return (
		<>
			<Button
				label="Push update"
				onClick={() =>
					toastActions.push({ message: 'Stored update', duration: 'infinite', transition: { duration: 0 } })
				}
			/>
			<Toast {...toast} data-testid="toast" container="parent" onHide={toastActions.clear} />
		</>
	);
}
export const StoreComposition: Story = {
	tags: ['tests'],
	render: () => <StoredToast />,
	play: async ({ canvasElement }) => {
		toastActions.clear();
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Push update' }));
		await canvas.findByTestId('toast');
		await userEvent.click(canvas.getByRole('button', { name: 'Dismiss notification' }));
		await waitFor(() => expect(canvas.queryByTestId('toast')).not.toBeInTheDocument());
	},
};

function ActionToast() {
	const [clicks, setClicks] = useState(0);
	const [result, setResult] = useState('');
	return (
		<>
			<output aria-label="Action result">{result}</output>
			<output aria-label="Action count">{clicks}</output>
			<Toast
				data-testid="toast"
				message="Open saved document"
				data={{ documentId: 'doc-42' }}
				container="parent"
				duration="infinite"
				transition={{ duration: 0 }}
				onClick={(event, data) => {
					setResult(`${event.currentTarget.tagName}:${data?.documentId}`);
					setClicks((value) => value + 1);
				}}
			/>
		</>
	);
}
export const ClickAction: Story = {
	tags: ['tests'],
	render: () => <ActionToast />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const action = await canvas.findByRole('button', { name: 'Open saved document' });
		await userEvent.click(action);
		await expect(canvas.getByLabelText('Action result')).toHaveTextContent('DIV:doc-42');
		await expect(canvas.getByLabelText('Action count')).toHaveTextContent('1');
		action.focus();
		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');
		await expect(canvas.getByLabelText('Action count')).toHaveTextContent('3');
		await userEvent.click(canvas.getByRole('button', { name: 'Dismiss notification' }));
		await waitFor(() => expect(canvas.queryByTestId('toast')).not.toBeInTheDocument());
		await expect(canvas.getByLabelText('Action count')).toHaveTextContent('3');
	},
};
