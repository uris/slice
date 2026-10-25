import { afterEach, describe, expect, it, vi } from 'vitest';

// Isolated imports exercise validation of upstream tokens without changing real tokens
// or exposing private conversion helpers as public library API.
afterEach(() => {
 vi.doUnmock('../../../src/theme/type/type');
 vi.doUnmock('../../../src/theme/colors/colors');
 vi.resetModules();
});

describe('native theme token validation', () => {
 it.each(['font-size', 'font-weight', 'line-height', 'letter-spacing'])(
  'rejects typography missing %s', async (missing) => {
   vi.resetModules();
   const properties = { 'font-size': '1rem', 'font-weight': '400', 'line-height': '140%', 'letter-spacing': '0.01em' };
   const css = Object.entries(properties).filter(([key]) => key !== missing).map(([key, value]) => `${key}: ${value}`).join(';');
   vi.doMock('../../../src/theme/type/type', () => ({ type: { body: css } }));
   await expect(import('./index')).rejects.toThrow(`Missing typography property: ${missing}`);
  },
 );
 it.each(['light', 'dark'] as const)('rejects unsupported %s shadow syntax', async (mode) => {
  vi.resetModules();
  vi.doMock('../../../src/theme/colors/colors', async () => {
   const actual = await vi.importActual<typeof import('../../../src/theme/colors/colors')>('../../../src/theme/colors/colors');
   return { ...actual, [mode]: { ...actual[mode], 'surface-shadow-soft': 'unsupported-shadow' } };
  });
  await expect(import('./index')).rejects.toThrow('Unsupported Slice shadow: unsupported-shadow');
 });
});
