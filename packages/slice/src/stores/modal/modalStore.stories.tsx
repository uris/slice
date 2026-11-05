import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { Button } from 'src/components/Button';
import { DialogBox } from 'src/components/DialogBox/DialogBox';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { ModalController } from 'src/components/ModalController/ModalController';
import { useModalActions } from 'src/stores/modal';
import type { DialogBoxAction, DialogBoxProps } from '../../components/DialogBox/_types';

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
};

const meta: Meta<typeof ModalController> = {
	title: 'Stores/Modal Store',
	component: ModalController,
	parameters: {
		a11y: { test: 'todo' },
	},
	args: {},
};

export default meta;

export const Demo: StoryObj<typeof ModalController> = {
	render: (args) => <ModalStoreDemo {...args} />,
};

function ModalStoreDemo(args: React.ComponentProps<typeof ModalController>) {
	const modalResponse = useModalActions().modalResponse;
	const ref = useRef<HTMLDivElement>(null);

	const showAsyncModalClick = async () => {
		const result = await modalResponse<DemoModalType>({
			id: 'modal-confirm',
			component: DialogBox<DemoModalType>,
			props: demoDialogBoxProps,
		}).catch((err) => {
			const msg = err instanceof Error ? err.message : String(err);
			alert(msg);
		});
		if (result) alert(`id: ${result.modalId}, data: ${result.data}`);
	};

	return (
		<FlexDiv absolute justify={'center'} align={'center'} ref={ref}>
			<Button iconRight={'arrows.arrow-right'} onClick={showAsyncModalClick}>
				Continue
			</Button>
			<ModalController {...args} dragConstraintsRef={ref} draggable={true} />
		</FlexDiv>
	);
}
