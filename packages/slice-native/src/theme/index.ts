import type { TextStyle, ViewStyle } from 'react-native';
import { dark, light, coreColors as webCore } from '../../../slice/src/theme/colors/colors';
import { corners } from '../../../slice/src/theme/corners/corners';
// Import token modules directly: web barrel exports can initialize browser stores.
import { elevations } from '../../../slice/src/theme/elevations/elevations';
import { motion as webMotion } from '../../../slice/src/theme/motion/motion';
import { spacing } from '../../../slice/src/theme/spacing/spacing';
import { type as webType } from '../../../slice/src/theme/type/type';
import { easing } from './motion';

export { corners, spacing, elevations };
export type NativeTypography = Record<keyof typeof webType, TextStyle>;
type ShadowKey = 'surface-shadow-soft' | 'surface-shadow-strong';
type CoreShadowKey = `${ShadowKey}-${'light' | 'dark'}`;
export type Colors = Omit<typeof light, ShadowKey>;
export type CoreColors = Omit<typeof webCore, CoreShadowKey>;

const {
	'surface-shadow-soft-light': _sl,
	'surface-shadow-soft-dark': _sd,
	'surface-shadow-strong-light': _hl,
	'surface-shadow-strong-dark': _hd,
	...palette
} = webCore;
export const coreColors: CoreColors = palette;

/** Uses a 16dp base for the web rem scale. Load this font in the consuming app. */
export function createTypography(fontFamily = 'Funnel Sans'): NativeTypography {
	return Object.fromEntries(
		Object.entries(webType).map(([key, css]) => {
			const read = (property: string) => {
				const value = css.match(new RegExp(`(?:^|;)\\s*${property}:\\s*([^;]+)`))?.[1];
				if (!value) throw new Error(`Missing typography property: ${property}`);
				return Number.parseFloat(value);
			};
			const fontSize = read('font-size') * 16;
			return [
				key,
				{
					fontFamily,
					fontSize,
					fontWeight: read('font-weight') as TextStyle['fontWeight'],
					lineHeight: (fontSize * read('line-height')) / 100,
					letterSpacing: fontSize * read('letter-spacing'),
					textDecorationLine: 'none',
				} satisfies TextStyle,
			];
		}),
	) as NativeTypography;
}
export const type = createTypography();
export const motion = {
	'motion-magnet': easing(webMotion['motion-magnet']),
	'motion-water': easing(webMotion['motion-water']),
	'motion-spring': easing(webMotion['motion-spring']),
	'motion-magnet-duration': Number.parseFloat(webMotion['motion-magnet-duration']) * 1000,
	'motion-water-duration': Number.parseFloat(webMotion['motion-water-duration']) * 1000,
	'motion-spring-duration': Number.parseFloat(webMotion['motion-spring-duration']) * 1000,
};

function shadow(value: string): ViewStyle {
	const match = value.match(/^([\d.]+)px ([\d.]+)px ([\d.]+)px (.+)$/);
	if (!match) throw new Error(`Unsupported Slice shadow: ${value}`);
	return {
		boxShadow: [
			{ offsetX: Number(match[1]), offsetY: Number(match[2]), blurRadius: Number(match[3]), color: match[4] },
		],
	};
}
function createTheme(name: string, palette: typeof light) {
	const { 'surface-shadow-soft': soft, 'surface-shadow-strong': strong, ...colors } = palette;
	return {
		name,
		coreColors,
		colors,
		corners,
		spacing,
		elevations,
		type,
		motion,
		shadows: { 'surface-shadow-soft': shadow(soft), 'surface-shadow-strong': shadow(strong) },
	};
}
export const lightTheme = createTheme('lightMode', light);
export const darkTheme = createTheme('darkMode', dark);
export type SliceNativeTheme = ReturnType<typeof createTheme>;
export type SliceTheme = SliceNativeTheme;
