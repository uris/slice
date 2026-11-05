import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

export type ContentEditableEditEndReason = 'blur' | 'enter' | 'escape' | 'external';
type ContentEditableBaseProps = {
	name?: string;
	value?: string;
	defaultValue?: string;
	isEditable?: boolean;
	selectOnEdit?: boolean;
	placeholder?: string;
	width?: number | string;
	textAlign?: 'left' | 'center' | 'right';
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	textColor?: ColorValue;
	textColorPlaceholder?: ColorValue;
	clamp?: number;
	padding?: number | string;
	borderRadius?: number | string;
	backgroundColor?: ColorValue;
	onChange?: (draft: string) => void;
	onCommit?: (value: string, previousValue: string) => void;
	onEditStart?: () => void;
	onEditEnd?: (reason: ContentEditableEditEndReason) => void;
};
export type ContentEditableProps = Omit<
	React.HTMLAttributes<HTMLSpanElement>,
	| keyof ContentEditableBaseProps
	| keyof React.AriaAttributes
	| 'role'
	| 'children'
	| 'dangerouslySetInnerHTML'
	| 'contentEditable'
	| 'suppressContentEditableWarning'
	| 'onSubmit'
> &
	ContentEditableBaseProps;
