'use client';

import { SquareButton, SquareButtonType } from '@/components/SqaureButton/SquareButton';
import { Caption, SpacerS } from '@/components/Type/Type';
import pattern from '@/src/assets/pattern-canvas.png';
import { surfaceYellow } from '@/src/consts/consts';
import { IconButton, Slider } from '@apple-pie/slice';
import type React from 'react';
import { useMemo, useState } from 'react';
import styles from './ComponentCanvas.module.css';

export type Zoom = {
	min: number;
	max: number;
	initial: number;
};

export interface ComponentCanvasProps {
	name?: string;
	storybookUrl?: string;
	zoom?: Zoom;
	components?: React.ReactNode;
}

export function ComponentCanvas(props: Readonly<ComponentCanvasProps>): React.ReactElement {
	const { name, zoom, components, storybookUrl } = props;
	const { initial, min, max } = zoom ?? { initial: 1, min: 0, max: 2 };
	const [scale, setScale] = useState(initial);
	const patternStyles = useMemo(() => {
		return {
			backgroundImage: `url("${pattern.src}")`,
			backgroundRepeat: 'repeat',
			backgroundSize: `${pattern.width * 0.1}px ${pattern.height * 0.1}px`,
		} as React.CSSProperties;
	}, []);

	const maskStyles = useMemo(() => {
		return {
			background: 'linear-gradient(to top, transparent 0%, var(--core-surface-primary-tint) 70%)',
		} as React.CSSProperties;
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.canvas}>
				{storybookUrl && (
					<div className={styles.storybookLink}>
						<SquareButton
							icon="share"
							label="View on Storybook"
							variant={SquareButtonType.Secondary}
							onClick={() => window.open(storybookUrl, '_blank', 'noopener,noreferrer')}
						/>
					</div>
				)}
				<div className={styles.pattern} style={patternStyles} />
				<div className={styles.mask} style={maskStyles} />
				<div className={styles.content}>
					<div className={styles.preview} style={{ transform: `scale(${scale})` }}>
						{components}
					</div>
				</div>
			</div>
			<SpacerS />
			<div className={styles.footer}>
				<div className={styles.caption}>
					<Caption>{name}</Caption>
				</div>
				<div className={styles.scale}>
					<Caption style={{ padding: 0 }}>Zoom:</Caption>
					<Slider
						value={scale}
						scaleMin={min}
						scaleMax={max}
						step={0.1}
						width={'100%'}
						onChange={setScale}
						progressColor={surfaceYellow}
						headRadius={0}
						trackHeadSize={6}
						trackHeadBorderSize={0}
						trackHeadBorderColor={'var(--core-surface-primary-tint)'}
						headColor={surfaceYellow}
						height={1}
					/>
					<Caption style={{ padding: 0 }}>{Math.round(scale * 100)}%</Caption>
					<IconButton
						icon={'undo'}
						iconSize={20}
						buttonSize={'s'}
						backgroundColor={'transparent'}
						backgroundColorHover={'transparent'}
						disabled={scale === 1}
						onClick={() => setScale(1)}
					/>
				</div>
			</div>
		</div>
	);
}
