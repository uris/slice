import { useCallback, useRef, useState } from 'react';
import { FlexDiv, Tip, Toast, type ToolTip, useToolTip } from 'src';
import { coreColors, dark, light } from '../../../src/theme/colors/colors';
import { ColorTile } from '../ColorTile/ColorTile';

type ColorMap = Record<string, string>;

type ColorGroup = {
	key: string;
	values: Array<{ key: string; value: string }>;
};

function groupColors(colors: ColorMap): ColorGroup[] {
	const grouped = new Map<string, Array<{ key: string; value: string }>>();

	for (const [key, value] of Object.entries(colors)) {
		const match = key.match(/^(brand|product)-[a-z]+-/i);
		const bucket = match ? match[0].slice(0, -1) : 'Special';
		if (!grouped.has(bucket)) grouped.set(bucket, []);
		grouped.get(bucket)?.push({ key, value });
	}

	return Array.from(grouped.entries()).map(([key, values]) => ({
		key,
		values,
	}));
}

function getReferencedBrandColors(themeColors: ColorMap): ColorMap {
	// Build lookup from core value -> core token keys.
	const valueToBrandKeys = new Map<string, string[]>();
	for (const [key, value] of Object.entries(coreColors)) {
		const current = valueToBrandKeys.get(value) ?? [];
		current.push(key);
		valueToBrandKeys.set(value, current);
	}

	const referencedBrandKeys = new Set<string>();
	for (const value of Object.values(themeColors)) {
		const keys = valueToBrandKeys.get(value);
		if (!keys) continue;
		for (const key of keys) referencedBrandKeys.add(key);
	}

	// Keep coreColors declaration order for stable display.
	const filtered: ColorMap = {};
	for (const [key, value] of Object.entries(coreColors)) {
		if (!referencedBrandKeys.has(key)) continue;
		filtered[key] = value;
	}
	return filtered;
}

function ReferencedBrandColors(props: Readonly<{ mode: 'light' | 'dark' }>) {
	const [tip, setTip] = useState<ToolTip | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const tipRef = useRef<HTMLDivElement>(null);
	const coords = useToolTip(tip, tipRef);
	const { mode } = props;
	const modeColors = mode === 'light' ? light : dark;
	const groupedColors = groupColors(getReferencedBrandColors(modeColors));

	const handleCopy = useCallback((token: string, hex: string) => {
		setMessage('Copied to clipboard');
	}, []);

	const handleToolTip = useCallback((tip: ToolTip | null) => {
		setTip(tip);
	}, []);

	return (
		<FlexDiv width={'fill'} height={'fit'} gap={16} justify={'start'} align={'start'} scrollY padding={'0 0 32px 0'}>
			{groupedColors.map((group) => (
				<FlexDiv width={'fill'} height={'fit'} direction={'column'} key={group.key}>
					<h3 style={{ textTransform: 'capitalize' }}>{group.key}</h3>
					<FlexDiv width={'fill'} height={'fit'} direction={'row'} wrap={true} gap={16}>
						{group.values.map((color) => (
							<ColorTile
								token={color.key}
								hex={color.value}
								key={color.key}
								onCopy={handleCopy}
								onTooltip={handleToolTip}
							/>
						))}
					</FlexDiv>
				</FlexDiv>
			))}
			<Tip ref={tipRef} coords={coords} tip={tip} />
			<Toast message={message} didHide={() => setMessage(null)} close={false} />
		</FlexDiv>
	);
}

export function LightModeBrandColors() {
	return <ReferencedBrandColors mode={'light'} />;
}

export function DarkModeBrandColors() {
	return <ReferencedBrandColors mode={'dark'} />;
}
