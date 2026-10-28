import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Tiny JSX serializer keeps generation independent of React and the native renderer.
function svgElement(tag, props, ...children) {
	if (tag === 'fragment') return children.flat(Number.POSITIVE_INFINITY).join('');
	const attributes = Object.entries(props ?? {})
		.filter(([key, value]) => key !== 'key' && value != null)
		.map(([key, value]) => {
			const name =
				key === 'clipPath'
					? 'clip-path'
					: key === 'xlinkHref'
						? 'href'
						: key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
			// All visible paint is white; only the explicit cover-up marker erases.
			if (['fill', 'stroke'].includes(key) && !['none', 'transparent', '__coverup__'].includes(value)) value = '#fff';
			if (value === '__coverup__') value = '#000';
			return `${name}="${String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`;
		})
		.join(' ');
	return `<${tag}${attributes ? ` ${attributes}` : ''}>${children.flat(Number.POSITIVE_INFINITY).join('')}</${tag}>`;
}
export async function iconSources() {
	const source = readFileSync(new URL('../../src/components/Icon/iconRegistry.tsx', import.meta.url), 'utf8');
	const code = ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.ESNext,
			jsx: ts.JsxEmit.React,
			jsxFactory: 'svgElement',
			jsxFragmentFactory: 'svgFragment',
		},
	}).outputText;
	const module = await import(
		`data:text/javascript;base64,${Buffer.from(`const svgFragment = 'fragment'; const svgElement = ${svgElement.toString()};\n${code}`).toString('base64')}`
	);
	const icons = [];
	for (const [name, definition] of module.STATIC_ICON_REGISTRY) {
		const variants = [];
		for (const [state, render] of [
			['normal', definition.line],
			['on', definition.lineOn],
		]) {
			if (!render) continue;
			const outline = render({ stroke: 1.5, strokeColor: '#fff', coverUp: '__coverup__', fillColor: 0 });
			const filled = render({ stroke: 1.5, strokeColor: '#fff', coverUp: '__coverup__', fillColor: 1 });
			variants.push({ state, filled: false, body: outline });
			if (filled !== outline) variants.push({ state, filled: true, body: filled });
		}
		icons.push({ name, variants });
	}
	return icons;
}

export function maskSVG(body) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><mask id="slice-template-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20" style="mask-type:luminance"><g fill="none">${body}</g></mask></defs><rect width="20" height="20" fill="white" mask="url(#slice-template-mask)"/></svg>`;
}
