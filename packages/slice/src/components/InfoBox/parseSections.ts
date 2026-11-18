import { Children, Fragment, type ReactNode, isValidElement } from 'react';
import { InfoBoxAction } from './InfoBoxAction';
import { InfoBoxContent } from './InfoBoxContent';
import { InfoBoxImage } from './InfoBoxImage';
import { InfoBoxTitle } from './InfoBoxTitle';

type Section = 'image' | 'title' | 'content' | 'action';

/** JSX order is independent of the fixed image, text, and action layout. */
export function parseSections(children: ReactNode) {
	const slots = new Map<Section, ReactNode>();
	const visit = (nodes: ReactNode) =>
		Children.forEach(nodes, (child) => {
			if (child == null || typeof child === 'boolean' || (typeof child === 'string' && !child.trim())) return;
			if (isValidElement<{ children?: ReactNode }>(child)) {
				if (child.type === Fragment) {
					visit(child.props.children);
					return;
				}
				let section: Section | undefined;
				if (child.type === InfoBoxImage) section = 'image';
				if (child.type === InfoBoxTitle) section = 'title';
				if (child.type === InfoBoxContent) section = 'content';
				if (child.type === InfoBoxAction) section = 'action';
				if (section) {
					if (slots.has(section)) throw new Error(`InfoBox accepts only one ${section} section.`);
					slots.set(section, child);
					return;
				}
			}
			throw new Error(
				'InfoBox accepts InfoBoxImage, InfoBoxTitle, InfoBoxContent, and InfoBoxAction sections. Place custom content inside a section.',
			);
		});
	visit(children);
	return slots;
}
