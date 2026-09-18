import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { IconButton } from 'src/components/IconButton';
import {
	runToastContainerParentPlay,
	runToastCustomClassPlay,
	runToastErrorInfiniteDurationPlay,
	runToastExplicitProgressPlay,
	runToastInfoPlay,
	runToastNoBorderNoClosePlay,
	runToastPositionTopPlay,
	runToastSuccessHoverPausePlay,
	runToastWarningKeyboardDismissPlay,
	runToastWithoutDidHidePlay,
} from 'src/components/playHelpers';
import { toastActions as toastActionsImperative, useToast, useToastActions } from 'src/stores/toast';
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
		textSize: 'm',
		close: true,
		type: ToastType.Info,
	},
};

export default meta;

// shared render across every story below — each story drives a single,
// independent flow against the SAME markup rather than chaining several
// flows through one story, so no story depends on a previous one's async
// dismiss/clear having fully settled first.
function ToastDemo(args: Parameters<Exclude<StoryObj<typeof Toast>['render'], undefined>>[0]) {
	const toast = useToast();
	const toastActions = useToastActions();

	// pass a type/duration through so each story can exercise its own
	// colorScheme/iconColor switch branch and the Infinite-duration/progress
	// branch, not just the default Info path a single fixed button would hit.
	const handleToast = (message: string, type?: ToastType, duration?: number | 'Infinite') => {
		toastActions.push({
			message,
			type,
			duration: duration ?? args.duration ?? 5000,
		});
	};

	return (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={16}>
			Click me!
			<IconButton
				icon={'home'}
				aria-label={'Info Toast'}
				onClick={() => handleToast('Thank you for clicking!', ToastType.Info)}
				toggle={false}
				hover={true}
			/>
			<IconButton
				icon={'check'}
				aria-label={'Success Toast'}
				onClick={() => handleToast('Saved successfully', ToastType.Success)}
				toggle={false}
				hover={true}
			/>
			<IconButton
				icon={'alert'}
				aria-label={'Warning Toast'}
				onClick={() => handleToast('Careful now', ToastType.Warning)}
				toggle={false}
				hover={true}
			/>
			<IconButton
				icon={'x'}
				aria-label={'Error Toast'}
				onClick={() => handleToast('Something failed', ToastType.Error, 'Infinite')}
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
}

export const Demo: StoryObj<typeof Toast> = {
	render: (args) => <ToastDemo {...args} />,
	play: async ({ canvasElement, args }) => {
		// the store is a module-level singleton shared across stories in this
		// file — reset it before each one so a previous story's leftover toast
		// (or a slow pending clear()) can never bleed into this run
		toastActionsImperative.clear();
		await runToastInfoPlay({ canvasElement, args });
	},
};

export const SuccessHoverPause: StoryObj<typeof Toast> = {
	tags: ['tests'],
	render: (args) => <ToastDemo {...args} />,
	play: async ({ canvasElement, args }) => {
		toastActionsImperative.clear();
		await runToastSuccessHoverPausePlay({ canvasElement, args });
	},
};

export const WarningKeyboardDismiss: StoryObj<typeof Toast> = {
	tags: ['tests'],
	render: (args) => <ToastDemo {...args} />,
	play: async ({ canvasElement, args }) => {
		toastActionsImperative.clear();
		await runToastWarningKeyboardDismissPlay({ canvasElement, args });
	},
};

export const ErrorInfiniteDuration: StoryObj<typeof Toast> = {
	tags: ['tests'],
	render: (args) => <ToastDemo {...args} />,
	play: async ({ canvasElement, args }) => {
		toastActionsImperative.clear();
		await runToastErrorInfiniteDurationPlay({ canvasElement, args });
	},
};

// direct render, bypassing the toast store — these stories only need a
// single fixed set of props rather than the multi-type click-through demo
export const CustomClassName: StoryObj<typeof Toast> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Toast message={'Custom class toast'} className={'story-toast-class'} showDelay={0} duration={'Infinite'} />
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		await runToastCustomClassPlay({ canvasElement });
	},
};

export const WithoutDidHide: StoryObj<typeof Toast> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Toast message={'Bye for now'} showDelay={0} duration={200} />
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		await runToastWithoutDidHidePlay({ canvasElement });
	},
};

export const NoBorderNoClose: StoryObj<typeof Toast> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Toast message={'Plain toast'} showDelay={0} duration={'Infinite'} border={false} close={false} />
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		await runToastNoBorderNoClosePlay({ canvasElement });
	},
};

export const ContainerParent: StoryObj<typeof Toast> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Toast message={'Parent-relative toast'} showDelay={0} duration={'Infinite'} container={'parent'} />
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		await runToastContainerParentPlay({ canvasElement });
	},
};

export const PositionTop: StoryObj<typeof Toast> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Toast message={'Top toast'} showDelay={0} duration={'Infinite'} position={'top'} />
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		await runToastPositionTopPlay({ canvasElement });
	},
};

export const ExplicitProgress: StoryObj<typeof Toast> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Toast message={'Progress toast'} showDelay={0} duration={5000} progress={true} />
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		await runToastExplicitProgressPlay({ canvasElement });
	},
};
