import type { SliceTheme, ToolTip } from 'src';

export interface ColorTileProps {
	token?: string;
	core?: string;
	hex?: string;
	width?: number;
	height?: number;
	onCopy?: (token: string, hex: string) => void;
	onTooltip?: (tip: ToolTip | null) => void;
}

export interface ColorTileGroupProps {
	pattern?: string | string[];
	theme?: SliceTheme;
}
