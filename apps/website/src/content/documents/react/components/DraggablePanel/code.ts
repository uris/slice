export const usageCode = `
import {Button, DraggablePanel, FlexBox, Preset} from '@apple-pie/slice';
import {useRef, useState} from 'react';

export function ProjectWorkspace({edge = 'right'}: Readonly<{ edge?: 'left' | 'right' }>) {
    const dragConstraints = {
        initial: 300, // Start at 300px.
        min: 200, // Stop shrinking at 200px.
        max: 0.8, // Grow up to 80% of the container width.
    };
    const containerRef = useRef<HTMLDivElement>(null);
    const [closed, setClosed] = useState(false);
    return (
        <FlexBox
            width={'100%'}
            direction={'row'}
            height={300}
            ref={containerRef}
            borderRadius={24}
            border={'1px solid var(--core-fill-primary)'}
            style={{overflow: 'hidden', margin: "24px 0 0 0"}}
        >
            <DraggablePanel
                containerRef={containerRef}
                isClosed={closed}
                drags={edge}
                style={{order: edge === 'left' ? 1 : 0}}
                sizeConstraints={dragConstraints}
                backgroundColor="core-fill-primary"
                resizeHandleLabel="Resize project sidebar"
            >
                <FlexBox preset={Preset.FillCenter} padding={24} style={{minWidth: dragConstraints.min}}>
                    <span>Panel A</span>
                </FlexBox>
            </DraggablePanel>
            <FlexBox preset={Preset.FillCenter} flex={1} padding={24}>
                <Button onClick={() => setClosed(!closed)}>{closed ? 'Open Panel A' : 'Close Panel A'}</Button>
            </FlexBox>
        </FlexBox>
    );
}


`;

export const constraintsCode = `
// Absolute widths in pixels.
const pixels = { initial: 240, min: 180, max: 320 };

// Percentages: start at 40%, with a range of 25% to 70%.
const percentages = { initial: 0.4, min: 0.25, max: 0.7 };

// Mixed: start at 300px, with a 200px minimum and an 80% maximum.
const mixed = { initial: 300, min: 200, max: 0.8 };
`;

export const constraintsExampleCode = `
import { Button, DraggablePanel, type DraggablePanelProps, FlexBox, Preset } from '@apple-pie/slice';
import { useRef, useState } from 'react';

function ConstraintRow({label, constraints}: {label: string; constraints: DraggablePanelProps['sizeConstraints']}) {
    const containerRef = useRef<HTMLDivElement>(null);
    return <div style={{display: 'grid', gap: 8}}>
        <span>{label}</span>
        <FlexBox ref={containerRef} direction="row" height={100} width="100%" style={{border: '1px solid var(--core-outline-primary)'}}>
            <DraggablePanel isClosed={false} containerRef={containerRef} sizeConstraints={constraints}
                backgroundColor="core-fill-primary" resizeHandleLabel={\`Resize \${label.toLowerCase()}\`}>
                <FlexBox preset={Preset.FillCenter}>Panel</FlexBox>
            </DraggablePanel>
            <FlexBox preset={Preset.FillCenter} flex={1} style={{minWidth: 0}}>Content</FlexBox>
        </FlexBox>
    </div>;
}

export function ConstraintComparison() {
    const [narrow, setNarrow] = useState(false);
    return <div style={{width: '100%', display: 'grid', gap: 16}}>
        <Button label={narrow ? 'Widen container' : 'Narrow container'} variant="outline" onClick={() => setNarrow(!narrow)}/>
        <div style={{width: narrow ? '70%' : '100%', minWidth: 280, display: 'grid', gap: 20}}>
            <ConstraintRow label="Pixels" constraints={{initial: 240, min: 180, max: 320}}/>
            <ConstraintRow label="Percentages" constraints={{initial: 0.4, min: 0.25, max: 0.7}}/>
        </div>
    </div>;
}

`;
