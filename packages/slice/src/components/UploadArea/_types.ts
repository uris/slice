import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { FileItem, FileListProps } from '../FileList';
import type { SliceIcon } from '../Icon/_types';
import type { ToolTip } from '../sharedTypes';

export const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'heic', 'heif'];
export const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
export const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
export const audioTypes = ['mp3', 'wav', 'ogg', 'aac', 'flac'];
export const textTypes = ['txt', 'rtf', 'md', 'csv', 'json', 'xml'];
export const allTypes = [...imageTypes, ...videoTypes, ...documentTypes, ...audioTypes, ...textTypes];

export type UploadFileRejection = {
	file: File;
	reason: 'type' | 'multiple';
};

type UploadAreaBaseProps = {
	icon?: SliceIcon;
	iconSize?: number;
	iconColor?: ColorValue;
	iconColorHover?: ColorValue;
	width?: number | string;
	height?: number | string;
	actionName?: string;
	title?: string;
	message?: string;
	busyMessage?: string;
	backgroundColor?: ColorValue;
	backgroundColorHover?: ColorValue;
	borderWidth?: number;
	borderColor?: ColorValue | null;
	borderColorHover?: ColorValue | null;
	borderStyle?: string;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	padding?: number | string;
	borderRadius?: number | string;
	acceptedTypes?: string[];
	multiple?: boolean;
	disabled?: boolean;
	busy?: boolean;
	showProgress?: boolean;
	files?: FileItem[];
	/** Presentation options for the embedded list; UploadArea owns data and interaction callbacks. */
	fileListProps?: Omit<FileListProps, 'files' | 'onChange' | 'canRemove' | 'onToolTip'>;
	canRemove?: boolean;
	onReject?: (files: UploadFileRejection[]) => void;
	onToolTip?: (tip: ToolTip | null) => void;
	onFilesChange?: (files: FileItem[]) => void;
	onUpload?: (files: File[]) => void;
};

export type UploadAreaProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof UploadAreaBaseProps | 'children' | 'dangerouslySetInnerHTML' | 'role' | 'aria-disabled' | 'aria-busy'
> &
	UploadAreaBaseProps;
