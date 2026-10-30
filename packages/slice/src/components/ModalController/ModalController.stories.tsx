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
import { fn } from 'storybook/test';
import { modalActions as modalActionsImperative, useModalActions } from '../../stores';
import { Button } from '../Button';
import { Modal } from '../Modal';
import type { ModalAction, ModalProps } from '../Modal/_types';

type DemoModalType = { modalId: string; data: string };

const demoActions: ModalAction<DemoModalType>[] = [
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

const demoModalProps: ModalProps<DemoModalType> = {
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
const demoModalPropsWithoutCallbacks: ModalProps<DemoModalType> = {
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
	render: () => <ModalControllerDemo modalProps={demoModalPropsWithoutCallbacks} />,
	play: async ({ canvasElement, args }) => {
		modalActionsImperative.clear();
		await runModalControllerResolveWithoutCallbacksPlay({ canvasElement, args });
	},
};

export const RejectWithoutCallbacks: StoryObj<typeof ModalController> = {
	tags: ['tests'],
	render: () => <ModalControllerDemo modalProps={demoModalPropsWithoutCallbacks} />,
	play: async ({ canvasElement, args }) => {
		modalActionsImperative.clear();
		await runModalControllerRejectWithoutCallbacksPlay({ canvasElement, args });
	},
};

function ModalControllerDemo({
	draggable = true,
	modalProps = demoModalProps,
}: {
	draggable?: boolean;
	modalProps?: ModalProps<DemoModalType>;
}) {
	const modalResponse = useModalActions().modalResponse;

	// await the modal response value
	const showAsyncModalClick = async () => {
		const result = await modalResponse<DemoModalType>({
			id: 'modal-confirm',
			component: Modal<DemoModalType>,
			props: modalProps,
		}).catch((err) => {
			const msg = err instanceof Error ? err.message : String(err);
			alert(msg);
		});
		if (result) alert(`id: ${result.modalId}, data: ${result.data}`);
	};

	return (
		<FlexDiv absolute justify={'center'} align={'center'}>
			<Button iconRight={'arrow right'} onClick={showAsyncModalClick}>
				Continue
			</Button>
			<ModalController draggable={draggable} />
		</FlexDiv>
	);
}
