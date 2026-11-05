import type React from 'react';
import { expectTypeOf, it } from 'vitest';
import { DialogBox } from './DialogBox';
import { useDialogBox } from './useDialogBox';
import type { DialogBoxAction, DialogBoxProps, DialogBoxSectionProps, DialogBoxControls } from './_types';

it('types native panel events and typed action responses without raw ARIA overrides', () => {
 expectTypeOf<Extract<keyof React.AriaAttributes | 'role', keyof DialogBoxProps>>().toEqualTypeOf<never>();
 expectTypeOf<DialogBoxProps['onClick']>().toEqualTypeOf<React.MouseEventHandler<HTMLDivElement> | undefined>();
 expectTypeOf<DialogBoxProps['onDragPointerDown']>().toEqualTypeOf<React.PointerEventHandler<HTMLDivElement> | undefined>();
 expectTypeOf<DialogBoxProps<number>['onResolve']>().toEqualTypeOf<((value?: number) => void) | undefined>();
 expectTypeOf<DialogBoxAction<number>['value']>().toEqualTypeOf<number | undefined>();
 expectTypeOf<DialogBoxAction['promise']>().toEqualTypeOf<'resolve' | 'reject' | 'none' | undefined>();
});

it('keeps typed compound members and generic dialog controls', () => {
 expectTypeOf<Parameters<typeof DialogBox.Title>[0]>().toEqualTypeOf<DialogBoxSectionProps>();
 expectTypeOf<Parameters<typeof DialogBox.Content>[0]>().toEqualTypeOf<DialogBoxSectionProps>();
 expectTypeOf<Parameters<typeof DialogBox.Actions>[0]>().toEqualTypeOf<DialogBoxSectionProps>();
 expectTypeOf<ReturnType<typeof useDialogBox<number>>>().toEqualTypeOf<DialogBoxControls<number>>();
});
