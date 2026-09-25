import { coreColors, dark, light } from './colors/colors';
import type { Colors, CoreColors } from './colors/types';
import { corners } from './corners/corners';
import type { Corners } from './corners/types';
import type { Elevations } from './elevations/_types';
import { elevations } from './elevations/elevations';
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
	spacing,
	motion,
};
