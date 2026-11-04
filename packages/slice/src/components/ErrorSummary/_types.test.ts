import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import { expectTypeOf, it } from 'vitest';
import type { ErrorMessage, ErrorSummaryProps } from './_types';
it('uses named accessibility controls and native events', () => {
	expectTypeOf<Extract<'motion' | 'variants' | 'autoNumber' | 'role' | 'children' | keyof React.AriaAttributes, keyof ErrorSummaryProps>>().toEqualTypeOf<never>();
	expectTypeOf<ErrorSummaryProps['announcement']>().toEqualTypeOf<'polite' | 'assertive' | 'off' | undefined>();
	expectTypeOf<ErrorSummaryProps['onAnimationStart']>().toEqualTypeOf<React.AnimationEventHandler<HTMLDivElement> | undefined>();
	expectTypeOf<ErrorSummaryProps['transition']>().toEqualTypeOf<Transition | undefined>();
	expectTypeOf<ErrorSummaryProps['motionValues']>().toEqualTypeOf<Variants | undefined>();
	expectTypeOf<ErrorMessage['id']>().toEqualTypeOf<string | undefined>();
	expectTypeOf<ErrorMessage['fieldName']>().toEqualTypeOf<string | undefined>();
});
