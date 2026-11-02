import { expectTypeOf, it } from 'vitest';
import type { AvatarProps } from '../Avatar';
import type { AvatarGroupProps, AvatarInfo } from './index';

it('exposes normalized style props without compatibility aliases', () => {
	expectTypeOf<Extract<keyof AvatarGroupProps, 'borderSize' | 'outerBorderSize' | 'color' | 'children'>>().toBeNever();
	expectTypeOf<AvatarGroupProps['borderWidth']>().toEqualTypeOf<number | undefined>();
	expectTypeOf<AvatarGroupProps['outerBorderWidth']>().toEqualTypeOf<number | undefined>();
});

it('uses a typed photo URL and textColor on avatar records', () => {
	expectTypeOf<Extract<keyof AvatarInfo, 'avatar' | 'color'>>().toBeNever();
	expectTypeOf<AvatarInfo['image']>().toEqualTypeOf<string | undefined>();
});

it('shares loading, typography, and record field types with Avatar', () => {
	expectTypeOf<AvatarGroupProps['lazyLoad']>().toEqualTypeOf<AvatarProps['lazyLoad']>();
	expectTypeOf<AvatarGroupProps['textSize']>().toEqualTypeOf<AvatarProps['textSize']>();
	expectTypeOf<Pick<AvatarInfo, 'image' | 'email' | 'textColor' | 'backgroundColor'>>().toEqualTypeOf<Pick<AvatarProps, 'image' | 'email' | 'textColor' | 'backgroundColor'>>();
	expectTypeOf<AvatarInfo['id']>().toEqualTypeOf<string | number | undefined>();
});
