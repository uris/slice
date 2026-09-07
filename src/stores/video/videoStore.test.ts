import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useVideo, useVideoActions, useVideoStore } from './videoStore';

const FakeComponent = () => null;

function descriptor(id: string) {
	return { id, component: FakeComponent };
}

beforeEach(() => {
	useVideoStore.setState({ video: null });
});

describe('videoStore', () => {
	it('show() sets the active video', () => {
		useVideoStore.getState().actions.show(descriptor('a'));
		expect(useVideoStore.getState().video?.id).toBe('a');
	});

	it('show() with the exact current video reference is a no-op', () => {
		useVideoStore.getState().actions.show(descriptor('a'));
		const stored = useVideoStore.getState().video;

		useVideoStore.getState().actions.show(stored);

		expect(useVideoStore.getState().video).toBe(stored);
	});

	it('show(null) clears the video', () => {
		useVideoStore.getState().actions.show(descriptor('a'));
		useVideoStore.getState().actions.show(null);
		expect(useVideoStore.getState().video).toBeNull();
	});

	it('clear() resets the video to null', () => {
		useVideoStore.getState().actions.show(descriptor('a'));
		useVideoStore.getState().actions.clear();
		expect(useVideoStore.getState().video).toBeNull();
	});

	it('exposes atomic selector hooks', () => {
		useVideoStore.getState().actions.show(descriptor('a'));
		const { result: videoResult } = renderHook(() => useVideo());
		const { result: actionsResult } = renderHook(() => useVideoActions());

		expect(videoResult.current?.id).toBe('a');
		expect(typeof actionsResult.current.show).toBe('function');
	});
});
