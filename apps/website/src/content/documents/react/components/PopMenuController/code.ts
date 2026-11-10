export const usageCode = `
import { Button, FlexBox, PopMenu, PopMenuController, type PopMenuProps } from '@apple-pie/slice';
import { popMenuActions } from '@apple-pie/slice/stores/popMenu';

function ProjectMenu(props: PopMenuProps) {
    return <PopMenu {...props} name="Project actions"
        options={[{ label: 'Edit' }, { label: 'Duplicate' }]} />;
}

export default function AppActions() {
    return (
        <FlexBox>
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
        </FlexBox>
    );
}
`;

export const composedCode = `
import { Button, PopMenu, type PopMenuProps } from '@apple-pie/slice';
import { popMenuActions } from '@apple-pie/slice/stores/popMenu';

function ProjectMenu(props: PopMenuProps) {
    return <PopMenu {...props} name="Project actions"
        options={[{ label: 'Edit' }, { label: 'Duplicate' }]} />;
}

export function ProjectMenuButton() {
    return <Button label="Project actions" onClick={(event) => {
        if (event) popMenuActions.push(<ProjectMenu caller={event.currentTarget} />);
    }} />;
}
`;

export const clearCode = `
import { popMenuActions } from '@apple-pie/slice/stores/popMenu';

popMenuActions.clear();
// Equivalent:
popMenuActions.push(null);
`;
