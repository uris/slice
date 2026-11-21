import { corners } from './corners/corners';

export type RadiusToken = keyof typeof corners;
export type SpacingToken = `spacing-${'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'h'}`;
export type RadiusValue = number | RadiusToken | `--${RadiusToken}` | (string & {});
export type SizeValue = number | SpacingToken | `--${SpacingToken}` | (string & {});

function getValue(value: SizeValue | null | undefined, fallback: SizeValue | undefined) {
	if (value == null || value === '' || (typeof value === 'number' && !Number.isFinite(value))) return fallback;
	return value;
}

/** Resolve numeric pixels, corner tokens, and CSS radius shorthands. */
export function resolveRadius(value: RadiusValue | null | undefined, fallback: RadiusValue): string;
export function resolveRadius(value: RadiusValue | null | undefined): string | undefined;
export function resolveRadius(value: RadiusValue | null | undefined, fallback?: RadiusValue) {
	const radius = getValue(value, fallback);
	if (typeof radius === 'number') return `${radius}px`;
	return radius?.replace(/(^|[\s/])(?:--)?(corner-[\w-]+)(?=$|[\s/])/g, (match, separator, token) =>
		Object.hasOwn(corners, token) ? `${separator}var(--${token})` : match,
	);
}

/** Resolve numeric pixels, spacing tokens, CSS lengths, and dash-separated spacing shorthands. */
export function resolveSize(value: SizeValue | null | undefined, fallback: SizeValue): string;
export function resolveSize(value: SizeValue | null | undefined): string | undefined;
export function resolveSize(value: SizeValue | null | undefined, fallback?: SizeValue) {
	const size = getValue(value, fallback);
	if (typeof size === 'number') return `${size}px`;
	if (size && /^\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?){1,3}$/.test(size)) {
		return size
			.split('-')
			.map((part) => `${part}px`)
			.join(' ');
	}
	return size?.replace(/(^|\s)(?:--)?(spacing-(?:xxs|xs|s|m|l|xl|xxl|h))(?=$|\s)/g, '$1var(--$2)');
}

/** Expand a resolved CSS box shorthand while keeping spaces inside functions. */
export function resolveBoxSides(value: SizeValue) {
	const parts: string[] = [];
	let depth = 0;
	let start = 0;
	const size = resolveSize(value, '0px').trim();
	for (let index = 0; index < size.length; index++) {
		const char = size[index];
		if (char === '(') depth++;
		if (char === ')') depth--;
		if (depth === 0 && /\s/.test(char)) {
			if (index > start) parts.push(size.slice(start, index));
			start = index + 1;
		}
	}
	parts.push(size.slice(start));
	const [top = '0px', right = top, bottom = top, left = right] = parts;
	return { top, right, bottom, left };
}
