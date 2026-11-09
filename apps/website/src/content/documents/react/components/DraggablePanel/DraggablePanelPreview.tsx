'use client';

import { Button, DraggablePanel, type DraggablePanelProps, FlexDiv, Preset } from '@apple-pie/slice';
import { useRef, useState } from 'react';

export function DraggablePanelPreview({ edge = 'right' }: Readonly<{ edge?: 'left' | 'right' }>) {
	const dragConstraints = {
		initial: 300, // Start at 300px.
		min: 200, // Stop shrinking at 200px.
		max: 0.8, // Grow up to 80% of the container width.
	};
	const containerRef = useRef<HTMLDivElement>(null);
	const [closed, setClosed] = useState(false);
	return (
		<FlexDiv
			width={'100%'}
			direction={'row'}
			height={300}
			ref={containerRef}
			borderRadius={24}
			border={'1px solid var(--core-fill-primary)'}
			style={{ overflow: 'hidden', margin: '24px 0 0 0' }}
		>
			<DraggablePanel
				containerRef={containerRef}
				isClosed={closed}
				drags={edge}
				style={{ order: edge === 'left' ? 1 : 0 }}
				sizeConstraints={dragConstraints}
				backgroundColor="core-fill-primary"
				resizeHandleLabel="Resize project sidebar"
			>
				<FlexDiv preset={Preset.FillCenter} padding={24} style={{ minWidth: dragConstraints.min }}>
					<span>Panel A</span>
				</FlexDiv>
			</DraggablePanel>
			<FlexDiv preset={Preset.FillCenter} flex={1} padding={24}>
				<Button onClick={() => setClosed(!closed)}>{closed ? 'Open Panel A' : 'Close Panel A'}</Button>
			</FlexDiv>
		</FlexDiv>
	);
}

function ConstraintRow({ label, constraints }: { label: string; constraints: DraggablePanelProps['sizeConstraints'] }) {
	const containerRef = useRef<HTMLDivElement>(null);
	return (
		<div style={{ display: 'grid', gap: 8 }}>
			<span>{label}</span>
			<FlexDiv
				ref={containerRef}
				direction="row"
				height={100}
				width="100%"
				style={{ border: '1px solid var(--core-outline-primary)' }}
			>
				<DraggablePanel
					isClosed={false}
					containerRef={containerRef}
					sizeConstraints={constraints}
					backgroundColor="core-fill-primary"
					resizeHandleLabel={`Resize ${label.toLowerCase()}`}
				>
					<FlexDiv preset={Preset.FillCenter}>Panel</FlexDiv>
				</DraggablePanel>
				<FlexDiv preset={Preset.FillCenter} flex={1} style={{ minWidth: 0 }}>
					Content
				</FlexDiv>
			</FlexDiv>
		</div>
	);
}

export function ConstraintsPreview() {
	const [narrow, setNarrow] = useState(false);
	return (
		<div style={{ width: '100%', display: 'grid', gap: 16 }}>
			<Button
				label={narrow ? 'Widen container' : 'Narrow container'}
				variant="outline"
				onClick={() => setNarrow(!narrow)}
			/>
			<div style={{ width: narrow ? '70%' : '100%', minWidth: 280, display: 'grid', gap: 20 }}>
				<ConstraintRow label="Pixels" constraints={{ initial: 240, min: 180, max: 320 }} />
				<ConstraintRow label="Percentages" constraints={{ initial: 0.4, min: 0.25, max: 0.7 }} />
			</div>
		</div>
	);
}
