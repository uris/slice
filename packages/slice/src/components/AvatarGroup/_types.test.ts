import { expectTypeOf, it } from 'vitest';
import type { AvatarProps } from '../Avatar';
import type { AvatarGroupMore, AvatarGroupProps, AvatarInfo } from './index';

it('exposes normalized style props without compatibility aliases', () => {
	expectTypeOf<Extract<keyof AvatarGroupProps, 'borderSize' | 'outerBorderSize' | 'color'>>().toBeNever();
	expectTypeOf<AvatarGroupProps['borderWidth']>().toEqualTypeOf<number | undefined>();
	expectTypeOf<AvatarGroupProps['outerBorderWidth']>().toEqualTypeOf<number | undefined>();
});

it('uses a typed photo URL and textColor on avatar records', () => {
	expectTypeOf<Extract<keyof AvatarInfo, 'avatar' | 'color'>>().toBeNever();
	expectTypeOf<AvatarInfo['image']>().toEqualTypeOf<string | undefined>();
});

it('shares loading, typography, and record field types with Avatar', () => {
	expectTypeOf<AvatarGroupProps['backgroundColor']>().toEqualTypeOf<AvatarProps['backgroundColor']>();
	expectTypeOf<AvatarGroupProps['lazyLoad']>().toEqualTypeOf<AvatarProps['lazyLoad']>();
	expectTypeOf<AvatarGroupProps['textSize']>().toEqualTypeOf<AvatarProps['textSize']>();
	expectTypeOf<Pick<AvatarInfo, 'image' | 'email' | 'textColor' | 'backgroundColor'>>().toEqualTypeOf<Pick<AvatarProps, 'image' | 'email' | 'textColor' | 'backgroundColor'>>();
	expectTypeOf<AvatarInfo['id']>().toEqualTypeOf<string | number | undefined>();
});


it('exposes a numeric limit and discriminated overflow lists', () => {
 expectTypeOf<AvatarGroupProps['limit']>().toEqualTypeOf<number | undefined>();
 expectTypeOf<Parameters<NonNullable<AvatarGroupProps['onMore']>>>().toEqualTypeOf<[details: AvatarGroupMore]>();
 expectTypeOf<Extract<AvatarGroupMore, { source: 'avatars' }>['more']>().toEqualTypeOf<AvatarInfo[]>();
 expectTypeOf<Extract<AvatarGroupMore, { source: 'children' }>['all']>().toEqualTypeOf<React.ReactNode[]>();
});
