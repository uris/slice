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

type FileListBaseProps<T extends File | FileItem> = {
	/** Raw files render without upload status. FileItem adds progress and errors. */
	files?: T[];
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
	onChange?: (files: T[]) => void;
	backgroundColor?: ColorValue;
	canRemove?: boolean;
	onToolTip?: (tip: ToolTip | null) => void;
};

export type FileListProps<T extends File | FileItem = FileItem> = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof FileListBaseProps<T> | 'role' | 'aria-label' | 'tabIndex' | 'children' | 'dangerouslySetInnerHTML'
> &
	FileListBaseProps<T>;
