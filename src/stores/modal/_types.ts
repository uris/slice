import type React from 'react';

export type ModalComponentProps<TResult = unknown> = {
	onResolve?: (value?: TResult) => void;
	onReject?: (error?: Error) => void;
	onClose?: () => void;
	onDragPointerDown?: React.PointerEventHandler;
};

export type ModalDescriptor<TProps extends Record<string, unknown> = Record<string, unknown>, TResult = unknown> = {
	id?: string;
	component: React.ComponentType<TProps & ModalComponentProps<TResult>>;
	props?: TProps;
};

export type ActiveModal = ModalDescriptor & {
	resolve?: (value?: unknown) => void;
	reject?: (reason?: unknown) => void;
};

export interface ModalStore {
	modal: ActiveModal | null;
	actions: {
		show: (modal: ModalDescriptor | null) => void;
		hide: (reason?: unknown) => void;
		modalResponse: <TResult = unknown>(modal: ModalDescriptor) => Promise<TResult | undefined>;
		resolve: <TResult = unknown>(value?: TResult) => void;
		reject: (reason?: unknown) => void;
		clear: () => void;
	};
}
