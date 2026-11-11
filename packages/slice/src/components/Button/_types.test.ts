import type React from 'react';
import type { HTMLMotionProps } from 'motion/react';
import { expectTypeOf, it } from 'vitest';
import type { ButtonHandle, ButtonProps } from './index';

it('uses normalized primary text props without old aliases', () => {
	expectTypeOf<Extract<keyof ButtonProps, 'labelColor' | 'labelSize' | 'color'>>().toBeNever();
	expectTypeOf<ButtonProps['textSize']>().toEqualTypeOf<'xs' | 's' | 'm' | 'l' | 'xl' | undefined>();
});

it('uses shared buttonSize and spacing props with explicit auto sizing', () => {
	expectTypeOf<Extract<'size', keyof ButtonProps>>().toBeNever();
	expectTypeOf<ButtonProps['buttonSize']>().toEqualTypeOf<'auto' | 's' | 'm' | 'l' | 'xl' | number | undefined>();
	expectTypeOf<ButtonProps['paddingTop']>().toEqualTypeOf<number | string | undefined>();
	expectTypeOf<ButtonProps['gap']>().toEqualTypeOf<number | undefined>();
});

it('documents native and programmatic activation types', () => {
	expectTypeOf<NonNullable<ButtonProps['onClick']>>().parameters.toEqualTypeOf<[React.MouseEvent<HTMLButtonElement> | undefined]>();
	expectTypeOf<ButtonHandle['triggerClick']>().toEqualTypeOf<() => void>();
});

it('uses Motion callback types for event names that Motion owns', () => {
	expectTypeOf<ButtonProps['onAnimationStart']>().toEqualTypeOf<HTMLMotionProps<'button'>['onAnimationStart']>();
	expectTypeOf<ButtonProps['onDrag']>().toEqualTypeOf<HTMLMotionProps<'button'>['onDrag']>();
});
