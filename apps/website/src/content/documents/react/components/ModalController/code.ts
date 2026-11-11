export const usageCode = `
import { Button, DialogBox, ModalController } from '@apple-pie/slice';
import { modalActions, type ModalComponentProps } from '@apple-pie/slice/stores/modal';

export function Confirmation(props: ModalComponentProps) {
  return <DialogBox {...props} title="Archive project?" actions={[
    { id: 'cancel', label: 'Cancel', promise: 'reject' },
    { id: 'archive', label: 'Archive', value: 'archive', primary: true },
  ]}>You can restore this project later.</DialogBox>;
}

export function App() {
  return <>
    <ModalController />
    <Button label="Open dialog" onClick={() => modalActions.show({
      id: 'archive-project', component: Confirmation,
    })} />
  </>;
}
`;
export const responseCode = `
async function confirmArchive() {
  try {
    const result = await modalActions.modalResponse<'archive'>({
      id: 'archive-project', component: Confirmation,
    });
    if (result === 'archive') await archiveProject();
  } catch {
    // Cancel, close, replacement, and dismissal reject the pending response.
  }
}
`;
export const motionCode = `
<ModalController
  draggable={false}
  transition={{ duration: 0.2, ease: 'easeOut' }}
  motionValues={{
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
  }}
/>
`;
