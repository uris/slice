import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { Modal } from 'src/components/Modal/Modal';
import { fn } from 'storybook/test';
import type { ModalAction } from './_types';

const demoActions: ModalAction<string>[] = [
	{
		id: 'no',
		label: undefined,
		iconLeft: 'x',
		position: 'right',
		promise: 'resolve',
		value: 'no',
		primary: false,
		round: true,
	},
	{
		id: 'yes',
		label: 'Yes',
		position: 'right',
		promise: 'resolve',
		value: 'yes',
		primary: true,
	},
];

const meta: Meta<typeof Modal> = {
	title: 'Components/Modal',
	component: Modal,
	args: {
		minWidth: 350,
		minHeight: 200,
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

export const Default: StoryObj<typeof Modal> = {
	render: (args) => {
		const ref = useRef<HTMLDivElement>(null);
		return (
			<FlexDiv absolute justify={'center'} align={'center'} ref={ref}>
				<Modal<string> {...args} actions={demoActions} title={'Confirmation'}>
					Are you sure you would like to continue? Are you sure you would like to continue? Are you sure you would like
					to continue? Are you sure you would like to continue? Are you sure you would like to continue? Are you sure
					you would like to continue? Are you sure you would like to continue? Are you sure you would like to continue?
					Are you sure you would like to continue? Are you sure you would like to continue? Are you sure you would like
					to continue? Are you sure you would like to continue? Are you sure you would like to continue? Are you sure
					you would like to continue? Are you sure you would like to continue? Are you sure you would like to continue?
					Are you sure you would like to continue? Are you sure you would like to continue?
				</Modal>
			</FlexDiv>
		);
	},
};
