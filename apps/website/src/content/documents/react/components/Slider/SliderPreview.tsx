'use client';

import { Code } from '@/components/Type/Type';
import { Slider, type SliderProps } from '@apple-pie/slice';
import { useState } from 'react';

type SliderPreviewProps = Pick<
	SliderProps,
	'width' | 'step' | 'disabled' | 'trackHeadOnHover' | 'height' | 'trackHeadSize' | 'trackHeadBorderWidth'
>;

export function SliderPreview(props: Readonly<SliderPreviewProps>) {
	const [value, setValue] = useState(50);
	return (
		<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }}>
			<Slider aria-label="Example value" width={300} value={value} onChange={setValue} {...props} />
			<Code style={{ minWidth: 50, justifyContent: 'flex-end' }}>{Number(value.toFixed(2))}</Code>
		</div>
	);
}
