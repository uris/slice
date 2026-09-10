// biome-ignore lint/style/useImportType: <explanation>
import React, { useCallback, useMemo, useState } from 'react';
import { Icon, IconButton, SliceIcons, Slider, TextField } from '../../../src';
import css from './IconSampler.module.css';
interface IconSamplerProps {
	size?: number;
	fill?: boolean;
}

export function IconSampler(props: Readonly<IconSamplerProps>) {
	const { size = 100, fill = false } = props;
	const [iconSize, setIconSize] = useState<number>(size);
	const [showFill, setShowFill] = useState<boolean>(fill);
	const [sizeKey, setSizeKey] = useState<string>(crypto.randomUUID());

	const handleIconSizeChange = useCallback((size: number | string) => {
		const newValue = Math.round(size === '' ? 64 : Number(size));
		if (size === '') setSizeKey(crypto.randomUUID());
		setIconSize(newValue);
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
					scaleMin={10}
					scaleMax={128}
					value={iconSize}
					onChange={(value, _) => setIconSize(value)}
					width={'100%'}
					trackHeadSize={16}
				/>
				<TextField
					value={iconSize.toFixed(0)}
					onBlur={(v) => handleIconSizeChange(v)}
					placeholder={'64'}
					clearButton={null}
					key={sizeKey}
					size={{ width: 75 }}
					textAlign={'center'}
				/>
				<IconButton
					icon={'moon full'}
					iconFill={showFill}
					toggle
					isToggled={showFill}
					onClick={() => setShowFill(!showFill)}
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
													<Icon name={icon} size={iconSize} fill={showFill} />
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
