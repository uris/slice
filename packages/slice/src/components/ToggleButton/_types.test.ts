import type React from 'react';
import {expectTypeOf,it} from 'vitest';
import type {ToggleButtonProps} from './_types';
it('uses normalized styling, motion, state and native button callbacks',()=>{
 expectTypeOf<Extract<'frameSize'|'iconTwo'|'iconOn'|'iconColorOn'|'backgroundColorOn'|'border'|'fill'|'unselect'|'onSelect'|'presetAnimations'|'customAnimations'|'aria-label'|'aria-labelledby',keyof ToggleButtonProps>>().toEqualTypeOf<never>();
 expectTypeOf<ToggleButtonProps['onClick']>().toEqualTypeOf<React.MouseEventHandler<HTMLButtonElement>|undefined>();
 expectTypeOf<ToggleButtonProps['onChange']>().toEqualTypeOf<((selected:boolean)=>void)|undefined>();
 expectTypeOf<ToggleButtonProps['defaultSelected']>().toEqualTypeOf<boolean|undefined>();
 expectTypeOf<ToggleButtonProps['buttonSize']>().toEqualTypeOf<'s'|'m'|'l'|'xl'|number|undefined>();
});
