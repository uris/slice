/** Slice depth levels, independent of stacking order and platform units. */
export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

/** Logical pixels on web; density-independent units on native. */
export type ShadowLayer = {
	readonly offsetX: number;
	readonly offsetY: number;
	readonly blurRadius: number;
	readonly spreadDistance: number;
	readonly opacity: number;
};

export type ElevationDefinition = {
	readonly shadows: readonly ShadowLayer[];
	/** Android native elevation in dp; not the Slice level number. */
	readonly androidElevation: number;
};
export type Elevations = Readonly<Record<ElevationLevel, ElevationDefinition>>;
export type ElevationShadows = Readonly<Record<`elevation-${ElevationLevel}`, string>>;
