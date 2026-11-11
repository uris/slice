import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { FileItem } from '../FileList';
import type { TextAreaProps } from '../TextArea';
import type { UploadAreaProps, UploadFileRejection } from '../UploadArea';
import type { ToolTip } from '../sharedTypes';

/** Commands available to custom actions without reaching into the editor DOM. */
export type PromptActions = {
	value: string;
	attachments: FileItem[];
	canSubmit: boolean;
	canAttach: boolean;
	disabled: boolean;
	focus: () => void;
	submit: () => void;
	stop: () => void;
	openFilePicker: () => void;
	addFiles: (files: File[]) => boolean;
	pasteText: (text: string) => void;
};
export type PromptTextAreaProps = Omit<
	TextAreaProps,
	| 'value'
	| 'defaultValue'
	| 'inputRef'
	| 'onChange'
	| 'onSubmit'
	| 'onFocus'
	| 'onBlur'
	| 'onPaste'
	| 'onKeyDown'
	| 'showSendButton'
	| 'submitClears'
	| 'allowEmptySubmit'
	| 'returnSubmits'
	| 'disabled'
	| 'readOnly'
	| 'focused'
>;

type BasePromptProps = {
	attachments?: FileItem[];
	defaultAttachments?: FileItem[];
	children?: React.ReactNode | ((actions: PromptActions) => React.ReactNode);
	value?: string;
	defaultValue?: string;
	maxHeight?: string | number;
	working?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	width?: string | number;
	maxWidth?: string | number;
	minWidth?: string | number;
	borderStyle?: 'solid' | 'gradient' | 'none';
	borderWidth?: number;
	borderColor?: ColorValue;
	borderColorFocused?: ColorValue;
	borderAnimate?: boolean;
	borderRadius?: number | string;
	placeholder?: string;
	placeholderWorking?: string;
	focused?: boolean;
	inputName?: string;
	submitClears?: boolean;
	enterSubmits?: boolean;
	sendButton?: boolean;
	attachButton?: boolean;
	stopEnabled?: boolean;
	maxLength?: number;
	toolbarGap?: number;
	attachmentsDisabled?: boolean;
	submitWorking?: boolean;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	textAreaProps?: PromptTextAreaProps;
	fileListProps?: UploadAreaProps['fileListProps'];
	acceptedTypes?: string[];
	multiple?: boolean;
	/** Opt-in: plain-text paste longer than this limit becomes a .txt attachment. */
	pasteAttachmentThreshold?: number;
	attachActionName?: string;
	sendActionName?: string;
	stopActionName?: string;
	onChange?: (value: string, attachments: FileItem[]) => void;
	onSubmit?: (value: string, attachments: FileItem[]) => void;
	onBlur?: (value: string, attachments: FileItem[]) => void;
	onFocus?: (value: string, attachments: FileItem[]) => void;
	onStop?: () => void;
	onAttachmentsChange?: (attachments: FileItem[]) => void;
	onReject?: (files: UploadFileRejection[]) => void;
	onToolTip?: (tip: ToolTip | null) => void;
	onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
	onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
};
export type PromptProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof BasePromptProps | 'dangerouslySetInnerHTML'
> &
	BasePromptProps;
