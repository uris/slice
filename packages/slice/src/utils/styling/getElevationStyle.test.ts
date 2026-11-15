import { expect, it } from 'vitest';
import { getElevationStyle } from './getElevationStyle';

it('defaults omitted elevation to flat and supports all shared levels without adding stacking styles', () => {
 expect(getElevationStyle()).toEqual({ boxShadow: 'var(--elevation-0)' });
 for (const level of [0, 1, 2, 3, 4, 5] as const) {
  expect(getElevationStyle(level)).toEqual({ boxShadow: `var(--elevation-${level})` });
 }
});
