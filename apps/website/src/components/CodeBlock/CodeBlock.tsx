'use client';

import { SquareButton, SquareButtonType } from '@/components/SqaureButton/SquareButton';
import { useClipboard } from '@apple-pie/slice/hooks';
import { useEffect, useMemo, useState } from 'react';
import styles from './CodeBlock.module.css';

export interface CodeBlockProps {
	code: string;
	/** Use tsx for TypeScript examples containing React JSX. */
	language?: 'typescript' | 'tsx';
	filename?: string;
	showFilename?: boolean;
	/** Wrap long lines instead of scrolling horizontally. */
	wrap?: boolean;
	className?: string;
}

// All snippets share one lazily loaded, TypeScript-only highlighter.
async function createCodeHighlighter() {
	const [{ createHighlighterCore }, { createJavaScriptRegexEngine }, typescript, tsx, theme] = await Promise.all([
		import('shiki/core'),
		import('shiki/engine/javascript'),
		import('shiki/langs/typescript.mjs'),
		import('shiki/langs/tsx.mjs'),
		import('shiki/themes/github-dark.mjs'),
	]);
	return createHighlighterCore({
		langs: [typescript.default, tsx.default],
		themes: [theme.default],
		engine: createJavaScriptRegexEngine(),
	});
}

let highlighter: ReturnType<typeof createCodeHighlighter> | undefined;

export function CodeBlock({
	code,
	language = 'typescript',
	filename,
	showFilename = false,
	wrap = false,
	className,
}: Readonly<CodeBlockProps>) {
	const { copy, isCopied, isRequesting, error } = useClipboard({ watchPermissions: false });
	const [instance, setInstance] = useState<Awaited<ReturnType<typeof createCodeHighlighter>>>();

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

	return (
		<figure className={[styles.codeBlock, wrap && styles.wrap, className].filter(Boolean).join(' ')}>
			{showFilename && filename && <figcaption className={styles.filename}>{filename}</figcaption>}
			<div className={styles.highlight}>
				<pre
					className={styles.scrollArea}
					role="region"
					aria-label={filename ?? 'TypeScript code'}
					style={{ color: fg }}
				>
					<code>
						{tokens
							? tokens.map((line, lineIndex) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: Token positions are stable within this static render.
									<span key={lineIndex}>
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
										{lineIndex < tokens.length - 1 ? '\n' : ''}
									</span>
								))
							: code}
					</code>
				</pre>
			</div>
			<div className={styles.copyButton}>
				<SquareButton
					label={isCopied ? 'Copied!' : error ? 'Retry copy' : 'Copy code'}
					variant={SquareButtonType.Secondary}
					disabled={isRequesting}
					onClick={() => {
						void copy(code);
					}}
				/>
			</div>
			<span className={styles.status} role="status">
				{isCopied ? 'Code copied to clipboard.' : error ? 'Unable to copy code. Please try again.' : ''}
			</span>
		</figure>
	);
}
