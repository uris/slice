export const usageCode = `
import { useState } from 'react';
import { Button, Modal } from '@apple-pie/slice';

function Confirmation() {
  const [open, setOpen] = useState(false);
  return <>
    <Button label="Archive project" onClick={() => setOpen(true)} />
    {open && <Modal<boolean>
      title="Archive project?"
      onResolve={() => setOpen(false)}
      onReject={() => setOpen(false)}
      onClose={() => setOpen(false)}
      actions={[
        { id: 'cancel', label: 'Cancel', promise: 'reject' },
        { id: 'archive', label: 'Archive', value: true, primary: true },
      ]}
    >You can restore this project later.</Modal>}
  </>;
}
`;
export const scrollingCode = `
<Modal title="Project details" maxHeight={360}
  actions={[{ id: 'done', label: 'Done', primary: true }]}
  onResolve={myHandler} onClose={myHandler}>
  <ProjectDetails />
</Modal>
`;
export const actionCode = `
type ModalAction<T = string> = {
  id: string;
  label?: string;
  value?: T;
  primary?: boolean;
  iconLeft?: string;
  iconRight?: string;
  tooltip?: string;
  round?: boolean;
  position?: 'left' | 'right';
  promise?: 'resolve' | 'reject';
};
`;
