import { expectTypeOf, it } from 'vitest';
import type { BarButton, ButtonBarProps } from './_types';

it('exposes normalized props without legacy label, border, or frame aliases', () => {
    expectTypeOf<Extract<'selected' | 'defaultSelected' | 'frameSize' | 'borderSize' | 'labelColor' | 'backgroundColorActive', keyof ButtonBarProps>>().toEqualTypeOf<never>();
    expectTypeOf<Extract<'label', keyof BarButton>>().toEqualTypeOf<never>();
    expectTypeOf<ButtonBarProps['buttonSize']>().toEqualTypeOf<'s' | 'm' | 'l' | 'xl' | number | undefined>();
});

it('supports explicit empty selection and preserves item callback payloads', () => {
    expectTypeOf<ButtonBarProps['selectedIndex']>().toEqualTypeOf<number | null | undefined>();
    expectTypeOf<ButtonBarProps['defaultSelectedIndex']>().toEqualTypeOf<number | null | undefined>();
    expectTypeOf<Parameters<NonNullable<ButtonBarProps['onChange']>>>().toEqualTypeOf<[BarButton]>();
});

it('exposes independent highlight radius and numeric spacing', () => {
    expectTypeOf<ButtonBarProps['selectionRadius']>().toEqualTypeOf<number | string | undefined>();
    expectTypeOf<ButtonBarProps['buttonGap']>().toEqualTypeOf<number | undefined>();
});

it('exposes uniform wrapper padding in pixels', () => {
    expectTypeOf<ButtonBarProps['padding']>().toEqualTypeOf<number | undefined>();
});
