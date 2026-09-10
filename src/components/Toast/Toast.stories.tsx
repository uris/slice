import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { IconButton } from 'src/components/IconButton';
import { useToast, useToastActions } from 'src/stores/toast';
import { Toast } from './Toast';
import { ToastType } from './_types';

const meta: Meta<typeof Toast> = {
	title: 'Components/Toast',
	component: Toast,
	argTypes: {
		type: {
			control: { type: 'radio' }, // Dropdown selection
			options: Object.values(ToastType), // Enum values as options
		},
	},
	args: {
		message: undefined,
		border: undefined,
		radius: undefined,
		padding: undefined,
		offset: undefined,
		position: 'bottom',
		progress: undefined,
		size: 'm',
		close: true,
		type: ToastType.Info,
	},
};

export default meta;

export const Demo: StoryObj<typeof Toast> = {
	render: (args) => {
		const toast = useToast();
		const toastActions = useToastActions();

		const handleToast = (message?: string | null) => {
			const notification = {
				message: message ?? null,
				duration: args.duration ?? 5000,
			};
			toastActions.push(notification);
		};

		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={16}>
				Click me!
				<IconButton
					icon={'home'}
					tooltip={'Go Home'}
					onClick={() => handleToast('Thank you for clicking!')}
					toggle={false}
					hover={true}
				/>
				<Toast
					{...args}
					message={toast?.message ?? null}
					type={toast?.type ?? args.type}
					close={toast?.close ?? args.close}
					duration={toast?.duration ?? args.duration}
					didHide={toastActions.clear}
				/>
			</FlexDiv>
		);
	},
};
