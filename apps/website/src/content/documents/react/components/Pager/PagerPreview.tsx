'use client';

import { Code } from '@/components/Type/Type';
import { IconButton, Pager, type PagerProps } from '@apple-pie/slice';
import { useState } from 'react';

type PagerPreviewProps = Pick<PagerProps, 'pages' | 'maxVisiblePages' | 'scaleFactor' | 'opacityScales' | 'transition'>;

export function PagerPreview({
	pages = 5,
	maxVisiblePages,
	scaleFactor,
	opacityScales,
	transition,
}: Readonly<PagerPreviewProps>) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const cycle = (direction: number) => setSelectedIndex((index) => (index + direction + pages) % pages);
	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
				<IconButton
					icon="arrow left"
					actionName="Previous page"
					buttonSize="s"
					iconSize={16}
					backgroundColor="transparent"
					backgroundColorHover="core-surface-primary"
					onClick={() => cycle(-1)}
				/>
				<Pager
					pages={pages}
					selectedIndex={selectedIndex}
					onChange={setSelectedIndex}
					maxVisiblePages={maxVisiblePages}
					scaleFactor={scaleFactor}
					opacityScales={opacityScales}
					transition={transition}
				/>
				<IconButton
					icon="arrow right"
					actionName="Next page"
					buttonSize="s"
					iconSize={16}
					backgroundColor="transparent"
					backgroundColorHover="core-surface-primary"
					onClick={() => cycle(1)}
				/>
			</div>
			{maxVisiblePages !== undefined && <Code>{`selectedIndex: ${selectedIndex} of ${pages - 1}`}</Code>}
		</div>
	);
}
