export const usageCode = `
import { Button } from '@apple-pie/slice';

<Button label="Continue" onClick={continueToNextStep} />
`;

export const variantsCode = `
<>
    <Button label="Continue" variant="solid" />
    <Button label="Go back" variant="outline" />
    <Button label="Cancel" variant="text" />
</>
`;

export const iconsCode = `
<>
    <Button label="Continue" iconRight="arrows.arrow-right" />
    <Button iconLeft="basic.home" round aria-label="Go home" onClick={goHome} />
</>
`;

export const stylingCode = `
<Button
    label="Continue"
    variant="solid"
    size="large"
    textSize="l"
    backgroundColor="#2563eb"
    textColor="#ffffff"
    width="fill"
/>
`;

export const workingCode = `
<Button label="Save changes" working={isSaving} onClick={saveChanges} />
`;

export const progressCode = `
<Button label="Run action" progress duration={1} onClick={runAction} />
`;

export const formCode = `
<Button label="Submit" type="submit" disabled={!canSubmit} />
`;

export const tooltipCode = `
<Button label="Save" tooltip="Save your changes" onToolTip={handleTooltip} />
`;

export const motionCode = `
<Button
    label="Continue"
    initial="hidden"
    animate="visible"
    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
    transition={{ duration: 0.2 }}
/>
`;

export const refCode = `
import { useRef } from 'react';
import type { ButtonHandle } from '@apple-pie/slice';

function ButtonWithRef() {
    const buttonRef = useRef<ButtonHandle>(null);

    return (
        <>
            <Button ref={buttonRef} label="Run action" onClick={runAction} />
            <button type="button" onClick={() => buttonRef.current?.triggerClick()}>
                Run through the ref
            </button>
        </>
    );
}
`;
