import type React from 'react';
import { expectTypeOf, it } from 'vitest';
import type { DropDownOption, DropDownProps } from './_types';

it('uses normalized dimensions, selection, and border names', () => {
	expectTypeOf<Extract<'borderSize' | 'validate' | 'selectedValue' | 'selectedIndex' | 'onOption', keyof DropDownProps>>().toEqualTypeOf<never>();
	expectTypeOf<DropDownProps['width']>().toEqualTypeOf<number | string | undefined>();
	expectTypeOf<DropDownProps['value']>().toEqualTypeOf<string | null | undefined>();
	expectTypeOf<DropDownProps['defaultValue']>().toEqualTypeOf<string | null | undefined>();
	expectTypeOf<DropDownProps['borderStyle']>().toEqualTypeOf<'box' | 'underline' | 'none' | undefined>();
});
it('preserves typed option data and native select settings', () => {
	type Owner = { id: number };
	expectTypeOf<DropDownProps<Owner>['onChange']>().toEqualTypeOf<((value: Owner, option: DropDownOption<Owner>, index: number) => void) | undefined>();
	type Attributes = NonNullable<DropDownProps['inputAttributes']>;
	expectTypeOf<Extract<'name' | 'value' | 'defaultValue' | 'id' | 'multiple' | 'size' | 'disabled' | 'onChange' | keyof React.AriaAttributes, keyof Attributes>>().toEqualTypeOf<never>();
	expectTypeOf<Extract<keyof React.AriaAttributes | 'role', keyof DropDownProps>>().toEqualTypeOf<never>();
});

it('shares label variants and guidance with TextField', () => {
	expectTypeOf<DropDownProps['variant']>().toEqualTypeOf<'simple' | 'stacked' | 'outlined' | undefined>();
	expectTypeOf<DropDownProps['behavior']>().toEqualTypeOf<'persistent' | 'appear' | undefined>();
	expectTypeOf<DropDownProps['tip']>().toEqualTypeOf<string | undefined>();
	expectTypeOf<DropDownProps['errorMessage']>().toEqualTypeOf<string | undefined>();
});

it('accepts either array data or native string-valued children', () => {
	expectTypeOf<DropDownProps<{ id: number }>['children']>().toEqualTypeOf<undefined>();
	const child = null as unknown as React.ReactElement<React.OptionHTMLAttributes<HTMLOptionElement>, 'option'>;
	const composed: DropDownProps = { children: child };
	// @ts-expect-error Array data and native children are mutually exclusive.
	const mixed: DropDownProps = { options: [{ value: 'active' }], children: child };
	// @ts-expect-error Native children provide string values; object values use the array API.
	const objectChildren: DropDownProps<{ id: number }> = { value: { id: 1 }, children: child };
	void composed;
	void mixed;
	void objectChildren;
});
