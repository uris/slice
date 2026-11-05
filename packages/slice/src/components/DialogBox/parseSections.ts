import { Children, Fragment, type ReactNode, isValidElement } from 'react';
import type { DialogBoxSectionProps } from './_types';
import { sections } from './sections';

type Slot = 'title' | 'content' | 'actions';

export function parseSections(children: ReactNode, title?: string, actions?: unknown[]) {
	const found = new Map<Slot, ReactNode>();
	let unsupported = false;
	const visit = (nodes: ReactNode) =>
		Children.forEach(nodes, (child) => {
			if (child == null || typeof child === 'boolean' || (typeof child === 'string' && child.trim() === '')) return;
			if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
				visit(child.props.children);
				return;
			}
			let slot: Slot | undefined;
			if (isValidElement<DialogBoxSectionProps>(child)) {
				if (child.type === sections.Title) slot = 'title';
				if (child.type === sections.Content) slot = 'content';
				if (child.type === sections.Actions) slot = 'actions';
				if (slot) {
					if (found.has(slot)) throw new Error(`DialogBox accepts only one ${slot} section.`);
					found.set(slot, child.props.children);
					return;
				}
			}
			unsupported = true;
		});
	visit(children);
	const composed = found.size > 0;
	if (composed && unsupported)
		throw new Error(
			'DialogBox composition accepts only DialogBox.Title, DialogBox.Content, and DialogBox.Actions as direct children. Place body content inside DialogBox.Content.',
		);
	if (found.has('title') && title !== undefined) throw new Error('Use either title or DialogBox.Title, not both.');
	if (found.has('actions') && actions !== undefined)
		throw new Error('Use either actions or DialogBox.Actions, not both.');
	return {
		title: found.has('title') ? found.get('title') : title,
		content: composed ? found.get('content') : children,
		actions: found.get('actions'),
		hasActions: found.has('actions'),
	};
}
