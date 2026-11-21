import { Slider } from '@apple-pie/slice';
import { tintFromColor } from '@apple-pie/slice/utils';
import { useState } from 'react';
import { Block, Row } from '../Shared';

export function TintExample() {
	const [percent, setPercent] = useState(15);
	const color = tintFromColor('#5c75df', percent);
	return (
		<Block title="Find the right shade" caption="TINT FROM COLOR">
			<div
				aria-label="Tint preview"
				style={{ width: '100%', height: 100, borderRadius: 'var(--corner-m)', background: color }}
			/>
			<Row>
				<span>Tint</span>
				<span>{percent}%</span>
			</Row>
			<Slider
				aria-label="Tint percentage"
				min={-50}
				max={50}
				step={1}
				value={percent}
				trackColor="core-outline-primary"
				onChange={(value) => setPercent(Math.round(value))}
			/>
		</Block>
	);
}
