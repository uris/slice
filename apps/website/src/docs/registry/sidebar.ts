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

const reactGettingStartedSection: ListSection = [
	{ type: SidebarListItemType.SectionTitle, title: 'Getting Started', display: false },
	{ title: 'Overview', slug: 'get-started' },
	{ title: 'Installation', slug: 'installation' },
	{ title: 'Resources', slug: 'resources' },
];

const reactComponentSection: ListSection = [
	{ type: SidebarListItemType.SectionTitle, title: 'Components' },
	{ title: 'AudioBubble', slug: 'placeholder', code: true },
	{ title: 'Avatar', slug: 'placeholder', code: true },
	{ title: 'AvatarGroup', slug: 'placeholder', code: true },
	{ title: 'Badge', slug: 'placeholder', code: true },
	{ title: 'Button', slug: 'placeholder', code: true },
	{ title: 'ButtonBar', slug: 'placeholder', code: true },
	{ title: 'Camera', slug: 'placeholder', code: true },
	{ title: 'CheckBox', slug: 'placeholder', code: true },
	{ title: 'Chip', slug: 'placeholder', code: true },
	{ title: 'DataTable', slug: 'placeholder', code: true },
	{ title: 'DivInput', slug: 'placeholder', code: true },
	{ title: 'DoneCheck', slug: 'placeholder', code: true },
	{ title: 'Dot', slug: 'placeholder', code: true },
	{ title: 'DraggablePanel', slug: 'placeholder', code: true },
	{ title: 'DropDown', slug: 'placeholder', code: true },
	{ title: 'ErrorSummary', slug: 'placeholder', code: true },
	{ title: 'FileIcon', slug: 'placeholder', code: true },
	{ title: 'FileList', slug: 'placeholder', code: true },
	{ title: 'FlexDiv', slug: 'placeholder', code: true },
	{ title: 'Grouper', slug: 'placeholder', code: true },
	{ title: 'Icon', slug: 'placeholder', code: true },
	{ title: 'IconButton', slug: 'placeholder', code: true },
	{ title: 'Label', slug: 'placeholder', code: true },
	{ title: 'Level', slug: 'placeholder', code: true },
	{ title: 'Modal', slug: 'placeholder', code: true },
	{ title: 'ModalController', slug: 'placeholder', code: true },
	{ title: 'Overlay', slug: 'placeholder', code: true },
	{ title: 'Pager', slug: 'placeholder', code: true },
	{ title: 'ProgressIndicator', slug: 'placeholder', code: true },
	{ title: 'PromptInput', slug: 'placeholder', code: true },
	{ title: 'RadioButton', slug: 'placeholder', code: true },
	{ title: 'RadioButtonList', slug: 'placeholder', code: true },
	{ title: 'Slider', slug: 'placeholder', code: true },
	{ title: 'Spacer', slug: 'placeholder', code: true },
	{ title: 'Switch', slug: 'placeholder', code: true },
	{ title: 'TabBar', slug: 'placeholder', code: true },
	{ title: 'TextArea', slug: 'placeholder', code: true },
	{ title: 'Textfield', slug: 'placeholder', code: true },
	{ title: 'Tip', slug: 'placeholder', code: true },
	{ title: 'Toast', slug: 'placeholder', code: true },
	{ title: 'ToggleButton', slug: 'placeholder', code: true },
	{ title: 'UploadArea', slug: 'placeholder', code: true },
	{ title: 'Video', slug: 'placeholder', code: true },
	{ title: 'VideoController', slug: 'placeholder', code: true },
];

const reactHooksSection: ListSection = [
	{ type: SidebarListItemType.SectionTitle, title: 'Hooks' },
	{ title: 'useActiveTab', slug: 'placeholder' },
	{ title: 'useAudioRecorder', slug: 'placeholder' },
	{ title: 'useBindWebRTC', slug: 'placeholder' },
	{ title: 'useClipboard', slug: 'placeholder' },
	{ title: 'useDoubleClick', slug: 'placeholder' },
	{ title: 'useInfiniteScroll', slug: 'placeholder' },
	{ title: 'useIntersecting', slug: 'placeholder' },
	{ title: 'useKeyboardShortcuts', slug: 'placeholder' },
	{ title: 'useLastUpdated', slug: 'placeholder' },
	{ title: 'useLocalStore', slug: 'placeholder' },
	{ title: 'useMdStreamBuffer', slug: 'placeholder' },
	{ title: 'useMicrophone', slug: 'placeholder' },
	{ title: 'useObserveResize', slug: 'placeholder' },
	{ title: 'useObserveTheme', slug: 'placeholder' },
	{ title: 'useTheme', slug: 'placeholder' },
	{ title: 'useToolTip', slug: 'placeholder' },
	{ title: 'useWindow', slug: 'placeholder' },
];

const reactProvidersSection: ListSection = [
	{ type: SidebarListItemType.SectionTitle, title: 'Providers' },
	{ title: 'ThemeProvider', slug: 'placeholder' },
	{ title: 'ThemeServer (SSR)', slug: 'placeholder' },
];

const reactStoresSection: ListSection = [
	{ type: SidebarListItemType.SectionTitle, title: 'Stores' },
	{ title: 'About Slice Stores', slug: 'placeholder' },
	{ title: 'activeTab', slug: 'placeholder' },
	{ title: 'Browser Channel Store', slug: 'placeholder' },
	{ title: 'Local DB Store', slug: 'placeholder' },
	{ title: 'Microphone Store', slug: 'placeholder' },
	{ title: 'Modal Store', slug: 'placeholder' },
	{ title: 'SSE Store', slug: 'placeholder' },
	{ title: 'Tip Store', slug: 'placeholder' },
	{ title: 'Toast Store', slug: 'placeholder' },
	{ title: 'Uploads Store', slug: 'placeholder' },
	{ title: 'Video Store', slug: 'placeholder' },
	{ title: 'Volume Store', slug: 'placeholder' },
	{ title: 'WebRTC Store', slug: 'placeholder' },
	{ title: 'Window Store', slug: 'placeholder' },
	{ title: 'WS Store', slug: 'placeholder' },
];

const reactUtilsSection: ListSection = [
	{ type: SidebarListItemType.SectionTitle, title: 'Utils' },
	{ title: 'AudioVisualizer', slug: 'placeholder' },
	{ title: 'Browser Channel', slug: 'placeholder' },
	{ title: 'IndexedDB', slug: 'placeholder' },
	{ title: 'Markdown Buffer', slug: 'placeholder' },
	{ title: 'SSE Connection', slug: 'placeholder' },
	{ title: 'Uploads Worker', slug: 'placeholder' },
	{ title: 'Utility Functions', slug: 'placeholder' },
	{ title: 'WebRTC Connection', slug: 'placeholder' },
	{ title: 'WS Connection', slug: 'placeholder' },
];

/** React docs navigation; unfinished docs use the existing placeholder route. */
export function getSidebarDocSections(packageType?: Package | null): ListSection[] {
	if (packageType === Package.React)
		return [
			reactGettingStartedSection,
			designSystemSection,
			reactComponentSection,
			reactProvidersSection,
			reactHooksSection,
			reactStoresSection,
			reactUtilsSection,
		];
	return [];
}
