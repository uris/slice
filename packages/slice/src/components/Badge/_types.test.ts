import type { ColorValue } from '../../theme/colors/resolveColor';
import { expectTypeOf, it } from 'vitest';
import type { BadgeProps } from './index';

it('exposes hideZero without the misleading alias or unused content props', () => {
	expectTypeOf<BadgeProps['hideZero']>().toEqualTypeOf<boolean | undefined>();
	expectTypeOf<Extract<keyof BadgeProps, 'hideNull' | 'children' | 'color'>>().toBeNever();
	expectTypeOf<BadgeProps['count']>().toEqualTypeOf<number | string | null | undefined>();
});

it('accepts theme tokens and CSS colors for independent overrides', () => {
	expectTypeOf<BadgeProps['backgroundColor']>().toEqualTypeOf<ColorValue | undefined>();
	expectTypeOf<BadgeProps['textColor']>().toEqualTypeOf<ColorValue | undefined>();
});
