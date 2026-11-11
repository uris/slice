import { sharedDocSlugs, sharedDocsMetadata } from '@/docs/registry/shared';
import type { Metadata } from 'next';

// all doc slugs (pages)
export const reactDocSlugs = [
	'data-table',
	'camera',
	'video-controller',
	'video',
	'spacer',
	'done-check',
	'draggable-panel',
	'textfield',
	'text-area',
	'drop-down',
	'content-editable',
	'error-summary',
	'overlay',
	'dialog-box',
	'modal-controller',
	'tip',
	'toast',
	'progress-indicator',
	'file-icon',
	'attachment',
	'file-list',
	'upload-area',
	'prompt-input',
	'icon-button',
	'toggle-button',
	'radio-button',
	'radio-button-list',
	'tab',
	'tab-bar',
	'icon',
	'flex-box',
	'flex-div',
	'audio-level',
	'audio-bubble',
	'avatar',
	'avatar-group',
	'badge',
	'button',
	'button-bar',
	'check-box',
	'chip',
	'dot',
	'pager',
	'pop-menu',
	'pop-menu-group',
	'pop-menu-item',
	'pop-menu-controller',
	'slider',
	'switch',
	'use-active-tab',
	'use-last-updated',
	'placeholder',
	'get-started',
	'installation',
	'resources',
	...sharedDocSlugs,
] as const;

// doc slug type including shared
export type ReactDocSlug = (typeof reactDocSlugs)[number];

// meta for all slugs including shared
export const reactDocsMetadata: Record<ReactDocSlug, Metadata> = {
	'data-table': {
		title: 'DataTable | Slice UIKit',
		description: 'Build sortable tables with custom cells, row actions, and automatic virtualization.',
	},
	camera: {
		title: 'Camera | Slice UIKit',
		description: 'Preview camera video, control microphone capture, and take still snapshots with Camera for React.',
	},
	icon: {
		title: 'Icon | Slice UIKit',
		description: 'Render theme-aware SVG icons with optional direct keyboard and pointer interaction.',
	},
	'flex-box': {
		title: 'FlexBox | Slice UIKit',
		description: 'Build flex layouts with spacing, scrolling, presets, and Motion support.',
	},
	'flex-div': {
		title: 'FlexDiv (deprecated) | Slice UIKit',
		description: 'Deprecated alias of FlexBox. Existing props, defaults, and forwarded refs remain supported.',
	},
	'audio-level': {
		title: 'AudioLevel | Slice UIKit',
		description: 'Display live microphone and audio stream volume with a configurable bar meter for React.',
	},
	'video-controller': {
		title: 'VideoController | Slice UIKit',
		description: 'Open a movable modal video player from application actions with VideoController for React.',
	},
	video: {
		title: 'Video | Slice UIKit',
		description:
			'Play video with Slice controls, native browser controls, captions, and a typed playback ref in React.',
	},
	spacer: {
		title: 'Spacer | Slice UIKit',
		description: 'Reserve a fixed square of empty space using the theme spacing grid.',
	},
	'done-check': {
		title: 'DoneCheck | Slice UIKit',
		description: 'Show a completion checkmark with an optional scale animation.',
	},

	'draggable-panel': {
		title: 'DraggablePanel | Slice UIKit',
		description: 'Build accessible split workspaces with resizable sidebars using DraggablePanel for React.',
	},
	attachment: {
		title: 'Attachment | Slice UIKit',
		description:
			'Preview images, clipboard text, files, and upload progress with the Slice Attachment component for React.',
	},
	'prompt-input': {
		title: 'PromptInput | Slice UIKit',
		description:
			'Build AI messaging experiences with PromptInput for React: prompts, attachments, model selection, and send/stop controls.',
	},
	'upload-area': {
		title: 'UploadArea | Slice UIKit',
		description: 'Choose files, receive drops, and display upload feedback with UploadArea for React.',
	},
	'file-list': {
		title: 'FileList | Slice UIKit',
		description: 'Display compact file rows or attachment cards with upload feedback and controlled removal in React.',
	},
	'file-icon': {
		title: 'FileIcon | Slice UIKit',
		description: 'Display themed document and media artwork with the Slice FileIcon component for React.',
	},
	'progress-indicator': {
		title: 'ProgressIndicator | Slice UIKit',
		description: 'Show indeterminate loading feedback with the Slice ProgressIndicator component for React.',
	},
	overlay: {
		title: 'Overlay | Slice UIKit',
		description: 'Dim the background for focused tasks with the Slice Overlay component for React.',
	},
	'dialog-box': {
		title: 'DialogBox | Slice UIKit',
		description: 'Present dialog content and typed actions with the Slice DialogBox component for React.',
	},
	'modal-controller': {
		title: 'ModalController | Slice UIKit',
		description: 'Present store-driven dialogs and collect responses with the Slice ModalController for React.',
	},
	tip: {
		title: 'Tip | Slice UIKit',
		description: 'Position short contextual hints with the Slice Tip component for React.',
	},
	toast: {
		title: 'Toast | Slice UIKit',
		description: 'Show timed and persistent notifications with the Slice Toast component for React.',
	},
	textfield: {
		title: 'TextField | Slice UIKit',
		description:
			'Capture a short answer, search query, or password with a field that keeps useful actions close to the text.',
	},
	'text-area': {
		title: 'TextArea | Slice UIKit',
		description: 'Make room for notes, comments, and longer messages with multiline editing and optional submission.',
	},
	'drop-down': {
		title: 'DropDown | Slice UIKit',
		description: 'Offer a focused set of choices with native selection, optional labels, and typed option data.',
	},
	'content-editable': {
		title: 'ContentEditable | Slice UIKit',
		description:
			'Edit a short title or label in place, with an editable text surface that can blend into surrounding content.',
	},
	'error-summary': {
		title: 'ErrorSummary | Slice UIKit',
		description: 'Bring validation messages together so people can see what needs attention before they continue.',
	},

	'icon-button': {
		title: 'IconButton | Slice UIKit',
		description:
			'Keep frequent actions within easy reach. IconButton combines an icon with optional activity dots and counts.',
	},
	'toggle-button': {
		title: 'ToggleButton | Slice UIKit',
		description: 'Pair an icon with a label for a compact on/off action.',
	},
	'radio-button': {
		title: 'RadioButton | Slice UIKit',
		description: 'Present a clear choice with a label, an optional frame, and a selection icon.',
	},
	'radio-button-list': {
		title: 'RadioButtonList | Slice UIKit',
		description: 'Group related choices with single or multiple selection and typed values.',
	},
	tab: {
		title: 'Tab | Slice UIKit',
		description: 'Compose individual choices inside TabBar with labels, icons, counts, and connected panels.',
	},
	'tab-bar': {
		title: 'TabBar | Slice UIKit',
		description: 'Organize related views into a compact row of tabs, with optional icons and counts.',
	},
	'audio-bubble': {
		title: 'AudioBubble | Slice UIKit',
		description:
			'Bring live audio to life with the Slice AudioBubble component for React. Explore usage, behavior, accessibility, props, and events.',
	},
	avatar: {
		title: 'Avatar | Slice UIKit',
		description: 'Display profile photos and initials with the Slice Avatar component for React.',
	},
	'avatar-group': {
		title: 'AvatarGroup | Slice UIKit',
		description: 'Show collaborators, assignees, and participants with the Slice AvatarGroup component for React.',
	},
	badge: {
		title: 'Badge | Slice UIKit',
		description:
			'Add compact counts and labels with the Slice Badge component for React. Explore usage, accessibility, props, and events.',
	},
	'button-bar': {
		title: 'ButtonBar | Slice UIKit',
		description: 'Group related icon actions with the Slice ButtonBar component for React.',
	},
	'check-box': {
		title: 'CheckBox | Slice UIKit',
		description: 'Select options and show mixed selection with the Slice CheckBox component for React.',
	},
	chip: {
		title: 'Chip | Slice UIKit',
		description: 'Display compact tags and actions with the Slice Chip component for React.',
	},
	dot: {
		title: 'Dot | Slice UIKit',
		description: 'Show compact activity and status signals with the Slice Dot component for React.',
	},
	slider: {
		title: 'Slider | Slice UIKit',
		description:
			'Choose numeric values with continuous dragging and keyboard increments using the Slice Slider component for React.',
	},
	'pop-menu': {
		title: 'PopMenu | Slice UIKit',
		description:
			'Build contextual actions with grouped items, toggles, and nested menus using Slice PopMenu for React.',
	},
	'pop-menu-group': {
		title: 'PopMenuGroup | Slice UIKit',
		description: 'Organize menu actions into titled and untitled groups with Slice PopMenuGroup for React.',
	},
	'pop-menu-item': {
		title: 'PopMenuItem | Slice UIKit',
		description:
			'Compose actions, controlled toggles, custom rows, and submenu openers with Slice PopMenuItem for React.',
	},
	'pop-menu-controller': {
		title: 'PopMenuController | Slice UIKit',
		description:
			'Open a single store-driven contextual menu from props or composed controls with Slice PopMenuController for React.',
	},
	pager: {
		title: 'Pager | Slice UIKit',
		description: 'Navigate pages with scalable dots and a sliding window using the Slice Pager component for React.',
	},
	switch: {
		title: 'Switch | Slice UIKit',
		description: 'Toggle settings with typed change callbacks using the Slice Switch component for React.',
	},
	button: {
		title: 'Button | Slice UIKit',
		description:
			'Build clear actions with the Slice Button component for React. Explore variants, icons, loading states, accessibility, props, and refs.',
	},
	'use-last-updated': {
		title: 'useLastUpdated | Slice UIKit',
		description:
			'Format timestamps as readable update labels with the Slice useLastUpdated hook. Explore parameters, refresh timing, lifecycle, and return values.',
	},
	'use-active-tab': {
		title: 'useActiveTab | Slice UIKit',
		description:
			'Track document visibility and focus with the Slice useActiveTab hook for React. Explore usage, lifecycle, parameters, and return values.',
	},
	placeholder: {
		title: 'Placeholder | Slice UIKit',
		description: 'Placeholder description.',
	},
	'get-started': {
		title: 'Get Started | Slice UIKit',
		description: 'Get started with Slice UIKit.',
	},
	installation: {
		title: 'Installation | Slice UIKit',
		description: 'Install Slice UIKit in your project.',
	},
	resources: {
		title: 'Resources | Slice UIKit',
		description: 'Explore Slice UIKit resources.',
	},
	...sharedDocsMetadata,
};

// utility to check if string is a valid slug
export function isReactDocSlug(slug: string): slug is ReactDocSlug {
	return reactDocSlugs.includes(slug as ReactDocSlug);
}

// get all react doc slugs
export function getReactDocSlugs(): ReactDocSlug[] {
	return [...reactDocSlugs];
}
