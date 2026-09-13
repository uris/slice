import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { useToast, useToastActions } from 'src/stores/toast';
import { IconButton } from '../../components/IconButton';
import { Toast, ToastType } from '../../components/Toast';

const meta: Meta<typeof Toast> = {
	title: 'Stores/Toast Store',
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
		size: 'm',
		close: true,
		type: ToastType.Info,
		container: 'parent',
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
				duration: 5000,
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
					container={'window'}
				/>
			</FlexDiv>
		);
	},
};
