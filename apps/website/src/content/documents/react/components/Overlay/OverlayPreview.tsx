'use client';
import { Button, Overlay } from '@apple-pie/slice';
import { useState } from 'react';
import styles from '../_shared/LayerPreview.module.css';

export function OverlayPreview({ opacity = 0, menu = false }: Readonly<{ opacity?: number; menu?: boolean }>) {
	const [show, setShow] = useState(false);
	return (
		<div
			className={styles.stage}
			onKeyDown={(event) => {
				if (event.key === 'Escape') setShow(false);
			}}
		>
			<Button label={show ? 'Click overlay to hide' : 'Show overlay'} onClick={() => setShow(true)} />
			<Overlay position="absolute" show={show} opacity={opacity} onPointerDown={() => setShow(false)} />
		</div>
	);
}
