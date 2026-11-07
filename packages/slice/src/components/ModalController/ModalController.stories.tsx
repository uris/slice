import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { ModalController } from 'src/components/ModalController/ModalController';
import {
	runModalControllerDismissViaBackdropPlay,
	runModalControllerNotDraggablePlay,
	runModalControllerPlay,
	runModalControllerRejectViaCloseButtonPlay,
	runModalControllerRejectWithoutCallbacksPlay,
	runModalControllerResolveViaPrimaryActionPlay,
	runModalControllerResolveWithoutCallbacksPlay,
} from 'src/components/playHelpers';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { modalActions as modalActionsImperative, useModalActions } from '../../stores';
import { Button } from '../Button';
import { DialogBox } from '../DialogBox';
import type { DialogBoxAction, DialogBoxProps } from '../DialogBox/_types';

type DemoModalType = { modalId: string; data: string };

const demoActions: DialogBoxAction<DemoModalType>[] = [
	{
		id: 'no',
		label: 'No',
		promise: 'resolve',
		value: { modalId: 'modal-confirm', data: 'no' },
	},
	{
		id: 'yes',
		label: 'Yes',
		promise: 'resolve',
		value: { modalId: 'modal-confirm', data: 'yes' },
		primary: true,
	},
];

const demoDialogBoxProps: DialogBoxProps<DemoModalType> = {
	title: 'Continue?',
	actions: demoActions,
	children: 'Are you sure you want to continue',
	// exercise ModalController's onResolve/onReject/onClose/onDragPointerDown
	// pass-through branches, which otherwise never see a truthy modalProps callback
	onResolve: fn(),
	onReject: fn(),
	onClose: fn(),
	onDragPointerDown: fn(),
};

// no onResolve/onReject/onClose/onDragPointerDown at all - exercises
// ModalController's `typeof modalProps?.on... === 'function'` guards taking
// their false branch (the pass-through call is skipped, only the underlying
// resolve()/reject()/hide()/controls.start() run)
const demoDialogBoxPropsWithoutCallbacks: DialogBoxProps<DemoModalType> = {
	title: 'Continue?',
	actions: demoActions,
	children: 'Are you sure you want to continue',
};

const meta: Meta<typeof ModalController> = {
	title: 'Components/ModalController',
	component: ModalController,
	args: {},
};

export default meta;

// each story below mounts its own fresh ModalControllerDemo and resets the
// (module-singleton) modal store first, rather than driving resolve/reject/
// dismiss sequentially through one story — a settle path is followed by an
// exit animation that keeps the dialog mounted for ~0.35s, so chaining a
// second round onto the same instance meant carefully waiting that out each
// time. Splitting them removes the need for that entirely.

export const Default: StoryObj<typeof ModalController> = {
	render: () => <ModalControllerDemo />,
	play: async ({ canvasElement, args }) => {
		modalActionsImperative.clear();
		await runModalControllerPlay({ canvasElement, args });
	},
};

export const ResolveViaPrimaryAction: StoryObj<typeof ModalController> = {
	tags: ['tests'],
	render: () => <ModalControllerDemo />,
	play: async ({ canvasElement, args }) => {
		modalActionsImperative.clear();
		await runModalControllerResolveViaPrimaryActionPlay({ canvasElement, args });
	},
};

export const RejectViaCloseButton: StoryObj<typeof ModalController> = {
	tags: ['tests'],
	render: () => <ModalControllerDemo />,
	play: async ({ canvasElement, args }) => {
		modalActionsImperative.clear();
		await runModalControllerRejectViaCloseButtonPlay({ canvasElement, args });
	},
};

export const DismissViaBackdrop: StoryObj<typeof ModalController> = {
	tags: ['tests'],
	render: () => <ModalControllerDemo />,
	play: async ({ canvasElement, args }) => {
		modalActionsImperative.clear();
		await runModalControllerDismissViaBackdropPlay({ canvasElement, args });
	},
};

export const NotDraggable: StoryObj<typeof ModalController> = {
	tags: ['tests'],
	render: () => <ModalControllerDemo draggable={false} />,
	play: async ({ canvasElement, args }) => {
		modalActionsImperative.clear();
		await runModalControllerNotDraggablePlay({ canvasElement, args });
	},
};

export const ResolveWithoutCallbacks: StoryObj<typeof ModalController> = {
	tags: ['tests'],
	render: () => <ModalControllerDemo modalProps={demoDialogBoxPropsWithoutCallbacks} />,
	play: async ({ canvasElement, args }) => {
		modalActionsImperative.clear();
		await runModalControllerResolveWithoutCallbacksPlay({ canvasElement, args });
	},
};

export const RejectWithoutCallbacks: StoryObj<typeof ModalController> = {
	tags: ['tests'],
	render: () => <ModalControllerDemo modalProps={demoDialogBoxPropsWithoutCallbacks} />,
	play: async ({ canvasElement, args }) => {
		modalActionsImperative.clear();
		await runModalControllerRejectWithoutCallbacksPlay({ canvasElement, args });
	},
};

function ModalControllerDemo({
	draggable = true,
	modalProps = demoDialogBoxProps,
}: {
	draggable?: boolean;
	modalProps?: DialogBoxProps<DemoModalType>;
}) {
	const modalResponse = useModalActions().modalResponse;

	// await the modal response value
	const showAsyncModalClick = async () => {
		const result = await modalResponse<DemoModalType>({
			id: 'modal-confirm',
			component: DialogBox<DemoModalType>,
			props: modalProps,
		}).catch((err) => {
			const msg = err instanceof Error ? err.message : String(err);
			alert(msg);
		});
		if (result) alert(`id: ${result.modalId}, data: ${result.data}`);
	};

	return (
		<FlexDiv absolute justify={'center'} align={'center'}>
			<Button iconRight={'arrows.arrow-right'} onClick={showAsyncModalClick}>
				Continue
			</Button>
			<ModalController draggable={draggable} />
		</FlexDiv>
	);
}

function HostedDialogDemo() {
	const actions = useModalActions();
	return (
		<>
			<button
				type="button"
				onClick={() =>
					actions.show({
						id: 'hosted-dialog-test',
						component: DialogBox,
						props: { title: 'Hosted dialog', actions: [{ id: 'done', label: 'Done' }] },
					})
				}
			>
				Open hosted dialog
			</button>
			<ModalController draggable={false} transition={{ duration: 0 }} />
		</>
	);
}
export const ModalFocusAndEscape: StoryObj<typeof ModalController> = {
	tags: ['tests'],
	render: () => <HostedDialogDemo />,
	play: async ({ canvasElement }) => {
		modalActionsImperative.clear();
		const canvas = within(canvasElement);
		const opener = canvas.getByRole('button', { name: 'Open hosted dialog' });
		const overflow = document.body.style.overflow;
		await userEvent.click(opener);
		const dialog = await canvas.findByRole('dialog', { name: 'Hosted dialog' });
		await expect(dialog).toHaveAttribute('aria-modal', 'true');
		await expect(opener.inert).toBe(true);
		await expect(document.body.style.overflow).toBe('hidden');
		const close = canvas.getByRole('button', { name: 'close' });
		const done = canvas.getByRole('button', { name: 'Done' });
		await expect(close).toHaveFocus();
		await userEvent.tab({ shift: true });
		await expect(done).toHaveFocus();
		await userEvent.tab();
		await expect(close).toHaveFocus();
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
		await expect(opener).toHaveFocus();
		await expect(opener.inert).toBe(false);
		await expect(document.body.style.overflow).toBe(overflow);
	},
};
export const BackdropHitTesting: StoryObj<typeof ModalController> = {
	tags: ['tests'],
	render: () => <HostedDialogDemo />,
	play: async ({ canvasElement }) => {
		modalActionsImperative.clear();
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Open hosted dialog' }));
		await canvas.findByRole('dialog');
		const overlay = canvasElement.querySelector('[data-overlay]') as HTMLElement;
		const bounds = overlay.getBoundingClientRect();
		await expect(overlay.ownerDocument.elementFromPoint(bounds.left + 8, bounds.top + 8)).toBe(overlay);
		await userEvent.click(overlay);
		await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
	},
};

export const UnfocusedPointerOpener: StoryObj<typeof ModalController> = {
	tags: ['tests'],
	render: () => <HostedDialogDemo />,
	play: async ({ canvasElement }) => {
		modalActionsImperative.clear();
		const canvas = within(canvasElement);
		const opener = canvas.getByRole('button', { name: 'Open hosted dialog' });
		(document.activeElement as HTMLElement)?.blur();
		fireEvent.pointerDown(opener);
		fireEvent.click(opener);
		await canvas.findByRole('dialog');
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
		await expect(opener).toHaveFocus();
	},
};

function MinimumWidthDemo({ width }: { width: number }) {
	return (
		<div style={{ width, height: 360, transform: 'translateZ(0)' }}>
			<Button
				label="Open width test"
				onClick={() =>
					modalActionsImperative.show({
						id: 'modal-width-test',
						component: DialogBox,
						props: { title: 'Width test', minWidth: 300, maxWidth: 400, children: 'Short content' },
					})
				}
			/>
			<ModalController transition={{ duration: 0 }} />
		</div>
	);
}

export const DialogMinimumWidth: StoryObj<typeof ModalController> = {
	tags: ['tests'],
	render: () => <MinimumWidthDemo width={600} />,
	play: async ({ canvasElement }) => {
		modalActionsImperative.clear();
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Open width test' }));
		const dialog = await canvas.findByRole('dialog', { name: 'Width test' });
		await expect(dialog.getBoundingClientRect().width).toBe(300);
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
	},
};

export const DialogMinimumWidthOverridesHost: StoryObj<typeof ModalController> = {
	tags: ['tests'],
	render: () => <MinimumWidthDemo width={240} />,
	play: async ({ canvasElement }) => {
		modalActionsImperative.clear();
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Open width test' }));
		const dialog = await canvas.findByRole('dialog', { name: 'Width test' });
		await expect(dialog.getBoundingClientRect().width).toBe(300);
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
	},
};
