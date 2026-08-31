import type React from 'react';
import type { JSX } from 'react';

export interface IconRenderProps {
	stroke: number;
	strokeColor: string;
	fillColor: number;
	coverUp: string;
}

export type IconLineRenderer = (props: IconRenderProps) => JSX.Element;

export interface IconDefinition {
	line: IconLineRenderer;
	lineOn?: IconLineRenderer;
}

/**
 * Static icon registry created once at module load.
 * Each entry stores only icon line content renderers.
 */
export const STATIC_ICON_REGISTRY = new Map<string, IconDefinition>([
	[
		'fullscreen',
		{
			line: ({ strokeColor }) => (
				<>
					<polygon
						points="9.53 8.47 5.31 4.25 8.5 4.25 8.5 2.75 2.75 2.75 2.75 8.5 4.25 8.5 4.25 5.31 8.47 9.53 9.53 8.47"
						fill={strokeColor}
					/>
					<polygon
						points="15.75 11.5 15.75 14.69 11.47 10.41 10.41 11.47 14.69 15.75 11.5 15.75 11.5 17.25 17.25 17.25 17.25 11.5 15.75 11.5"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'pause',
		{
			line: ({ strokeColor }) => (
				<>
					<rect x="6.62" y="6.25" width="2" height="7.5" fill={strokeColor} />
					<rect x="11.38" y="6.25" width="2" height="7.5" fill={strokeColor} />
				</>
			),
		},
	],
	[
		'pause circle',
		{
			line: ({ strokeColor, fillColor }) => (
				<>
					<path
						d="M10,2.5c4.14,0,7.5,3.36,7.5,7.5s-3.36,7.5-7.5,7.5-7.5-3.36-7.5-7.5,3.36-7.5,7.5-7.5"
						fill={strokeColor}
						fillOpacity={fillColor}
					/>
					<path
						d="M10,2.5c4.14,0,7.5,3.36,7.5,7.5s-3.36,7.5-7.5,7.5-7.5-3.36-7.5-7.5,3.36-7.5,7.5-7.5M10,1C5.03,1,1,5.03,1,10s4.03,9,9,9,9-4.03,9-9S14.97,1,10,1h0Z"
						fill={strokeColor}
					/>
					<rect x="6.62" y="6.25" width="2" height="7.5" fill={strokeColor} />
					<rect x="11.38" y="6.25" width="2" height="7.5" fill={strokeColor} />
				</>
			),
		},
	],
	[
		'play',
		{
			line: ({ strokeColor }) => (
				<polygon
					points="15.4 10 7.3 5.62 7.3 14.38 15.4 10"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'play circle',
		{
			line: ({ strokeColor, fillColor }) => (
				<>
					<path
						d="M10,2.5c4.14,0,7.5,3.36,7.5,7.5s-3.36,7.5-7.5,7.5-7.5-3.36-7.5-7.5,3.36-7.5,7.5-7.5"
						fill={strokeColor}
						fillOpacity={fillColor}
					/>
					<path
						d="M10,2.5c4.14,0,7.5,3.36,7.5,7.5s-3.36,7.5-7.5,7.5-7.5-3.36-7.5-7.5,3.36-7.5,7.5-7.5M10,1C5.03,1,1,5.03,1,10s4.03,9,9,9,9-4.03,9-9S14.97,1,10,1h0Z"
						fill={strokeColor}
					/>
					<polygon
						points="15.4 10 7.3 5.62 7.3 14.38 15.4 10"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'npm',
		{
			line: ({ strokeColor }) => (
				<path
					d="M7.415 7.656l17.291 0.024-0.011 17.29h-4.329l0.012-12.974h-4.319l-0.010 12.964h-8.656zM3.207 1.004c-0.002 0-0.003 0-0.005 0-1.214 0-2.198 0.984-2.198 2.198 0 0.002 0 0.004 0 0.006v-0 25.585c0 0.002 0 0.003 0 0.005 0 1.214 0.984 2.198 2.198 2.198 0.002 0 0.004 0 0.006 0h25.585c0.002 0 0.003 0 0.005 0 1.214 0 2.198-0.984 2.198-2.198 0-0.002 0-0.004 0-0.006v0-25.585c0-0.002 0-0.003 0-0.005 0-1.214-0.984-2.198-2.198-2.198-0.002 0-0.004 0-0.006 0h0z"
					transform="scale(0.625)"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'github',
		{
			line: ({ strokeColor }) => (
				<path
					d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
					transform="translate(0 0) scale(1.25)"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'openAI',
		{
			line: ({ strokeColor }) => (
				<path
					d="M7.9,7.57v-1.69c0-.14.05-.25.18-.32l3.41-1.96c.46-.27,1.02-.39,1.59-.39,2.14,0,3.5,1.66,3.5,3.43,0,.12,0,.27-.02.41l-3.53-2.07c-.21-.12-.43-.12-.64,0l-4.48,2.6ZM15.86,14.17v-4.05c0-.25-.11-.43-.32-.55l-4.48-2.6,1.46-.84c.12-.07.23-.07.36,0l3.41,1.96c.98.57,1.64,1.78,1.64,2.96,0,1.36-.8,2.6-2.07,3.12h0ZM6.85,10.61l-1.46-.86c-.12-.07-.18-.18-.18-.32v-3.92c0-1.91,1.46-3.35,3.44-3.35.75,0,1.44.25,2.03.7l-3.51,2.03c-.21.12-.32.3-.32.55v5.17h0ZM10,12.43l-2.1-1.18v-2.5l2.1-1.18,2.1,1.18v2.5l-2.1,1.18ZM11.35,17.85c-.75,0-1.44-.25-2.03-.7l3.51-2.03c.21-.12.32-.3.32-.55v-5.17l1.48.86c.12.07.18.18.18.32v3.92c0,1.91-1.48,3.35-3.46,3.35h0ZM7.12,13.87l-3.41-1.96c-.98-.57-1.64-1.78-1.64-2.96,0-1.37.82-2.6,2.09-3.12v4.07c0,.25.11.43.32.55l4.46,2.59-1.46.84c-.12.07-.23.07-.36,0ZM6.92,16.8c-2.02,0-3.5-1.52-3.5-3.39,0-.14.02-.29.04-.43l3.51,2.03c.21.12.43.12.64,0l4.48-2.59v1.69c0,.14-.05.25-.18.32l-3.41,1.96c-.46.27-1.02.39-1.59.39h0ZM11.35,18.92c2.16,0,3.96-1.53,4.37-3.57,2-.52,3.28-2.39,3.28-4.3,0-1.25-.54-2.46-1.5-3.34.09-.37.14-.75.14-1.12,0-2.55-2.07-4.46-4.46-4.46-.48,0-.95.07-1.41.23-.8-.78-1.91-1.28-3.12-1.28-2.16,0-3.96,1.53-4.37,3.57-2,.52-3.28,2.39-3.28,4.3,0,1.25.54,2.46,1.5,3.34-.09.37-.14.75-.14,1.12,0,2.55,2.07,4.46,4.46,4.46.48,0,.95-.07,1.41-.23.8.78,1.91,1.28,3.12,1.28Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'talk',
		{
			line: ({ strokeColor, fillColor }) => (
				<>
					<path
						d="M10,2.5c4.14,0,7.5,3.36,7.5,7.5s-3.36,7.5-7.5,7.5-7.5-3.36-7.5-7.5,3.36-7.5,7.5-7.5M10,1C5.03,1,1,5.03,1,10s4.03,9,9,9,9-4.03,9-9S14.97,1,10,1h0Z"
						fill={strokeColor}
					/>
					<path
						d="M1,10c0,3,1.47,5.65,3.73,7.28l1.7.24c.43.06.86.03,1.28-.02.96-.12,1.81-.82,1.92-1.81.11-1.06-.59-2.18-.06-2.67.22-.21.47-.37.64-.62.17-.27.1-.73-.15-.93-.44-.36-1.41-.24-1.83-.66-.16-.16-.24-.41-.21-.62.13-.8,2.13-1,2.72-1.61.29-.3.25-.79.09-1.15-.34-.78-.72-1.73.15-2.09l.66-.27c.39-.16.73-.46.86-.87.25-.82-.71-1.56-1.39-2.21-.31-.3-.58-.63-.84-.97-.09,0-.18-.01-.26-.01C5.03,1,1,5.03,1,10Z"
						fill={strokeColor}
						fillOpacity={fillColor}
					/>
					<path
						d="M9.54,2.51c.17.2.34.39.52.55.09.09.18.17.28.26.13.13.32.3.47.46l-.41.17c-.78.32-1.13.86-1.29,1.27-.36.89-.08,1.79.19,2.45-.11.04-.23.09-.33.12-.94.35-2.22.82-2.44,2.15-.11.7.13,1.44.64,1.94.29.28.63.45.95.56-.42.77-.23,1.65-.11,2.22.07.32.14.64.11.85-.03.27-.34.45-.61.48-.17.02-.4.05-.61.05-.1,0-.19,0-.28-.02l-1.31-.18c-1.77-1.42-2.82-3.58-2.82-5.85,0-3.98,3.12-7.25,7.04-7.49M10,1C5.03,1,1,5.03,1,10c0,3,1.47,5.65,3.73,7.28l1.7.24c.16.02.32.03.49.03.27,0,.53-.02.79-.06.96-.12,1.81-.82,1.92-1.81.11-1.06-.59-2.18-.06-2.67.22-.21.47-.37.64-.62.17-.27.1-.73-.15-.93-.44-.36-1.41-.24-1.83-.66-.16-.16-.24-.41-.21-.62.13-.8,2.13-1,2.72-1.61.29-.3.25-.79.09-1.15-.34-.78-.72-1.73.15-2.09l.66-.27c.39-.16.73-.46.86-.87.25-.82-.71-1.56-1.39-2.21-.31-.3-.58-.63-.84-.97-.09,0-.18-.01-.26-.01h0Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'speaker',
		{
			line: ({ fillColor, strokeColor }) => (
				<path
					d="M4.71,7.95v4.13c0,.37.3.66.66.66h3.31c.08,0,.17.03.23.09l4.81,4.21c.22.19.56.04.56-.25V3.15c0-.25-.3-.37-.47-.2l-4.21,4.21c-.06.06-.15.1-.24.1h-3.97c-.37,0-.68.3-.68.68Z"
					fill={strokeColor}
					fillOpacity={fillColor}
					stroke={strokeColor}
					strokeWidth={1.5}
				/>
			),
		},
	],
	[
		'speaker muted',
		{
			line: ({ stroke, strokeColor, fillColor }) => (
				<>
					<polygon
						points="4.82 8.35 9.61 12.51 4.82 12.51 4.82 8.35"
						fill={strokeColor}
						fillOpacity={fillColor}
					/>
					<polygon
						points="8.51 7.58 14.51 12.78 14.5 3 14 2.5 8.51 7.58"
						fill={strokeColor}
						fillOpacity={fillColor}
					/>
					<path
						d="M9.02,8.02h.34c.29,0,.57-.11.77-.32l3.41-3.41v7.65l1.5,1.3V3.15c0-.42-.25-.79-.64-.95-.39-.16-.83-.07-1.12.22l-4.09,4.09h-1.9l1.73,1.5Z"
						fill={strokeColor}
					/>
					<path
						d="M9.16,12.11c-.15-.07-.3-.12-.47-.12h-3.22v-3.09l-1.46-1.27c-.02.1-.04.2-.04.31v4.13c0,.78.63,1.41,1.41,1.41h3.16l4.7,4.11c.2.18.46.27.72.27.15,0,.31-.03.45-.1.27-.12.47-.35.57-.62l-5.81-5.04Z"
						fill={strokeColor}
					/>
					<line
						x1="3.25"
						y1="5"
						x2="16.5"
						y2="16.5"
						strokeLinecap={'round'}
						strokeLinejoin={'round'}
						stroke={strokeColor}
						strokeWidth={stroke}
						fill={'none'}
					/>
				</>
			),
		},
	],
	[
		'speaker high',
		{
			line: ({ strokeColor, fillColor }) => (
				<>
					<path
						d="M11.24,17.87c-.26,0-.51-.09-.72-.27l-4.7-4.11h-3.16c-.78,0-1.41-.63-1.41-1.41v-4.13c0-.79.64-1.43,1.43-1.43h3.8l4.09-4.09c.29-.29.73-.38,1.12-.22.39.16.64.53.64.95v13.63c0,.43-.25.81-.64.99-.14.06-.3.1-.45.1Z"
						fill={strokeColor}
						fillOpacity={fillColor}
					/>
					<path
						d="M11.24,17.87c-.26,0-.51-.09-.72-.27l-4.7-4.11h-3.16c-.78,0-1.41-.63-1.41-1.41v-4.13c0-.79.64-1.43,1.43-1.43h3.8l4.09-4.09c.29-.29.73-.38,1.12-.22.39.16.64.53.64.95v13.63c0,.43-.25.81-.64.99-.14.06-.3.1-.45.1ZM2.75,11.99h3.22c.27,0,.52.1.72.27l4.13,3.61V4.29l-3.41,3.41c-.21.21-.48.32-.77.32h-3.89v3.97Z"
						fill={strokeColor}
					/>
					<rect x="14.04" y="8" width="1.5" height="4" fill={strokeColor} />
					<rect x="16.75" y="6" width="1.5" height="8" fill={strokeColor} />
				</>
			),
		},
	],
	[
		'speaker low',
		{
			line: ({ strokeColor, fillColor }) => (
				<>
					<path
						d="M12.85,17.87c-.26,0-.51-.09-.72-.27l-4.7-4.11h-3.16c-.78,0-1.41-.63-1.41-1.41v-4.13c0-.79.64-1.43,1.43-1.43h3.8l4.09-4.09c.3-.3.74-.38,1.12-.22.38.16.63.53.63.95v13.63c0,.43-.25.81-.64.99-.14.06-.3.1-.45.1Z"
						fill={strokeColor}
						fillOpacity={fillColor}
					/>
					<path
						d="M12.85,17.87c-.26,0-.51-.09-.72-.27l-4.7-4.11h-3.16c-.78,0-1.41-.63-1.41-1.41v-4.13c0-.79.64-1.43,1.43-1.43h3.8l4.09-4.09c.3-.3.74-.38,1.12-.22.38.16.63.53.63.95v13.63c0,.43-.25.81-.64.99-.14.06-.3.1-.45.1ZM4.36,11.99h3.22c.27,0,.52.1.72.27l4.13,3.61V4.29l-3.41,3.41c-.2.2-.49.32-.77.32h-3.9v3.97Z"
						fill={strokeColor}
					/>
					<rect x="15.64" y="8" width="1.5" height="4" fill={strokeColor} />
				</>
			),
		},
	],
	[
		'laptop',
		{
			line: ({ fillColor, strokeColor }) => (
				<>
					<rect
						x="4"
						y="5"
						width="12"
						height="9"
						rx="1"
						ry="1"
						fill={strokeColor}
						opacity={fillColor}
					/>
					<path
						d="M18,13.25h-1.25v-7.25c0-.96-.79-1.75-1.75-1.75H5c-.96,0-1.75.79-1.75,1.75v7.25h-1.25c-.41,0-.75.34-.75.75s.34.75.75.75h16c.41,0,.75-.34.75-.75s-.34-.75-.75-.75ZM4.75,6c0-.14.11-.25.25-.25h10c.14,0,.25.11.25.25v7.25H4.75v-7.25Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'moon full',
		{
			line: ({ strokeColor, fillColor }: IconRenderProps) => (
				<>
					<circle
						cx="10"
						cy="10"
						r="6.5"
						fill={'none'}
						stroke={strokeColor}
						strokeWidth={1.5}
					/>
					<circle
						cx="10"
						cy="10"
						r="6.5"
						fill={strokeColor}
						fillOpacity={fillColor}
					/>
				</>
			),
		},
	],
	[
		'sun',
		{
			line: ({ strokeColor, fillColor }) => (
				<>
					<path
						d="M10,13.25c-1.79,0-3.25-1.46-3.25-3.25s1.46-3.25,3.25-3.25,3.25,1.46,3.25,3.25-1.46,3.25-3.25,3.25Z"
						fill={strokeColor}
						fillOpacity={fillColor}
					/>
					<path
						d="M10,5.25c-2.62,0-4.75,2.13-4.75,4.75s2.13,4.75,4.75,4.75,4.75-2.13,4.75-4.75-2.13-4.75-4.75-4.75ZM10,13.25c-1.79,0-3.25-1.46-3.25-3.25s1.46-3.25,3.25-3.25,3.25,1.46,3.25,3.25-1.46,3.25-3.25,3.25Z"
						fill={strokeColor}
					/>
					<circle cx="10" cy="2" r="1" fill={strokeColor} />
					<circle cx="15.7" cy="4.3" r="1" fill={strokeColor} />
					<circle cx="18.06" cy="10" r="1" fill={strokeColor} />
					<circle cx="1.95" cy="10" r="1" fill={strokeColor} />
					<circle cx="4.3" cy="15.7" r="1" fill={strokeColor} />
					<circle cx="10" cy="18.05" r="1" fill={strokeColor} />
					<circle cx="15.7" cy="15.7" r="1" fill={strokeColor} />
					<circle cx="4.3" cy="4.3" r="1" fill={strokeColor} />
				</>
			),
		},
	],
	[
		'keyboard',
		{
			line: ({ strokeColor }) => (
				<>
					<path
						d="M17.26,16.46H2.75c-.96,0-1.75-.85-1.75-1.89V5.88c0-1.04.79-1.89,1.75-1.89h14.51c.96,0,1.75.85,1.75,1.89v8.69c0,1.04-.79,1.89-1.75,1.89ZM2.75,5.61c-.14,0-.25.12-.25.27v8.69c0,.15.11.27.25.27h14.51c.14,0,.25-.12.25-.27V5.88c0-.15-.11-.27-.25-.27H2.75Z"
						fill={strokeColor}
					/>
					<circle cx="5.52" cy="8.52" r=".97" fill={strokeColor} />
					<circle cx="8.53" cy="8.52" r=".97" fill={strokeColor} />
					<circle cx="11.52" cy="8.52" r=".97" fill={strokeColor} />
					<circle cx="14.48" cy="8.52" r=".97" fill={strokeColor} />
					<circle cx="14.48" cy="11.97" r=".97" fill={strokeColor} />
					<path
						d="M11.52,11h-6c-.54,0-.97.44-.97.97s.44.97.97.97h6c.54,0,.97-.44.97-.97s-.44-.97-.97-.97Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'sidebar',
		{
			line: ({ strokeColor, fillColor }) => (
				<>
					<rect
						x="10"
						y="4.5"
						width="8"
						height="11"
						rx="1"
						ry="1"
						opacity={fillColor}
						fill={strokeColor}
					/>
					<path
						d="M17,3.75H3c-.96,0-1.75.78-1.75,1.75v9c0,.96.78,1.75,1.75,1.75h14c.96,0,1.75-.78,1.75-1.75V5.5c0-.96-.78-1.75-1.75-1.75ZM2.75,14.5V5.5c0-.14.11-.25.25-.25h6.25v9.5H3c-.14,0-.25-.11-.25-.25ZM17.25,14.5c0,.14-.11.25-.25.25h-6.25V5.25h6.25c.14,0,.25.11.25.25v9Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'sidebar split',
		{
			line: ({ fillColor, strokeColor }) => (
				<>
					<rect
						x="10"
						y="4.5"
						width="8"
						height="11"
						rx="1"
						ry="1"
						fill={strokeColor}
						fillOpacity={fillColor}
					/>
					<path
						d="M17,16.25H3c-.96,0-1.75-.78-1.75-1.75V5.5c0-.96.78-1.75,1.75-1.75h14c.96,0,1.75.78,1.75,1.75v9c0,.96-.78,1.75-1.75,1.75ZM3,5.25c-.14,0-.25.11-.25.25v9c0,.14.11.25.25.25h14c.14,0,.25-.11.25-.25V5.5c0-.14-.11-.25-.25-.25H3Z"
						fill={strokeColor}
					/>
					<rect x="9.25" y="4.5" width="1.5" height="11" fill={strokeColor} />
					<rect x="10" y="9.5" width="8" height="1" fill={strokeColor} />
				</>
			),
		},
	],
	[
		'target',
		{
			line: ({ strokeColor }) => (
				<>
					<circle cx="10" cy="10" r="3.25" fill={strokeColor} />
					<path
						d="M10,7.5c1.38,0,2.5,1.12,2.5,2.5s-1.12,2.5-2.5,2.5-2.5-1.12-2.5-2.5,1.12-2.5,2.5-2.5M10,6c-2.21,0-4,1.79-4,4s1.79,4,4,4,4-1.79,4-4-1.79-4-4-4h0Z"
						fill={strokeColor}
					/>
					<path
						d="M10,18.25c-4.55,0-8.25-3.7-8.25-8.25S5.45,1.75,10,1.75s8.25,3.7,8.25,8.25-3.7,8.25-8.25,8.25ZM10,3.75c-3.45,0-6.25,2.8-6.25,6.25s2.8,6.25,6.25,6.25,6.25-2.8,6.25-6.25-2.8-6.25-6.25-6.25Z"
						fill={strokeColor}
					/>
					<path
						d="M10,2.5c4.14,0,7.5,3.36,7.5,7.5s-3.36,7.5-7.5,7.5-7.5-3.36-7.5-7.5,3.36-7.5,7.5-7.5M10,17c3.86,0,7-3.14,7-7s-3.14-7-7-7-7,3.14-7,7,3.14,7,7,7M10,1C5.03,1,1,5.03,1,10s4.03,9,9,9,9-4.03,9-9S14.97,1,10,1h0ZM10,15.5c-3.04,0-5.5-2.46-5.5-5.5s2.46-5.5,5.5-5.5,5.5,2.46,5.5,5.5-2.46,5.5-5.5,5.5h0Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'video off',
		{
			line: ({ strokeColor }) => (
				<>
					<path
						d="M10.97,14.75H3.04c-.16,0-.29-.11-.29-.25v-6.79l-1.5-1.29v8.08c0,.96.8,1.75,1.79,1.75h9.68l-1.75-1.5Z"
						fill={strokeColor}
					/>
					<path
						d="M18.39,5.86c-.23-.13-.51-.14-.74-.02l-2.9,1.55v-1.38c0-.97-.81-1.76-1.8-1.76H4.87l1.75,1.5h6.33c.17,0,.3.12.3.26v5.43l2.7,2.32,1.69.91c.11.06.23.09.35.09.13,0,.27-.04.39-.11.23-.14.36-.38.36-.64v-7.5c0-.26-.14-.51-.36-.64ZM17.25,12.75l-2.5-1.34v-2.32l2.5-1.34v4.99Z"
						fill={strokeColor}
					/>
					<path
						d="M15.21,16.5c-.17,0-.35-.06-.49-.18L1.3,4.82c-.31-.27-.35-.74-.08-1.06.27-.31.74-.35,1.06-.08l13.42,11.5c.31.27.35.74.08,1.06-.15.17-.36.26-.57.26Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'video',
		{
			line: ({ strokeColor }) => (
				<>
					<path
						d="M18.39,5.86c-.23-.13-.51-.14-.74-.02l-2.9,1.55v-1.38c0-.97-.81-1.76-1.8-1.76H3.04c-.99,0-1.79.79-1.79,1.75v8.5c0,.96.8,1.75,1.79,1.75h9.91c.99,0,1.79-.79,1.79-1.75v-1.39l2.9,1.55c.11.06.23.09.35.09.13,0,.27-.04.39-.11.23-.14.36-.38.36-.64v-7.5c0-.26-.14-.51-.36-.64ZM13.25,14.5c0,.14-.13.25-.29.25H3.04c-.16,0-.29-.11-.29-.25V6c0-.14.13-.25.29-.25h9.91c.17,0,.3.12.3.26v8.49ZM17.25,12.75l-2.5-1.34v-2.32l2.5-1.34v4.99Z"
						fill={strokeColor}
					/>
					<circle cx="8" cy="10.25" r="1" fill={strokeColor} />
				</>
			),
		},
	],
	[
		'mic',
		{
			line: ({ strokeColor, fillColor }) => (
				<>
					<path
						d="M10.25,11.75c1.65,0,3-1.35,3-3v-4.5c0-1.65-1.35-3-3-3s-3,1.35-3,3v4.5c0,1.65,1.35,3,3,3Z"
						fill={strokeColor}
						fillOpacity={fillColor}
					/>
					<path
						d="M10.25,11.75c1.65,0,3-1.35,3-3v-4.5c0-1.65-1.35-3-3-3s-3,1.35-3,3v4.5c0,1.65,1.35,3,3,3ZM8.75,4.25c0-.83.67-1.5,1.5-1.5s1.5.67,1.5,1.5v4.5c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5v-4.5Z"
						fill={strokeColor}
					/>
					<path
						d="M14.75,7.25v1.25c0,2.48-2.02,4.5-4.5,4.5s-4.5-2.02-4.5-4.5v-1.25h-1.5v1.25c0,3.08,2.33,5.62,5.31,5.96v2.79h-3.59v1.5h8.48v-1.5h-3.39v-2.81c2.92-.4,5.19-2.91,5.19-5.94v-1.25h-1.5Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'mic muted',
		{
			line: ({ strokeColor }) => (
				<>
					<path
						d="M8.78,3.95c.14-.68.74-1.2,1.47-1.2.83,0,1.5.67,1.5,1.5v2.67l1.5,1.5v-4.17c0-1.65-1.35-3-3-3-1.13,0-2.1.63-2.61,1.56l1.14,1.14Z"
						fill={strokeColor}
					/>
					<path
						d="M7.25,8.08v.67c0,1.65,1.35,3,3,3,.21,0,.41-.02.61-.06l-3.61-3.61Z"
						fill={strokeColor}
					/>
					<path
						d="M14.75,7.25v1.25c0,.43-.08.84-.19,1.23l1.17,1.17c.33-.74.52-1.54.52-2.4v-1.25h-1.5Z"
						fill={strokeColor}
					/>
					<path
						d="M11.06,14.44c.69-.09,1.33-.31,1.93-.62l-1.13-1.13c-.5.19-1.04.31-1.61.31-2.48,0-4.5-2.02-4.5-4.5v-1.25h-1.5v1.25c0,3.08,2.33,5.62,5.31,5.96v2.79h-3.59v1.5h8.48v-1.5h-3.39v-2.81Z"
						fill={strokeColor}
					/>
					<path
						d="M16.75,15.5c-.19,0-.38-.07-.53-.22L3.72,2.78c-.29-.29-.29-.77,0-1.06s.77-.29,1.06,0l12.5,12.5c.29.29.29.77,0,1.06-.15.15-.34.22-.53.22Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'camera',
		{
			line: ({ strokeColor }) => (
				<>
					<path
						d="M16.75,16.25H3.25c-.96,0-1.75-.79-1.75-1.75V5.5c0-.96.79-1.75,1.75-1.75h13.5c.96,0,1.75.79,1.75,1.75v9c0,.96-.79,1.75-1.75,1.75ZM3.25,5.25c-.14,0-.25.11-.25.25v9c0,.14.11.25.25.25h13.5c.14,0,.25-.11.25-.25V5.5c0-.14-.11-.25-.25-.25H3.25Z"
						fill={strokeColor}
					/>
					<path
						d="M11.94,13.75c-2.03,0-3.69-1.65-3.69-3.69s1.65-3.69,3.69-3.69,3.69,1.65,3.69,3.69-1.65,3.69-3.69,3.69ZM11.94,7.88c-1.21,0-2.19.98-2.19,2.19s.98,2.19,2.19,2.19,2.19-.98,2.19-2.19-.98-2.19-2.19-2.19Z"
						fill={strokeColor}
					/>
					<circle cx="6" cy="8" r="1" fill={strokeColor} />
				</>
			),
		},
	],
	[
		'highlight',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<>
					<path d="M 0 0 L 24 0 L 24 24 L 0 24 Z" fill="transparent" />
					<path
						d="M 20.825 11.376 C 20.713 11.263 20.56 11.199 20.401 11.199 C 20.241 11.199 20.089 11.263 19.976 11.376 L 16.201 15.15 L 9.85 8.799 L 13.626 5.025 C 13.86 4.79 13.86 4.41 13.626 4.176 C 13.391 3.941 13.011 3.942 12.777 4.176 L 9.002 7.951 C 8.629 8.324 8.543 8.897 8.791 9.362 L 7.202 10.951 C 6.734 11.419 6.734 12.179 7.202 12.647 L 7.554 12.999 L 3.178 17.374 C 3.03 17.521 2.969 17.734 3.017 17.937 C 3.065 18.14 3.215 18.303 3.413 18.368 L 8.812 20.168 C 8.95 20.215 9.099 20.209 9.232 20.153 C 9.305 20.123 9.371 20.079 9.427 20.023 L 12.002 17.447 L 12.353 17.799 C 12.822 18.267 13.581 18.267 14.05 17.799 L 15.638 16.211 C 16.104 16.458 16.677 16.372 17.049 15.999 L 20.825 12.224 C 21.06 11.99 21.06 11.61 20.825 11.376 Z M 13.201 16.95 L 8.05 11.799 L 9.602 10.248 L 14.753 15.399 Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'like',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<path
					d="M 13.447 16.354 C 13.167 16.759 12.706 17 12.214 17 L 3.5 17 C 2.672 17 2 16.328 2 15.5 L 2 8.5 C 2 7.672 2.672 7 3.5 7 L 4.343 7 C 4.762 7 5.161 6.825 5.445 6.517 L 9.265 2.379 C 9.883 1.71 11 2.147 11 3.058 L 11 7 L 16 7 C 16.828 7 17.5 7.672 17.5 8.5 L 17.5 10.031 C 17.5 10.336 17.407 10.634 17.233 10.885 Z M 5 6.5 L 5 17"
					fill="transparent"
					strokeWidth={stroke}
					stroke={strokeColor}
					strokeMiterlimit="10"
					strokeDasharray=""
				/>
			),
		},
	],
	[
		'unlike',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<path
					d="M 6.053 4.646 C 6.333 4.241 6.794 4 7.286 4 L 16 4 C 16.828 4 17.5 4.672 17.5 5.5 L 17.5 12.5 C 17.5 13.328 16.828 14 16 14 L 15.157 14 C 14.738 14 14.339 14.175 14.055 14.483 L 10.235 18.621 C 9.617 19.29 8.5 18.853 8.5 17.942 L 8.5 14 L 3.5 14 C 2.672 14 2 13.328 2 12.5 L 2 10.969 C 2 10.664 2.093 10.366 2.267 10.115 Z M 14.5 14.5 L 14.5 4"
					fill="transparent"
					strokeWidth={stroke}
					stroke={strokeColor}
					strokeMiterlimit="10"
					strokeDasharray=""
				/>
			),
		},
	],
	[
		'stop',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 3 7.5 C 3 5.015 5.015 3 7.5 3 L 12.5 3 C 14.985 3 17 5.015 17 7.5 L 17 12.5 C 17 14.985 14.985 17 12.5 17 L 7.5 17 C 5.015 17 3 14.985 3 12.5 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'copy',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<>
					<path d="M 0 0 L 20 0 L 20 20 L 0 20 Z" fill="transparent" />
					<path
						d="M 5 15 L 3.5 15 C 2.672 15 2 14.328 2 13.5 L 2 3.5 C 2 2.672 2.672 2 3.5 2 L 13.5 2 C 14.328 2 15 2.672 15 3.5 L 15 5"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeLinejoin="round"
						strokeMiterlimit={'10'}
					/>
					<path
						d="M 5 6.5 C 5 5.672 5.672 5 6.5 5 L 16.5 5 C 17.328 5 18 5.672 18 6.5 L 18 16.5 C 18 17.328 17.328 18 16.5 18 L 6.5 18 C 5.672 18 5 17.328 5 16.5 Z"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeLinejoin="round"
						strokeMiterlimit={'10'}
					/>
				</>
			),
		},
	],
	[
		'font smaller',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<>
					<path d="M 0 0 L 20 0 L 20 20 L 0 20 Z" fill="transparent" />
					<path
						d="M 9.081 5 L 10.746 5 L 14.321 14.824 L 14.321 15.015 L 12.833 15.015 L 11.919 12.232 L 7.854 12.232 L 6.899 15.015 L 5.5 15.015 L 5.5 14.824 Z M 11.503 11.017 L 9.913 6.542 L 9.858 6.542 L 8.282 11.017 L 11.502 11.017 Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'font larger',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<>
					<path d="M 0 0 L 20 0 L 20 20 L 0 20 Z" fill="transparent" />
					<path
						d="M 8.872 3 L 11.137 3 L 16 16.733 L 16 17 L 13.976 17 L 12.733 13.109 L 7.202 13.109 L 5.903 17 L 4 17 L 4 16.733 Z M 12.167 11.411 L 10.004 5.155 L 9.929 5.155 L 7.785 11.411 L 12.166 11.411 Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'bar chart',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<>
					<path d="M 0 0 L 20 0 L 20 20 L 0 20 Z" fill="transparent" />
					<path
						d="M 2 2.5 L 2 17 L 18.5 17"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeLinejoin="round"
					/>
					<path
						d="M 6.5 9 L 6.5 14"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
					<path
						d="M 10.451 5 L 10.451 14"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
					<path
						d="M 14.5 7 L 14.5 14"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'briefcase',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<>
					<path
						d="M 5 12 C 5 12.552 5.448 13 6 13 C 6.552 13 7 12.552 7 12 C 7 11.448 6.552 11 6 11 C 5.448 11 5 11.448 5 12 Z M 14 13 C 13.448 13 13 12.552 13 12 C 13 11.448 13.448 11 14 11 C 14.552 11 15 11.448 15 12 C 15 12.552 14.552 13 14 13 Z"
						fill={strokeColor}
					/>
					<path
						d="M 5.25 5 L 5.25 3.5 C 5.25 2.257 6.257 1.25 7.5 1.25 L 12.5 1.25 C 13.743 1.25 14.75 2.257 14.75 3.5 L 14.75 5 L 17.5 5 C 18.328 5 19 5.672 19 6.5 L 19 15.5 C 19 16.328 18.328 17 17.5 17 L 2.5 17 C 1.672 17 1 16.328 1 15.5 L 1 6.5 C 1 5.672 1.672 5 2.5 5 Z M 6.75 5 L 13.25 5 L 13.25 3.5 C 13.25 3.086 12.914 2.75 12.5 2.75 L 7.5 2.75 C 7.086 2.75 6.75 3.086 6.75 3.5 Z M 2.5 6.5 L 2.5 15.5 L 17.5 15.5 L 17.5 6.5 L 14.75 6.5 L 14.75 9 L 13.25 9 L 13.25 6.5 L 6.75 6.5 L 6.75 9 L 5.25 9 L 5.25 6.5 Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'globe location',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<g transform="translate(2 2.5)">
					<path
						d="M 7.619 15.238 C 3.411 15.238 0 11.827 0 7.619 C -0.003 5.575 0.819 3.616 2.278 2.185 M 2.921 13.601 C 2.663 12.725 3.136 12.29 3.812 12.007 C 4.85 11.57 4.85 11.57 5.63 10.534 C 6.412 9.497 7.393 9.476 9.239 11.547 C 10.068 12.479 11.796 11.666 12.728 13.066 M 7.619 15.238 C 9.503 15.238 11.228 14.554 12.558 13.421 C 13.222 12.855 13.789 12.176 14.227 11.414 C 14.446 11.033 14.634 10.631 14.785 10.213 C 14.861 10.003 14.928 9.79 14.985 9.572 M 1.785 2.916 C 2.6 2.938 3.261 3.5 3.132 4.374 C 2.921 5.801 4.248 5.459 4.199 6.75 C 4.167 7.611 3.509 8.55 1.892 8.936 C 1.041 9.139 0.559 9.279 0.176 9.806 M 6.874 0.036 C 6.628 0.06 6.383 0.095 6.142 0.143 C 5.658 0.238 5.187 0.38 4.733 0.566 C 3.825 0.937 2.99 1.484 2.278 2.185"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeLinejoin="round"
						strokeDasharray=""
					/>
					<path
						d="M 12.19 0 C 14.252 0 16 1.69 16 3.741 C 16 5.823 14.224 7.285 12.583 8.279 C 12.339 8.415 12.042 8.415 11.798 8.279 C 10.16 7.276 8.381 5.831 8.381 3.741 C 8.381 1.691 10.129 0 12.19 0 Z"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeLinejoin="round"
						strokeDasharray=""
					/>
					<path
						d="M 12.952 3.81 C 12.952 4.23 12.611 4.571 12.19 4.571 C 11.77 4.571 11.429 4.23 11.429 3.81 C 11.429 3.389 11.77 3.048 12.19 3.048 C 12.611 3.048 12.952 3.389 12.952 3.81 Z"
						fill={strokeColor}
					/>
				</g>
			),
		},
	],
	[
		'focus',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<>
					<path d="M 0 0 L 20 0 L 20 20 L 0 20 Z" fill="transparent" />
					<path
						d="M 9.75 2.641 C 13.666 2.641 16.859 5.834 16.859 9.75 C 16.859 13.666 13.666 16.859 9.75 16.859 C 5.834 16.859 2.641 13.666 2.641 9.75 C 2.641 5.834 5.834 2.641 9.75 2.641 M 9.75 1 C 4.916 1 1 4.916 1 9.75 C 1 14.584 4.916 18.5 9.75 18.5 C 14.584 18.5 18.5 14.584 18.5 9.75 C 18.5 4.916 14.584 1 9.75 1 Z"
						fill={strokeColor}
					/>
					<path
						d="M 5.492 12.657 L 6.03 11.706 L 13.892 16.157 L 13.353 17.109 Z"
						fill={strokeColor}
					/>
					<path
						d="M 5.112 7.527 L 6.206 7.519 L 6.282 16.553 L 5.188 16.562 Z"
						fill={strokeColor}
					/>
					<path
						d="M 1.573 9.2 L 9.36 4.62 L 9.914 5.563 L 2.127 10.144 Z"
						fill={strokeColor}
					/>
					<path
						d="M 5.605 3.344 L 6.143 2.392 L 14.005 6.844 L 13.465 7.795 Z"
						fill={strokeColor}
					/>
					<path
						d="M 13.223 2.953 L 14.316 2.945 L 14.392 11.979 L 13.298 11.988 Z"
						fill={strokeColor}
					/>
					<path
						d="M 9.579 13.946 L 17.366 9.365 L 17.92 10.308 L 10.133 14.888 Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'chart arrow',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<>
					<path d="M 0 0 L 20 0 L 20 20 L 0 20 Z" fill="transparent" />
					<g transform="translate(3.5 6)">
						<path
							d="M 0 8 L 4.5 3.5 L 7.5 6 L 12.5 0.5"
							fill="transparent"
							strokeWidth={stroke}
							stroke={strokeColor}
							strokeLinecap="square"
							strokeMiterlimit="10"
							strokeDasharray=""
						/>
						<path
							d="M 0.876 5.957 L 3.387 2.87 L 0 0"
							transform="translate(10.018 -1.785) rotate(-40 1.694 2.978)"
							fill="transparent"
							strokeWidth={stroke}
							stroke={strokeColor}
							strokeLinecap="square"
							strokeMiterlimit="10"
							strokeDasharray=""
						/>
					</g>
				</>
			),
		},
	],
	[
		'document editor',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<>
					<g>
						<defs>
							<path
								d="M 3 3 C 3 1.895 3.895 1 5 1 L 15 1 C 16.105 1 17 1.895 17 3 L 17 17 C 17 18.105 16.105 19 15 19 L 5 19 C 3.895 19 3 18.105 3 17 Z"
								id="a1000z"
							/>
							<clipPath id="a1001z">
								<use xlinkHref="#a1000z" />
							</clipPath>
						</defs>
						<use
							xlinkHref="#a1000z"
							fill="transparent"
							clipPath="url(#a1001z)"
							strokeWidth="3.1"
							stroke={strokeColor}
						/>
					</g>
					<g transform="translate(7 9.25)">
						<path d="M 0 1.5 L 4.5 1.5 L 4.5 0 L 0 0 Z" fill={strokeColor} />
						<path d="M 6 5.5 L 0 5.5 L 0 4 L 6 4 Z" fill={strokeColor} />
					</g>
				</>
			),
		},
	],
	[
		'settings',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<>
					<path
						d="M 2 5.25 L 4.07 5.25 C 4.024 5.493 4 5.744 4 6 C 4 6.256 4.024 6.507 4.07 6.75 L 2 6.75 Z M 18 5.25 L 18 6.75 L 11.93 6.75 C 11.976 6.507 12 6.256 12 6 C 12 5.744 11.976 5.493 11.93 5.25 Z"
						fill={strokeColor}
					/>
					<path
						d="M 2 13.25 L 8.07 13.25 C 8.024 13.493 8 13.744 8 14 C 8 14.256 8.024 14.507 8.07 14.75 L 2 14.75 Z M 18 13.25 L 18 14.75 L 15.93 14.75 C 15.976 14.507 16 14.256 16 14 C 16 13.744 15.976 13.493 15.93 13.25 Z"
						fill={strokeColor}
					/>
					<path
						d="M 12 12 C 12.966 12 13.75 12.784 13.75 13.75 C 13.75 14.716 12.966 15.5 12 15.5 C 11.034 15.5 10.25 14.716 10.25 13.75 C 10.25 12.784 11.034 12 12 12 Z"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeMiterlimit="10"
						strokeDasharray=""
					/>
					<path
						d="M 8 4.25 C 8.966 4.25 9.75 5.034 9.75 6 C 9.75 6.966 8.966 7.75 8 7.75 C 7.034 7.75 6.25 6.966 6.25 6 C 6.25 5.034 7.034 4.25 8 4.25 Z"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeMiterlimit="10"
						strokeDasharray=""
					/>
				</>
			),
		},
	],
	[
		'light bulb',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<>
					<path
						d="M 5.05 13.95 C 3.784 12.683 3 10.933 3 9 C 3 7.067 3.784 5.317 5.05 4.05 C 6.317 2.784 8.067 2 10 2 C 11.933 2 13.683 2.784 14.95 4.05 C 16.216 5.317 17 7.067 17 9 C 17 10.933 16.216 12.683 14.95 13.95"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
					<path
						d="M 10 10 C 10.552 10 11 9.552 11 9 C 11 8.448 10.552 8 10 8 C 9.448 8 9 8.448 9 9 C 9 9.552 9.448 10 10 10 Z"
						fill={strokeColor}
					/>
					<path
						d="M 6.5 15 L 13.5 15"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
					<path
						d="M 7.5 18 L 12.5 18"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'issue',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<>
					<path
						d="M 10 11.667 L 10.008 11.667"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M 10 9.167 L 10 5.833"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M 2 4.503 C 2 3.581 2.748 2.833 3.67 2.833 L 16.33 2.833 C 17.252 2.833 18 3.581 18 4.503 L 18 13.163 C 18 14.086 17.252 14.833 16.33 14.833 L 3.67 14.833 C 2.748 14.833 2 14.086 2 13.163 Z"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
					<path
						d="M 3.383 18.336 C 5.417 17.476 7.653 17 10 17 C 12.347 17 14.583 17.476 16.617 18.336"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'chart',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<>
					<path d="M 0 0 L 20 0 L 20 20 L 0 20 Z" fill="transparent" />
					<path
						d="M 5 12 L 9 8 L 12.5 11.5 L 16.5 7.5"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeLinecap="square"
						strokeMiterlimit="10"
						strokeDasharray=""
					/>
					<path
						d="M 2 2.5 L 2 17 L 18.5 17"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeLinejoin="round"
					/>
				</>
			),
		},
	],
	[
		'chat',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 17.75 5 C 17.75 2.929 16.071 1.25 14 1.25 L 6 1.25 C 3.929 1.25 2.25 2.929 2.25 5 L 2.25 19 L 3.75 19 C 3.75 17.757 4.757 16.75 6 16.75 L 14 16.75 C 16.071 16.75 17.75 15.071 17.75 13 Z M 3.75 16 L 3.75 5 C 3.75 3.757 4.757 2.75 6 2.75 L 14 2.75 C 15.243 2.75 16.25 3.757 16.25 5 L 16.25 13 C 16.25 14.243 15.243 15.25 14 15.25 L 6 15.25 C 5.156 15.25 4.377 15.529 3.75 16 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'exclamation',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<>
					<path d="M 1 1 L 19 1 L 19 19 L 1 19 Z" fill="transparent" />
					<g transform="translate(8.75 4)">
						<path
							d="M 2.471 7.765 L 2.471 0 L 0.353 0 L 0.353 7.765 Z"
							fill={strokeColor}
						/>
						<path
							d="M 2.824 10.588 C 2.824 11.368 2.191 12 1.412 12 C 0.632 12 0 11.368 0 10.588 C 0 9.809 0.632 9.176 1.412 9.176 C 2.191 9.176 2.824 9.809 2.824 10.588 Z"
							fill={strokeColor}
						/>
					</g>
				</>
			),
		},
	],
	[
		'undo',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<>
					<path
						d="M 13.5 2 L 15.5 2 L 11.5 2 L 11.5 6"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
					<path
						d="M 18 10 C 18 14.418 14.418 18 10 18 C 5.582 18 2 14.418 2 10 C 2 8.543 2.39 7.177 3.07 6 L 4.876 6 C 4.014 7.103 3.5 8.491 3.5 10 C 3.5 13.59 6.41 16.5 10 16.5 C 13.59 16.5 16.5 13.59 16.5 10 C 16.5 7.108 14.611 4.657 12 3.813 L 12 2.252 C 15.45 3.14 18 6.272 18 10 Z"
						fill={strokeColor}
					/>
					<path
						d="M 11 10 C 11 10.552 10.552 11 10 11 C 9.448 11 9 10.552 9 10 C 9 9.448 9.448 9 10 9 C 10.552 9 11 9.448 11 10 Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'character beam',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<>
					<path d="M 0 0 L 24 0 L 24 24 L 0 24 Z" fill="transparent" />
					<g transform="translate(2 3.5)">
						<path
							d="M 3.987 1.4 L 5.841 1.4 L 9.821 12.338 L 9.821 12.55 L 8.165 12.55 L 7.147 9.452 L 2.621 9.452 L 1.558 12.55 L 0 12.55 L 0 12.338 Z M 6.684 8.099 L 4.913 3.116 L 4.852 3.116 L 3.098 8.099 L 6.683 8.099 Z"
							fill={strokeColor}
						/>
						<path
							d="M 10.733 0 L 16.333 0 M 10.733 14 L 16.333 14 M 13.533 0 L 13.533 14"
							fill="transparent"
							strokeWidth={stroke}
							stroke={strokeColor}
						/>
					</g>
				</>
			),
		},
	],
	[
		'edit',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M14.0272 0.966797L14.5303 1.46995L16.5303 3.46995L17.0893 4.02893L16.5017 4.55775L6.50172 13.5577L6.2878 13.7503H6H4H3.25V13.0003V11.0003V10.6663L3.49828 10.4428L13.4983 1.44281L14.0272 0.966797ZM4.75 11.3343V12.2503H5.7122L14.9107 3.97163L13.9728 3.03376L4.75 11.3343ZM17 16.7503H5V15.2503H17V16.7503ZM2 17.0003C2.55228 17.0003 3 16.5526 3 16.0003C3 15.448 2.55228 15.0003 2 15.0003C1.44772 15.0003 1 15.448 1 16.0003C1 16.5526 1.44772 17.0003 2 17.0003Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'text document',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 12.5 5.5 L 12.5 2.5 L 4.5 2.5 L 4.5 17.5 L 15.5 17.5 L 15.5 5.5 Z M 15.5 19 L 4.5 19 C 3.672 19 3 18.328 3 17.5 L 3 2.5 C 3 1.672 3.672 1 4.5 1 L 12.5 1 C 13.328 1 14 1.672 14 2.5 L 14 4 L 15.5 4 C 16.328 4 17 4.672 17 5.5 L 17 17.5 C 17 18.328 16.328 19 15.5 19 Z M 14 14.75 L 6 14.75 L 6 13.25 L 14 13.25 Z M 6 10.75 L 12 10.75 L 12 9.25 L 6 9.25 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'mail',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<>
					<path
						d="M 2 5 C 2 4.448 2.448 4 3 4 L 17 4 C 17.552 4 18 4.448 18 5 L 18 15 C 18 15.552 17.552 16 17 16 L 3 16 C 2.448 16 2 15.552 2 15 Z"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
					<path
						d="M 15.5 8 C 15.5 8.552 15.052 9 14.5 9 C 13.948 9 13.5 8.552 13.5 8 C 13.5 7.448 13.948 7 14.5 7 C 15.052 7 15.5 7.448 15.5 8 Z"
						fill={strokeColor}
					/>
					<path
						d="M 11.5 8 L 4.5 8"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
					<path
						d="M 9.75 11 L 4.5 11"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'concise',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 18 7 L 2 7 L 2 8.5 L 18 8.5 Z M 14 12 L 2 12 L 2 13.5 L 14 13.5 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'moderate',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 2 4 L 14 4 L 14 5.5 L 2 5.5 Z M 2 9 L 18 9 L 18 10.5 L 2 10.5 Z M 10 14 L 2 14 L 2 15.5 L 10 15.5 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'expanded',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 2 2 L 14 2 L 14 3.5 L 2 3.5 Z M 18 7 L 2 7 L 2 8.5 L 18 8.5 Z M 16 12 L 2 12 L 2 13.5 L 16 13.5 Z M 10 17 L 2 17 L 2 18.5 L 10 18.5 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'open circle',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<path
					d="M 17.371 6.886 C 17.776 7.843 18 8.895 18 10 C 18 14.418 14.418 18 10 18 C 5.582 18 2 14.418 2 10 C 2 5.582 5.582 2 10 2"
					fill="transparent"
					strokeWidth={stroke}
					stroke={strokeColor}
				/>
			),
		},
	],
	[
		'view',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<>
					<path d="M 1 1 L 19 1 L 19 19 L 1 19 Z" fill="transparent" />
					<path
						d="M 10 2.75 C 5.996 2.75 2.75 5.996 2.75 10 C 2.75 14.004 5.996 17.25 10 17.25 C 14.004 17.25 17.25 14.004 17.25 10 C 17.25 5.996 14.004 2.75 10 2.75 Z M 1.25 10 C 1.25 5.168 5.168 1.25 10 1.25 C 14.832 1.25 18.75 5.168 18.75 10 C 18.75 14.832 14.832 18.75 10 18.75 C 5.168 18.75 1.25 14.832 1.25 10 Z"
						fill={strokeColor}
					/>
					<path
						d="M 11 10 C 11 10.552 10.552 11 10 11 C 9.448 11 9 10.552 9 10 C 9 9.448 9.448 9 10 9 C 10.552 9 11 9.448 11 10 Z"
						fill={strokeColor}
					/>
				</>
			),
			lineOn: ({ strokeColor }: IconRenderProps) => (
				<>
					<path d="M 1 1 L 19 1 L 19 19 L 1 19 Z" fill="transparent" />
					<path
						d="M 10 2.75 C 5.996 2.75 2.75 5.996 2.75 10 C 2.75 14.004 5.996 17.25 10 17.25 C 14.004 17.25 17.25 14.004 17.25 10 C 17.25 5.996 14.004 2.75 10 2.75 Z M 1.25 10 C 1.25 5.168 5.168 1.25 10 1.25 C 14.832 1.25 18.75 5.168 18.75 10 C 18.75 14.832 14.832 18.75 10 18.75 C 5.168 18.75 1.25 14.832 1.25 10 Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'apple',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 9.643 5.355 C 10.635 5.355 11.505 4.967 12.253 4.19 C 13.001 3.414 13.376 2.511 13.376 1.482 C 13.376 1.369 13.367 1.208 13.349 1 C 13.218 1.018 13.12 1.033 13.055 1.045 C 12.14 1.176 11.336 1.625 10.641 2.392 C 9.946 3.16 9.599 3.981 9.599 4.855 C 9.599 4.956 9.613 5.123 9.643 5.355 Z M 13.197 19 C 13.904 19 14.685 18.515 15.54 17.545 C 16.395 16.576 17.049 15.436 17.5 14.127 C 15.819 13.259 14.979 12.012 14.979 10.388 C 14.979 9.032 15.659 7.872 17.019 6.908 C 16.075 5.724 14.828 5.132 13.278 5.132 C 12.624 5.132 12.027 5.23 11.487 5.426 L 11.149 5.551 L 10.694 5.73 C 10.397 5.843 10.127 5.899 9.884 5.899 C 9.694 5.899 9.444 5.834 9.135 5.703 L 8.788 5.56 L 8.458 5.426 C 7.977 5.224 7.461 5.123 6.908 5.123 C 5.43 5.123 4.242 5.623 3.345 6.622 C 2.448 7.622 2 8.94 2 10.576 C 2 12.878 2.719 15.005 4.156 16.956 C 5.153 18.319 6.065 19 6.891 19 C 7.241 19 7.588 18.932 7.933 18.795 L 8.369 18.616 L 8.717 18.491 C 9.204 18.319 9.652 18.233 10.062 18.233 C 10.495 18.233 10.994 18.343 11.558 18.563 L 11.834 18.67 C 12.411 18.89 12.865 19 13.197 19 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'linkedin',
		{
			line: ({ strokeColor }) => (
				<path
					d="M 16.4 16.259 L 13.766 16.259 L 13.766 12.133 C 13.766 11.15 13.748 9.883 12.396 9.883 C 11.023 9.883 10.813 10.955 10.813 12.061 L 10.813 16.258 L 8.18 16.258 L 8.18 7.775 L 10.709 7.775 L 10.709 8.933 L 10.743 8.933 C 11.259 8.052 12.218 7.525 13.239 7.563 C 15.909 7.563 16.401 9.319 16.401 11.603 L 16.4 16.258 Z M 5.208 6.615 C 4.652 6.63 4.132 6.343 3.849 5.863 C 3.567 5.384 3.567 4.79 3.849 4.311 C 4.132 3.832 4.652 3.544 5.208 3.559 C 6.036 3.581 6.695 4.259 6.695 5.087 C 6.695 5.915 6.036 6.593 5.208 6.615 Z M 6.524 16.259 L 3.888 16.259 L 3.888 7.775 L 6.524 7.775 Z M 17.713 1.111 L 2.564 1.111 C 1.848 1.103 1.261 1.677 1.252 2.393 L 1.252 17.604 C 1.256 17.948 1.396 18.277 1.642 18.518 C 1.888 18.759 2.219 18.892 2.563 18.889 L 17.713 18.889 C 18.431 18.898 19.02 18.324 19.03 17.606 L 19.03 2.392 C 19.02 1.675 18.43 1.102 17.713 1.111"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'google',
		{
			line: (_props: IconRenderProps) => (
				<g transform="translate(1.05 1.197)">
					<path
						d="M 8.995 3.569 C 10.269 3.549 11.524 4.039 12.446 4.922 L 15.014 2.334 C 13.387 0.804 11.23 -0.019 8.995 0 C 5.583 0 2.485 1.922 0.956 4.961 L 3.936 7.275 C 4.662 5.137 6.642 3.569 8.995 3.569 Z"
						fill="rgb(229,67,53)"
					/>
					<path
						d="M 3.936 10.726 C 3.564 9.608 3.564 8.392 3.936 7.275 L 0.956 4.961 C -0.319 7.51 -0.319 10.51 0.956 13.039 Z"
						fill="rgb(246,183,4)"
					/>
					<path
						d="M 8.995 18 C 11.426 18 13.465 17.196 14.956 15.824 L 12.054 13.588 C 11.25 14.137 10.211 14.451 8.995 14.451 C 6.642 14.451 4.662 12.863 3.936 10.745 L 0.956 13.039 C 2.485 16.078 5.583 18 8.995 18 Z"
						fill="rgb(52,163,83)"
					/>
					<path
						d="M 17.642 9.216 C 17.642 8.608 17.583 7.981 17.485 7.392 L 8.995 7.392 L 8.995 10.863 L 13.858 10.863 C 13.662 11.981 13.014 12.961 12.054 13.588 L 14.956 15.843 C 16.661 14.255 17.642 11.941 17.642 9.216 Z"
						fill="rgb(66,128,239)"
					/>
				</g>
			),
		},
	],
	[
		'google mono',
		{
			line: ({ strokeColor }) => (
				<g transform="translate(1.05 1.197)">
					<path
						d="M 8.995 3.569 C 10.269 3.549 11.524 4.039 12.446 4.922 L 15.014 2.334 C 13.387 0.804 11.23 -0.019 8.995 0 C 5.583 0 2.485 1.922 0.956 4.961 L 3.936 7.275 C 4.662 5.137 6.642 3.569 8.995 3.569 Z"
						fill={strokeColor}
					/>
					<path
						d="M 3.936 10.726 C 3.564 9.608 3.564 8.392 3.936 7.275 L 0.956 4.961 C -0.319 7.51 -0.319 10.51 0.956 13.039 Z"
						fill={strokeColor}
					/>
					<path
						d="M 8.995 18 C 11.426 18 13.465 17.196 14.956 15.824 L 12.054 13.588 C 11.25 14.137 10.211 14.451 8.995 14.451 C 6.642 14.451 4.662 12.863 3.936 10.745 L 0.956 13.039 C 2.485 16.078 5.583 18 8.995 18 Z"
						fill={strokeColor}
					/>
					<path
						d="M 17.642 9.216 C 17.642 8.608 17.583 7.981 17.485 7.392 L 8.995 7.392 L 8.995 10.863 L 13.858 10.863 C 13.662 11.981 13.014 12.961 12.054 13.588 L 14.956 15.843 C 16.661 14.255 17.642 11.941 17.642 9.216 Z"
						fill={strokeColor}
					/>
				</g>
			),
		},
	],
	[
		'dollar',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<>
					<path d="M 1 1 L 19 1 L 19 19 L 1 19 Z" fill="transparent" />
					<path
						d="M 1 10 C 1 5.029 5.029 1 10 1 C 14.971 1 19 5.029 19 10 C 19 14.971 14.971 19 10 19 C 5.029 19 1 14.971 1 10 Z M 10 17.5 C 14.142 17.5 17.5 14.142 17.5 10 C 17.5 5.858 14.142 2.5 10 2.5 C 5.858 2.5 2.5 5.858 2.5 10 C 2.5 14.142 5.858 17.5 10 17.5 Z"
						fill={strokeColor}
					/>
					<path
						d="M 10 6.75 C 10.69 6.75 11.25 7.31 11.25 8 L 12.75 8 C 12.75 6.77 11.933 5.689 10.75 5.354 L 10.75 4.5 L 9.25 4.5 L 9.25 5.354 C 7.932 5.731 7.093 7.02 7.281 8.378 C 7.47 9.735 8.629 10.747 10 10.75 C 10.69 10.75 11.25 11.31 11.25 12 C 11.25 12.69 10.69 13.25 10 13.25 C 9.31 13.25 8.75 12.69 8.75 12 L 7.25 12 C 7.25 13.23 8.067 14.311 9.25 14.646 L 9.25 15.5 L 10.75 15.5 L 10.75 14.646 C 12.068 14.269 12.907 12.98 12.719 11.622 C 12.53 10.265 11.371 9.253 10 9.25 C 9.31 9.25 8.75 8.69 8.75 8 C 8.75 7.31 9.31 6.75 10 6.75 Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'trash bin',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 17 0.5 L 3 0.5 L 3 2 L 17 2 Z M 5.5 16.75 L 14.5 16.75 L 14.5 5.75 L 5.5 5.75 Z M 14.8 18.25 L 5.2 18.25 C 4.537 18.25 4 17.713 4 17.05 L 4 5.45 C 4 4.787 4.537 4.25 5.2 4.25 L 14.8 4.25 C 15.463 4.25 16 4.787 16 5.45 L 16 17.05 C 16 17.713 15.463 18.25 14.8 18.25 Z M 7.25 14.25 L 7.25 8.25 L 8.75 8.25 L 8.75 14.25 Z M 11.25 8.25 L 11.25 14.25 L 12.75 14.25 L 12.75 8.25 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'recent',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 2 4.25 L 10 4.25 L 10 5.75 L 2 5.75 Z M 18 9.25 L 18 10.75 L 2 10.75 L 2 9.25 Z M 14 14.25 L 2 14.25 L 2 15.75 L 14 15.75 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'refresh',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 9 1.25 L 5 1.25 L 5 2.75 L 7.255 2.75 C 4.108 3.943 2.089 7.03 2.259 10.391 C 2.429 13.753 4.748 16.621 8 17.49 L 8 15.923 C 5.415 15.048 3.695 12.598 3.753 9.869 C 3.81 7.14 5.63 4.764 8.25 3.998 L 8.25 6 L 9.75 6 L 9.75 1.25 Z M 12.745 17.25 C 15.892 16.057 17.911 12.97 17.741 9.609 C 17.571 6.247 15.252 3.379 12 2.51 L 12 4.077 C 14.585 4.952 16.305 7.402 16.247 10.131 C 16.19 12.86 14.37 15.236 11.75 16.002 L 11.75 14 L 10.25 14 L 10.25 18.75 L 15 18.75 L 15 17.25 Z M 11 10 C 11 10.552 10.552 11 10 11 C 9.448 11 9 10.552 9 10 C 9 9.448 9.448 9 10 9 C 10.552 9 11 9.448 11 10 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'document',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<path
					d="M 13.25 4 L 13.25 4.75 L 15.5 4.75 C 15.914 4.75 16.25 5.086 16.25 5.5 L 16.25 17.5 C 16.25 17.914 15.914 18.25 15.5 18.25 L 4.5 18.25 C 4.086 18.25 3.75 17.914 3.75 17.5 L 3.75 2.5 C 3.75 2.086 4.086 1.75 4.5 1.75 L 12.5 1.75 C 12.914 1.75 13.25 2.086 13.25 2.5 Z"
					fill="transparent"
					strokeWidth={stroke}
					stroke={strokeColor}
					strokeMiterlimit="10"
					strokeDasharray=""
				/>
			),
		},
	],
	[
		'navigate right',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<g transform="translate(2 4)">
					<path d="M 0 0 L 16 0 L 16 11.207 L 0 11.207 Z" fill="transparent" />
					<path
						d="M 14.113 4.78 L 6.176 4.78 C 3.227 4.78 0.838 7.28 0.838 10.369 L 0.838 11.179"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeMiterlimit="10"
						strokeDasharray=""
					/>
					<path
						d="M 10.62 8.972 L 14.81 4.78 L 10.62 0.588"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeMiterlimit="10"
						strokeDasharray=""
					/>
				</g>
			),
		},
	],
	[
		'navigate left',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<g transform="translate(18 4) scale(-1 1)">
					<path d="M 0 0 L 16 0 L 16 11.207 L 0 11.207 Z" fill="transparent" />
					<path
						d="M 14.113 4.78 L 6.176 4.78 C 3.227 4.78 0.838 7.28 0.838 10.369 L 0.838 11.179"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeMiterlimit="10"
						strokeDasharray=""
					/>
					<path
						d="M 10.62 8.972 L 14.81 4.78 L 10.62 0.588"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeMiterlimit="10"
						strokeDasharray=""
					/>
				</g>
			),
		},
	],
	[
		'arrow right',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 10.53 3.469 L 16.53 9.469 L 17.06 9.999 L 16.53 10.529 L 10.53 16.529 L 9.47 15.469 L 14.19 10.749 L 4 10.749 L 4 9.249 L 14.19 9.249 L 9.47 4.53 L 10.53 3.47 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'arrow left',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 9.47 3.469 L 3.47 9.469 L 2.94 9.999 L 3.47 10.529 L 9.47 16.529 L 10.53 15.469 L 5.81 10.749 L 16 10.749 L 16 9.249 L 5.81 9.249 L 10.53 4.529 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 10.53 3.469 L 16.53 9.469 L 17.06 9.999 L 16.53 10.529 L 10.53 16.529 L 9.47 15.469 L 14.19 10.749 L 4 10.749 L 4 9.249 L 14.19 9.249 L 9.47 4.53 L 10.53 3.47 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'arrow up',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 16.53 9.47 L 10.53 3.47 L 10 2.94 L 9.469 3.47 L 3.469 9.47 L 4.529 10.53 L 9.249 5.81 L 9.249 16 L 10.749 16 L 10.749 5.81 L 15.469 10.53 L 16.529 9.47 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'arrow down',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<g transform="translate(20 20) scale(-1 -1)">
					<path
						d="M 16.53 9.47 L 10.53 3.47 L 10 2.94 L 9.469 3.47 L 3.469 9.47 L 4.529 10.53 L 9.249 5.81 L 9.249 16 L 10.749 16 L 10.749 5.81 L 15.469 10.53 L 16.529 9.47 Z"
						fill={strokeColor}
					/>
				</g>
			),
		},
	],
	[
		'notification',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<>
					<path
						d="M 1 3.5 C 1 2.119 2.119 1 3.5 1 L 16.5 1 C 17.881 1 19 2.119 19 3.5 L 19 16.5 C 19 17.881 17.881 19 16.5 19 L 3.5 19 C 2.119 19 1 17.881 1 16.5 Z"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
					<path
						d="M 14 12 L 6 12"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
					<path
						d="M 12 8 L 6 8"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'alert',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<>
					<path
						d="M 10.25 3 C 6.246 3 3 6.246 3 10.25 C 3 14.254 6.246 17.5 10.25 17.5 C 14.254 17.5 17.5 14.254 17.5 10.25 C 17.5 6.246 14.254 3 10.25 3 Z M 1.5 10.25 C 1.5 5.418 5.418 1.5 10.25 1.5 C 15.082 1.5 19 5.418 19 10.25 C 19 15.082 15.082 19 10.25 19 C 5.418 19 1.5 15.082 1.5 10.25 Z M 11.25 13.25 C 11.25 13.802 10.802 14.25 10.25 14.25 C 9.698 14.25 9.25 13.802 9.25 13.25 C 9.25 12.698 9.698 12.25 10.25 12.25 C 10.802 12.25 11.25 12.698 11.25 13.25 Z M 11 11.25 L 11 5.75 L 9.5 5.75 L 9.5 11.25 Z"
						fill={strokeColor}
					/>
					<path d="M 1 1 L 19 1 L 19 19 L 1 19 Z" fill="transparent" />
				</>
			),
		},
	],
	[
		'blank',
		{
			line: (_props: IconRenderProps) => <></>,
		},
	],
	[
		'check',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 14.5 6 L 8.53 11.97 L 6.06 9.5 L 5 10.56 L 8 13.56 L 8.53 14.09 L 9.06 13.56 L 15.56 7.06 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'help',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<>
					<path
						d="M 11 13 C 11 13.552 10.552 14 10 14 C 9.448 14 9 13.552 9 13 C 9 12.448 9.448 12 10 12 C 10.552 12 11 12.448 11 13 Z M 8.75 8 C 8.75 7.31 9.31 6.75 10 6.75 C 10.69 6.75 11.25 7.31 11.25 8 C 11.25 8.69 10.69 9.25 10 9.25 L 9.25 9.25 L 9.25 11 L 10.75 11 L 10.75 10.646 C 12.118 10.259 12.966 8.893 12.706 7.496 C 12.446 6.098 11.163 5.129 9.748 5.26 C 8.332 5.39 7.249 6.578 7.25 8 Z"
						fill={strokeColor}
					/>
					<path
						d="M 1 10 C 1 5.029 5.029 1 10 1 C 14.971 1 19 5.029 19 10 C 19 14.971 14.971 19 10 19 C 5.029 19 1 14.971 1 10 Z M 10 17.5 C 14.142 17.5 17.5 14.142 17.5 10 C 17.5 5.858 14.142 2.5 10 2.5 C 5.858 2.5 2.5 5.858 2.5 10 C 2.5 14.142 5.858 17.5 10 17.5 Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'menu',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M18 6.25H2v1.5h16v-1.5Zm0 6H2v1.5h16v-1.5Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'attach',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<>
					<g clipPath="url(#a)">
						<path
							d="m8 13 4-4a1.414 1.414 0 1 0-2-2l-6 6a2.828 2.828 0 1 0 4 4l7.5-7.5a4.243 4.243 0 1 0-6-6L4 9"
							stroke={strokeColor}
							strokeWidth={stroke}
						/>
					</g>
					<defs>
						<clipPath id="a">
							<path
								fill="transparent"
								transform="translate(1 1)"
								d="M0 0h18v18H0z"
							/>
						</clipPath>
					</defs>
				</>
			),
		},
	],
	[
		'person',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M12.5 5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM14 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3.5 13v-.5h13v.5a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 13ZM2 13v-.5A1.5 1.5 0 0 1 3.5 11h13a1.5 1.5 0 0 1 1.5 1.5v.5a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'upload',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<g transform="translate(1 0.94)">
					<path
						d="M 0 0.06 L 18 0.06 L 18 18.06 L 0 18.06 Z"
						fill="transparent"
					/>
					<path
						d="M 9.53 0.53 L 14.53 5.53 L 13.47 6.59 L 9.75 2.87 L 9.75 13.06 L 8.25 13.06 L 8.25 2.87 L 4.53 6.59 L 3.47 5.53 L 8.47 0.53 L 9 0 Z M 1 13.06 L 1 15.56 C 1 16.388 1.672 17.06 2.5 17.06 L 15.5 17.06 C 16.328 17.06 17 16.388 17 15.56 L 17 13.06 L 15.5 13.06 L 15.5 15.56 L 2.5 15.56 L 2.5 13.06 Z"
						fill={strokeColor}
					/>
				</g>
			),
		},
	],
	[
		'download',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="m10.75 12.19 3.72-3.72 1.06 1.06-5 5-.53.53-.53-.53-5-5 1.06-1.06 3.72 3.72V2h1.5v10.19ZM2 14v2.5A1.5 1.5 0 0 0 3.5 18h13a1.5 1.5 0 0 0 1.5-1.5V14h-1.5v2.5h-13V14H2Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'check circle',
		{
			line: ({ strokeColor, stroke }: IconRenderProps) => (
				<>
					<circle
						cx="10"
						cy="10"
						r="8.25"
						fill="none"
						stroke={strokeColor}
						strokeWidth={stroke}
					/>
					<polyline
						points="6.66 9.94 9.05 12.06 13.26 7.86"
						strokeWidth={stroke}
						stroke={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'share',
		{
			line: ({ stroke, strokeColor, fillColor }: IconRenderProps) => (
				<path
					d="M11 7c-5.063 0-8 4.03-8 9 1.222-1.2 3-3 8-3v3l6-6-6-6v3Z"
					stroke={strokeColor}
					strokeWidth={stroke}
					fill={strokeColor}
					fillOpacity={fillColor}
				/>
			),
		},
	],
	[
		'search',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<>
					<path
						d="M 10 9 C 10 9.552 9.552 10 9 10 C 8.448 10 8 9.552 8 9 C 8 8.448 8.448 8 9 8 C 9.552 8 10 8.448 10 9 Z"
						fill={strokeColor}
					/>
					<path
						d="M 18.53 17.47 L 17.47 18.531 L 13.392 14.451 C 10.495 16.785 6.278 16.445 3.793 13.677 C 1.307 10.909 1.42 6.681 4.051 4.05 C 6.682 1.419 10.91 1.306 13.678 3.792 C 16.446 6.277 16.786 10.494 14.452 13.391 Z M 9 14.5 C 12.038 14.5 14.5 12.038 14.5 9 C 14.5 5.962 12.038 3.5 9 3.5 C 5.962 3.5 3.5 5.962 3.5 9 C 3.5 12.038 5.962 14.5 9 14.5 Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'x',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<g transform="translate(1 1)">
					<path d="M 0 0 L 18 0 L 18 18 L 0 18 Z" fill="transparent" />
					<path
						d="M 7.94 9 L 3.47 13.47 L 4.53 14.53 L 9 10.06 L 13.47 14.53 L 14.53 13.47 L 10.06 9 L 14.53 4.53 L 13.47 3.47 L 9 7.94 L 4.53 3.47 L 3.47 4.53 Z"
						fill={strokeColor}
					/>
				</g>
			),
		},
	],
	[
		'plus',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 9.25 10.75 L 9.25 16 L 10.75 16 L 10.75 10.75 L 16 10.75 L 16 9.25 L 10.75 9.25 L 10.75 4 L 9.25 4 L 9.25 9.25 L 4 9.25 L 4 10.75 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'circle',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 1 10 C 1 5.029 5.029 1 10 1 C 14.971 1 19 5.029 19 10 C 19 14.971 14.971 19 10 19 C 5.029 19 1 14.971 1 10 Z M 10 17.5 C 14.142 17.5 17.5 14.142 17.5 10 C 17.5 5.858 14.142 2.5 10 2.5 C 5.858 2.5 2.5 5.858 2.5 10 C 2.5 14.142 5.858 17.5 10 17.5 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'circle fill',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 1 10 C 1 5.029 5.029 1 10 1 C 14.971 1 19 5.029 19 10 C 19 14.971 14.971 19 10 19 C 5.029 19 1 14.971 1 10 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'plus circle',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<>
					<path
						d="M 1 10 C 1 5.029 5.029 1 10 1 C 14.971 1 19 5.029 19 10 C 19 14.971 14.971 19 10 19 C 5.029 19 1 14.971 1 10 Z M 10 17.5 C 14.142 17.5 17.5 14.142 17.5 10 C 17.5 5.858 14.142 2.5 10 2.5 C 5.858 2.5 2.5 5.858 2.5 10 C 2.5 14.142 5.858 17.5 10 17.5 Z"
						fill={strokeColor}
					/>
					<path
						d="M 10.75 9.25 L 14 9.25 L 14 10.75 L 10.75 10.75 L 10.75 14 L 9.25 14 L 9.25 10.75 L 6 10.75 L 6 9.25 L 9.25 9.25 L 9.25 6 L 10.75 6 Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'chevron down',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<path d="m5 8 5 5 5-5" stroke={strokeColor} strokeWidth={stroke} />
			),
		},
	],
	[
		'chevron up',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<path d="m15 12-5-5-5 5" stroke={strokeColor} strokeWidth={stroke} />
			),
		},
	],
	[
		'checkbox checked',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M3.5 2A1.5 1.5 0 0 0 2 3.5v13A1.5 1.5 0 0 0 3.5 18h13a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 2h-13Zm9.47 4.97L9 10.94 7.03 8.97l-1.06 1.06 2.5 2.5.53.53.53-.53 4.5-4.5-1.06-1.06Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'checkbox',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<rect
					x="2.75"
					y="2.75"
					width="14.5"
					height="14.5"
					rx=".75"
					stroke={strokeColor}
					strokeWidth={stroke}
				/>
			),
		},
	],
	[
		'checkbox partial',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<>
					<rect
						x="2"
						y="2"
						width="16"
						height="16"
						rx="1.5"
						stroke={strokeColor}
						strokeWidth={stroke}
					/>
					<path d="M14 10H6" stroke={strokeColor} strokeWidth={stroke} />
				</>
			),
		},
	],
	[
		'search',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M9 14.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Zm5.452-1.109a7 7 0 1 0-1.06 1.06l4.078 4.08 1.06-1.061-4.078-4.079ZM10 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'filter',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M2 4.25h16v1.5H2v-1.5Zm3 5h10v1.5H5v-1.5Zm7 5H8v1.5h4v-1.5Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'more',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					d="M 4 11.5 C 3.31 11.5 2.75 10.94 2.75 10.25 C 2.75 9.56 3.31 9 4 9 C 4.69 9 5.25 9.56 5.25 10.25 C 5.25 10.94 4.69 11.5 4 11.5 Z M 10 11.5 C 9.31 11.5 8.75 10.94 8.75 10.25 C 8.75 9.56 9.31 9 10 9 C 10.69 9 11.25 9.56 11.25 10.25 C 11.25 10.94 10.69 11.5 10 11.5 Z M 14.75 10.25 C 14.75 10.94 15.31 11.5 16 11.5 C 16.69 11.5 17.25 10.94 17.25 10.25 C 17.25 9.56 16.69 9 16 9 C 15.31 9 14.75 9.56 14.75 10.25 Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'people',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<>
					<g clipPath="url(#a)">
						<path
							d="M11 18v.75V18Zm.003 0v.75V18ZM10 18h-.75v.75H10V18Zm8-4.124.656.364.094-.17v-.194H18Zm-7 4.874h.002v-1.5H11v1.5Zm-1 0h1v-1.5h-1v1.5Zm-.75-6.25V18h1.5v-5.5h-1.5Zm1.25-1.25c-.69 0-1.25.56-1.25 1.25h1.5a.25.25 0 0 1-.25.25v-1.5Zm7 0h-7v1.5h7v-1.5Zm1.25 1.25c0-.69-.56-1.25-1.25-1.25v1.5a.25.25 0 0 1-.25-.25h1.5Zm0 1.376V12.5h-1.5v1.376h1.5Zm-7.747 4.874a8.748 8.748 0 0 0 7.653-4.51l-1.312-.728a7.248 7.248 0 0 1-6.342 3.738v1.5Z"
							fill={strokeColor}
						/>
						<path
							d="M9 18v.75V18Zm-.004 0v.75V18ZM10 18h.75v.75H10V18ZM2 9.5h-.75H2Zm0 4.376-.656.364-.094-.17v-.194H2Zm7 4.874h-.004v-1.5H9v1.5Zm1 0H9v-1.5h1v1.5Zm.75-9.25V18h-1.5V9.5h1.5ZM9.5 8.25c.69 0 1.25.56 1.25 1.25h-1.5c0 .138.112.25.25.25v-1.5Zm-7 0h7v1.5h-7v-1.5ZM1.25 9.5c0-.69.56-1.25 1.25-1.25v1.5a.25.25 0 0 0 .25-.25h-1.5Zm0 4.376V9.5h1.5v4.376h-1.5Zm7.746 4.874a8.748 8.748 0 0 1-7.652-4.51l1.312-.728a7.248 7.248 0 0 0 6.34 3.738v1.5Z"
							fill={strokeColor}
						/>
						<circle
							cx="6"
							cy="4"
							r="2"
							stroke={strokeColor}
							strokeWidth={stroke}
						/>
						<circle
							cx="14"
							cy="6"
							r="2"
							stroke={strokeColor}
							strokeWidth={stroke}
						/>
					</g>
					<defs>
						<clipPath id="a">
							<path fill="#fff" transform="translate(1 1)" d="M0 0h18v18H0z" />
						</clipPath>
					</defs>
				</>
			),
		},
	],
	[
		'wand',
		{
			line: ({ strokeColor }) => (
				<g transform="scale(0.833333)">
					<path d="M 0 0 L 24 0 L 24 24 L 0 24 Z" fill="transparent" />
					<path
						d="M 8.599 9.902 C 8.429 9.902 8.303 9.775 8.276 9.594 C 7.972 7.018 7.846 6.954 5.256 6.528 C 5.059 6.491 4.934 6.392 4.934 6.201 C 4.934 6.011 5.059 5.902 5.221 5.875 C 7.828 5.376 7.972 5.385 8.276 2.808 C 8.303 2.627 8.429 2.5 8.599 2.5 C 8.778 2.5 8.904 2.627 8.922 2.799 C 9.253 5.412 9.343 5.494 11.978 5.875 C 12.139 5.893 12.264 6.02 12.264 6.201 C 12.264 6.383 12.139 6.491 11.978 6.528 C 9.343 7.036 9.262 7.036 8.922 9.612 C 8.904 9.775 8.778 9.902 8.599 9.902 Z M 5.265 21.187 C 4.862 21.604 4.181 21.604 3.796 21.187 C 3.401 20.761 3.401 20.108 3.796 19.699 L 12.847 10.51 C 13.25 10.102 13.931 10.102 14.317 10.51 C 14.72 10.936 14.711 11.599 14.317 12.007 Z M 17.794 18.157 C 17.659 18.157 17.588 18.066 17.552 17.949 C 17.229 16.116 17.22 16.007 15.302 15.663 C 15.168 15.644 15.087 15.554 15.087 15.418 C 15.087 15.282 15.177 15.209 15.302 15.173 C 17.211 14.846 17.22 14.728 17.552 12.896 C 17.579 12.769 17.659 12.678 17.794 12.678 C 17.928 12.678 18 12.778 18.036 12.896 C 18.358 14.728 18.367 14.837 20.285 15.173 C 20.41 15.2 20.5 15.282 20.5 15.418 C 20.5 15.554 20.401 15.635 20.285 15.663 C 18.376 15.998 18.367 16.116 18.036 17.949 C 18.009 18.076 17.928 18.157 17.794 18.157 Z M 17.794 8.941 C 17.659 8.941 17.588 8.841 17.552 8.723 C 17.229 6.891 17.22 6.782 15.302 6.446 C 15.177 6.419 15.087 6.337 15.087 6.201 C 15.087 6.065 15.186 5.983 15.302 5.956 C 17.211 5.621 17.22 5.503 17.552 3.67 C 17.579 3.543 17.659 3.462 17.794 3.462 C 17.928 3.462 18 3.552 18.036 3.67 C 18.358 5.503 18.367 5.611 20.285 5.956 C 20.41 5.974 20.5 6.065 20.5 6.201 C 20.5 6.337 20.401 6.41 20.285 6.446 C 18.376 6.773 18.367 6.891 18.036 8.723 C 18.009 8.85 17.928 8.941 17.794 8.941 Z"
						fill={strokeColor}
					/>
				</g>
			),
		},
	],
	[
		'wallet',
		{
			line: ({ stroke, strokeColor, coverUp }: IconRenderProps) => (
				<>
					<path
						d="M 7 8 C 7.552 8 8 8.448 8 9 C 8 9.552 7.552 10 7 10 C 6.448 10 6 9.552 6 9 C 6 8.448 6.448 8 7 8 Z"
						fill={strokeColor}
					/>
					<path
						d="M 15.5 2 L 2.5 2 C 2.224 2 2 2.224 2 2.5 L 2 15.5 C 2 15.776 2.224 16 2.5 16 L 15.5 16 C 15.776 16 16 15.776 16 15.5 L 16 2.5 C 16 2.224 15.776 2 15.5 2 Z"
						fill="transparent"
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeMiterlimit="10"
						strokeDasharray=""
					/>
					<path
						d="M 17 10.6 L 17 7.4 C 17 7.179 16.821 7 16.6 7 L 13 7 C 11.895 7 11 7.895 11 9 C 11 10.105 11.895 11 13 11 L 16.6 11 C 16.821 11 17 10.821 17 10.6 Z"
						fill={coverUp}
						strokeWidth={stroke}
						stroke={strokeColor}
						strokeMiterlimit="10"
						strokeDasharray=""
					/>
				</>
			),
		},
	],
	[
		'invoice',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M12.5 5.5v-3h-8v15h11v-12h-3Zm3 13.5h-11A1.5 1.5 0 0 1 3 17.5v-15A1.5 1.5 0 0 1 4.5 1h8A1.5 1.5 0 0 1 14 2.5V4h1.5A1.5 1.5 0 0 1 17 5.5v12a1.5 1.5 0 0 1-1.5 1.5Zm-5-4.25H6v-1.5h4.5v1.5Zm-4.5-4h4.5v-1.5H6v1.5Zm8-.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'payment',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M2.5 4.5h15v2.75h-15V4.5Zm0 4.25v6.75h15V8.75h-15ZM17.5 3h-15A1.5 1.5 0 0 0 1 4.5v11A1.5 1.5 0 0 0 2.5 17h15a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 17.5 3ZM14 13a1 1 0 1 0 2 0 1 1 0 0 0-2 0Zm-2 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'heart',
		{
			line: ({ stroke, strokeColor }: IconRenderProps) => (
				<>
					<g clipPath="url(#a)">
						<path d="M11 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" fill={strokeColor} />
						<path
							d="M2 7c0 6 8 11 8 11s8-5 8-11c0-3-1.79-5-4-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4C3.79 2 2 4 2 7Z"
							stroke={strokeColor}
							strokeWidth={stroke}
						/>
					</g>
					<defs>
						<clipPath id="a">
							<path
								fill="transparent"
								transform="translate(1 1)"
								d="M0 0h18v18H0z"
							/>
						</clipPath>
					</defs>
				</>
			),
		},
	],
	[
		'clock',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<>
					<path d="M 1 1 L 19 1 L 19 19 L 1 19 Z" fill="transparent" />
					<path
						d="M 10.75 5 L 10.75 9.69 L 13.53 12.47 L 12.47 13.53 L 9.47 10.53 L 9.25 10.31 L 9.25 5 Z"
						fill={strokeColor}
					/>
					<path
						d="M 19 10 C 19 14.971 14.971 19 10 19 C 5.029 19 1 14.971 1 10 C 1 5.029 5.029 1 10 1 C 14.971 1 19 5.029 19 10 Z M 10 2.5 C 5.858 2.5 2.5 5.858 2.5 10 C 2.5 14.142 5.858 17.5 10 17.5 C 14.142 17.5 17.5 14.142 17.5 10 C 17.5 5.858 14.142 2.5 10 2.5 Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
	[
		'book',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M2 3.25h-.75v13.5H7A2.25 2.25 0 0 1 9.25 19h1.5A2.25 2.25 0 0 1 13 16.75h5.75V3.25H13a3.744 3.744 0 0 0-3 1.5 3.744 3.744 0 0 0-3-1.5H2ZM9.25 7A2.25 2.25 0 0 0 7 4.75H2.75v10.5H7c.844 0 1.623.279 2.25.75V7Zm1.5 9a3.734 3.734 0 0 1 2.25-.75h4.25V4.75H13A2.25 2.25 0 0 0 10.75 7v9Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'sparkle',
		{
			line: ({ strokeColor, fillColor }: IconRenderProps) => (
				<>
					<path
						d="M10.5 2h.5a7 7 0 0 0 7 7v2a7 7 0 0 0-7 7H9a7 7 0 0 0-7-7V9a7 7 0 0 0 7-7h1.5ZM10 4.88A8.525 8.525 0 0 0 15.12 10 8.525 8.525 0 0 0 10 15.12 8.525 8.525 0 0 0 4.88 10 8.524 8.524 0 0 0 10 4.88Z"
						fill={strokeColor}
						fillOpacity={fillColor}
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M10.5 2h.5a7 7 0 0 0 7 7v2a7 7 0 0 0-7 7H9a7 7 0 0 0-7-7V9a7 7 0 0 0 7-7h1.5ZM10 4.88A8.525 8.525 0 0 0 15.12 10 8.525 8.525 0 0 0 10 15.12 8.525 8.525 0 0 0 4.88 10 8.524 8.524 0 0 0 10 4.88ZM17 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM5 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
						fill={strokeColor}
					/>
					<path d="M17 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" fill={strokeColor} />
					<path d="M5 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" fill={strokeColor} />
				</>
			),
		},
	],
	[
		'inbox',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M2.5 4.5h15v4.75h-5.25V10a2.25 2.25 0 0 1-4.5 0v-.75H2.5V4.5Zm0 6.25v4.75h15v-4.75h-3.825a3.751 3.751 0 0 1-7.35 0H2.5ZM17.5 3h-15A1.5 1.5 0 0 0 1 4.5v11A1.5 1.5 0 0 0 2.5 17h15a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 17.5 3Z"
					fill={strokeColor}
				/>
			),
		},
	],
	[
		'home',
		{
			line: ({ strokeColor }: IconRenderProps) => (
				<>
					<path
						d="M 10 13 C 10.552 13 11 12.552 11 12 C 11 11.448 10.552 11 10 11 C 9.448 11 9 11.448 9 12 C 9 12.552 9.448 13 10 13 Z"
						fill={strokeColor}
					/>
					<path
						d="M 2 9 L 10 1 L 18 9 L 18 16.5 C 18 17.328 17.328 18 16.5 18 L 3.5 18 C 2.672 18 2 17.328 2 16.5 Z M 16.5 16.5 L 16.5 9.621 L 10 3.121 L 3.5 9.621 L 3.5 16.5 Z"
						fill={strokeColor}
					/>
				</>
			),
		},
	],
]);
