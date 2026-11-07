import type { Meta, StoryObj } from '@storybook/react-vite';
import { Component, type ReactNode, useState } from 'react';
import { DialogBox } from 'src/components/DialogBox/DialogBox';
import { FlexDiv } from 'src/components/FlexDiv';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { useDialogBox } from './useDialogBox';

function DefaultActions() {
	const { close, resolve } = useDialogBox();
	return (
		<>
			<Button label="Cancel" variant="outline" backgroundColor={'transparent'} onClick={close} />
			<Button variant={'solid'} label="Continue" onClick={() => resolve('continue')} />
		</>
	);
}

const meta: Meta<typeof DialogBox> = {
	title: 'Components/DialogBox',
	component: DialogBox,
	argTypes: { actionsBackgroundColor: { control: 'text' } },
	args: {
		maxWidth: 350,
		maxHeight: 200,
		autoBorderBottom: true,
		titleBorderColor: undefined,
		titleBorderWidth: undefined,
		actionsBorderColor: undefined,
		actionsBorderWidth: undefined,
		onAction: fn(),
		onReject: fn(),
		onResolve: fn(),
		onClose: fn(),
		onToolTip: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof DialogBox> = {
	render: (args) => {
		const { title = 'Confirmation', actions, ...panelProps } = args;
		const children =
			'Ohio’s GOP gubernatorial candidate Vivek Ramaswamy said he left a congratulatory message for his Democratic opponent, Amy Acton, after she was projected to win their race Tuesday night.';
		return (
			<FlexDiv absolute justify="center" align="center" padding={64}>
				<DialogBox {...panelProps} actions={actions}>
					<DialogBox.Title>{title}</DialogBox.Title>
					<DialogBox.Content>{children}</DialogBox.Content>
					{actions === undefined && (
						<DialogBox.Actions>
							<DefaultActions />
						</DialogBox.Actions>
					)}
				</DialogBox>
			</FlexDiv>
		);
	},
};

export const NamedDialog: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	args: { title: 'Archive project?', titleIcon: 'basic.home', children: 'Keep your project history.' },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const dialog = canvas.getByRole('dialog', { name: 'Archive project?' });
		await expect(dialog).not.toHaveAttribute('aria-modal');
		const heading = canvas.getByRole('heading', { name: 'Archive project?' });
		await expect(getComputedStyle(heading).fontSize).toBe(
			getComputedStyle(heading.parentElement as HTMLElement).fontSize,
		);
		await expect(getComputedStyle(heading).marginTop).toBe('0px');
		await expect(canvas.getByRole('heading', { name: 'Archive project?' })).toHaveAttribute(
			'id',
			dialog.getAttribute('aria-labelledby'),
		);
		await userEvent.click(canvas.getByRole('button', { name: 'close' }));
		await expect(args.onClose).toHaveBeenCalledTimes(1);
		await expect(args.onReject).not.toHaveBeenCalled();
	},
};
export const CustomName: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	args: { title: 'Details', dialogName: 'Project details', close: false },
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('dialog', { name: 'Project details' })).not.toHaveAttribute(
			'aria-labelledby',
		);
	},
};
export const FallbackName: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	args: { close: false },
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('dialog', { name: 'Dialog' })).toBeInTheDocument();
	},
};
export const ResolveAction: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	args: { title: 'Save', actions: [{ id: 'save', label: 'Save', value: 'saved' }] },
	play: async ({ canvasElement, args }) => {
		await userEvent.click(within(canvasElement).getByRole('button', { name: 'Save' }));
		await expect(args.onAction).toHaveBeenCalledWith('saved');
		await expect(args.onResolve).toHaveBeenCalledWith('saved');
		await expect(args.onReject).not.toHaveBeenCalled();
	},
};
export const RejectAction: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	args: { actions: [{ id: 'cancel', label: 'Cancel', value: 'cancelled', promise: 'reject' }] },
	play: async ({ canvasElement, args }) => {
		await userEvent.click(within(canvasElement).getByRole('button', { name: 'Cancel' }));
		await expect(args.onReject).toHaveBeenCalledWith(expect.objectContaining({ cause: 'cancelled' }));
		await expect(args.onResolve).not.toHaveBeenCalled();
	},
};
export const ActionOnly: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	args: { actions: [{ id: 'preview', tooltip: 'Preview', iconLeft: 'basic.home', value: 'preview', promise: 'none' }] },
	play: async ({ canvasElement, args }) => {
		await userEvent.click(within(canvasElement).getByRole('button', { name: 'Preview' }));
		await expect(args.onAction).toHaveBeenCalledWith('preview');
		await expect(args.onReject).not.toHaveBeenCalled();
		await expect(args.onResolve).not.toHaveBeenCalled();
	},
};
export const DisabledActions: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	args: {
		actions: [
			{ id: 'disabled', label: 'Disabled', disabled: true },
			{ id: 'working', label: 'Working', working: true },
		],
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button', { name: 'Disabled' })).toBeDisabled();
		await userEvent.click(canvas.getByRole('button', { name: /Working/ }));
		await expect(args.onAction).not.toHaveBeenCalled();
	},
};
export const ContainedPanel: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	render: (args) => (
		<div data-testid="container" style={{ width: 240 }}>
			<DialogBox
				{...args}
				title="A very long project title that should wrap safely inside this narrow panel"
				padding="calc(8px + 2px) 12px"
				actions={[
					{ id: 'a', label: 'First action' },
					{ id: 'b', label: 'Second action' },
				]}
			>
				Content
			</DialogBox>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const dialog = canvas.getByRole('dialog');
		await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(240);
		const heading = canvas.getByRole('heading');
		const header = heading.parentElement?.parentElement as HTMLElement;
		await expect(getComputedStyle(header).paddingTop).toBe('10px');
		await expect(getComputedStyle(header).paddingBottom).toBe('10px');
		await expect(getComputedStyle(header).paddingLeft).toBe('12px');
	},
};
export const DynamicScroll: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	render: (args) => {
		const [long, setLong] = useState(false);
		return (
			<DialogBox {...args} minHeight={0} maxHeight={360} title="Notes" actions={[{ id: 'done', label: 'Done' }]}>
				<button type="button" onClick={() => setLong(!long)}>
					Change content
				</button>
				<div style={{ height: long ? 600 : 20 }}>Notes</div>
			</DialogBox>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const footer = canvas.getByRole('button', { name: 'Done' }).parentElement?.parentElement as HTMLElement;
		await waitFor(() => expect(getComputedStyle(footer).borderTopWidth).toBe('0px'));
		await userEvent.click(canvas.getByRole('button', { name: 'Change content' }));
		await waitFor(() => expect(getComputedStyle(footer).borderTopWidth).toBe('1px'));
		await userEvent.click(canvas.getByRole('button', { name: 'Change content' }));
		await waitFor(() => expect(getComputedStyle(footer).borderTopWidth).toBe('0px'));
	},
};
export const DragSurfaces: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	args: { title: 'Move panel', onDragPointerDown: fn(), actions: [{ id: 'done', label: 'Done' }] },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('heading', { name: 'Move panel' }));
		await expect(args.onDragPointerDown).toHaveBeenCalledTimes(1);
		await userEvent.click(canvas.getByRole('button', { name: 'Done' }));
		await userEvent.click(canvas.getByRole('button', { name: 'close' }));
		await expect(args.onDragPointerDown).toHaveBeenCalledTimes(1);
	},
};

function SharedActions() {
	const { close, resolve, reject } = useDialogBox<number>();
	return (
		<>
			<Button label="Cancel" onClick={close} />
			<Button label="Reject" onClick={() => reject(new Error('Cancelled'))} />
			<Button label="Save" onClick={() => resolve(42)} />
		</>
	);
}

export const ComposedSections: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	render: (args) => (
		<DialogBox<number>
			onResolve={args.onResolve}
			onReject={args.onReject}
			onClose={args.onClose}
			onAction={args.onAction}
		>
			<DialogBox.Actions>
				<SharedActions />
			</DialogBox.Actions>
			<>
				<DialogBox.Content>Project notes</DialogBox.Content>
				{true && (
					<DialogBox.Title>
						<span>Project</span> details
					</DialogBox.Title>
				)}
			</>
		</DialogBox>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const dialog = canvas.getByRole('dialog', { name: 'Project details' });
		const heading = canvas.getByRole('heading', { name: 'Project details' });
		await expect(heading).toHaveAttribute('id', dialog.getAttribute('aria-labelledby'));
		const body = canvas.getByText('Project notes');
		const save = canvas.getByRole('button', { name: 'Save' });
		await expect(Boolean(heading.compareDocumentPosition(body) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true);
		await expect(Boolean(body.compareDocumentPosition(save) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true);
		await userEvent.click(save);
		await expect(args.onResolve).toHaveBeenCalledWith(42);
		await expect(args.onAction).not.toHaveBeenCalled();
		await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
		await expect(args.onClose).toHaveBeenCalledTimes(1);
		await userEvent.click(canvas.getByRole('button', { name: 'Reject' }));
		await expect(args.onReject).toHaveBeenCalledWith(expect.objectContaining({ message: 'Cancelled' }));
	},
};
export const ComposedScroll: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	render: (args) => (
		<DialogBox {...args} minHeight={0} maxHeight={300}>
			<DialogBox.Title>Long notes</DialogBox.Title>
			<DialogBox.Content>
				<div style={{ height: 600 }}>Scrollable notes</div>
			</DialogBox.Content>
			<DialogBox.Actions>
				<Button label="Done" onClick={args.onClose} />
			</DialogBox.Actions>
		</DialogBox>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = canvas.getByText('Scrollable notes').parentElement?.parentElement as HTMLElement;
		const panel = canvas.getByRole('dialog');
		const innerRight =
			panel.getBoundingClientRect().right - Number.parseFloat(getComputedStyle(panel).borderRightWidth);
		await expect(Math.abs(innerRight - body.getBoundingClientRect().right - 4)).toBeLessThanOrEqual(1);
		await expect(body.clientHeight).toBeGreaterThan(40);
		await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
		await waitFor(() => expect(getComputedStyle(body.firstElementChild as HTMLElement).marginTop).toBe('2px'));
		const footer = canvas.getByRole('button', { name: 'Done' }).parentElement?.parentElement as HTMLElement;
		await waitFor(() => expect(getComputedStyle(footer).borderTopWidth).toBe('1px'));
	},
};

export const EmptyComposedTitle: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	render: (args) => (
		<DialogBox {...args} dialogName="  ">
			<DialogBox.Title>{[' ', false, null]}</DialogBox.Title>
			<DialogBox.Content>Notes</DialogBox.Content>
		</DialogBox>
	),
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('dialog', { name: 'Dialog' })).not.toHaveAttribute('aria-labelledby');
	},
};

class InvalidCompositionBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
	state: { error: Error | null } = { error: null };

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	render() {
		if (this.state.error) return <p role="alert">{this.state.error.message}</p>;
		return this.props.children;
	}
}

export const InvalidComposition: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	render: () => (
		<>
			<InvalidCompositionBoundary>
				<DialogBox.Title>Outside title</DialogBox.Title>
			</InvalidCompositionBoundary>
			<InvalidCompositionBoundary>
				<DialogBox.Content>Outside content</DialogBox.Content>
			</InvalidCompositionBoundary>
			<InvalidCompositionBoundary>
				<DialogBox.Actions>Outside actions</DialogBox.Actions>
			</InvalidCompositionBoundary>
			<InvalidCompositionBoundary>
				<DialogBox>
					<DialogBox.Title>Heading</DialogBox.Title>
					<div>Unsupported direct body</div>
				</DialogBox>
			</InvalidCompositionBoundary>
		</>
	),
	play: async ({ canvasElement }) => {
		const alerts = within(canvasElement).getAllByRole('alert');
		await expect(alerts).toHaveLength(4);
		await expect(alerts[0]).toHaveTextContent('DialogBox.Title must be a direct child');
		await expect(alerts[1]).toHaveTextContent('DialogBox.Content must be a direct child');
		await expect(alerts[2]).toHaveTextContent('DialogBox.Actions must be a direct child');
		await expect(alerts[3]).toHaveTextContent('composition accepts only');
	},
};

export const BodyAndFooterDefaults: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	render: (args) => (
		<div style={{ color: 'black' }}>
			<span data-testid="body-color" style={{ color: 'var(--core-text-secondary)', display: 'none' }} />
			<DialogBox {...args} style={{ width: 400 }}>
				<DialogBox.Title>Project notes</DialogBox.Title>
				<DialogBox.Content>
					<span>Body copy</span>
				</DialogBox.Content>
				<DialogBox.Actions>
					<Button label="Cancel" />
					<Button label="Save" />
				</DialogBox.Actions>
			</DialogBox>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(getComputedStyle(canvas.getByText('Body copy')).color).toBe(
			getComputedStyle(canvas.getByTestId('body-color')).color,
		);
		const save = canvas.getByRole('button', { name: 'Save' });
		const group = save.parentElement as HTMLElement;
		const footer = group.parentElement as HTMLElement;
		const expectedRight =
			footer.getBoundingClientRect().right -
			Number.parseFloat(getComputedStyle(footer).paddingRight) -
			Number.parseFloat(getComputedStyle(footer).borderRightWidth);
		await expect(Math.abs(group.getBoundingClientRect().right - expectedRight)).toBeLessThanOrEqual(1);
	},
};

export const ActionsBackgroundFollowsBase: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	render: (args) => {
		const [background, setBackground] = useState('#808080');
		return (
			<>
				<span data-testid="footer-color" style={{ display: 'none', backgroundColor: background }} />
				<DialogBox {...args} backgroundColor={background}>
					<DialogBox.Content>
						<button type="button" onClick={() => setBackground('#404040')}>
							Change background
						</button>
					</DialogBox.Content>
					<DialogBox.Actions>
						<Button label="Done" />
					</DialogBox.Actions>
				</DialogBox>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const footer = canvas.getByRole('button', { name: 'Done' }).parentElement?.parentElement as HTMLElement;
		await expect(getComputedStyle(footer).backgroundColor).toBe(
			getComputedStyle(canvas.getByTestId('footer-color')).backgroundColor,
		);
		const previous = getComputedStyle(footer).backgroundColor;
		await userEvent.click(canvas.getByRole('button', { name: 'Change background' }));
		await expect(getComputedStyle(footer).backgroundColor).not.toBe(previous);
		await expect(getComputedStyle(footer).backgroundColor).toBe(
			getComputedStyle(canvas.getByTestId('footer-color')).backgroundColor,
		);
	},
};
export const ScrollingSectionBackgrounds: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	render: function ScrollingExample(args) {
		const [overflow, setOverflow] = useState(false);
		return (
			<>
				<span data-testid="scroll-color" style={{ display: 'none', backgroundColor: 'var(--core-fill-primary)' }} />
				<button type="button" onClick={() => setOverflow((value) => !value)}>
					Toggle overflow
				</button>
				<DialogBox {...args} title="Project details" backgroundColor="#808080" maxHeight={240}>
					<DialogBox.Content>
						<div style={{ height: overflow ? 500 : 20 }}>Project notes</div>
					</DialogBox.Content>
					<DialogBox.Actions>
						<Button label="Done" />
					</DialogBox.Actions>
				</DialogBox>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const header = canvas.getByRole('heading', { name: 'Project details' }).parentElement?.parentElement as HTMLElement;
		const footer = canvas.getByRole('button', { name: 'Done' }).parentElement?.parentElement as HTMLElement;
		const fill = getComputedStyle(canvas.getByTestId('scroll-color')).backgroundColor;
		await expect(getComputedStyle(header).paddingBottom).toBe('0px');
		for (const section of [header, footer])
			await waitFor(() => expect(getComputedStyle(section).backgroundColor).toBe('rgb(128, 128, 128)'));
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle overflow' }));
		for (const section of [header, footer])
			await waitFor(() => expect(getComputedStyle(section).backgroundColor).toBe(fill));
		await expect(getComputedStyle(header).paddingBottom).toBe('4px');
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle overflow' }));
		for (const section of [header, footer])
			await waitFor(() => expect(getComputedStyle(section).backgroundColor).toBe('rgb(128, 128, 128)'));
		await expect(getComputedStyle(header).paddingBottom).toBe('0px');
	},
};

export const ExplicitZeroHeaderPadding: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	args: { padding: 0 },
	render: ScrollingSectionBackgrounds.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const header = canvas.getByRole('heading', { name: 'Project details' }).parentElement?.parentElement as HTMLElement;
		const fill = getComputedStyle(canvas.getByTestId('scroll-color')).backgroundColor;
		await expect(getComputedStyle(header).paddingBottom).toBe('0px');
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle overflow' }));
		await waitFor(() => expect(getComputedStyle(header).backgroundColor).toBe(fill));
		await expect(getComputedStyle(header).paddingBottom).toBe('0px');
	},
};

export const ExplicitSectionBackgrounds: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	args: { titleBackgroundColor: '#123456', actionsBackgroundColor: 'transparent' },
	render: ScrollingSectionBackgrounds.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const header = canvas.getByRole('heading', { name: 'Project details' }).parentElement?.parentElement as HTMLElement;
		const footer = canvas.getByRole('button', { name: 'Done' }).parentElement?.parentElement as HTMLElement;
		for (let step = 0; step < 3; step++) {
			await expect(getComputedStyle(header).backgroundColor).toBe('rgb(18, 52, 86)');
			await expect(getComputedStyle(footer).backgroundColor).toBe('rgba(0, 0, 0, 0)');
			await userEvent.click(canvas.getByRole('button', { name: 'Toggle overflow' }));
		}
	},
};

export const ActionsBackgroundOverride: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	args: { actionsBackgroundColor: 'core-surface-primary', actions: [{ id: 'done', label: 'Done' }] },
	render: (args) => (
		<>
			<span data-testid="footer-color" style={{ display: 'none', backgroundColor: 'var(--core-surface-primary)' }} />
			<DialogBox {...args}>Notes</DialogBox>
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const footer = canvas.getByRole('button', { name: 'Done' }).parentElement?.parentElement as HTMLElement;
		await expect(getComputedStyle(footer).backgroundColor).toBe(
			getComputedStyle(canvas.getByTestId('footer-color')).backgroundColor,
		);
	},
};
export const TransparentActionsBackground: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	args: { actionsBackgroundColor: 'transparent', actions: [{ id: 'done', label: 'Done' }] },
	play: async ({ canvasElement }) => {
		const footer = within(canvasElement).getByRole('button', { name: 'Done' }).parentElement
			?.parentElement as HTMLElement;
		await expect(getComputedStyle(footer).backgroundColor).toBe('rgba(0, 0, 0, 0)');
	},
};

export const ExplicitMinimumWidth: StoryObj<typeof DialogBox> = {
	tags: ['tests'],
	render: (args) => (
		<div style={{ width: 240 }}>
			<DialogBox {...args} title="Explicit minimum" minWidth={300} maxWidth={200}>
				Short content
			</DialogBox>
		</div>
	),
	play: async ({ canvasElement }) => {
		await expect(
			within(canvasElement).getByRole('dialog', { name: 'Explicit minimum' }).getBoundingClientRect().width,
		).toBe(300);
	},
};
