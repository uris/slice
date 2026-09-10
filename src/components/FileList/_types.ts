import type React from 'react';
import type { ToolTip } from '../sharedTypes';

export type FileItem = {
	file: File | string;
	uploading?: boolean;
	progress?: number;
	error?: string;
};

type FileListBaseProps = {
	files?: FileItem[];
	direction?: 'row' | 'column';
	gap?: number;
	size?: 'xs' | 's' | 'm' | 'l' | 'xl';
	maxWidth?: number | string;
	minWidth?: number | string;
	padding?: number | string;
	iconSize?: number;
	onChange?: (files: FileItem[]) => void;
	backgroundColor?: string;
	bgColor?: string;
	canRemove?: boolean;
	onToolTip?: (tip: ToolTip | null) => void;
};

export type FileListProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof FileListBaseProps> & FileListBaseProps;
