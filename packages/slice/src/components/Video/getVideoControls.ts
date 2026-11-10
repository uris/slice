import type { CustomVideoControls } from './_types';

/** An explicit configuration is a complete selection; simple is only a shortcut. */
export function getVideoControls(controls?: CustomVideoControls): Required<CustomVideoControls> {
	if (controls === undefined) {
		return { play: false, progress: true, volume: true, fullscreen: true, captions: true, quit: false };
	}
	return {
		play: controls.play === true,
		progress: controls.progress === true,
		volume: controls.volume === true,
		fullscreen: controls.fullscreen === true,
		captions: controls.captions === true,
		quit: controls.quit === true,
	};
}
