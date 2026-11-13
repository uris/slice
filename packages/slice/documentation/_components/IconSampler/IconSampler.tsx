// biome-ignore lint/style/useImportType: <explanation>
import React, { useCallback, useMemo, useState } from 'react';
import { Icon, IconButton, SliceIcons, Slider, TextField } from '../../../src';
import css from './IconSampler.module.css';

interface IconSamplerProps {
	size?: number;
	stroke?: number;
	fill?: boolean;
}

export function IconSampler(props: Readonly<IconSamplerProps>) {
	const { size = 100, fill = false, stroke = 1.25 } = props;
	const [iconSize, setIconSize] = useState<number>(size);
	const [strokeWidth, setStrokeWidth] = useState<number>(stroke);
	const [showFill, setShowFill] = useState<boolean>(fill);
	const [sizeKey, setSizeKey] = useState<string>(crypto.randomUUID());

	const handleIconSizeChange = useCallback((size: number | string) => {
		const newValue = Math.round(size === '' ? 64 : Number(size));
		if (size === '') setSizeKey(crypto.randomUUID());
		setIconSize(newValue);
	}, []);

	const handleIconStrokeWidth = useCallback((width: number | string) => {
		const newValue = width === '' ? 1.25 : Number(width);
		if (width === '') setSizeKey(crypto.randomUUID());
		setStrokeWidth(newValue);
	}, []);

	const cssVars = useMemo(() => {
		return {
			'--icon-size': `${iconSize + 16 * 2}px`,
		} as React.CSSProperties;
	}, [iconSize]);

	const categories = Object.keys(SliceIcons) ?? [];

	return (
		<>
			<div className={css.controls}>
				<Slider
					aria-label="Icon size"
					min={10}
					max={128}
					value={iconSize}
					onChange={(value, _) => setIconSize(value)}
					width={'100%'}
					trackHeadSize={16}
				/>
				<TextField
					inputName="Icon size"
					defaultValue={iconSize.toFixed(0)}
					onBlur={(v) => handleIconSizeChange(v)}
					placeholder={'64'}
					clearButton={null}
					key={`${iconSize}:${sizeKey}`}
					width={75}
					textAlign={'center'}
				/>
				<IconButton
					actionName="Show filled icons"
					icon={'weather.moon'}
					iconDualTone={showFill}
					toggle
					selected={showFill}
					onClick={() => setShowFill(!showFill)}
				/>
				<TextField
					inputName="Icon Stroke"
					defaultValue={'1.25'}
					onBlur={(v) => handleIconStrokeWidth(v)}
					placeholder={'1.25'}
					clearButton={null}
					key={`${strokeWidth}:${sizeKey}`}
					width={75}
					textAlign={'center'}
				/>
			</div>
			{categories
				.toSorted((a, b) => a.localeCompare(b))
				.map((category) => {
					const categoryName = category as keyof typeof SliceIcons;
					const categoryIcons = Object.keys(SliceIcons[categoryName]);
					return (
						<div className={css.category} style={cssVars} key={`category_${category}`}>
							<h3 className={css.categoryTitle}>{category}</h3>
							<div className={css.container}>
								{categoryIcons
									//.toSorted((a, b) => a.localeCompare(b))
									.map((iconKey) => {
										const key = iconKey as keyof (typeof SliceIcons)[typeof categoryName];
										const icon = SliceIcons[categoryName][key];
										return (
											<div className={`${css.wrapper} slice_icon`} key={`slice_icon_${icon}`}>
												<div className={css.icon}>
													<Icon name={icon} stroke={strokeWidth} size={iconSize} dualTone={showFill} />
												</div>
												<div className={css.label}>{icon}</div>
											</div>
										);
									})}
							</div>
						</div>
					);
				})}
		</>
	);
}
