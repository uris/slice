'use client';

import type React from 'react';
import { useId, useRef, useState } from 'react';
import type { FileItem } from '../FileList';
import type { UploadFileRejection } from './_types';
import { normalizeAcceptedTypes, selectUploadFiles } from './selection';

type Options = {
	files: FileItem[];
	acceptedTypes: string[];
	multiple: boolean;
	disabled: boolean;
	onFilesChange?: (files: FileItem[]) => void;
	onUpload?: (files: File[]) => void;
	onReject?: (files: UploadFileRejection[]) => void;
};

/** Shared nonvisual picker/validation contract for UploadArea and composed editors. */
export function useFileSelection({
	files,
	acceptedTypes,
	multiple,
	disabled,
	onFilesChange,
	onUpload,
	onReject,
}: Options) {
	const inputRef = useRef<HTMLInputElement>(null);
	const prefix = useId();
	const sequence = useRef(0);
	const [rejection, setRejection] = useState('');
	const selectFiles = (selected: File[]) => {
		if (disabled || !selected.length) return false;
		const { accepted, rejected } = selectUploadFiles(selected, acceptedTypes, multiple);
		setRejection(
			rejected
				.map(({ file, reason }) => {
					if (reason === 'multiple') return `${file.name}: only one file can be selected.`;
					return `${file.name}: file type is not accepted.`;
				})
				.join(' '),
		);
		if (accepted.length) {
			const additions = accepted.map((file) => ({ id: `${prefix}-${sequence.current++}`, file }));
			onFilesChange?.(multiple ? [...files, ...additions] : additions);
			onUpload?.(accepted);
		}
		if (rejected.length) onReject?.(rejected);
		return accepted.length > 0;
	};
	const openPicker = () => {
		if (disabled || !inputRef.current) return;
		inputRef.current.value = '';
		inputRef.current.click();
	};
	const inputProps = {
		ref: inputRef,
		type: 'file' as const,
		hidden: true,
		disabled,
		multiple,
		accept: normalizeAcceptedTypes(acceptedTypes).join(',') || undefined,
		onClick: (event: React.MouseEvent<HTMLInputElement>) => event.stopPropagation(),
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
			selectFiles(Array.from(event.currentTarget.files ?? []));
		},
	};
	return { inputRef, inputProps, openPicker, selectFiles, rejection };
}
