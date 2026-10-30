// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { darkTheme, lightTheme } from '../themes';
import { fontSizes, fontWeights, type, typeCssClasses, typeStyles } from './type';

const themeCss = readFileSync(new URL('./type.css', import.meta.url), 'utf8');
const moduleCss = readFileSync(new URL('../../utils/styling/type.module.css', import.meta.url), 'utf8');

describe('body-xxl typography', () => {
 it('defines an 18px size at the default 16px root', () => {
  expect(fontSizes.xxl).toBe('1.125rem');
  expect(Number.parseFloat(fontSizes.xxl) * 16).toBe(18);
  expect(themeCss).toContain('--font-size-xxl: 1.125rem;');
 });
 it.each(['regular', 'medium', 'bold'] as const)('exposes the %s variant across web theme and CSS APIs', (weight) => {
  const key = `body-xxl-${weight}` as const;
  expect(typeStyles[key]).toMatchObject({ fontSize: '1.125rem', fontWeight: String(fontWeights[weight]), lineHeight: '133.33%', letterSpacing: '0.009375em', textDecoration: 'none' });
  for (const theme of [lightTheme, darkTheme]) {
   expect(theme.type[key]).toBe(type[key]);
   expect(theme.type[key]).toContain('font-size: 1.125rem;');
   expect(theme.type[key]).toContain('line-height: 133.33%;');
   expect(theme.type[key]).toContain('letter-spacing: 0.009375em');
  }
  expect(typeCssClasses[key]).toBe(key);
  for (const css of [themeCss, moduleCss]) {
   const declarations = css.match(new RegExp(`\\.${key}\\s*\\{([^}]+)\\}`))?.[1];
   expect(declarations).toBeDefined();
   expect(declarations).toContain(`font-weight: var(--font-weight-${weight});`);
   expect(declarations).toContain('font-size: var(--font-size-xxl);');
   expect(declarations).toContain('line-height: var(--line-height-m);');
   expect(declarations).toContain('letter-spacing: var(--letter-spacing-s);');
  }
 });
});
