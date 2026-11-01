import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DraggablePanel } from './DrggablePanel';

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

const sizeConstraints = { initial: 230, min: 230, max: 400 };

describe('DraggablePanel initial width', () => {
	it('renders an open fixed-width panel at its initial width on the server', () => {
		const html = renderToStaticMarkup(<DraggablePanel isClosed={false} sizeConstraints={sizeConstraints} />);
		expect(html).toContain('width:230px;');
	});

	it('preserves the fixed width on mount and still supports closing and reopening', () => {
		vi.stubGlobal('ResizeObserver', class {
			observe() {}
			unobserve() {}
			disconnect() {}
		});
		const { container, rerender } = render(<DraggablePanel isClosed={false} sizeConstraints={sizeConstraints} />);
		const panel = container.firstElementChild as HTMLElement;
		expect(panel.style.width).toBe('230px');
		rerender(<DraggablePanel isClosed sizeConstraints={sizeConstraints} />);
		expect(panel.style.width).toBe('0px');
		rerender(<DraggablePanel isClosed={false} sizeConstraints={sizeConstraints} />);
		expect(panel.style.width).toBe('230px');
		expect(panel.style.transition).toBe('width var(--motion-water-duration) var(--motion-water)');
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
