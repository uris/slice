import { motion } from '@apple-pie/slice';

// Derive the reference from the same tokens as the previews to prevent drift.
export const motionDefinitionsCode = `
import type { SliceMotion } from '@apple-pie/slice/theme';

export const motion: SliceMotion = ${JSON.stringify(motion, null, 2)};
`;

export const springSquareCode = `
import { FlexBox } from '@apple-pie/slice';
import { useState } from 'react';
import './spring-square.css';

export function CssSpringSquare() {
    const [expanded, setExpanded] = useState(false);

    return (
        <FlexBox
            width={96}
            height={96}
            borderRadius="var(--corner-xxl)"
            background="core-blue"
            className={expanded ? 'spring-square expanded' : 'spring-square'}
            onClick={() => setExpanded((value) => !value)}
        />
    );
}

`;

export const springSquareCssCode = `
.spring-square {
    transform: scale(1) rotate(0deg);
    transition: transform var(--motion-spring-duration) var(--motion-spring);
}

.expanded {
    transform: scale(1.2) rotate(90deg);
}
`;

export const motionPropsCode = `
import { Button, Dot, FlexBox } from '@apple-pie/slice';
import { useState } from 'react';

export function ActivityIndicator() {
    const [show, setShow] = useState(false);

    return (
        <FlexBox gap={16}>
            <Button onClick={() => setShow((visible) => !visible)}>
                {show ? 'Hide activity' : 'Show activity'}
            </Button>
            <Dot
                show={show}
                position="inline"
                transition={{ duration: 0.2 }}
                motionValues={{
                    initial: { opacity: 0, scale: 0.8 },
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.8 },
                }}
            />
        </FlexBox>
    );
}
`;

export const springMotionSquareCode = `
import { FlexBox, motionValues } from '@apple-pie/slice';
import { useState } from 'react';

export function SpringSquare() {
    const [expanded, setExpanded] = useState(false);

    return (
        <FlexBox
            width={96}
            height={96}
            borderRadius="var(--corner-xxl)"
            background="core-blue"
            initial="rest"
            animate={expanded ? 'expanded' : 'rest'}
            variants={{
                rest: { scale: 1, rotate: 0 },
                expanded: { scale: 1.2, rotate: 90 },
            }}
            transition={motionValues['transition-spring']}
            onClick={() => setExpanded((value) => !value)}
        />
    );
}
`;
