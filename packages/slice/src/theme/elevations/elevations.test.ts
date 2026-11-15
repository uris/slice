import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createElevationShadows, elevations } from './elevations';
import { darkTheme, lightTheme } from '../themes';
import { layers } from '../layers/layers';

describe('elevation platform contract', () => {
 it('keeps depth separate from stacking and maps ordinal levels to Android dp', () => {
  expect(Object.values(elevations).map(({ androidElevation }) => androidElevation)).toEqual([0, 1, 3, 6, 8, 12]);
  expect(elevations[0].shadows).toEqual([]);
  expect(lightTheme.layers).toEqual(layers);
  expect(darkTheme.layers).toEqual(layers);
  expect(lightTheme.elevationShadows['elevation-0']).toBe('none');
 });
 it.each(['light', 'dark'] as const)('publishes %s CSS matching the shared definitions', (mode) => {
  const css = readFileSync('src/theme/elevations/elevation.css', 'utf8');
  const block = css.split(`[data-slice-theme-scope][data-slice-elevation-theme="${mode}"] {`)[1].split('}')[0];
  for (const [token, value] of Object.entries(createElevationShadows(mode))) {
   expect(block).toContain(`--${token}: ${value};`);
  }
 });
 it('preserves geometry and scales dark opacity without changing shared definitions', () => {
  expect(lightTheme.elevationShadows['elevation-3']).toBe('0px 10px 20px 0px rgba(0, 0, 0, 0.19), 0px 6px 6px 0px rgba(0, 0, 0, 0.1)');
  expect(darkTheme.elevationShadows['elevation-3']).toBe('0px 10px 20px 0px rgba(0, 0, 0, 0.38), 0px 6px 6px 0px rgba(0, 0, 0, 0.2)');
  expect(lightTheme.elevations).toBe(darkTheme.elevations);
 });
});
