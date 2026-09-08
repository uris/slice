import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import type { ModalDescriptor } from './_types';
import { useModal, useModalActions, useModalStore } from './modalStore';

const FakeComponent = () => null;

function descriptor(id: string): ModalDescriptor {
	return { id, component: FakeComponent };
}

beforeEach(() => {
	useModalStore.setState({ modal: null });
});

describe('modalStore', () => {
	it('show() sets the active modal, stripping resolve/reject', () => {
		useModalStore.getState().actions.show(descriptor('a'));
		const modal = useModalStore.getState().modal;

		expect(modal?.id).toBe('a');
		expect(modal?.resolve).toBeUndefined();
		expect(modal?.reject).toBeUndefined();
	});

	it('show() with the exact current modal reference is a no-op', () => {
		useModalStore.getState().actions.show(descriptor('a'));
		const stored = useModalStore.getState().modal;

		useModalStore.getState().actions.show(stored);

		expect(useModalStore.getState().modal).toBe(stored);
	});

	it('show() rejects a previously pending modalResponse()', async () => {
		const pending = useModalStore.getState().actions.modalResponse(descriptor('a'));
		useModalStore.getState().actions.show(descriptor('b'));

		await expect(pending).rejects.toThrow('Modal replaced.');
		expect(useModalStore.getState().modal?.id).toBe('b');
	});

	it('modalResponse() resolves via the modal state resolve callback', async () => {
		const pending = useModalStore.getState().actions.modalResponse<string>(
			descriptor('a'),
		);

		useModalStore.getState().modal?.resolve?.('done');

		await expect(pending).resolves.toBe('done');
		expect(useModalStore.getState().modal).toBeNull();
	});

	it('modalResponse() rejects via the modal state reject callback', async () => {
		const pending = useModalStore.getState().actions.modalResponse(descriptor('a'));

		useModalStore.getState().modal?.reject?.(new Error('nope'));

		await expect(pending).rejects.toThrow('nope');
		expect(useModalStore.getState().modal).toBeNull();
	});

	it('hide() rejects the pending modal and clears state', async () => {
		const pending = useModalStore.getState().actions.modalResponse(descriptor('a'));

		useModalStore.getState().actions.hide();

		await expect(pending).rejects.toThrow('Modal dismissed.');
		expect(useModalStore.getState().modal).toBeNull();
	});

	it('hide() accepts a custom reject reason', async () => {
		const pending = useModalStore.getState().actions.modalResponse(descriptor('a'));

		useModalStore.getState().actions.hide('custom reason');

		await expect(pending).rejects.toBe('custom reason');
	});

	it('resolve()/reject() actions call through to the active modal', async () => {
		const pending = useModalStore.getState().actions.modalResponse<number>(
			descriptor('a'),
		);
		useModalStore.getState().actions.resolve(7);
		await expect(pending).resolves.toBe(7);
		expect(useModalStore.getState().modal).toBeNull();

		const pending2 = useModalStore.getState().actions.modalResponse(descriptor('b'));
		useModalStore.getState().actions.reject('bad');
		await expect(pending2).rejects.toBe('bad');
		expect(useModalStore.getState().modal).toBeNull();
	});

	it('clear() rejects any pending modal and is a no-op when idle', async () => {
		const pending = useModalStore.getState().actions.modalResponse(descriptor('a'));
		useModalStore.getState().actions.clear();
		await expect(pending).rejects.toThrow('Modal cleared.');

		expect(() => useModalStore.getState().actions.clear()).not.toThrow();
		expect(useModalStore.getState().modal).toBeNull();
	});

	it('exposes atomic selector hooks', () => {
		const { result: modalResult } = renderHook(() => useModal());
		const { result: actionsResult } = renderHook(() => useModalActions());

		expect(modalResult.current).toBeNull();
		expect(typeof actionsResult.current.show).toBe('function');
	});
});
