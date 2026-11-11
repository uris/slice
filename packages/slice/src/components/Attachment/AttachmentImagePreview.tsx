'use client';

import { useEffect, useRef, useState } from 'react';
import { FileIcon } from '../FileIcon';
import { ProgressIndicator } from '../Progress';
import styles from './Attachment.module.css';

/** Mount with the source as its key so loading/error state belongs to one URL. */
export function AttachmentImagePreview({ src, iconSize, color }: { src: string; iconSize: number; color: string }) {
	const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
	const mounted = useRef(true);
	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);
	const load = async (image: HTMLImageElement) => {
		try {
			await image.decode();
			if (mounted.current) setStatus('ready');
		} catch {
			if (mounted.current) setStatus('error');
		}
	};
	if (status === 'error')
		return (
			<div className={styles.fileThumbnail}>
				<FileIcon type="image" size={iconSize} decorative />
			</div>
		);
	return (
		<>
			<img
				className={styles.imageThumbnail}
				style={{ opacity: status === 'ready' ? 1 : 0 }}
				src={src}
				alt=""
				loading="lazy"
				decoding="async"
				onLoad={(event) => {
					void load(event.currentTarget);
				}}
				onError={() => setStatus('error')}
			/>
			{status === 'loading' && (
				<div className={styles.previewLoader}>
					<ProgressIndicator decorative inline show size={20} color={color} />
				</div>
			)}
		</>
	);
}
