import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';
import { FlexBox } from './FlexBox';
import { Icon } from './Icon';
import { Chip } from './Chip';
import { DragHandle } from './DraggablePanel/DrggablePanel';

describe('component color tokens', () => {
	it('resolves forwarded-ref layout backgrounds and scrollbar tokens during SSR', () => {
		const html = renderToStaticMarkup(<FlexBox background="core-surface-primary" scrollHandle="scroll-bar" />);
		expect(html).toContain('background:var(--core-surface-primary)');
		expect(html).toContain('--flex-div-scroll-handle:var(--scroll-bar)');
	});

	it('resolves button label, background, and nested icon colors', () => {
		const html = renderToStaticMarkup(<Button variant="solid" label="Test" backgroundColor="core-surface-special" textColor="core-text-accent" iconLeft="basic.home" iconColor="core-icon-error" />);
		expect(html).toContain('background-color:var(--core-surface-special)');
		expect(html).toContain('color:var(--core-text-accent)');
		expect(html).toContain('var(--core-icon-error)');
	});

	it('resolves SVG and nested drag handle token props', () => {
		const html = renderToStaticMarkup(<Icon name="basic.home" strokeColor="core-icon-error" coverUp="core-surface-special" />);
		expect(html).toContain('stroke="var(--core-icon-error)"');
		const handle = renderToStaticMarkup(<DragHandle color="core-surface-special" strokeColor="core-outline-primary" />);
		expect(handle).toContain('--drag-handle-bg:var(--core-surface-special)');
		expect(handle).toContain('--drag-handle-border-color:var(--core-outline-primary)');
	});

	it('resolves Chip status colors, theme tokens, and custom CSS', () => {
		expect(renderToStaticMarkup(<Chip backgroundColor="feedback-warning" />)).toContain('--ui-chip-bg-color:var(--feedback-warning)');
		expect(renderToStaticMarkup(<Chip backgroundColor="core-surface-special" textColor="#123456" />)).toContain('--ui-chip-bg-color:var(--core-surface-special)');
		expect(renderToStaticMarkup(<Chip textColor="#123456" />)).toContain('--ui-chip-text-color:#123456');
	});
});
