import { resolveColor } from '../../theme/colors/resolveColor';

const nestedColorOptions = new Set(['iconLeft', 'resizeHandle', 'dragHandleStyle']);

/** Normalize only color props, preserving styles, children, and caller-owned objects. */
export function resolveColorProps<T extends object>(props: T): T {
	let resolved = props;
	for (const key of Object.keys(props) as (keyof T & string)[]) {
		const value = props[key];
		let next: unknown = value;
		if (
			typeof value === 'string' &&
			(key === 'color' ||
				/^color[A-Z]/.test(key) ||
				key.includes('Color') ||
				['background', 'coverUp', 'scrollHandle', 'scrollHandleHover'].includes(key))
		) {
			next = resolveColor(value);
		} else if (nestedColorOptions.has(key) && value && typeof value === 'object') {
			next = resolveColorProps(value);
		}
		if (next !== value) {
			if (resolved === props) resolved = { ...props };
			resolved[key] = next as T[typeof key];
		}
	}
	return resolved;
}
