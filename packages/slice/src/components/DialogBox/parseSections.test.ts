import { createElement as h, Fragment } from 'react';
import { describe, expect, it } from 'vitest';
import { parseSections } from './parseSections';
import { sections } from './sections';

describe('DialogBox section parsing', () => {
 it('retains the shorthand body and flattens fragments and conditionals for composition', () => {
  expect(parseSections('Body', 'Title').content).toBe('Body');
  const result = parseSections(h(Fragment, null, false, null, h(sections.Actions, null, 'Footer'), h(Fragment, null, h(sections.Title, null, 'Heading'), h(sections.Content, null, 'Body'))));
  expect(result).toEqual({ title: 'Heading', content: 'Body', actions: 'Footer', hasActions: true });
 });
 it.each([sections.Title, sections.Content, sections.Actions])('rejects repeated structural sections', Section => {
  expect(() => parseSections([h(Section, { key: 'a' }), h(Section, { key: 'b' })])).toThrow('only one');
 });
 it('rejects conflicting shorthand definitions, including empty props', () => {
  expect(() => parseSections(h(sections.Title), '')).toThrow('Use either title');
  expect(() => parseSections(h(sections.Actions), undefined, [])).toThrow('Use either actions');
 });
 it('rejects unsupported direct children in composed mode', () => {
  expect(() => parseSections([h(sections.Title, { key: 'title' }, 'Title'), h('div', { key: 'body' }, 'Body')])).toThrow('Place body content inside DialogBox.Content');
 });
 it('allows shorthand props for sections that are not composed', () => {
  expect(parseSections(h(sections.Content, null, 'Body'), 'Heading').title).toBe('Heading');
 });
});
