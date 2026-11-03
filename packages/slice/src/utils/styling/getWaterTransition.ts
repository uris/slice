import type { Transition } from 'motion/react';
import type { SliceMotion } from '../../theme/motion/_types';

/** Internal bridge from theme CSS timing tokens to Motion's seconds-based transition. */
export function getWaterTransition(motion: SliceMotion, overrides?: Transition): Transition {
	const curve = motion['motion-water']
		.match(/cubic-bezier\(([^)]+)\)/)?.[1]
		.split(',')
		.map(Number);
	const durationText = motion['motion-water-duration'];
	const duration = Number.parseFloat(durationText) / (durationText.endsWith('ms') ? 1000 : 1);
	return {
		type: 'tween',
		ease:
			curve?.length === 4 && curve.every(Number.isFinite)
				? (curve as [number, number, number, number])
				: [0.36, 0, 0.64, 1],
		duration: Number.isFinite(duration) && duration >= 0 ? duration : 0.25,
		...overrides,
	};
}
