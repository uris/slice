export const usageCode = `
import { useState } from 'react';
import { Button, DialogBox } from '@apple-pie/slice';

function Confirmation() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <>
    <Button label="Archive project" onClick={() => setOpen(true)} />
    {open && <DialogBox onClose={close}>
      <DialogBox.Title>Archive project?</DialogBox.Title>
      <DialogBox.Content>You can restore this project later.</DialogBox.Content>
      <DialogBox.Actions>
        <Button label="Cancel" variant="outline" onClick={close} />
        <Button label="Archive" onClick={() => { myHandler(); close(); }} />
      </DialogBox.Actions>
    </DialogBox>}
  </>;
}
`;
export const shorthandCode = `
<DialogBox title="Archive project?"
  onClose={myCloseHandler}
  onResolve={myHandler}
  actions={[
    { id: 'cancel', label: 'Cancel', promise: 'reject' },
    { id: 'archive', label: 'Archive', value: 'archive', primary: true },
  ]}
  onReject={myRejectHandler}>
  You can restore this project later.
</DialogBox>
`;
export const scrollingCode = `
<DialogBox maxHeight={360} onClose={myCloseHandler}>
  <DialogBox.Title>Project details</DialogBox.Title>
  <DialogBox.Content><ProjectDetails /></DialogBox.Content>
  <DialogBox.Actions><Button label="Done" onClick={myCloseHandler} /></DialogBox.Actions>
</DialogBox>
`;
export const sharedActionsCode = `
import { useDialogBox } from '@apple-pie/slice';

function ArchiveActions() {
  const { close, resolve } = useDialogBox<string>();
  return <>
    <Button label="Cancel" variant="outline" onClick={close} />
    <Button label="Archive" onClick={() => resolve('archive')} />
  </>;
}

<DialogBox<string> onResolve={myHandler} onClose={myCloseHandler}>
  <DialogBox.Title>Archive project?</DialogBox.Title>
  <DialogBox.Content>You can restore this project later.</DialogBox.Content>
  <DialogBox.Actions><ArchiveActions /></DialogBox.Actions>
</DialogBox>
`;
export const actionCode = `
type DialogBoxAction<T = string> = {
  id: string;
  label?: string;
  value?: T;
  primary?: boolean;
  iconLeft?: string;
  iconRight?: string;
  tooltip?: string;
  round?: boolean;
  position?: 'left' | 'right';
  promise?: 'resolve' | 'reject' | 'none';
  disabled?: boolean;
  working?: boolean;
};
`;
