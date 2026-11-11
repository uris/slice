import {expectTypeOf, it} from 'vitest';
import type {ButtonProps} from '../Button';
import type {ButtonBarBaseProps, ButtonBarItemInfo, ButtonBarProps} from './_types';

it('composes Button props and callbacks directly', () => {
    expectTypeOf<ButtonBarProps['buttons']>().toEqualTypeOf<ButtonProps[] | undefined>();
    expectTypeOf<Parameters<NonNullable<ButtonBarProps['onClick']>>[0]>().toEqualTypeOf<Parameters<NonNullable<ButtonProps['onClick']>>[0]>();
    expectTypeOf<ButtonBarProps['onToolTip']>().toEqualTypeOf<ButtonProps['onToolTip']>();
    expectTypeOf<ButtonBarProps['buttonSize']>().toEqualTypeOf<ButtonProps['buttonSize']>();
    expectTypeOf<ButtonBarBaseProps>().toExtend<ButtonBarProps>();
});


it('shares item metadata and supports direct state setters', () => {
    expectTypeOf<Parameters<NonNullable<ButtonBarProps['onChange']>>>().toEqualTypeOf<[string, ButtonBarItemInfo]>();
    expectTypeOf<Parameters<NonNullable<ButtonBarProps['onClick']>>[1]>().toEqualTypeOf<ButtonBarItemInfo>();
    expectTypeOf<(value: string) => void>().toExtend<NonNullable<ButtonBarProps['onChange']>>();
});
