import type React from 'react';
import { describe, expectTypeOf, it } from 'vitest';
import type { Avatar, AvatarProps } from './index';

interface User {
	id: string;
}

describe('Avatar public types', () => {
	it('preserves the generic component signature through memo and exports', () => {
		expectTypeOf<Parameters<typeof Avatar<User>>[0]>().toEqualTypeOf<AvatarProps<User>>();
		expectTypeOf<AvatarProps<User>['info']>().toEqualTypeOf<User | undefined>();
		expectTypeOf<AvatarProps['info']>().toBeUnknown();
	});

	it('retains specific native event types alongside optional typed info', () => {
		expectTypeOf<NonNullable<AvatarProps<User>['onClick']>>().parameters.toEqualTypeOf<
			[React.MouseEvent<HTMLDivElement>, User | undefined]
		>();
		expectTypeOf<NonNullable<AvatarProps<User>['onPointerDownCapture']>>().parameters.toEqualTypeOf<
			[React.PointerEvent<HTMLDivElement>, User | undefined]
		>();
		expectTypeOf<NonNullable<AvatarProps<User>['onFocus']>>().parameters.toEqualTypeOf<
			[React.FocusEvent<HTMLDivElement>, User | undefined]
		>();
	});

	it('accepts existing one-argument handlers', () => {
		expectTypeOf<React.MouseEventHandler<HTMLDivElement>>().toExtend<NonNullable<AvatarProps<User>['onClick']>>();
		expectTypeOf<React.KeyboardEventHandler<HTMLDivElement>>().toExtend<
			NonNullable<AvatarProps<User>['onKeyDown']>
		>();
	});
});
