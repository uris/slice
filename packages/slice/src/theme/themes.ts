import { coreColors, dark, light } from './colors/colors';
import type { Colors, CoreColors } from './colors/types';
import { corners } from './corners/corners';
import type { Corners } from './corners/types';
import type { Elevations } from './elevations/_types';
import { createElevationShadows, elevations } from './elevations/elevations';
import { layers } from './layers/layers';
import type { Layers } from './layers/types';
import type { SliceMotion } from './motion/_types';
import { motion } from './motion/motion';
import type { SpacingGrid } from './spacing/_types';
import { spacing } from './spacing/spacing';
import { type } from './type/type';
import type { Type } from './type/types';

export type SliceTheme = {
	name: string;
	coreColors: CoreColors;
	colors: Colors;
	type: Type;
	corners: Corners;
	elevations: Elevations;
	layers: Layers;
	elevationShadows: ReturnType<typeof createElevationShadows>;
	spacing: SpacingGrid;
	motion: SliceMotion;
};

export const lightTheme: SliceTheme = {
	name: 'lightMode',
	coreColors,
	colors: light,
	type,
	corners,
	elevations,
	layers,
	elevationShadows: createElevationShadows('light'),
	spacing,
	motion,
};

export const darkTheme: SliceTheme = {
	name: 'darkMode',
	coreColors,
	colors: dark,
	type,
	corners,
	elevations,
	layers,
	elevationShadows: createElevationShadows('dark'),
	spacing,
	motion,
};
