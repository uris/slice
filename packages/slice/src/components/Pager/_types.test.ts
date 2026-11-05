import type { Transition } from 'motion/react';
import { expectTypeOf, it } from 'vitest';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { PagerProps } from './_types';

it('uses explicit controlled/default selection and retains the agreed color names', () => {
    expectTypeOf<Extract<'index' | 'children' | 'dangerouslySetInnerHTML' | 'showMore', keyof PagerProps>>().toEqualTypeOf<never>();
    expectTypeOf<PagerProps['selectedIndex']>().toEqualTypeOf<number | undefined>();
    expectTypeOf<PagerProps['defaultSelectedIndex']>().toEqualTypeOf<number | undefined>();
    expectTypeOf<PagerProps['colorOn']>().toEqualTypeOf<ColorValue | undefined>();
    expectTypeOf<PagerProps['colorHover']>().toEqualTypeOf<ColorValue | undefined>();
});

it('exposes Motion transition settings', () => { expectTypeOf<PagerProps['transition']>().toEqualTypeOf<Transition | undefined>(); });

it('supports optional opacity scaling', () => { expectTypeOf<PagerProps['opacityScales']>().toEqualTypeOf<boolean | undefined>(); });
