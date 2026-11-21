import type { ColorValue } from '../../theme/colors/resolveColor';
import type { RadiusValue, SizeValue } from '../../theme/resolveSize';
import type { TabBarProps } from '../TabBar';
import type { ElevationProps } from '../sharedTypes';

export type PillButtonBarProps<T = string> = Omit<
	TabBarProps<T>,
	'underline' | 'underlineColor' | 'underlineSelectedColor' | 'width' | 'tabWidth'
> &
	ElevationProps & {
		backgroundColor?: ColorValue;
		borderWidth?: number | string;
		borderRadius?: RadiusValue;
		pillBackgroundColor?: ColorValue;
		pillBorderColor?: ColorValue;
		pillBorderWidth?: number | string;
		pillBorderRadius?: RadiusValue;
		/** Space between the track border and its options. */
		pillInset?: SizeValue;
		pillElevation?: ElevationProps['elevation'];
	};
