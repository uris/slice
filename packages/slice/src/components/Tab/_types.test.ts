import type React from 'react';
import { expectTypeOf, it } from 'vitest';
import type { TabOption, TabProps } from './_types';
it('exports a typed choice with native button events and internally managed ARIA', () => {
	expectTypeOf<TabProps['value']>().toEqualTypeOf<string>();
	expectTypeOf<TabOption<{ id: number }>['value']>().toEqualTypeOf<{ id: number }>();
	expectTypeOf<TabProps['onClick']>().toEqualTypeOf<React.MouseEventHandler<HTMLButtonElement> | undefined>();
	expectTypeOf<Extract<keyof React.AriaAttributes, keyof TabProps>>().toEqualTypeOf<never>();
});
