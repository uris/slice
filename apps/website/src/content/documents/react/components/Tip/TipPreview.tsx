'use client';
import { Button, Tip } from '@apple-pie/slice';
import { useState } from 'react';
import styles from '../_shared/LayerPreview.module.css';
export function TipPreview({ interactive = false }: { interactive?: boolean }) {
	const [coords, setCoords] = useState<{ x: number; y: number } | undefined>(
		interactive ? undefined : { x: 24, y: 100 },
	);
	const show = () => setCoords({ x: 24, y: 184 });
	return (
		<div className={styles.stage}>
			{interactive && (
				<Button
					label="Project details"
					onMouseEnter={show}
					onMouseLeave={() => setCoords(undefined)}
					onFocus={show}
					onBlur={() => setCoords(undefined)}
				/>
			)}
			<Tip
				tip={{ payload: { label: 'Your changes are saved automatically.' } }}
				coords={coords}
				showDelay={interactive ? 350 : 0}
				hideDelay={60_000}
			/>
		</div>
	);
}
