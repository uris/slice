import type React from 'react';
import { expectTypeOf, it } from 'vitest';
import type { IconButtonProps } from './_types';

it('provides actionName and removes explicit naming attributes and obsolete props', () => {
 expectTypeOf<Extract<'aria-label' | 'aria-labelledby' | 'label' | 'children' | 'round' | 'frameSize' | 'border' | 'color' | 'colorOn' | 'fillColor' | 'isToggled' | 'iconColorOn' | 'backgroundColorOn' | 'presetAnimations' | 'customAnimations' | 'variants' | 'initial' | 'animate' | 'exit', keyof IconButtonProps>>().toEqualTypeOf<never>();
 expectTypeOf<{icon:string}>().toExtend<IconButtonProps>();
 expectTypeOf<IconButtonProps['actionName']>().toEqualTypeOf<string | undefined>();
 expectTypeOf<IconButtonProps['onClick']>().toEqualTypeOf<React.MouseEventHandler<HTMLButtonElement> | undefined>();
 expectTypeOf<IconButtonProps['onChange']>().toEqualTypeOf<((selected:boolean)=>void) | undefined>();
});
