import type React from 'react';
import type { FileItem } from '../FileList';

export const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'heic', 'heif'];
export const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
export const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
export const audioTypes = ['mp3', 'wav', 'ogg', 'aac', 'flac'];
export const textTypes = ['txt', 'rtf', 'md', 'csv', 'json', 'xml'];
export const allTypes = [...imageTypes, ...videoTypes, ...documentTypes, ...audioTypes, ...textTypes];

export enum FileTypes {
	images = 'images',
	videos = 'videos',
	documents = 'documents',
	audio = 'audio',
	text = 'text',
	all = 'all',
	custom = 'custom',
}

type UploadAreaBaseProps = {
	icon?: string;
	iconSize?: number;
	iconColor?: string;
	iconColorHover?: string;
	width?: number | string;
	height?: number | string;
	title?: string;
	message?: string;
	busyMessage?: string;
	backgroundColor?: string;
	backgroundColorHover?: string;
	bgColor?: string;
	bgColorHover?: string;
	borderWidth?: number;
	border?: number;
	borderColor?: string | null;
	borderColorHover?: string | null;
	borderStyle?: string;
	textSize?: 'xs' | 's' | 'm' | 'l';
	padding?: number | string;
	borderRadius?: number | string;
	radius?: number | string;
	acceptedTypes?: string[];
	multiple?: boolean;
	busy?: boolean;
	showProgress?: boolean;
	files?: FileItem[];
	canRemove?: boolean;
	onUpload?: (files: File[]) => void;
};

export type UploadAreaProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof UploadAreaBaseProps> &
	UploadAreaBaseProps;
