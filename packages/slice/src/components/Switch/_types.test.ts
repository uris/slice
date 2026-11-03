import type React from 'react';
import { expectTypeOf, it } from 'vitest';
import type { SwitchProps } from './_types';

it('removes legacy props and unsupported content', () => {
	expectTypeOf<Extract<'state' | 'fieldName' | 'children' | 'dangerouslySetInnerHTML', keyof SwitchProps>>().toEqualTypeOf<never>();
});
it('preserves generic metadata and native click types', () => {
	type Setting = { id: number };
	expectTypeOf<SwitchProps<Setting>['value']>().toEqualTypeOf<Setting | undefined>();
	expectTypeOf<SwitchProps<Setting>['onChange']>().toEqualTypeOf<((value: Setting | undefined, checked: boolean) => void) | undefined>();
	expectTypeOf<SwitchProps<Setting>['onClick']>().toEqualTypeOf<React.MouseEventHandler<HTMLButtonElement> | undefined>();
});

it('types independent knob and track shape controls', () => {
    expectTypeOf<SwitchProps['knobWidth']>().toEqualTypeOf<number | undefined>();
    expectTypeOf<SwitchProps['knobRadius']>().toEqualTypeOf<number | string | undefined>();
    expectTypeOf<SwitchProps['borderRadius']>().toEqualTypeOf<number | string | undefined>();
});
