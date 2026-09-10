import type React from 'react';

type IconBaseProps = {
	name?: string;
	size?: number;
	stroke?: number;
	strokeColor?: string;
	fillColor?: number;
	coverUp?: string;
	toggle?: boolean;
	pointer?: boolean;
	disabled?: boolean;
	fill?: boolean;
	onClick?: (e: React.MouseEvent<SVGElement, MouseEvent>) => void;
};

export type IconProps = Omit<React.SVGAttributes<SVGSVGElement>, keyof IconBaseProps> & IconBaseProps;

export const SliceIcons = {
	arrows: {
		arrowLeft: 'arrow left',
		arrowRight: 'arrow right',
		arrowUp: 'arrow up',
		arrowDown: 'arrow down',
		chevronDown: 'chevron down',
		chevronUp: 'chevron up',
		navigateRight: 'navigate right',
		navigateLeft: 'navigate left',
		share: 'share',
	},
	selection: {
		check: 'check',
		checkCircle: 'check circle',
		checkbox: 'checkbox',
		checkboxChecked: 'checkbox checked',
		checkboxPartial: 'checkbox partial',
		circle: 'circle',
		circleFill: 'circle fill',
		plus: 'plus',
		plusCircle: 'plus circle',
	},
	Messaging: {
		chat: 'chat',
		mail: 'mail',
		notification: 'notification',
		inbox: 'inbox',
		like: 'like',
		unlike: 'unlike',
	},
	media: {
		camera: 'camera',
		focus: 'focus',
		mic: 'mic',
		micMuted: 'mic muted',
		video: 'video',
		videoOff: 'video off',
		download: 'download',
		upload: 'upload',
		speaker: 'speaker',
		speakerMuted: 'speaker muted',
		speakerHigh: 'speaker high',
		speakerLow: 'speaker low',
		play: 'play',
		playCircle: 'play circle',
		pause: 'pause',
		pauseCircle: 'pause circle',
	},
	files: {
		document: 'document',
		documentEditor: 'document editor',
		textDocument: 'text document',
	},
	people: {
		people: 'people',
		person: 'person',
		talk: 'talk',
	},
	business: {
		briefcase: 'briefcase',
		dollar: 'dollar',
		invoice: 'invoice',
		payment: 'payment',
		wallet: 'wallet',
		laptop: 'laptop',
	},
	charts: {
		barChart: 'bar chart',
		chart: 'chart',
		chartArrow: 'chart arrow',
	},
	status: {
		alert: 'alert',
		exclamation: 'exclamation',
		help: 'help',
		info: 'info',
		issue: 'issue',
		lightBulb: 'light bulb',
		target: 'target',
		openCircle: 'open circle',
	},
	brands: {
		apple: 'apple',
		google: 'google',
		googleMono: 'google mono',
		linkedin: 'linkedin',
		github: 'github',
		npm: 'npm',
		openAI: 'openAI',
	},
	edit: {
		edit: 'edit',
		trashBin: 'trash bin',
		copy: 'copy',
		filter: 'filter',
		highlight: 'highlight',
		undo: 'undo',
		concise: 'concise',
		expanded: 'expanded',
		moderate: 'moderate',
		recent: 'recent',
	},
	typography: {
		fontLarger: 'font larger',
		fontSmaller: 'font smaller',
		characterBeam: 'character beam',
	},
	weather: {
		sun: 'sun',
		moonFull: 'moon full',
	},
	ai: {
		sparkle: 'sparkle',
		wand: 'wand',
	},
	ui: {
		attach: 'attach',
		blank: 'blank',
		book: 'book',
		globeLocation: 'globe location',
		heart: 'heart',
		stop: 'stop',
		search: 'search',
		settings: 'settings',
		view: 'view',
		refresh: 'refresh',
		home: 'home',
		menu: 'menu',
		more: 'more',
		sidebar: 'sidebar',
		sidebarSplit: 'sidebar split',
		keyboard: 'keyboard',
		x: 'x',
		fullscreen: 'fullscreen',
	},
} as const;
