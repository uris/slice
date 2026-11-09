import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Package } from '@/src/consts/consts';
import type { ComponentType } from 'react';

/** Each document owns its content and optional table of contents. */
export interface DocumentModule {
	default: ComponentType;
	trackedItems?: TrackedItem[];
}

export type DocumentLoader = () => Promise<DocumentModule>;

// Use explicit imports so Next can split documents into chunks and unknown slugs cannot resolve arbitrary files.
const documents: Record<Package, ReadonlyMap<string, DocumentLoader>> = {
	[Package.React]: new Map<string, DocumentLoader>([
		['draggable-panel', () => import('@/documents/react/components/DraggablePanel/DraggablePanel')],
		['textfield', () => import('@/documents/react/components/TextField/TextField')],
		['text-area', () => import('@/documents/react/components/TextArea/TextArea')],
		['drop-down', () => import('@/documents/react/components/DropDown/DropDown')],
		['content-editable', () => import('@/documents/react/components/ContentEditable/ContentEditable')],
		['error-summary', () => import('@/documents/react/components/ErrorSummary/ErrorSummary')],

		['overlay', () => import('@/documents/react/components/Overlay/Overlay')],
		['dialog-box', () => import('@/documents/react/components/DialogBox/DialogBox')],
		['modal-controller', () => import('@/documents/react/components/ModalController/ModalController')],
		['tip', () => import('@/documents/react/components/Tip/Tip')],
		['toast', () => import('@/documents/react/components/Toast/Toast')],
		['progress-indicator', () => import('@/documents/react/components/ProgressIndicator/ProgressIndicator')],
		['attachment', () => import('@/documents/react/components/Attachment/Attachment')],
		['prompt-input', () => import('@/documents/react/components/PromptInput/PromptInput')],
		['upload-area', () => import('@/documents/react/components/UploadArea/UploadArea')],
		['file-list', () => import('@/documents/react/components/FileList/FileList')],
		['file-icon', () => import('@/documents/react/components/FileIcon/FileIcon')],

		['icon-button', () => import('@/documents/react/components/IconButton/IconButton')],
		['toggle-button', () => import('@/documents/react/components/ToggleButton/ToggleButton')],
		['radio-button', () => import('@/documents/react/components/RadioButton/RadioButton')],
		['radio-button-list', () => import('@/documents/react/components/RadioButtonList/RadioButtonList')],
		['tab', () => import('@/documents/react/components/Tab/Tab')],
		['tab-bar', () => import('@/documents/react/components/TabBar/TabBar')],
		['audio-bubble', () => import('@/documents/react/components/AudioBubble/AudioBubble')],
		['avatar', () => import('@/documents/react/components/Avatar/Avatar')],
		['avatar-group', () => import('@/documents/react/components/AvatarGroup/AvatarGroup')],
		['badge', () => import('@/documents/react/components/Badge/Badge')],
		['use-last-updated', () => import('@/documents/react/hooks/useLastUpdated/useLastUpdated')],
		['use-active-tab', () => import('@/documents/react/hooks/useActiveTab/useActiveTab')],
		['button-bar', () => import('@/documents/react/components/ButtonBar/ButtonBar')],
		['check-box', () => import('@/documents/react/components/CheckBox/CheckBox')],
		['chip', () => import('@/documents/react/components/Chip/Chip')],
		['dot', () => import('@/documents/react/components/Dot/Dot')],
		['slider', () => import('@/documents/react/components/Slider/Slider')],
		['pager', () => import('@/documents/react/components/Pager/Pager')],
		['pop-menu', () => import('@/documents/react/components/PopMenu/PopMenu')],
		['pop-menu-group', () => import('@/documents/react/components/PopMenuGroup/PopMenuGroup')],
		['pop-menu-item', () => import('@/documents/react/components/PopMenuItem/PopMenuItem')],
		['pop-menu-controller', () => import('@/documents/react/components/PopMenuController/PopMenuController')],
		['switch', () => import('@/documents/react/components/Switch/Switch')],
		['button', () => import('@/documents/react/components/Button/Button')],
	]),
	[Package.ReactNative]: new Map<string, DocumentLoader>(),
};

export function getDocumentLoader(packageType: Package | null, slug: string | null): DocumentLoader | undefined {
	if (!packageType || !slug) return undefined;
	return documents[packageType].get(slug);
}
