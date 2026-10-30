import type { SliceMotion } from './_types';

/**
 * Motion for Slice UI
 */
export const motion: SliceMotion = {
	'motion-magnet': 'cubic-bezier(0.352, 0.003, 0.993, -0.052)',
	'motion-water': 'cubic-bezier(0.36, 0, 0.64, 1)',
	'motion-spring':
		'linear(0, 0.001 0.3%, 0.008 0.7%, 0.034 1.5%, 0.076 2.3%, 0.138 3.2%, 0.275 4.8%, 0.713 9.4%, 0.836 10.9%, 0.933 12.3%, 1.011 13.7%, 1.074 15.2%, 1.096 15.9%, 1.116 16.7%, 1.132 17.5%, 1.142 18.3%, 1.148 19.1%, 1.15 20%, 1.148 21%, 1.142 22%, 1.133 22.9%, 1.12 24%, 1.048 29.1%, 1.015 31.8%, 1.002 33.3%, 0.991 34.9%, 0.983 36.5%, 0.979 38.1%, 0.977 39.9%, 0.979 42%, 0.997 51.7%, 1.003 57.7%, 1 77%, 1)',
	'motion-magnet-duration': '0.5s',
	'motion-water-duration': '0.25s',
	'motion-spring-duration': '1s',
};
