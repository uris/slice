export const usageCode = `
import { useState } from 'react';

function ContinueButton() {
    const [continued, setContinued] = useState(false);

    return (
        <Button
            label={continued ? 'Continued' : 'Continue'}
            onClick={() => setContinued(!continued)}
        />
    );
}
`;

export const solidCode = `
import { Button } from '@apple-pie/slice';

export default function SolidButton() {
    return <Button label="Solid" variant="solid" />;
}
`;
export const outlineCode = `
import { Button } from '@apple-pie/slice';

export default function OutlineButton() {
    return <Button label="Outline" variant="outline" />;
}
`;
export const textCode = `
import { Button } from '@apple-pie/slice';

export default function TextButton() {
    return <Button label="Text Button" variant="text" />;
}
`;

export const iconsCode = `
<Button label="Continue" iconRight="arrows.arrow-right" />
`;
export const iconOnlyCode = `
<Button iconLeft="basic.home" round aria-label="Go home" />
`;

export const stylingCode = `
<Button
    label="Continue"
    variant="solid"
    buttonSize="l"
    textSize="l"
    backgroundColor="#2563eb"
    textColor="#ffffff"
    width="fill"
/>
`;

export const workingCode = `
function SaveButton({ saveChanges }: { saveChanges: () => Promise<void> }) {
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        setIsSaving(true);

        try {
            await saveChanges();
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Button
            label="Save changes"
            working={isSaving}
            onClick={handleSave}
        />
    );
}
`;

export const progressCode = `
function DelayedAction() {
    const [completed, setCompleted] = useState(false);

    return (
        <Button
            label={completed ? 'Run again' : 'Run action'}
            progress
            duration={1}
            onClick={() => setCompleted(!completed)}
        />
    );
}
`;

export const formCode = `
function SubmitExample() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <form onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
        }}>
            <Button
                label={submitted ? 'Submitted' : 'Submit'}
                type="submit"
            />
        </form>
    );
}
`;

export const tooltipCode = `
import { useTipActions } from '@apple-pie/slice/stores';
import { Button } from '@apple-pie/slice';

function ButtonWithTooltip() {
    // Slice’s tooltip store; your app renders
    // the active tip from useTip().
    const { push } = useTipActions();

    return (
        <Button
            label="Save"
            tooltip="Save your changes"
            onToolTip={push}
        />
    );
}
`;

export const motionCode = `
function AnimatedButton() {
    const [expanded, setExpanded] = useState(false);

    return (
        <Button
            label="Animate"
            initial="compact"
            animate={expanded ? 'expanded' : 'compact'}
            variants={{ 
                compact: { scale: 1 },
                expanded: { scale: 1.5 } }
            }
            transition={{ duration: 0.2 }}
            onClick={() => setExpanded(!expanded)}
        />
    );
}
`;

export const refCode = `
import { type ButtonHandle, FlexDiv } from '@apple-pie/slice';
import { useRef } from 'react';

function ButtonWithRef() {
    const buttonRef = useRef<ButtonHandle>(null);
    const [count, setCount] = useState(0);

    return (
        <FlexDiv gap={12}>
            <Button ref={buttonRef} label={\`Run action (\${count})\`}
                onClick={() => setCount((value) => value + 1)} />
            <Button label="Run through the ref"
                onClick={() => buttonRef.current?.triggerClick()} />
        </FlexDiv>
    );
}
`;

export const disabledCode = `
<Button label="Continue" disabled />
`;

export const childrenCode = `
import { Avatar } from '@apple-pie/slice';

<Button buttonSize="auto" aria-label="John Wick's Profile">
    <Avatar name="John Wick" image="/images/jw-profile.png" />
    <span>John Wick's Profile</span>
</Button>
`;
