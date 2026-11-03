import type React from 'react';
import type { Transition } from 'motion/react';
import { expectTypeOf, it } from 'vitest';
import type { TabBarProps } from './_types';
import type { TabOption } from '../Tab';
it('uses typed values and composed children without selection aliases', () => {
	expectTypeOf<Extract<'selected' | 'selectedValue' | 'onTabChange', keyof TabBarProps>>().toEqualTypeOf<never>();
	expectTypeOf<TabBarProps['value']>().toEqualTypeOf<string | null | undefined>();
	expectTypeOf<TabBarProps['children']>().toEqualTypeOf<React.ReactNode>();
	expectTypeOf<TabBarProps<{ id: number }>['onChange']>().toEqualTypeOf<((value: { id: number }, option: TabOption<{ id: number }>) => void) | undefined>();
	expectTypeOf<TabBarProps['transition']>().toEqualTypeOf<Transition | undefined>();
});

it('manages ARIA through intent-based public props', () => {
	expectTypeOf<TabBarProps['tabBarName']>().toEqualTypeOf<string | undefined>();
	expectTypeOf<Extract<keyof React.AriaAttributes, keyof TabBarProps>>().toEqualTypeOf<never>();
});
