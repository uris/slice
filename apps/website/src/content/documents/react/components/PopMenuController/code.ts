export const usageCode = `
import { Button, FlexDiv, PopMenu, PopMenuController, type PopMenuProps } from '@apple-pie/slice';
import { popMenuActions } from '@apple-pie/slice/stores/popMenu';

function ProjectMenu(props: PopMenuProps) {
    return <PopMenu {...props} name="Project actions"
        options={[{ label: 'Edit' }, { label: 'Duplicate' }]} />;
}

export default function AppActions() {
    return (
        <FlexDiv>
            <Button label="Push props" onClick={(event) => {
                if (!event) return;
                popMenuActions.push({
                    caller: event.currentTarget,
                    name: 'Quick actions',
                    options: [{ label: 'Edit' }, { label: 'Archive' }],
                });
            }} />
            <Button label="Push composed menu" variant="outline" onClick={(event) => {
                if (event) popMenuActions.push(<ProjectMenu caller={event.currentTarget} />);
            }} />
            <PopMenuController />
        </FlexDiv>
    );
}
`;

export const composedCode = `
import { PopMenu, type PopMenuProps } from '@apple-pie/slice';

function ProjectMenu(props: PopMenuProps) {
    return <PopMenu {...props} name="Project actions"
        options={[{ label: 'Edit' }, { label: 'Duplicate' }]} />;
}

// Capture the button inside its click handler.
popMenuActions.push(<ProjectMenu caller={event.currentTarget} />);
`;

export const clearCode = `
popMenuActions.clear();
// Equivalent:
popMenuActions.push(null);
`;
