import { create } from 'zustand';
import type { ActiveModal, ModalDescriptor, ModalStore } from './_types';

function rejectPendingModal(modal: ActiveModal | null, reason?: unknown) {
	modal?.reject?.(reason);
}

export const useModalStore = create<ModalStore>((set, get) => ({
	modal: null,
	actions: {
		show: (modal: ModalDescriptor | null) => {
			const currentModal = get().modal;
			if (currentModal === modal) return;
			rejectPendingModal(currentModal, new Error('Modal replaced.'));
			set({
				modal: modal
					? {
							...modal,
							resolve: undefined,
							reject: undefined,
						}
					: null,
			});
		},
		modalResponse: <TResult = unknown>(modal: ModalDescriptor) => {
			const currentModal = get().modal;
			rejectPendingModal(currentModal, new Error('Modal replaced.'));
			return new Promise<TResult | undefined>((resolve, reject) => {
				set({
					modal: {
						...modal,
						resolve: (value?: unknown) => {
							resolve(value as TResult | undefined);
							set({ modal: null });
						},
						reject: (reason?: unknown) => {
							reject(reason);
							set({ modal: null });
						},
					},
				});
			});
		},
		hide: (reason?: unknown) => {
			const currentModal = get().modal;
			rejectPendingModal(currentModal, reason ?? new Error('Modal dismissed.'));
			set({ modal: null });
		},
		resolve: (value?: unknown) => {
			const currentModal = get().modal;
			currentModal?.resolve?.(value);
			set({ modal: null });
		},
		reject: (reason?: unknown) => {
			const currentModal = get().modal;
			currentModal?.reject?.(reason);
			set({ modal: null });
		},
		clear: () => {
			const currentModal = get().modal;
			rejectPendingModal(currentModal, new Error('Modal cleared.'));
			set({ modal: null });
		},
	},
}));

// atomic hook exports for use in React components
export const useModal = () => useModalStore((state) => state.modal);
export const useModalActions = () => useModalStore((state) => state.actions);

// non-reactive imperative exports for use outside the React context
export const modalActions = useModalStore.getState().actions;
export const getModal = () => useModalStore.getState().modal;
