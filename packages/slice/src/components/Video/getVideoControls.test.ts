import { describe, expect, it } from 'vitest';
import { getVideoControls } from './getVideoControls';

describe('getVideoControls', () => {
	it('uses the simple shortcut only when the selection is omitted', () => {
		expect(getVideoControls()).toEqual({ play: false, progress: true, volume: true, fullscreen: true, captions: true, quit: false });
	});
	it('enables only explicitly selected controls', () => {
		expect(getVideoControls({ play: true })).toEqual({ play: true, progress: false, volume: false, fullscreen: false, captions: false, quit: false });
	});
	it('treats an empty or undefined-valued selection as no controls', () => {
		expect(Object.values(getVideoControls({}))).not.toContain(true);
		expect(Object.values(getVideoControls({ progress: undefined, play: false }))).not.toContain(true);
	});
});
