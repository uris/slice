import type React from 'react';
import { expectTypeOf, it } from 'vitest';
import type { CheckBoxProps } from './_types';

it('exposes normalized icon and text controls without old aliases', () => {
    expectTypeOf<Extract<'size' | 'color' | 'IconPartial', keyof CheckBoxProps>>().toEqualTypeOf<never>();
    expectTypeOf<CheckBoxProps['textSize']>().toEqualTypeOf<'xs' | 's' | 'm' | 'l' | 'xl' | undefined>();
    expectTypeOf<CheckBoxProps['iconSize']>().toEqualTypeOf<number | undefined>();
    expectTypeOf<CheckBoxProps['label']>().toEqualTypeOf<string | undefined>();
});

it('uses native div events and a boolean change payload', () => {
    expectTypeOf<CheckBoxProps['onAnimationStart']>().toEqualTypeOf<React.AnimationEventHandler<HTMLDivElement> | undefined>();
    expectTypeOf<CheckBoxProps['onDrag']>().toEqualTypeOf<React.DragEventHandler<HTMLDivElement> | undefined>();
    expectTypeOf<Parameters<NonNullable<CheckBoxProps['onChange']>>>().toEqualTypeOf<[boolean]>();
});

it('supports multiline alignment and a selected icon color', () => {
    expectTypeOf<CheckBoxProps['align']>().toEqualTypeOf<'top' | 'middle' | 'bottom' | undefined>();
    expectTypeOf<CheckBoxProps['iconColorSelected']>().toEqualTypeOf<CheckBoxProps['iconColor']>();
});

it('supports a signed text alignment offset', () => {
    expectTypeOf<CheckBoxProps['textTopOffset']>().toEqualTypeOf<number | undefined>();
});
