import type React from 'react';
import { expectTypeOf, it } from 'vitest';
import type { TextAreaProps } from './_types';

it('uses normalized props and separate controlled/uncontrolled values', () => {
	expectTypeOf<Extract<'hasSend' | 'border', keyof TextAreaProps>>().toEqualTypeOf<never>();
	expectTypeOf<TextAreaProps['defaultValue']>().toEqualTypeOf<string | undefined>();
	expectTypeOf<TextAreaProps['onKeyDown']>().toEqualTypeOf<React.KeyboardEventHandler<HTMLTextAreaElement> | undefined>();
	expectTypeOf<Extract<keyof React.AriaAttributes | 'role', keyof TextAreaProps>>().toEqualTypeOf<never>();
});
it('exposes native settings without duplicate managed input or ARIA props', () => {
	type Attributes = NonNullable<TextAreaProps['inputAttributes']>;
	expectTypeOf<Extract<'value' | 'defaultValue' | 'rows' | 'name' | 'id' | 'onChange' | 'onPaste' | keyof React.AriaAttributes, keyof Attributes>>().toEqualTypeOf<never>();
	expectTypeOf<Attributes['spellCheck']>().toEqualTypeOf<React.TextareaHTMLAttributes<HTMLTextAreaElement>['spellCheck']>();
});
