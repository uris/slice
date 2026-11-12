import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import seeds from '../../../scripts/core-palette.json';
import greySource from '../../../scripts/grey-palette.json';
import { themeCss } from './recipes';
import { corePalette, corePaletteAnchors, coreGreyAnchors, coreGreyLayers } from './palette';

const colors: Record<string, string> = corePalette;
const requiredStops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Independent sRGB luminance check: increasing shade numbers should get darker.
function luminance(hex: string) {
 const channels = hex.slice(1).match(/../g)!.map(value => {
  const s = Number.parseInt(value, 16) / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
 });
 return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

describe('core palette', () => {
 it('preserves both screenshot colors exactly, with every light anchor at 500', () => {
  for (const [family, seed] of Object.entries(seeds)) {
   const anchors = corePaletteAnchors[family as keyof typeof corePaletteAnchors];
   expect(anchors.light).toBe(500);
   expect(colors[`core-${family}-500`]).toBe(seed.light);
   expect(colors[`core-${family}-${anchors.dark}`]).toBe(seed.dark);
  }
 });
 it('has complete shared ramps ordered from light to dark', () => {
  for (const family of Object.keys(seeds)) {
   const entries = Object.entries(colors).filter(([token]) => token.startsWith(`core-${family}-`));
   const stops = entries.map(([token]) => Number(token.split('-').at(-1)));
   expect(stops).toEqual([...stops].sort((a, b) => a - b));
   expect(stops).toEqual(expect.arrayContaining(requiredStops));
   for (let i = 1; i < entries.length; i++) {
    expect(luminance(entries[i][1]), entries[i][0]).toBeLessThan(luminance(entries[i-1][1]));
   }
  }
 });
 it('publishes every palette value as an identical CSS custom property', () => {
  const css = readFileSync('src/theme/colors/palette.css', 'utf8');
  for (const [token, value] of Object.entries(colors)) expect(css).toContain(`--${token}: ${value};`);
 });
});

it('keeps semantic CSS references aligned with both theme maps', async () => {
 const { coreColors, light, dark } = await import('./colors');
 const css = readFileSync('src/theme/colors/colors.css', 'utf8');
 for (const [mode, theme] of Object.entries({ light, dark })) {
  const block = css.split(`:root[data-slice-theme="${mode}Mode"] [data-slice-theme-scope] {`)[1].split('}')[0];
  const references = [...block.matchAll(/--([\w-]+): ([^;]+);/g)];
  const neutral: Record<string,string> = themeCss(mode as 'light' | 'dark');
  expect(references).toHaveLength(Object.keys(theme).length);
  for (const [, token, value] of references) {
   if (token in neutral) expect(value).toBe(neutral[token]);
   else {
    const reference = value.match(/^var\(--([\w-]+)\)$/)?.[1];
    expect(reference, token).toBeDefined();
    expect(theme[token as keyof typeof theme]).toBe(coreColors[reference as keyof typeof coreColors]);
   }
  }
 }
});


it('keeps white text readable on primary, badge, and destructive fills', async () => {
 const { light, dark } = await import('./colors');
 for (const theme of [light, dark]) {
  for (const role of ['core-button-primary', 'core-badge-primary', 'feedback-warning'] as const) {
   const contrast = (luminance(theme['core-text-light']) + 0.05) / (luminance(theme[role]) + 0.05);
   expect(contrast, role).toBeGreaterThanOrEqual(4.5);
  }
 }
});


describe('gray screenshot ramp', () => {
 it('includes every distinct printed base color exactly once as a fixed anchor', () => {
  const values = new Set(Object.values(greySource).flatMap(group => Object.values(group).flatMap(entry => [entry.light, entry.dark])));
  expect(values.size).toBe(22);
  expect(Object.keys(coreGreyAnchors).sort()).toEqual([...values].sort());
  for (const hex of values) {
   expect(colors[coreGreyAnchors[hex as keyof typeof coreGreyAnchors]]).toBe(hex);
  }
  expect(colors['core-grey-0']).toBe('#ffffff');
  expect(colors['core-grey-500']).toBe('#939292');
  expect(colors['core-grey-1000']).toBe('#000000');
 });
 it('keeps near-identical screenshot shades distinct and the full ramp ordered', () => {
  const ramp = Object.entries(colors).filter(([token]) => token.startsWith('core-grey-'));
  expect(ramp).toHaveLength(31);
  for (let i=1; i<ramp.length; i++) {
   expect(Number(ramp[i][0].split('-').at(-1))).toBeGreaterThan(Number(ramp[i-1][0].split('-').at(-1)));
   expect(luminance(ramp[i][1]), ramp[i][0]).toBeLessThan(luminance(ramp[i-1][1]));
  }
  expect(coreGreyAnchors['#939292']).not.toBe(coreGreyAnchors['#939290']);
  expect(coreGreyAnchors['#1f1e1e']).not.toBe(coreGreyAnchors['#1e1e1d']);
 });
 it('retains opacity as a layer recipe rather than flattening the base color', () => {
  for (const [group, entries] of Object.entries(greySource)) {
   for (const [name, entry] of Object.entries(entries)) {
    if (!('opacity' in entry)) continue;
    const key = `${group}-${name}` as keyof typeof coreGreyLayers;
    for (const mode of ['light','dark'] as const) {
     const layer = coreGreyLayers[key][mode];
     expect(layer.opacity).toBe(entry.opacity);
     expect(colors[layer.token]).toBe(entry[mode]);
    }
   }
  }
 });
});


it('places the custom primary surface between black and the secondary surface', async () => {
 const { dark } = await import('./colors');
 expect(colors['core-grey-975']).toBe('#101010');
 expect(dark['core-surface-primary']).toBe(colors['core-grey-975']);
 expect(luminance(dark['core-surface-primary'])).toBeGreaterThan(luminance('#000000'));
 expect(luminance(dark['core-surface-primary'])).toBeLessThan(luminance(dark['core-surface-secondary']));
});

it('resolves base family aliases to each appearance anchor while keeping fixed ramps unchanged', async () => {
 const { light, dark, colorCssVars } = await import('./colors');
 const { resolveColor } = await import('./resolveColor');
 for (const family of Object.keys(corePaletteAnchors) as (keyof typeof corePaletteAnchors)[]) {
  const token = `core-${family}` as const;
  for (const [mode, theme] of [['light', light], ['dark', dark]] as const) {
   const stop = corePaletteAnchors[family][mode];
   expect(theme[token]).toBe(colors[`core-${family}-${stop}`]);
  }
  expect(resolveColor(token)).toBe(`var(--${token})`);
  expect(colorCssVars[token]).toBe(`var(--${token})`);
 }
 expect(light['core-blue']).toBe('#0088ff');
 expect(dark['core-blue']).toBe('#0091ff');
 expect(colors['core-blue-500']).toBe('#0088ff');
});
