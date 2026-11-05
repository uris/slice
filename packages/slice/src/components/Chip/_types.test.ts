import type React from 'react';
import { expectTypeOf, it } from 'vitest';
import type { ChipProps } from './_types';

it('removes non-normalized styling aliases', () => {
    expectTypeOf<Extract<'variant' | 'labelSize' | 'labelColor' | 'labelColorHover' | 'borderSize' | 'paddingTops' | 'paddingSides' | 'focused' | 'color', keyof ChipProps>>().toEqualTypeOf<never>();
    expectTypeOf<ChipProps['textSize']>().toEqualTypeOf<'xs' | 's' | 'm' | 'l' | 'xl' | undefined>();
});
it('types the action as a native button click and static chips without it', () => {
    expectTypeOf<NonNullable<ChipProps['onClick']>>().toEqualTypeOf<React.MouseEventHandler<HTMLButtonElement>>();
    expectTypeOf<ChipProps['selected']>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<ChipProps['onRemove']>().toEqualTypeOf<React.MouseEventHandler<HTMLButtonElement> | undefined>();
});
