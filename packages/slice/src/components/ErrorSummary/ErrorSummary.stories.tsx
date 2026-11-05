import type { Meta, StoryObj } from '@storybook/react-vite';
import { createRef, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { TextField } from '../Textfield';
import { installReducedMotionPreference } from '../playHelpers';
import { ErrorSummary } from './ErrorSummary';
import type { ErrorMessage, ErrorSummaryProps } from './_types';

const errors: ErrorMessage[] = [
	{ id: 'password', title: 'Password format', message: ['Include a special character.', 'Include a number.'] },
	{ id: 'email', title: 'Email address required' },
];
const meta = {
	title: 'Components/ErrorSummary',
	component: ErrorSummary,
	args: {
		transition: { duration: 0 },
		entries: errors,
		announcement: 'polite',
		summaryName: 'Errors to review',
		borderWidth: 1,
		borderRadius: 4,
		padding: 16,
		gap: 4,
		textSize: 'm',
	},
	argTypes: {
		announcement: { control: 'inline-radio', options: ['polite', 'assertive', 'off'] },
		textSize: { control: 'inline-radio', options: ['xs', 's', 'm', 'l', 'xl'] },
		textColor: { control: 'text' },
		backgroundColor: { control: 'text' },
		borderColor: { control: 'text' },
		transition: { control: 'object' },
		motionValues: { control: 'object' },
	},
} satisfies Meta<typeof ErrorSummary>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	args: { transition: undefined },
	render: (args) => (
		<div style={{ width: '100%', maxWidth: 480 }}>
			<ErrorSummary {...args} />
		</div>
	),
};
export const GroupedMessages: Story = {
	tags: ['tests'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const summary = canvas.getByRole('status', { name: 'Errors to review' });
		await expect(summary).toHaveAttribute('aria-live', 'polite');
		await expect(summary).toHaveAttribute('aria-atomic', 'true');
		await waitFor(() => expect(canvas.getByText('Password format')).toBeVisible());
		await expect(canvas.getAllByRole('listitem')).toHaveLength(4);
		await expect(summary.textContent).not.toMatch(/1\. Password/);
		await expect(summary.querySelector('ol')).toBeNull();
	},
};
function DynamicSummary({
	transition = { duration: 0 },
	motionValues,
}: Pick<ErrorSummaryProps, 'transition' | 'motionValues'>) {
	const [entries, setEntries] = useState<ErrorMessage[]>([]);
	return (
		<>
			<ErrorSummary entries={entries} transition={transition} motionValues={motionValues} />
			<button type="button" onClick={() => setEntries(errors)}>
				Show errors
			</button>
			<button type="button" onClick={() => setEntries([])}>
				Clear errors
			</button>
		</>
	);
}
export const PersistentAnnouncementRegion: Story = {
	tags: ['tests'],
	render: () => <DynamicSummary />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const region = canvas.getByRole('status');
		await expect(region.textContent).toBe('');
		await userEvent.click(canvas.getByText('Show errors'));
		await expect(canvas.getByRole('status')).toBe(region);
		await waitFor(() => expect(canvas.getByText('Password format')).toBeVisible());
		await expect(canvas.getByText('Show errors')).toHaveFocus();
		await userEvent.click(canvas.getByText('Clear errors'));
		await waitFor(() => expect(region.textContent).toBe(''));
		await expect(canvas.getByRole('status')).toBe(region);
	},
};
export const LongContentAndDuplicates: Story = {
	tags: ['tests'],
	args: {
		entries: Array.from({ length: 40 }, (_, index) => ({
			id: `entry-${index}`,
			title: `Error ${index}`,
			message: ['Repeated message', 'Repeated message', ' ', ''],
		})),
	},
	play: async ({ canvasElement }) => {
		const summary = within(canvasElement).getByRole('status');
		await waitFor(() => expect(summary.getBoundingClientRect().height).toBeGreaterThan(500));
		const last = within(canvasElement).getByText('Error 39');
		await expect(last.getBoundingClientRect().bottom).toBeLessThanOrEqual(summary.getBoundingClientRect().bottom);
		await expect(within(canvasElement).getAllByText('Repeated message')).toHaveLength(80);
	},
};
export const FieldNavigation: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			<label>
				Other form email
				<input name={'email[work]"'} />
			</label>
			<form onSubmit={(event) => event.preventDefault()}>
				<ErrorSummary {...args} entries={[{ id: 'email', title: 'Check your email', fieldName: 'email[work]"' }]} />
				<TextField name={'email[work]"'} inputName="Work email" label="Email" />
			</form>
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Check your email' }));
		await expect(canvas.getByRole('textbox', { name: 'Work email' })).toHaveFocus();
		await expect(canvas.getByRole('textbox', { name: 'Other form email' })).not.toHaveFocus();
	},
};
export const KeyboardNavigationAndUnavailableFields: Story = {
	tags: ['tests'],
	args: {
		entries: [
			{ title: 'Project missing', fieldName: 'project' },
			{ title: 'Email missing', fieldName: 'email' },
		],
	},
	render: (args) => (
		<>
			<ErrorSummary {...args} />
			<input name="email" type="hidden" />
			<label>
				Disabled email
				<input name="email" disabled />
			</label>
			<label>
				Active email
				<input name="email" />
			</label>
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Project missing' }));
		await expect(canvas.getByRole('button', { name: 'Project missing' })).toHaveFocus();
		await userEvent.tab();
		await userEvent.keyboard('{Enter}');
		await expect(canvas.getByRole('textbox', { name: 'Active email' })).toHaveFocus();
	},
};
export const AnnouncementModesAndStyles: Story = {
	tags: ['tests'],
	args: {
		announcement: 'assertive',
		summaryName: 'Submission errors',
		textColor: '#123456',
		borderColor: '#654321',
		backgroundColor: '#ffffff',
		padding: 0,
		gap: '8px',
		borderWidth: 2,
		borderRadius: 12,
		className: 'custom-summary',
		textSize: 's',
		onClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const summary = within(canvasElement).getByRole('alert', { name: 'Submission errors' });
		const panel = summary.querySelector('ul')?.parentElement as HTMLElement;
		const style = getComputedStyle(panel);
		await expect(style.padding).toBe('0px');
		await expect(style.borderColor).toBe('rgb(101, 67, 33)');
		await expect(style.color).toBe('rgb(18, 52, 86)');
		await expect(style.borderWidth).toBe('2px');
		await expect(style.borderRadius).toBe('12px');
		await expect(summary).toHaveClass('custom-summary');
		await userEvent.click(within(canvasElement).getByText('Password format'));
		await expect(args.onClick).toHaveBeenCalledTimes(1);
	},
};
export const OptionalFocus: Story = {
	tags: ['tests'],
	args: { announcement: 'off', summaryName: ' ' },
	render: (args) => {
		const ref = createRef<HTMLDivElement>();
		return (
			<>
				<ErrorSummary {...args} ref={ref} />
				<button type="button" onClick={() => ref.current?.focus()}>
					Review errors
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const summary = canvas.getByRole('region', { name: 'Errors to review' });
		await expect(summary).toHaveAttribute('aria-live', 'off');
		await userEvent.click(canvas.getByRole('button', { name: 'Review errors' }));
		await expect(summary).toHaveFocus();
	},
};

function ReorderedErrors() {
	const [entries, setEntries] = useState<ErrorMessage[]>([
		{ id: 'email', title: 'Email required' },
		{ id: 'password', title: 'Password required' },
	]);
	return (
		<>
			<ErrorSummary entries={entries} />
			<button
				type="button"
				onClick={() =>
					setEntries([
						{ id: 'password', title: 'Update password' },
						{ id: 'email', title: 'Update email' },
					])
				}
			>
				Reorder errors
			</button>
		</>
	);
}
export const StableIdentity: Story = {
	tags: ['tests'],
	render: () => <ReorderedErrors />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const email = canvas.getByText('Email required');
		const password = canvas.getByText('Password required');
		await userEvent.click(canvas.getByText('Reorder errors'));
		await expect(canvas.getByText('Update password')).toBe(password);
		await expect(canvas.getByText('Update email')).toBe(email);
	},
};
export const DuplicateEntriesAndEmptyMessages: Story = {
	tags: ['tests'],
	args: {
		entries: [
			{ title: 'Check the value', message: '' },
			{ title: 'Check the value', message: [' ', ''] },
			{ id: 'duplicate', title: 'Repeated ID', message: ' ' },
			{ id: 'duplicate', title: 'Repeated ID', message: 'Review this value.' },
		],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getAllByText('Check the value')).toHaveLength(2);
		await expect(canvas.getAllByText('Repeated ID')).toHaveLength(2);
		await expect(canvas.getAllByRole('list')).toHaveLength(2);
	},
};

function LiveErrors() {
	const [value, setValue] = useState('');
	return (
		<>
			<ErrorSummary
				transition={{ duration: 0.2 }}
				entries={
					value.length > 0 ? [{ id: 'example-value', title: 'Value not accepted', fieldName: 'example-value' }] : []
				}
			/>
			<TextField
				name="example-value"
				inputName="Example value"
				value={value}
				onChange={(next) => setValue(next ?? '')}
			/>
		</>
	);
}
export const LiveValidationAndPresence: Story = {
	tags: ['tests'],
	render: () => <LiveErrors />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox', { name: 'Example value' });
		const region = canvas.getByRole('status');
		await expect(region.textContent).toBe('');
		await userEvent.type(input, 'Invalid');
		await waitFor(() => expect(canvas.getByRole('button', { name: 'Value not accepted' })).toBeVisible());
		await expect(input).toHaveFocus();
		const animated = region.firstElementChild as HTMLElement;
		await waitFor(() => expect(getComputedStyle(animated).opacity).toBe('1'));
		await expect(animated.style.height).toBe('auto');
		await userEvent.clear(input);
		await expect(animated).toHaveAttribute('inert');
		await expect(animated).toHaveAttribute('aria-hidden', 'true');
		await waitFor(() => expect(region.textContent).toBe(''));
		await expect(canvas.getByRole('status')).toBe(region);
		await expect(input).toHaveFocus();
	},
};

export const CustomMotionValues: Story = {
	tags: ['tests'],
	args: { motionValues: { initial: { x: -8 }, animate: { x: 6, opacity: 0.8 }, exit: { x: 8 } } },
	play: async ({ canvasElement }) => {
		const region = within(canvasElement).getByRole('status');
		const animated = region.firstElementChild as HTMLElement;
		await waitFor(() => expect(getComputedStyle(animated).opacity).toBe('0.8'));
		await expect(animated.style.height).toBe('auto');
		await expect(region.getBoundingClientRect().height).toBeGreaterThan(0);
		await expect(new DOMMatrix(getComputedStyle(animated).transform).m41).toBe(6);
	},
};
let motionPreference: ReturnType<typeof installReducedMotionPreference>;
export const LiveReducedMotion: Story = {
	tags: ['tests'],
	args: {
		transition: { duration: 4, delay: 1, repeat: Number.POSITIVE_INFINITY },
		motionValues: { initial: { x: 200 }, animate: { x: 100 } },
	},
	beforeEach: () => {
		motionPreference = installReducedMotionPreference(false);
		return () => motionPreference.restore();
	},
	render: (args) => <DynamicSummary transition={args.transition} motionValues={args.motionValues} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const region = canvas.getByRole('status');
		await userEvent.click(canvas.getByText('Show errors'));
		motionPreference.set(true);
		await waitFor(() => expect(canvas.getByText('Password format')).toBeVisible());
		await expect(getComputedStyle(region.firstElementChild as HTMLElement).transform).toBe('none');
		await userEvent.click(canvas.getByText('Clear errors'));
		await waitFor(() => expect(region.textContent).toBe(''));
		motionPreference.set(false);
		await userEvent.click(canvas.getByText('Show errors'));
		await userEvent.click(canvas.getByText('Clear errors'));
		motionPreference.set(true);
		await waitFor(() => expect(region.textContent).toBe(''));
	},
};
