'use client';

import { IconButton } from '@apple-pie/slice';
import { useClipboard } from '@apple-pie/slice/hooks';
import { useTipActions, useToastActions } from '@apple-pie/slice/stores';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import styles from './CodeBlock.module.css';

export interface CodeBlockProps {
	code: string;
	/** Use tsx for TypeScript examples containing React JSX. */
	language?: 'typescript' | 'tsx' | 'css';
	filename?: string;
	showFilename?: boolean;
	/** Wrap long lines, preserving their indentation on continuation lines. */
	wrap?: boolean;
	className?: string;
	teased?: boolean;
	canvas?: boolean;
	showCopy?: boolean;
	last?: boolean;
	first?: boolean;
}

// All snippets share one lazily loaded highlighter for TypeScript, TSX, and CSS.
async function createCodeHighlighter() {
	const [{ createHighlighterCore }, { createJavaScriptRegexEngine }, typescript, tsx, theme, css] = await Promise.all([
		import('shiki/core'),
		import('shiki/engine/javascript'),
		import('shiki/langs/typescript.mjs'),
		import('shiki/langs/tsx.mjs'),
		import('shiki/themes/github-dark.mjs'),
		import('shiki/langs/css.mjs'),
	]);
	return createHighlighterCore({
		langs: [typescript.default, tsx.default, css.default],
		themes: [theme.default],
		engine: createJavaScriptRegexEngine(),
	});
}

// Match the two-column tab stops used by the code block stylesheet.
function getLineIndent(content: string): number {
	let columns = 0;
	for (const character of content) {
		if (character === ' ') {
			columns += 1;
		} else if (character === '\t') {
			columns += 2 - (columns % 2);
		} else {
			break;
		}
	}
	return columns;
}

function getWrappedLineStyle(content: string): React.CSSProperties {
	const indent = `${getLineIndent(content)}ch`;
	return { paddingLeft: indent, textIndent: `-${indent}` };
}

let highlighter: ReturnType<typeof createCodeHighlighter> | undefined;

export function CodeBlock({
	code,
	language = 'typescript',
	filename,
	showFilename = false,
	wrap = false,
	className,
	teased = false,
	last = true,
	first = true,
	canvas = false,
	showCopy = true,
}: Readonly<CodeBlockProps>) {
	const { copy, isCopied, isRequesting, error } = useClipboard({ watchPermissions: false });
	const [instance, setInstance] = useState<Awaited<ReturnType<typeof createCodeHighlighter>>>();
	const pushTip = useTipActions().push;
	const pushToast = useToastActions().push;

	useEffect(() => {
		let active = true;
		highlighter ??= createCodeHighlighter().catch((error) => {
			highlighter = undefined;
			throw error;
		});
		highlighter
			.then((value) => {
				if (active) setInstance(value);
			})
			.catch((error) => console.error('Code highlighting failed:', error));
		return () => {
			active = false;
		};
	}, []);

	const highlighted = useMemo(
		() => instance?.codeToTokens(code, { lang: language, theme: 'github-dark' }),
		[instance, code, language],
	);
	const { tokens, fg = '#e1e4e8' } = highlighted ?? {};

	// adjust display based on integration into canvas or displayed solo
	const containerStyles = useMemo(() => {
		const topRadius = canvas ? 0 : 24;
		const bottomRadius = canvas && !last ? 0 : 24;
		return {
			borderTopLeftRadius: topRadius,
			borderTopRightRadius: topRadius,
			borderBottomLeftRadius: bottomRadius,
			borderBottomRightRadius: bottomRadius,
			marginBottom: canvas || teased ? 0 : 24,
			marginTop: canvas || teased ? 0 : 24,
			borderWidth: canvas ? 0 : 1,
			background: canvas ? 'transparent' : 'var(--core-surface-secondary)',
			overflow: canvas ? 'visible' : 'hidden',
		} as React.CSSProperties;
	}, [canvas, teased, last]);

	const getCopyIcon = () => {
		if (isCopied) return 'basic.check';
		if (error) return 'basic.cross';
		return 'basic.copy';
	};

	return (
		<figure
			className={[styles.codeBlock, wrap && styles.wrap, className].filter(Boolean).join(' ')}
			style={containerStyles}
		>
			{showFilename && filename && (
				<figcaption className={styles.filename} style={{ borderTopWidth: canvas && first ? 0 : undefined }}>
					{filename}
				</figcaption>
			)}
			<div className={styles.highlight}>
				<pre
					className={styles.scrollArea}
					role="region"
					aria-label={filename ?? (language === 'css' ? 'CSS code' : 'TypeScript code')}
					style={{ color: fg, paddingBottom: teased ? 64 : 24 }}
				>
					<code>
						{tokens
							? tokens.map((line, lineIndex) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: Token positions are stable within this static render.
									<span key={lineIndex} className={styles.line}>
										<span
											className={styles.lineContent}
											style={wrap ? getWrappedLineStyle(line.map((token) => token.content).join('')) : undefined}
										>
											{line.map((token) => (
												<span
													key={token.offset}
													style={{
														color: token.color,
														fontStyle: (token.fontStyle ?? 0) & 1 ? 'italic' : undefined,
														fontWeight: (token.fontStyle ?? 0) & 2 ? 'bold' : undefined,
														textDecoration: (token.fontStyle ?? 0) & 4 ? 'underline' : undefined,
													}}
												>
													{token.content}
												</span>
											))}
										</span>
										{lineIndex < tokens.length - 1 ? '\n' : ''}
									</span>
								))
							: code}
					</code>
				</pre>
			</div>
			{showCopy && (
				<div className={styles.copyButton}>
					<IconButton
						icon={getCopyIcon()}
						actionName={filename ? `Copy ${filename}` : 'Copy code'}
						iconSize={18}
						toggle={false}
						tooltip={'Copy code'}
						backgroundColorHover={isCopied ? 'feedback-positive' : 'core-surface-primary'}
						backgroundColor={isCopied ? 'feedback-positive' : 'core-surface-primary'}
						borderColor={isCopied ? 'feedback-positive' : 'core-fill-primary'}
						borderWidth={0}
						disabled={isRequesting}
						onClick={async () => {
							const result = await copy(code);
							if (result) pushToast({ message: 'Code copied to clipboard', type: 'success', duration: 1500 });
							else pushToast({ message: 'Unable to copy to clipboard', type: 'error', duration: 1500 });
						}}
						onToolTip={pushTip}
					/>
				</div>
			)}
			<span className={styles.status} role="status">
				{isCopied ? 'Code copied to clipboard.' : error ? 'Unable to copy code. Please try again.' : ''}
			</span>
		</figure>
	);
}
