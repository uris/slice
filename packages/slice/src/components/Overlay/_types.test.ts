import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import { expectTypeOf, it } from 'vitest';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { OverlayProps } from './_types';
it('exposes a controlled pointer layer with normalized visual props', () => {
	expectTypeOf<Extract<'type' | 'color' | 'overlay' | 'global' | 'toggleOverlay' | 'motion' | 'variants' | 'role' | keyof React.AriaAttributes, keyof OverlayProps>>().toEqualTypeOf<never>();
	expectTypeOf<OverlayProps['position']>().toEqualTypeOf<'fixed' | 'absolute' | undefined>();
 expectTypeOf<OverlayProps['pointerEvents']>().toEqualTypeOf<'auto' | 'none' | undefined>();
 expectTypeOf<OverlayProps['backgroundColor']>().toEqualTypeOf<ColorValue | undefined>();
	expectTypeOf<OverlayProps['transition']>().toEqualTypeOf<Transition | undefined>();
	expectTypeOf<OverlayProps['motionValues']>().toEqualTypeOf<Variants | undefined>();
	expectTypeOf<OverlayProps['onClick']>().toEqualTypeOf<React.MouseEventHandler<HTMLDivElement> | undefined>();
	expectTypeOf<OverlayProps['onPointerDown']>().toEqualTypeOf<React.PointerEventHandler<HTMLDivElement> | undefined>();
	expectTypeOf<OverlayProps['onAnimationStart']>().toEqualTypeOf<React.AnimationEventHandler<HTMLDivElement> | undefined>();
});
