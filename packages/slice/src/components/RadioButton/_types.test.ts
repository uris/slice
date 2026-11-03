import type React from 'react';
import {expectTypeOf,it} from 'vitest';
import type {RadioButtonProps,RadioButtonOption} from './_types';
it('uses checkbox-aligned styling and native radio attributes',()=>{
 expectTypeOf<Extract<'selected'|'controlType'|'deselect'|'wrap'|'list'|'hideRadio'|'noFrame'|'icon'|'checkedIcon'|'aria-label'|'aria-labelledby'|'color'|'size',keyof RadioButtonProps>>().toEqualTypeOf<never>();
 expectTypeOf<RadioButtonProps['checked']>().toEqualTypeOf<boolean|undefined>();
 expectTypeOf<RadioButtonProps['onClick']>().toEqualTypeOf<React.MouseEventHandler<HTMLInputElement>|undefined>();
 expectTypeOf<RadioButtonProps<{id:number}>['onChange']>().toEqualTypeOf<((option:RadioButtonOption<{id:number}>,checked:boolean)=>void)|undefined>();
});
