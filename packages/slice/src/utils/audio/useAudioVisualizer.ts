'use client';

import { useEffect, useMemo, useRef } from 'react';
import {
	AudioVisualizer,
	type AudioVisualizerOptions,
	type AudioVisualizerSource,
} from '../objects/audioVisualizer/audioVisualizer';

/** Internal lifecycle shared by the audio visualizations. Never owns the input tracks. */
export function useAudioVisualizer(
	source: AudioVisualizerSource | null | undefined,
	playing: boolean,
	options: Omit<AudioVisualizerOptions, 'onUpdate' | 'onError'>,
	onUpdate: NonNullable<AudioVisualizerOptions['onUpdate']>,
	onReset: () => void,
) {
	const callbacks = useRef({ onUpdate, onReset });
	// Update only after commit so abandoned renders cannot change active callbacks.
	useEffect(() => {
		callbacks.current = { onUpdate, onReset };
	}, [onUpdate, onReset]);
	// Construction is inert: the graph is created only by start() in the effect.
	const visualizer = useMemo(() => {
		if (!source) return null;
		return new AudioVisualizer(source, {
			...options,
			onUpdate: (state) => callbacks.current.onUpdate(state),
			onError: () => callbacks.current.onReset(),
		});
	}, [source, options]);

	useEffect(() => {
		callbacks.current.onReset();
		if (!source || !visualizer) return;
		const tracks = source instanceof MediaStream ? source.getAudioTracks() : [source];
		const stop = () => {
			if (tracks.some((track) => track.readyState !== 'ended')) return;
			visualizer.stop();
			callbacks.current.onReset();
		};
		for (const track of tracks) track.addEventListener('ended', stop);
		return () => {
			for (const track of tracks) track.removeEventListener('ended', stop);
			visualizer.dispose();
		};
	}, [source, visualizer]);

	useEffect(() => {
		if (!visualizer) return;
		if (!playing) {
			visualizer.stop();
			callbacks.current.onReset();
			return;
		}
		const tracks = source instanceof MediaStream ? source.getAudioTracks() : [source];
		if (!tracks.some((track) => track?.kind === 'audio' && track.readyState !== 'ended')) return;
		try {
			visualizer.start();
		} catch {
			visualizer.dispose();
			callbacks.current.onReset();
		}
	}, [source, visualizer, playing]);
}
