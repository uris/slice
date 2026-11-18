export const elevationComparisonCode = `
import { FlexBox } from '@apple-pie/slice';

export function ElevationComparison() {
    return (
        <FlexBox
            direction="row"
            width="fit"
            gap={64}
            padding={48}
            overflow="visible"
            background="core-fill-primary"
            borderRadius="var(--corner-xxl)"
        >
            <FlexBox
                width={96}
                height={96}
                borderRadius="var(--corner-xxl)"
                background="core-blue"
                elevation={0}
            />
            <FlexBox
                width={96}
                height={96}
                borderRadius="var(--corner-xxl)"
                background="core-blue"
                elevation={5}
            />
        </FlexBox>
    );
}
`;

export const elevationAnimationCode = `
import { FlexBox, motionValues } from '@apple-pie/slice';
import { useState } from 'react';

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
						key={\`box.\${
							// biome-ignore lint/suspicious/noArrayIndexKey: demo
							index
						}\`}
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
`;

export const elevationVariableCode = `
.panel {
  box-shadow: var(--elevation-2);
}

.panel:hover {
  box-shadow: var(--elevation-3);
}
`;

export const elevationClassCode = `
import '@apple-pie/slice/styles.css';
import { ThemeProvider } from '@apple-pie/slice';

export function Surfaces() {
  return (
    <ThemeProvider>
      <div className="elevation-0">Flat surface</div>
      <div className="elevation-3">Raised surface</div>
    </ThemeProvider>
  );
}
`;
