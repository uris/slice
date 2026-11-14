import { Caption } from '@/components/Type/Type';
import { type ColorValue, type Colors, useTheme } from '@apple-pie/slice';
import { classNames, setStyle } from '@apple-pie/slice/utils';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import type React from 'react';
import { type CSSProperties, useMemo } from 'react';
import { setSizeStyle } from '../../../../../packages/slice/src/utils/functions/misc';
import css from './GradientCanvas.module.css';

export interface GradientCanvasProps {
	children?: React.ReactNode;
	height?: number;
	gradient?: {
		type?: 'radial' | 'linear';
		angle?: number;
		fromColor?: keyof Colors;
		toColor?: keyof Colors;
		opacity?: number;
	};
	mask?: {
		type?: 'radial' | 'linear';
		angle?: number;
		startAt?: number;
		endAt?: number;
		opacity?: number;
	};
	opacity?: number;
	backgroundColor?: ColorValue;
	caption?: string;
	imageSrc?: string | StaticImport;
	imageDescription?: string;
	imageWidth?: number | string;
	padding?: number | string;
}

export function GradientCanvas(props: Readonly<GradientCanvasProps>) {
	const {
		caption,
		children,
		height,
		padding = 24,
		gradient,
		mask,
		opacity = 1,
		backgroundColor = 'transparent',
		imageSrc,
		imageDescription,
		imageWidth = '40%',
	} = props;
	const { current } = useTheme();

	const cssVars = useMemo(() => {
		return {
			'--gc-height': setStyle(height),
			'--gc-opacity': opacity,
			'--gc-background': backgroundColor,
			'--gc-image-width': setSizeStyle(imageWidth),
			'--gc-padding': setSizeStyle(padding),
		} as CSSProperties;
	}, [height, backgroundColor, opacity, imageWidth, padding]);

	const gradientStyle = useMemo((): CSSProperties => {
		const { fromColor, toColor, type, angle, opacity } = gradient ?? {};
		if (!type) return {};
		const from = fromColor ? current.colors[fromColor] : current.colors['core-green'];
		const to = toColor ? current.colors[toColor] : current.colors['core-orange'];
		return {
			background:
				type === 'radial'
					? `radial-gradient(circle at center, ${from} 0%, ${to} 100%)`
					: `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)`,
			opacity,
		} as CSSProperties;
	}, [current.colors, gradient]);

	const maskStyle = useMemo(() => {
		const { startAt, endAt, type, angle } = mask ?? {};
		if (!type) return {};
		const linear = `linear-gradient(${angle}deg, black ${startAt}%, transparent ${endAt}%)`;
		const radial = `radial-gradient(circle, black ${startAt}%, transparent ${endAt}%)`;
		return {
			'-webkit-mask-image': type === 'radial' ? radial : linear,
			'mask-image': type === 'radial' ? radial : linear,
		} as CSSProperties;
	}, [mask]);

	const renderImage = () => {
		if (!imageSrc) return null;
		return (
			<Image
				src={imageSrc}
				alt={imageDescription ?? 'Feature image'}
				quality={80}
				fill={false}
				sizes={'100vw'}
				loading={'eager'}
				preload={true}
				className={css.image}
			/>
		);
	};

	return (
		<div className={css.wrapper} style={cssVars}>
			<div className={classNames(css.container, css.gradient)} style={{ ...gradientStyle, ...maskStyle }} />
			<div className={classNames(css.container, css.pattern)} />
			{caption && (
				<div className={classNames(css.caption)}>
					<Caption style={{ paddingLeft: 0 }}>{caption}</Caption>
				</div>
			)}
			<div className={classNames(css.content)}>{imageSrc ? renderImage() : children}</div>
		</div>
	);
}
