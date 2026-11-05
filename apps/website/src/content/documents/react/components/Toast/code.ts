export const usageCode = `
import { useState } from 'react';
import { Button, Toast, ToastType } from '@apple-pie/slice';

function NotificationExample() {
  const [version, setVersion] = useState(0);
  return <>
    <Button label="Show notification" onClick={() => setVersion((value) => value + 1)} />
    <Toast key={version} notifId={String(version)}
      message={version ? 'Your changes have been saved.' : null}
      type={ToastType.Success} />
  </>;
}
`;
export const persistentCode = `
<Toast message="Uploading files…" duration="Infinite" progress
  didHide={myHandler} />
`;
export const parentCode = `
<div style={{ position: 'relative', height: 240 }}>
  <Toast message="Your changes have been saved." container="parent"
    position="top" offset={16} duration={4000} />
</div>
`;
