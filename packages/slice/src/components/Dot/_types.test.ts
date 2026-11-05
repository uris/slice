import type { Variants } from 'motion/react';
import { expectTypeOf, it } from 'vitest';
import type { DotProps } from './_types';

it('retains the animation API without the unused motion alias', () => {
    expectTypeOf<Extract<'motion', keyof DotProps>>().toEqualTypeOf<never>();
    expectTypeOf<DotProps['motionValues']>().toEqualTypeOf<Variants | undefined>();
});
