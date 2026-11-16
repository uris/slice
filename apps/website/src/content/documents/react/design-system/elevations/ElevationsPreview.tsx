'use client';

import { Code } from '@/components/Type/Type';
import { FlexBox, motionValues } from '@apple-pie/slice';
import { useState } from 'react';

export function ElevationComparisonPreview() {
	return (
		<FlexBox
			direction="row"
			width="fit"
			height="fit"
			gap={64}
			padding={48}
			overflow="visible"
			background={'core-fill-primary'}
			borderRadius="var(--corner-xxl)"
			margin="24px 0 0 0"
		>
			{([0, 5] as const).map((level) => (
				<FlexBox key={level} width="fit" height="fit" align="center" gap={24} overflow="visible">
					<Code>{`elevation={${level}}`}</Code>
					<FlexBox
						width={96}
						height={96}
						borderRadius="var(--corner-xxl)"
						background={'core-blue'}
						elevation={level}
						role="img"
						aria-label={`Square with elevation ${level}`}
					/>
				</FlexBox>
			))}
		</FlexBox>
	);
}

export function ElevationAnimation() {
	const [elevated, setElevated] = useState<boolean[]>([false, false, false]);
	return (
		<FlexBox
			direction="row"
			width="fit"
			height="fit"
			gap={12}
			layout={true}
			padding={48}
			overflow="visible"
			background={'core-fill-primary'}
			borderRadius="var(--corner-xxl)"
			margin="24px 0 0 0"
		>
			{elevated.map((_, index) => {
				return (
					<FlexBox
						key={`box.${
							// biome-ignore lint/suspicious/noArrayIndexKey: demo
							index
						}`}
						width={96}
						height={96}
						borderRadius="var(--corner-xxl)"
						background={'core-blue'}
						elevation={elevated[index] ? 5 : 0}
						variants={{ raised: { y: -3, scale: 1.05 }, flat: { y: 0, scale: 1 } }}
						animate={elevated[index] ? 'raised' : 'flat'}
						transition={motionValues['transition-water']}
						onMouseEnter={() =>
							setElevated((prev) => {
								return prev.map((value, i) => {
									return index === i;
								});
							})
						}
						onMouseOut={() =>
							setElevated((prev) => {
								return prev.map((value, i) => {
									return false;
								});
							})
						}
						style={{ cursor: 'pointer', zIndex: 2 }}
					/>
				);
			})}
		</FlexBox>
	);
}
