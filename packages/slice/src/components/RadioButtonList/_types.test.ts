import {expectTypeOf,it} from 'vitest';
import type React from 'react';
import type {RadioButtonOption} from '../RadioButton';
import type {RadioButtonListProps,RadioButtonListOption} from './_types';
it('uses singular value selection with composed children and data shorthand',()=>{
 expectTypeOf<Extract<'multiSelect'|'deselect'|'selectedIndexes'|'selectedOptions'|'selectedIndex'|'defaultSelectedIndex'|'toggleIcon'|'tabIndexSeed'|'noFrame'|'hideRadio'|'spacer'|'custom'|'icon'|'checkedIcon'|'iconSelectedColor',keyof RadioButtonListProps>>().toEqualTypeOf<never>();
 expectTypeOf<RadioButtonListProps['value']>().toEqualTypeOf<string|null|undefined>();
 expectTypeOf<RadioButtonListProps['children']>().toEqualTypeOf<React.ReactNode>();
 expectTypeOf<RadioButtonListProps<{id:number}>['onChange']>().toEqualTypeOf<((value:{id:number},option:RadioButtonOption<{id:number}>)=>void)|undefined>();
 expectTypeOf<RadioButtonListOption['value']>().toEqualTypeOf<string>();
});
