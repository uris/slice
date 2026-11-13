import type React from 'react';
import type { ColorValue } from '../../theme';
import type { ButtonProps } from '../Button';
import type { TextFieldProps } from '../Textfield';
import type { ButtonStyleProps } from '../sharedTypes';

type ButtonBarStyleProps = ButtonStyleProps &
	Pick<
		ButtonProps,
		| 'variant'
		| 'state'
		| 'disabled'
		| 'width'
		| 'iconDualTone'
		| 'fill'
		| 'iconSize'
		| 'iconStrokeWidth'
		| 'borderRadius'
		| 'borderWidth'
		| 'borderColor'
		| 'iconColor'
		| 'iconColorHover'
		| 'backgroundColor'
		| 'backgroundColorHover'
		| 'backgroundColorDisabled'
		| 'textColor'
		| 'textColorHover'
		| 'textSize'
		| 'transition'
		| 'variants'
		| 'initial'
		| 'animate'
		| 'exit'
		| 'underline'
		| 'destructive'
	>;

/** Identifies a processed bar item. The index includes buttons and TextFields. */
export type ButtonBarItemInfo = Pick<ButtonProps, 'id' | 'label'> & {
	index: number;
};

export type ButtonBarItemClickInfo = ButtonBarItemInfo;

// Keep native button event signatures; clicks additionally identify the bar item.
type ButtonBarEvents = Pick<ButtonProps, Exclude<Extract<keyof ButtonProps, `on${string}`>, 'onChange' | 'onClick'>> & {
	/** Button activation, after the child's own onClick callback. */
	onClick?: (event: Parameters<NonNullable<ButtonProps['onClick']>>[0], item: ButtonBarItemClickInfo) => void;
	/** TextField value changes, after the child's own onChange callback. */
	onChange?: (value: Parameters<NonNullable<TextFieldProps['onChange']>>[0], item: ButtonBarItemInfo) => void;
};

/**
 * Defined styles override child values. Border props belong only to the wrapper.
 * Buttons default to outline, medium button/text sizes, and Button's own padding
 * and optical label adjustment. Small buttons default to 2px top/bottom padding;
 * explicit padding or side padding takes precedence.
 * Background defaults to core-surface-secondary when the
 * child has no background override. Text defaults to core-text-secondary unless
 * overridden by the child or bar. Icons also default to secondary; icon and text
 * hover colors default to core-text-primary.
 */
export type ButtonBarBaseProps = ButtonBarStyleProps &
	ButtonBarEvents & {
		/** Button definitions to render in the stack. */
		buttons?: ButtonProps[];
		/** Composed content; only direct Button and TextField elements are processed. Fields use the simple variant and bar height. */
		children?: React.ReactNode;
		orientation?: 'horizontal' | 'vertical';
		/** Extra left/right content inset at the bar edges, inside button backgrounds. Numbers use pixels. Defaults to 6 for l, 10 for xl, 4 otherwise, and 0 for vertical bars. */
		inset?: number | string;
		/** Percentage mixed toward white on hover (0–100). Defaults to 4. Explicit hover colors take precedence. */
		hoverTint?: number;
		borderStyle?: React.CSSProperties['borderStyle'];
		/** Wrapper border color while a child has focus. Defaults to core-fill-secondary. */
		borderColorFocused?: ColorValue;
		/** Whether to render dividers between adjacent buttons. */
		divider?: boolean;
		dividerColor?: ColorValue;
		/** Divider opacity, from 0 to 1. Defaults to 0.75. */
		dividerOpacity?: number;
		/** Divider thickness. Numbers use pixels. */
		dividerWidth?: number | string;
		dividerStyle?: React.CSSProperties['borderStyle'];
	};

/** DOM attributes apply to the wrapper; event callbacks receive child Button events. */
export type ButtonBarProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof ButtonBarBaseProps | 'color' | Extract<keyof React.HTMLAttributes<HTMLDivElement>, `on${string}`>
> &
	ButtonBarBaseProps;
