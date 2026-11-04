import type React from 'react';
import { expectTypeOf, it } from 'vitest';
import type { ContentEditableEditEndReason, ContentEditableProps } from './_types';
it('uses normalized styles and edit-session callbacks', () => {
	expectTypeOf<Extract<'wrap' | 'focus' | 'radius' | 'onDblClick' | 'onSubmit' | 'children' | 'contentEditable' | 'role' | keyof React.AriaAttributes, keyof ContentEditableProps>>().toEqualTypeOf<never>();
	expectTypeOf<ContentEditableProps['padding']>().toEqualTypeOf<number | string | undefined>();
	expectTypeOf<ContentEditableProps['onChange']>().toEqualTypeOf<((draft: string) => void) | undefined>();
	expectTypeOf<ContentEditableProps['onCommit']>().toEqualTypeOf<((value: string, previousValue: string) => void) | undefined>();
	expectTypeOf<ContentEditableProps['onEditEnd']>().toEqualTypeOf<((reason: ContentEditableEditEndReason) => void) | undefined>();
	expectTypeOf<ContentEditableProps['onDoubleClick']>().toEqualTypeOf<React.MouseEventHandler<HTMLSpanElement> | undefined>();
	expectTypeOf<ContentEditableProps['onBlur']>().toEqualTypeOf<React.FocusEventHandler<HTMLSpanElement> | undefined>();
});
