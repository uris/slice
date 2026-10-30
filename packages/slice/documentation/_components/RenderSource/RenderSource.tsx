import { Source } from '@storybook/addon-docs/blocks';
import React from 'react';
import { useTheme } from 'src';

export interface RenderSourceProps extends React.ComponentProps<typeof Source> {
	children?: React.ReactNode;
}

/**
 * Custom MDX renderer that converts children to a string.
 * Supports both string children and fenced markdown code blocks inside MDX.
 */
function childrenToCode(children: React.ReactNode) {
	const isTag = (node: React.ReactNode, tagName: string): node is React.ReactElement =>
		React.isValidElement(node) && typeof node.type === 'string' && node.type === tagName;

	const findFirstPre = (node: React.ReactNode): React.ReactElement | null => {
		if (Array.isArray(node)) {
			for (const child of node) {
				const match = findFirstPre(child);
				if (match) return match;
			}
			return null;
		}

		if (!React.isValidElement(node) || !node.props) {
			return null;
		}

		if (isTag(node, 'pre')) {
			return node;
		}

		const contentNode = (node as any).props as React.PropsWithChildren;
		return findFirstPre(contentNode.children);
	};

	const toText = (node: React.ReactNode): string => {
		if (typeof node === 'string' || typeof node === 'number') {
			return String(node);
		}

		if (Array.isArray(node)) {
			return node.map(toText).join('');
		}

		if (React.isValidElement(node) && node.props) {
			const contentNode = node.props as React.PropsWithChildren;
			return toText(contentNode.children ?? '');
		}
		return '';
	};

	// When MDX content is passed as a fenced code block, it becomes <pre><code>...</code></pre>.
	// Prioritize that branch to avoid accidentally serializing nearby markdown copy.
	const preNode = findFirstPre(children);
	const code = preNode ? toText(preNode) : toText(children);

	// Keep indentation/tabs intact; only drop a single outer newline from MDX formatting.
	return code.replace(/^\n/, '').replace(/\n$/, '');
}

export function RenderSource(props: RenderSourceProps) {
	const { children, code, dark, ...sourceProps } = props;
	const theme = useTheme();
	const resolvedCode = code ?? childrenToCode(children);
	const resolvedDark = dark ?? theme.isDark;

	return <Source {...sourceProps} dark={resolvedDark} code={resolvedCode} />;
}
