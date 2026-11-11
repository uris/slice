import { afterEach, describe, expect, it, vi } from 'vitest';
import type { KeyboardShortcut } from '../../hooks/useKeyboardShortcuts/useKeyboardShortcuts';
import { resolveShortcut } from './resolveShortcut';

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const shortcut: KeyboardShortcut = { key: 'k', name: 'Quick open', metaPressed: true, altPressed: true, shiftPressed: true };

describe('resolveShortcut', () => {
 it('formats Apple modifiers in menu order without changing the definition', () => {
  expect(resolveShortcut(Object.freeze(shortcut), true)).toBe('⌥⇧⌘K');
 });
 it('formats the matching Windows/Linux modifiers', () => {
  expect(resolveShortcut(shortcut, false)).toBe('Ctrl+Alt+Shift+K');
 });
 it.each([
  ['Enter', 'Enter', 'Enter'], ['Escape', 'Esc', 'Esc'], ['Backspace', '⌫', 'Backspace'], ['Delete', '⌦', 'Delete'],
  ['Tab', 'Tab', 'Tab'], ['ArrowUp', '↑', 'Up'], ['ArrowDown', '↓', 'Down'], ['ArrowLeft', '←', 'Left'], ['ArrowRight', '→', 'Right'], [' ', 'Space', 'Space'],
 ])('formats the named key %s', (key, apple, other) => {
  expect(resolveShortcut({ name: 'Action', key }, true)).toBe(apple);
  expect(resolveShortcut({ name: 'Action', key }, false)).toBe(other);
 });
 it('handles unmodified characters and preserves unknown key names', () => {
  expect(resolveShortcut({ name: 'Action', key: 'a' }, true)).toBe('A');
  expect(resolveShortcut({ name: 'Action', key: 'F12' }, false)).toBe('F12');
  expect(resolveShortcut({ name: 'Action', key: 'constructor' }, true)).toBe('constructor');
 });
 it.each([['MacIntel', '⌥⇧⌘K'], ['iPhone', '⌥⇧⌘K'], ['Linux x86_64', 'Ctrl+Alt+Shift+K']])('detects %s by default', (platform, expected) => {
  vi.spyOn(navigator, 'platform', 'get').mockReturnValue(platform);
  expect(resolveShortcut(shortcut)).toBe(expected);
 });
 it('accepts explicit platform overrides', () => {
  vi.spyOn(navigator, 'platform', 'get').mockReturnValue('MacIntel');
  expect(resolveShortcut(shortcut, false)).toBe('Ctrl+Alt+Shift+K');
 });
 it('works without browser globals', () => {
  vi.stubGlobal('window', undefined); vi.stubGlobal('navigator', undefined);
  expect(resolveShortcut(shortcut)).toBe('Ctrl+Alt+Shift+K');
 });
});
