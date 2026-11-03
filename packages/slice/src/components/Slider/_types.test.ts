import type React from 'react';
import { expectTypeOf, it } from 'vitest';
import type { SliderProps } from './_types';

it('removes legacy names and unsupported native props', () => {
	expectTypeOf<Extract<'scaleMin' | 'scaleMax' | 'headColor' | 'headRadius' | 'trackHeadBorderSize' | 'onDragChange' | 'children' | 'readOnly' | 'type', keyof SliderProps>>().toEqualTypeOf<never>();
});
it('types native input events and the two numeric change callbacks', () => {
	expectTypeOf<SliderProps['onKeyDown']>().toEqualTypeOf<React.KeyboardEventHandler<HTMLInputElement> | undefined>();
	expectTypeOf<SliderProps['onChangeEnd']>().toEqualTypeOf<((value: number, percent: number) => void) | undefined>();
	expectTypeOf<SliderProps['value']>().toEqualTypeOf<number | undefined>();
	expectTypeOf<SliderProps['defaultValue']>().toEqualTypeOf<number | undefined>();
});
