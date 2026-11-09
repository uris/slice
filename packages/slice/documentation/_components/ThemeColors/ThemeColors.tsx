import { useCallback, useRef, useState } from 'react';
import { FlexDiv, Tip, Toast, type ToolTip, useToolTip } from 'src';
import { coreColors, dark, light } from '../../../src/theme/colors/colors';
import { coreGreyRecipes } from '../../../src/theme/colors/palette';
import { neutralThemeRecipes } from '../../../src/theme/colors/recipes';
import { ColorTile } from '../ColorTile/ColorTile';

type ColorMap = Record<string, string>;

type ColorGroup = {
	key: string;
	values: Array<{ key: string; value: string }>;
};

function groupColors(colors: ColorMap): ColorGroup[] {
	const grouped = new Map<string, Array<{ key: string; value: string }>>();

	for (const [key, value] of Object.entries(colors)) {
		const match = key.match(/^(?:core|brand)-[a-z]+-\d+$/i);
		const bucket = match ? key.replace(/-\d+$/, '') : 'Special';
		if (!grouped.has(bucket)) grouped.set(bucket, []);
		grouped.get(bucket)?.push({ key, value });
	}

	return Array.from(grouped.entries()).map(([key, values]) => ({
		key,
		values,
	}));
}

function getReferencedCoreColors(themeColors: ColorMap, mode: 'light' | 'dark'): ColorMap {
	// Build lookup from core value -> core token keys.
	const valueToCoreKeys = new Map<string, string[]>();
	for (const [key, value] of Object.entries(coreColors)) {
		const current = valueToCoreKeys.get(value) ?? [];
		current.push(key);
		valueToCoreKeys.set(value, current);
	}

	const referencedCoreKeys = new Set<string>();
	for (const [token, recipe] of Object.entries(neutralThemeRecipes)) {
		if (token in themeColors) referencedCoreKeys.add(coreGreyRecipes[recipe][mode].token);
	}
	for (const value of Object.values(themeColors)) {
		const keys = valueToCoreKeys.get(value);
		if (!keys) continue;
		for (const key of keys) referencedCoreKeys.add(key);
	}

	// Keep coreColors declaration order for stable display.
	const filtered: ColorMap = {};
	for (const [key, value] of Object.entries(coreColors)) {
		if (!referencedCoreKeys.has(key)) continue;
		filtered[key] = value;
	}
	return filtered;
}

function ReferencedCoreColors(props: Readonly<{ mode: 'light' | 'dark' }>) {
	const [tip, setTip] = useState<ToolTip | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const tipRef = useRef<HTMLDivElement>(null);
	const coords = useToolTip(tip, tipRef);
	const { mode } = props;
	const modeColors = mode === 'light' ? light : dark;
	const groupedColors = groupColors(getReferencedCoreColors(modeColors, mode));

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
			<Toast message={message} onHide={() => setMessage(null)} close={false} />
		</FlexDiv>
	);
}

export function LightModeCoreColors() {
	return <ReferencedCoreColors mode={'light'} />;
}

export function DarkModeCoreColors() {
	return <ReferencedCoreColors mode={'dark'} />;
}
