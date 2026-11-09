export const usageCode = `
import { useState } from 'react';
import { Button, Toast, ToastType } from '@apple-pie/slice';

export function NotificationExample() {
  const [version, setVersion] = useState(0);
  return <>
    <Button label="Show notification" onClick={() => setVersion((value) => value + 1)} />
    <Toast notificationId={String(version)}
      message={version ? 'Your changes have been saved.' : null}
      type={ToastType.Success} />
  </>;
}
`;
export const persistentCode = `
<Toast message="Uploading files…" duration="infinite" progress
  close={false} />
`;
export const parentCode = `
<div style={{ position: 'relative', height: 240 }}>
  <Toast message="Your changes have been saved." container="parent"
    position="top" offset={16} duration={4000} />
</div>
`;

export const successCode = `
<Toast message="Your changes have been saved." type={ToastType.Success} duration="infinite" />
`;

export const warningCode = `
<Toast message="Your changes have been saved." type={ToastType.Warning} duration="infinite" />
`;

export const errorCode = `
<Toast message="Your changes have been saved." type={ToastType.Error} duration="infinite" />
`;

export const motionCode = `
<Toast message="Saved" motionValues={{ initial: { y: 4 }, exit: { y: 4 } }}
  transition={{ duration: 0.15 }} />
`;
export const storeCode = `
import { Toast } from '@apple-pie/slice';
import { useToast, toastActions } from '@apple-pie/slice/stores/toast';

export function Notifications() {
  const notification = useToast();
  return <Toast {...notification} onHide={toastActions.clear} />;
}

// Every push gets a new ID, including repeated messages.
toastActions.push({ message: 'Saved', type: 'success' });
`;

export const actionCode = `
type DocumentNotice = { documentId: string };

<Toast<DocumentNotice>
  message="Open saved document"
  data={{ documentId: 'doc-42' }}
  onClick={(_event, data) => {
    if (data) window.location.assign('/documents/' + data.documentId);
  }}
/>
`;
