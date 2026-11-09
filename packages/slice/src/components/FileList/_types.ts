import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { FixedSize, ToolTip } from '../sharedTypes';

export type FileItem = {
	/** Stable identity for immutable updates and duplicate filenames. Unique within the list. */
	id?: string;
	file: File | string;
	uploading?: boolean;
	/** Percentage from 0 to 100. Missing/nonfinite progress is indeterminate while uploading. */
	progress?: number;
	error?: string;
};

type FileListBaseProps = {
	files?: FileItem[];
	/** Compact file rows by default; attachments render thumbnail cards. */
	variant?: 'list' | 'attachments';
	/** Card dimensions for the attachments variant. */
	attachmentSize?: FixedSize;
	listName?: string;
	direction?: 'row' | 'column';
	gap?: number;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	maxWidth?: number | string;
	minWidth?: number | string;
	padding?: number | string;
	iconSize?: number;
	onChange?: (files: FileItem[]) => void;
	backgroundColor?: ColorValue;
	canRemove?: boolean;
	onToolTip?: (tip: ToolTip | null) => void;
};

export type FileListProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof FileListBaseProps | 'role' | 'aria-label' | 'tabIndex' | 'children' | 'dangerouslySetInnerHTML'
> &
	FileListBaseProps;
