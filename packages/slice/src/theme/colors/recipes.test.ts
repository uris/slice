import { describe, expect, it } from 'vitest';
import source from '../../../scripts/grey-palette.json';
import { dark, light } from './colors';
import { coreGreyRecipes, corePalette } from './palette';
import { colorRecipeCss, neutralThemeColors, neutralThemeCss, resolveColorRecipe } from './recipes';

describe('color recipes', () => {
 it.each([
  ['core-grey-795', 0.6, 'rgba(67, 66, 66, 0.6)', 'color-mix(in srgb, var(--core-grey-795) 60%, transparent)'],
  ['core-grey-51', 0.3, 'rgba(245, 243, 240, 0.3)', 'color-mix(in srgb, var(--core-grey-51) 30%, transparent)'],
  ['core-grey-0', 1, '#ffffff', 'var(--core-grey-0)'],
  ['core-grey-1000', 0, 'rgba(0, 0, 0, 0)', 'color-mix(in srgb, var(--core-grey-1000) 0%, transparent)'],
 ] as const)('preserves channels and alpha for %s at %s', (token, opacity, portable, css) => {
  expect(resolveColorRecipe({ token, opacity })).toBe(portable);
  expect(colorRecipeCss({ token, opacity })).toBe(css);
 });
 it('uses every original fill, label, and background recipe in both appearances', () => {
  expect(Object.keys(coreGreyRecipes)).toHaveLength(12);
  for (const group of ['fills', 'text', 'background'] as const) {
   for (const [name, entry] of Object.entries(source[group])) {
    const recipe = coreGreyRecipes[`${group}-${name}` as keyof typeof coreGreyRecipes];
    for (const mode of ['light', 'dark'] as const) {
     expect(corePalette[recipe[mode].token]).toBe(entry[mode]);
     expect(recipe[mode].opacity).toBe('opacity' in entry ? entry.opacity : 1);
    }
   }
  }
 });
 it('maps the screenshot roles without changing foreground opacity into component opacity', () => {
  expect(light).toMatchObject({
   'core-surface-primary': '#ffffff', 'core-surface-secondary': '#f5f4f2',
   'core-text-primary': '#000000', 'core-text-secondary': 'rgba(67, 66, 66, 0.6)',
   'core-text-tertiary': 'rgba(67, 66, 66, 0.3)', 'core-text-quaternary': 'rgba(67, 66, 66, 0.18)',
   'core-fill-primary': 'rgba(128, 128, 128, 0.12)', 'core-fill-secondary': 'rgba(60, 60, 67, 0.3)',
   'core-fill-tertiary': 'rgba(120, 120, 120, 0.2)', 'core-surface-liquid-glass': 'rgba(255, 255, 255, 0.8)',
  });
  expect(dark).toMatchObject({
   'core-surface-primary': '#101010', 'core-surface-secondary': '#1f1e1e',
   'core-text-primary': '#ffffff', 'core-text-secondary': 'rgba(245, 243, 240, 0.6)',
   'core-text-tertiary': 'rgba(245, 243, 240, 0.3)', 'core-text-quaternary': 'rgba(235, 235, 245, 0.18)',
   'core-fill-secondary': 'rgba(235, 235, 245, 0.3)', 'core-surface-liquid-glass': 'rgba(31, 30, 30, 0.8)',
  });
  for (const mode of ['light', 'dark'] as const) {
   expect(Object.keys(neutralThemeColors(mode))).toEqual(Object.keys(neutralThemeCss(mode)));
  }
 });
});

describe('array background and accent pairs', () => {
 it.each([
  ['blue', '#0455a1', '#3c9eff', '0, 136, 255'],
  ['cyan', '#005265', '#3cd3fe', '0, 192, 232'],
  ['lime', '#5e7c12', '#aad254', '157, 204, 41'],
  ['pink', '#a11b33', '#ff5c72', '255, 45, 85'],
  ['orange', '#9d5413', '#ff9f53', '255, 141, 40'],
  ['purple', '#a527b6', '#e056f4', '203, 48, 224'],
  ['yellow', '#997900', '#ffd600', '255, 204, 0'],
 ] as const)('preserves approved %s accents and unflattened background alpha', (family, lightAccent, darkAccent, channels) => {
  expect(light[`array-${family}`]).toBe(`rgba(${channels}, 0.1)`);
  expect(dark[`array-${family}`]).toBe(`rgba(${channels}, 0.16)`);
  expect(light[`array-${family}-accent`]).toBe(lightAccent);
  expect(dark[`array-${family}-accent`]).toBe(darkAccent);
  expect(light).not.toHaveProperty(`array-${family}-label`);
  expect(dark).not.toHaveProperty(`array-${family}-label`);
 });
});

describe('grey level aliases', () => {
 it.each([
  [1, '#939292', '#939290'],
  [2, '#b2b1b0', '#666564'],
  [3, '#cccbca', '#4a4949'],
  [4, '#d6d5d4', '#3c3c3b'],
  [5, '#eae9e8', '#2e2e2d'],
  [6, '#f7f6f5', '#1e1e1d'],
 ] as const)('resolves grey %s to its exact light/dark pair', (level, lightHex, darkHex) => {
  expect(light[`core-grey-${level}`]).toBe(lightHex);
  expect(dark[`core-grey-${level}`]).toBe(darkHex);
 });
 it('retains the unnumbered grey alias and fixed ramp endpoints', () => {
  expect(light['core-grey-1']).toBe(light['core-grey']);
  expect(dark['core-grey-1']).toBe(dark['core-grey']);
  expect(corePalette['core-grey-50']).toBe('#f5f4f2');
  expect(corePalette['core-grey-1000']).toBe('#000000');
 });
});
