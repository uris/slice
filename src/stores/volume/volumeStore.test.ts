import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useVolumeStore } from './volumeStore';

function resetStore() {
	useVolumeStore.setState({
		volume: 1,
		storedVolume: 1,
		muted: false,
		elements: new Set(),
		feedbackElement: null,
	});
}

beforeEach(() => {
	resetStore();
	vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
	vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('volumeStore', () => {
	it('attachMedia() adds elements and applies the current volume', () => {
		const audio = document.createElement('audio');
		useVolumeStore.setState({ volume: 0.5 });

		useVolumeStore.getState().actions.attachMedia(audio);

		expect(useVolumeStore.getState().elements.has(audio)).toBe(true);
		expect(audio.volume).toBe(0.5);
	});

	it('attachMedia() accepts an array of elements', () => {
		const audio = document.createElement('audio');
		const video = document.createElement('video');

		useVolumeStore.getState().actions.attachMedia([audio, video]);

		expect(useVolumeStore.getState().elements.size).toBe(2);
	});

	it('detachMedia() and clearMedia() remove elements', () => {
		const audio = document.createElement('audio');
		const video = document.createElement('video');
		useVolumeStore.getState().actions.attachMedia([audio, video]);

		useVolumeStore.getState().actions.detachMedia(audio);
		expect(useVolumeStore.getState().elements.has(audio)).toBe(false);
		expect(useVolumeStore.getState().elements.has(video)).toBe(true);

		useVolumeStore.getState().actions.clearMedia();
		expect(useVolumeStore.getState().elements.size).toBe(0);
	});

	it('setVolume() updates volume and applies it to attached media', async () => {
		const audio = document.createElement('audio');
		useVolumeStore.getState().actions.attachMedia(audio);

		await useVolumeStore.getState().actions.setVolume(0.3);

		expect(useVolumeStore.getState().volume).toBe(0.3);
		expect(useVolumeStore.getState().storedVolume).toBe(0.3);
		expect(audio.volume).toBe(0.3);
	});

	it('setVolume() forces 0 while muted but still updates storedVolume', async () => {
		useVolumeStore.setState({ muted: true });

		await useVolumeStore.getState().actions.setVolume(0.7);

		expect(useVolumeStore.getState().volume).toBe(0);
		expect(useVolumeStore.getState().storedVolume).toBe(0.7);
	});

	it('setVolume() plays feedback when requested and not muted', async () => {
		const feedback = document.createElement('audio');
		useVolumeStore.getState().actions.attachFeedbackElement(feedback);

		await useVolumeStore.getState().actions.setVolume(0.6, { playFeedback: true });

		expect(feedback.play).toHaveBeenCalled();
	});

	it('mute() zeroes the volume and remembers the previous value', async () => {
		useVolumeStore.setState({ volume: 0.8 });
		const audio = document.createElement('audio');
		useVolumeStore.getState().actions.attachMedia(audio);

		await useVolumeStore.getState().actions.mute();

		expect(useVolumeStore.getState().muted).toBe(true);
		expect(useVolumeStore.getState().volume).toBe(0);
		expect(useVolumeStore.getState().storedVolume).toBe(0.8);
		expect(audio.volume).toBe(0);
	});

	it('mute() is a no-op when already muted', async () => {
		useVolumeStore.setState({ muted: true, volume: 0, storedVolume: 0.5 });
		await useVolumeStore.getState().actions.mute();
		expect(useVolumeStore.getState().storedVolume).toBe(0.5);
	});

	it('unmute() restores the stored volume and plays feedback', async () => {
		const feedback = document.createElement('audio');
		useVolumeStore.getState().actions.attachFeedbackElement(feedback);
		useVolumeStore.setState({ muted: true, volume: 0, storedVolume: 0.4 });

		await useVolumeStore.getState().actions.unmute();

		expect(useVolumeStore.getState().muted).toBe(false);
		expect(useVolumeStore.getState().volume).toBe(0.4);
		expect(feedback.play).toHaveBeenCalled();
	});

	it('unmute() is a no-op when not muted', async () => {
		await useVolumeStore.getState().actions.unmute();
		expect(useVolumeStore.getState().muted).toBe(false);
	});

	it('playFeedback() is skipped while muted', async () => {
		const feedback = document.createElement('audio');
		useVolumeStore.getState().actions.attachFeedbackElement(feedback);
		useVolumeStore.setState({ muted: true });

		await useVolumeStore.getState().actions.playFeedback();

		expect(feedback.play).not.toHaveBeenCalled();
	});

	it('attachFeedbackElement() disables loop and detachFeedbackElement() clears it', () => {
		const feedback = document.createElement('audio');
		feedback.loop = true;

		useVolumeStore.getState().actions.attachFeedbackElement(feedback);
		expect(feedback.loop).toBe(false);
		expect(useVolumeStore.getState().feedbackElement).toBe(feedback);

		useVolumeStore.getState().actions.detachFeedbackElement(feedback);
		expect(useVolumeStore.getState().feedbackElement).toBeNull();
	});
});

describe('volume feedback and public accessors', () => {
	it('preserves the last audible volume at zero and restores attached media on unmute', async () => {
		const audio = document.createElement('audio');
		const video = document.createElement('video');
		const actions = useVolumeStore.getState().actions;
		actions.attachMedia([audio, video]);
		await actions.setVolume(0.65);
		await actions.setVolume(0);
		expect(useVolumeStore.getState().storedVolume).toBe(0.65);
		await actions.setVolume(0.65);
		await actions.mute();
		await actions.unmute();
		expect(audio.volume).toBe(0.65);
		expect(video.volume).toBe(0.65);
		actions.detachMedia([audio, video]);
		expect(useVolumeStore.getState().elements.size).toBe(0);
	});

	it('restarts playing feedback and tolerates playback rejection', async () => {
		const feedback = document.createElement('audio');
		Object.defineProperties(feedback, {
			paused: { value: false },
			ended: { value: false },
			readyState: { value: 4 },
		});
		feedback.currentTime = 3;
		vi.mocked(feedback.play).mockRejectedValue(new DOMException('Playback blocked', 'NotAllowedError'));
		const actions = useVolumeStore.getState().actions;
		actions.attachFeedbackElement(feedback);
		await expect(actions.playFeedback(0.456)).resolves.toBeUndefined();
		expect(feedback.pause).toHaveBeenCalledOnce();
		expect(feedback.currentTime).toBe(0);
		expect(feedback.volume).toBe(0.46);
	});

	it('plays feedback at the current volume and safely skips missing feedback', async () => {
		const actions = useVolumeStore.getState().actions;
		await expect(actions.playFeedback()).resolves.toBeUndefined();
		const feedback = document.createElement('audio');
		actions.attachFeedbackElement(feedback);
		await actions.setVolume(0.25, { playFeedback: false });
		expect(feedback.play).not.toHaveBeenCalled();
		await actions.playFeedback();
		expect(feedback.volume).toBe(0.25);
		expect(feedback.play).toHaveBeenCalledOnce();
	});

	it('imperative getters reflect changes made through the public actions', async () => {
		const { volumeActions, getVolume, getStoredVolume, getMuted, getAttachedMedia } = await import('./volumeStore');
		const audio = document.createElement('audio');
		volumeActions.attachMedia(audio);
		await volumeActions.setVolume(0.4);
		expect(getVolume()).toBe(0.4);
		expect(getStoredVolume()).toBe(0.4);
		await volumeActions.mute();
		expect(getMuted()).toBe(true);
		expect(getVolume()).toBe(0);
		expect(getAttachedMedia()).toEqual(new Set([audio]));
	});
});
