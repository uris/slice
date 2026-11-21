import { Slider } from '@apple-pie/slice';
import { opacityFromColor } from '@apple-pie/slice/utils';
import { useState } from 'react';
import { Block, Row } from '../Shared';

export function OpacityExample() {
	const [opacity, setOpacity] = useState(50);
	return (
		<Block title="A lighter touch" caption="OPACITY FROM COLOR">
			<div style={{ background: 'var(--core-surface-primary)', borderRadius: 'var(--corner-m)', width: '100%' }}>
				<div
					aria-label="Opacity preview"
					style={{ height: 100, borderRadius: 'inherit', background: opacityFromColor('#5c75df', opacity / 100) }}
				/>
			</div>
			<Row>
				<span>Opacity</span>
				<span>{opacity}%</span>
			</Row>
			<Slider
				aria-label="Opacity percentage"
				min={0}
				max={100}
				step={1}
				value={opacity}
				trackColor="core-outline-primary"
				onChange={(value) => setOpacity(Math.round(value))}
			/>
		</Block>
	);
}
