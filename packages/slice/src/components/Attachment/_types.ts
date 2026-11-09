import type React from 'react';
import type { ColorValue } from '../../theme';
import type { FileIconTypes } from '../FileIcon';
import type { FileItem } from '../FileList';
import type { FixedSize, ToolTip } from '../sharedTypes';

export enum ContentType {
	Text = 'text',
	File = 'file',
}

export type ContentFormat = FileIconTypes;

export type Content = FileItem | string;

export type AttachmentBaseProps = {
	/** FileItem.uploading and FileItem.progress drive upload status; FileItem.error replaces the preview. */
	content?: Content;
	textColor?: ColorValue;
	textColorLight?: ColorValue;
	textSize?: FixedSize;
	borderColor?: ColorValue;
	borderWidth?: number;
	borderStyle?: React.CSSProperties['borderStyle'];
	borderRadius?: number | string;
	iconSize?: number;
	iconGap?: number;
	/** Exact padding inside each information row. */
	padding?: number | string;
	width?: number | string;
	height?: number | string;
	thumbTextSize?: number;
	thumbPadding?: number | string;
	/** Removal is shown only when a handler is supplied; false hides it. */
	canRemove?: boolean;
	/** Accessible name of the attachment group; defaults to the displayed filename. */
	attachmentName?: string;
	/** Override the contextual action name, which includes the original filename extension. */
	removeLabel?: string;
	/** Optional preview action; supports mouse and native keyboard activation. */
	onOpen?: React.MouseEventHandler<HTMLButtonElement>;
	openLabel?: string;
	disabled?: boolean;
	/** Controlled removal: update parent state here. The click does not bubble to the wrapper. */
	onRemove?: React.MouseEventHandler<HTMLButtonElement>;
	onToolTip?: (tip: ToolTip | null) => void;
	backgroundColor?: ColorValue;
	thumbColor?: ColorValue;
	size?: FixedSize;
};

export type AttachmentProps = AttachmentBaseProps &
	Omit<
		React.HTMLAttributes<HTMLDivElement>,
		keyof AttachmentBaseProps | keyof React.AriaAttributes | 'role' | 'children' | 'dangerouslySetInnerHTML'
	>;
