'use client';

import { Button, IconButton, useTheme } from '@apple-pie/slice';
import { useClipboard } from '@apple-pie/slice/hooks';
import { useTipActions } from '@apple-pie/slice/stores';
import { addOpacity } from '@apple-pie/slice/utils';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
	canvas = false,
}: Readonly<CodeBlockProps>) {
	const { copy, isCopied, isRequesting, error } = useClipboard({ watchPermissions: false });
	const [instance, setInstance] = useState<Awaited<ReturnType<typeof createCodeHighlighter>>>();
	const [hidden, setHidden] = useState<boolean>(teased);
	const [height, setHeight] = useState(100);
	const { current } = useTheme();
	const codeBlockRef = useRef<HTMLDivElement>(null);
	const { push } = useTipActions();

	// set height of code element
	useEffect(() => {
		if (code) setHeight((codeBlockRef.current?.offsetHeight ?? 100) + 48);
	}, [code]);

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

	const maskStyles = useMemo(() => {
		if (!teased) return {};
		const color = current.colors['core-surface-secondary'];
		const colorFrom = addOpacity(color, 1);
		const colorTo = addOpacity(color, 0.5);
		return {
			background: `linear-gradient(to top, ${colorFrom} 0%, ${colorTo} 80%)`,
		} as React.CSSProperties;
	}, [current.colors['core-surface-secondary'], teased]);

	const buttonStyles = useMemo(() => {
		if (!teased) return {};
		const translateY = hidden ? '50%' : '0';
		return {
			bottom: hidden ? '50%' : '24px',
			left: '50%',
			transform: `translateY(${translateY}) translateX(-50%)`,
		} as React.CSSProperties;
	}, [teased, hidden]);

	const containerStyles = useMemo(() => {
		const radius = canvas ? 0 : 24;
		return {
			maxHeight: !teased ? 'unset' : hidden ? 100 : height,
			borderTopLeftRadius: radius,
			borderTopRightRadius: radius,
			marginBottom: teased ? 0 : 24,
			marginTop: teased ? 0 : 24,
		} as React.CSSProperties;
	}, [teased, height, hidden, canvas]);

	return (
		<figure
			className={[styles.codeBlock, wrap && styles.wrap, className].filter(Boolean).join(' ')}
			style={containerStyles}
		>
			{showFilename && filename && <figcaption className={styles.filename}>{filename}</figcaption>}
			<div className={styles.highlight} ref={codeBlockRef}>
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
			<div className={styles.mask} style={{ ...maskStyles, opacity: hidden ? 1 : 0 }} />
			{teased && (
				<div className={styles.show} style={buttonStyles}>
					<Button
						label={hidden ? 'Show code' : 'Hide code'}
						buttonSize="s"
						textSize={'s'}
						variant={'solid'}
						backgroundColor={'core-surface-primary'}
						textColor={'core-text-primary'}
						padding={16}
						onClick={() => setHidden(!hidden)}
					/>
				</div>
			)}
			<div className={styles.copyButton} style={{ opacity: hidden ? 0 : 1 }}>
				<IconButton
					icon={isCopied ? 'basic.check' : error ? 'basic.cross' : 'basic.copy'}
					iconSize={18}
					toggle={false}
					tooltip={'Copy code'}
					backgroundColorHover={isCopied ? 'feedback-positive' : 'core-surface-primary'}
					backgroundColor={isCopied ? 'feedback-positive' : 'core-surface-primary'}
					borderColor={isCopied ? 'feedback-positive' : 'core-fill-primary'}
					borderWidth={0}
					disabled={isRequesting}
					onClick={() => {
						void copy(code);
					}}
					onToolTip={push}
				/>
			</div>
			<span className={styles.status} role="status">
				{isCopied ? 'Code copied to clipboard.' : error ? 'Unable to copy code. Please try again.' : ''}
			</span>
		</figure>
	);
}
