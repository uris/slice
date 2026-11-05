import type React from 'react';
import { expectTypeOf, it } from 'vitest';
import type { TextFieldProps } from './_types';
it('uses normalized dimensions, read-only state, keyboard events, and value/defaultValue', () => {
	expectTypeOf<Extract<'size' | 'editable' | 'onKeydown' | 'borderType' | 'noShow', keyof TextFieldProps>>().toEqualTypeOf<never>();
	expectTypeOf<TextFieldProps['width']>().toEqualTypeOf<number | string | undefined>();
	expectTypeOf<TextFieldProps['defaultValue']>().toEqualTypeOf<string | undefined>();
	expectTypeOf<TextFieldProps['onKeyDown']>().toEqualTypeOf<React.KeyboardEventHandler<HTMLInputElement> | undefined>();
	expectTypeOf<Extract<keyof React.AriaAttributes, keyof TextFieldProps>>().toEqualTypeOf<never>();
});
it('exposes native input attributes without duplicate managed props or raw ARIA', () => {
	type Attributes = NonNullable<TextFieldProps['inputAttributes']>;
	expectTypeOf<Extract<keyof React.AriaAttributes | 'value' | 'defaultValue' | 'name' | 'id' | 'onChange' | 'onKeyDown' | 'disabled', keyof Attributes>>().toEqualTypeOf<never>();
	expectTypeOf<Attributes['required']>().toEqualTypeOf<boolean | undefined>();
});
it('supports explicit label variants and stacked appearance behavior', () => {
	expectTypeOf<TextFieldProps['variant']>().toEqualTypeOf<'simple' | 'stacked' | 'outlined' | undefined>();
	expectTypeOf<TextFieldProps['behavior']>().toEqualTypeOf<'persistent' | 'appear' | undefined>();
	expectTypeOf<TextFieldProps['stackedGap']>().toEqualTypeOf<number | undefined>();
});
