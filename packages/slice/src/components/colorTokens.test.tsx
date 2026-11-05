import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';
import { FlexDiv } from './FlexDiv';
import { Icon } from './Icon';
import { Label } from './Label';
import { DragHandle } from './DraggablePanel/DrggablePanel';

describe('component color tokens', () => {
	it('resolves forwarded-ref layout backgrounds and scrollbar tokens during SSR', () => {
		const html = renderToStaticMarkup(<FlexDiv background="core-surface-primary" scrollHandle="scroll-bar" />);
		expect(html).toContain('background:var(--core-surface-primary)');
		expect(html).toContain('--flex-div-scroll-handle:var(--scroll-bar)');
	});

	it('resolves button label, background, and nested icon colors', () => {
		const html = renderToStaticMarkup(<Button variant="solid" label="Test" backgroundColor="core-surface-special" textColor="core-text-accent" iconLeft="basic.home" iconColor="core-icon-error" />);
		expect(html).toContain('background:var(--core-surface-special)');
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

	it('preserves Label semantic colors and custom CSS while accepting tokens', () => {
		expect(renderToStaticMarkup(<Label backgroundColor="red" />)).toContain('--label-bg-color:var(--feedback-warning)');
		expect(renderToStaticMarkup(<Label backgroundColor="core-surface-special" textColor="#123456" />)).toContain('--label-bg-color:var(--core-surface-special)');
		expect(renderToStaticMarkup(<Label textColor="#123456" />)).toContain('--label-color:#123456');
	});
});
