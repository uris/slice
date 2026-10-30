import type { ButtonBaseProps, ButtonProps } from './_types';

type GlassOptions = Exclude<ButtonProps['liquidGlassBackground'], boolean | undefined>;

export function resolveGlassOptions(value: ButtonProps['liquidGlassBackground']): GlassOptions {
	if (value && typeof value === 'object') return value;
	return {};
}

/**

 * Match Slice's existing asymmetric label/icon padding on both rendering paths.

 */
export function resolveButtonInsets({
	hasLabel,
	icon,
	iconPosition,
	contentInsets,
}: Pick<ButtonBaseProps, 'icon' | 'contentInsets'> & { hasLabel: boolean; iconPosition: 'left' | 'right' }) {
	let leading = 0;
	let trailing = 0;
	if (hasLabel) {
		leading = 16;
		trailing = 16;
		if (icon) {
			if (iconPosition === 'right') leading = 22;
			else trailing = 22;
		}
	}
	return {
		top: contentInsets?.top ?? 0,
		bottom: contentInsets?.bottom ?? 0,
		leading: contentInsets?.leading ?? leading,
		trailing: contentInsets?.trailing ?? trailing,
	};
}
