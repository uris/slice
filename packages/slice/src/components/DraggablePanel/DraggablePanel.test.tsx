import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DraggablePanel } from './DrggablePanel';

const sizeConstraints = { initial: 230, min: 230, max: 400 };

describe('DraggablePanel initial width', () => {
	it('renders an open fixed-width panel at its initial width on the server', () => {
		const html = renderToStaticMarkup(<DraggablePanel isClosed={false} sizeConstraints={sizeConstraints} />);
		expect(html).toContain('width:230px;');
	});

	it('keeps closed panels at zero width on the server', () => {
		const html = renderToStaticMarkup(<DraggablePanel isClosed sizeConstraints={sizeConstraints} />);
		expect(html).toContain('width:0;');
	});

	it('defers fractional widths until container measurements are available', () => {
		const html = renderToStaticMarkup(<DraggablePanel isClosed={false} sizeConstraints={{ initial: 0.25, min: 0.2, max: 0.5 }} />);
		expect(html).toContain('width:0px;');
	});
});
