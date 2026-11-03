import type { ListSection } from '@/components/SidebarDocList/SidebarDocList';
import { SidebarListItemType } from '@/components/SidebarListItem/SidebarListItem';
import { Package } from '@/src/consts/consts';

const designSystemSection: ListSection = [
	{ type: SidebarListItemType.SectionTitle, title: 'Design System' },
	{ title: 'Colors', slug: 'colors' },
	{ title: 'Spacing', slug: 'spacing' },
	{ title: 'Elevations', slug: 'elevations' },
	{ title: 'Corners', slug: 'corners' },
	{ title: 'Typography', slug: 'typography' },
	{ title: 'Motion', slug: 'motion' },
	{ title: 'Icons', slug: 'icons' },
];

const gettingStartedSection: ListSection = [
	{ type: SidebarListItemType.SectionTitle, title: 'Getting Started', display: false },
	{ title: 'Overview', slug: 'get-started' },
	{ title: 'Installation', slug: 'installation' },
	{ title: 'Resources', slug: 'resources' },
];

const reactComponentSection: ListSection = [
	{ type: SidebarListItemType.SectionTitle, title: 'Components' },
	{ title: 'AudioBubble', slug: 'audio-bubble', code: true },
	{ title: 'Avatar', slug: 'avatar', code: true },
	{ title: 'AvatarGroup', slug: 'avatar-group', code: true },
	{ title: 'Badge', slug: 'badge', code: true },
	{ title: 'Button', slug: 'button', code: true },
	{ title: 'ButtonBar', slug: 'button-bar', code: true },
	{ title: 'Camera', slug: 'camera', code: true },
	{ title: 'CheckBox', slug: 'check-box', code: true },
	{ title: 'Chip', slug: 'chip', code: true },
	{ title: 'DataTable', slug: 'data-table', code: true },
	{ title: 'DivInput', slug: 'div-input', code: true },
	{ title: 'DoneCheck', slug: 'done-check', code: true },
	{ title: 'Dot', slug: 'dot', code: true },
	{ title: 'DraggablePanel', slug: 'draggable-panel', code: true },
	{ title: 'DropDown', slug: 'drop-down', code: true },
	{ title: 'ErrorSummary', slug: 'error-summary', code: true },
	{ title: 'FileIcon', slug: 'file-icon', code: true },
	{ title: 'FileList', slug: 'file-list', code: true },
	{ title: 'FlexDiv', slug: 'flex-div', code: true },
	{ title: 'Grouper', slug: 'grouper', code: true },
	{ title: 'Icon', slug: 'icon', code: true },
	{ title: 'IconButton', slug: 'icon-button', code: true },
	{ title: 'Label', slug: 'label', code: true },
	{ title: 'Level', slug: 'level', code: true },
	{ title: 'Modal', slug: 'modal', code: true },
	{ title: 'ModalController', slug: 'modal-controller', code: true },
	{ title: 'Overlay', slug: 'overlay', code: true },
	{ title: 'Pager', slug: 'pager', code: true },
	{ title: 'ProgressIndicator', slug: 'progress-indicator', code: true },
	{ title: 'PromptInput', slug: 'prompt-input', code: true },
	{ title: 'RadioButton', slug: 'radio-button', code: true },
	{ title: 'RadioButtonList', slug: 'radio-button-list', code: true },
	{ title: 'Slider', slug: 'slider', code: true },
	{ title: 'Spacer', slug: 'spacer', code: true },
	{ title: 'Switch', slug: 'switch', code: true },
	{ title: 'Tab', slug: 'tab', code: true },
	{ title: 'TabBar', slug: 'tab-bar', code: true },
	{ title: 'TextArea', slug: 'text-area', code: true },
	{ title: 'TextField', slug: 'textfield', code: true },
	{ title: 'Tip', slug: 'tip', code: true },
	{ title: 'Toast', slug: 'toast', code: true },
	{ title: 'ToggleButton', slug: 'toggle-button', code: true },
	{ title: 'UploadArea', slug: 'upload-area', code: true },
	{ title: 'Video', slug: 'video', code: true },
	{ title: 'VideoController', slug: 'video-controller', code: true },
];

const reactHooksSection: ListSection = [
	{ type: SidebarListItemType.SectionTitle, title: 'Hooks' },
	{ title: 'useActiveTab', slug: 'use-active-tab' },
	{ title: 'useAudioRecorder', slug: 'use-audio-recorder' },
	{ title: 'useBindWebRTC', slug: 'use-bind-web-rtc' },
	{ title: 'useClipboard', slug: 'use-clipboard' },
	{ title: 'useDoubleClick', slug: 'use-double-click' },
	{ title: 'useInfiniteScroll', slug: 'use-infinite-scroll' },
	{ title: 'useIntersecting', slug: 'use-intersecting' },
	{ title: 'useKeyboardShortcuts', slug: 'use-keyboard-shortcuts' },
	{ title: 'useLastUpdated', slug: 'use-last-updated' },
	{ title: 'useLocalStore', slug: 'use-local-store' },
	{ title: 'useMdStreamBuffer', slug: 'use-md-stream-buffer' },
	{ title: 'useMicrophone', slug: 'use-microphone' },
	{ title: 'useObserveResize', slug: 'use-observe-resize' },
	{ title: 'useObserveTheme', slug: 'use-observe-theme' },
	{ title: 'useTheme', slug: 'use-theme' },
	{ title: 'useToolTip', slug: 'use-tool-tip' },
	{ title: 'useWindow', slug: 'use-window' },
];

const reactProvidersSection: ListSection = [
	{ type: SidebarListItemType.SectionTitle, title: 'Providers' },
	{ title: 'ThemeProvider', slug: 'theme-provider' },
	{ title: 'ThemeServer (SSR)', slug: 'theme-server' },
];

const reactStoresSection: ListSection = [
	{ type: SidebarListItemType.SectionTitle, title: 'Stores' },
	{ title: 'About Slice Stores', slug: 'about-slice-stores' },
	{ title: 'activeTab', slug: 'active-tab' },
	{ title: 'Browser Channel Store', slug: 'browser-channel-store' },
	{ title: 'Local DB Store', slug: 'local-db-store' },
	{ title: 'Microphone Store', slug: 'microphone-store' },
	{ title: 'Modal Store', slug: 'modal-store' },
	{ title: 'SSE Store', slug: 'sse-store' },
	{ title: 'Tip Store', slug: 'tip-store' },
	{ title: 'Toast Store', slug: 'toast-store' },
	{ title: 'Uploads Store', slug: 'uploads-store' },
	{ title: 'Video Store', slug: 'video-store' },
	{ title: 'Volume Store', slug: 'volume-store' },
	{ title: 'WebRTC Store', slug: 'web-rtc-store' },
	{ title: 'Window Store', slug: 'window-store' },
	{ title: 'WS Store', slug: 'ws-store' },
];

const reactUtilsSection: ListSection = [
	{ type: SidebarListItemType.SectionTitle, title: 'Utils' },
	{ title: 'AudioVisualizer', slug: 'audio-visualizer' },
	{ title: 'Browser Channel', slug: 'browser-channel' },
	{ title: 'IndexedDB', slug: 'indexed-db' },
	{ title: 'Markdown Buffer', slug: 'markdown-buffer' },
	{ title: 'SSE Connection', slug: 'sse-connection' },
	{ title: 'Uploads Worker', slug: 'uploads-worker' },
	{ title: 'Utility Functions', slug: 'utility-functions' },
	{ title: 'WebRTC Connection', slug: 'web-rtc-connection' },
	{ title: 'WS Connection', slug: 'ws-connection' },
];

/** Navigation stays available even when the requested document has not been written yet. */
export function getSidebarDocSections(packageType?: Package | null): ListSection[] {
	if (packageType === Package.React)
		return [
			gettingStartedSection,
			designSystemSection,
			reactComponentSection,
			reactProvidersSection,
			reactHooksSection,
			reactStoresSection,
			reactUtilsSection,
		];
	if (packageType === Package.ReactNative) return [gettingStartedSection, designSystemSection];
	return [];
}
