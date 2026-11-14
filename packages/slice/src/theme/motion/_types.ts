export type SliceMotion = {
	'motion-magnet': string;
	'motion-water': string;
	'motion-spring': string;
	'motion-magnet-duration': string;
	'motion-water-duration': string;
	'motion-spring-duration': string;
};

/** Motion-ready defaults. Numeric durations are measured in seconds. */
export type SliceMotionValues = {
	'motion-magnet': [number, number, number, number];
	'motion-water': [number, number, number, number];
	/** Physics approximation of the CSS Spring curve; its settling time is physics-driven. */
	'motion-spring': {
		type: 'spring';
		mass: number;
		stiffness: number;
		damping: number;
	};
	'motion-magnet-duration': number;
	'motion-water-duration': number;
	/** Reference duration; mass, stiffness, and damping determine the physics spring's timing. */
	'motion-spring-duration': number;
	/** Ready-made transitions, structurally compatible with Motion without importing its types. */
	'transition-water': {
		type: 'tween';
		ease: SliceMotionValues['motion-water'];
		duration: number;
	};
	'transition-magnet': {
		type: 'tween';
		ease: SliceMotionValues['motion-magnet'];
		duration: number;
	};
	'transition-spring': SliceMotionValues['motion-spring'];
};
