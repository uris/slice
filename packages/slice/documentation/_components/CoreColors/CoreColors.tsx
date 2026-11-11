import { useCallback, useRef, useState } from 'react';
import { FlexBox, Tip, Toast, type ToolTip, useToolTip } from 'src';
import { coreColors } from '../../../src/theme/colors/colors';
import { corePaletteAnchors } from '../../../src/theme/colors/palette';
import { ColorTile } from '../ColorTile/ColorTile';

export function CoreColors() {
	const [tip, setTip] = useState<ToolTip | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const tipRef = useRef<HTMLDivElement>(null);
	const coords = useToolTip(tip, tipRef);
	type ColorMap = Record<string, string>;

	type ColorGroup = {
		key: string;
		values: Array<{ key: string; value: string }>;
	};

	function groupColors(colors: ColorMap): ColorGroup[] {
		const grouped = new Map<string, Array<{ key: string; value: string }>>();

		for (const [key, value] of Object.entries(colors)) {
			const match = /^(?:core|brand)-[a-z]+-\d+$/i.exec(key);
			const bucket = match ? key.replace(/-\d+$/, '') : 'Special';

			if (!grouped.has(bucket)) grouped.set(bucket, []);
			grouped.get(bucket)?.push({ key, value });
		}

		return Array.from(grouped.entries()).map(([key, values]) => ({
			key,
			values,
		}));
	}

	const groupedColors = groupColors(coreColors);
	function getAnchorLabel(token: string) {
		const match = /^core-([a-z]+)-(\d+)$/.exec(token);
		if (!match) return undefined;
		const anchor = corePaletteAnchors[match[1] as keyof typeof corePaletteAnchors];
		if (!anchor) return undefined;
		if (Number(match[2]) === anchor.light) return 'Light accent';
		if (Number(match[2]) === anchor.dark) return 'Dark accent';
		return undefined;
	}

	const handleCopy = useCallback((token: string, hex: string) => {
		setMessage('Copied to clipboard');
	}, []);

	const handleToolTip = useCallback((tip: ToolTip | null) => {
		setTip(tip);
	}, []);

	return (
		<FlexBox width={'fill'} height={'fit'} gap={16} justify={'start'} align={'start'} scrollY padding={'0 0 32px 0'}>
			{groupedColors.map((group) => {
				return (
					<FlexBox width={'fill'} height={'fit'} direction={'column'} key={group.key}>
						<h3 style={{ textTransform: 'capitalize' }}>{group.key}</h3>
						<FlexBox width={'fill'} height={'fit'} direction={'row'} wrap={true} gap={16}>
							{group.values.map((color) => {
								return (
									<ColorTile
										token={color.key}
										hex={color.value}
										core={getAnchorLabel(color.key)}
										key={color.key}
										onCopy={handleCopy}
										onTooltip={handleToolTip}
									/>
								);
							})}
						</FlexBox>
					</FlexBox>
				);
			})}
			<Tip ref={tipRef} coords={coords} tip={tip} />
			<Toast message={message} onHide={() => setMessage(null)} close={false} />
		</FlexBox>
	);
}
