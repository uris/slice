export const usageCode = `
import { useState } from 'react';
import { Button, Overlay } from '@apple-pie/slice';

function OverlayExample() {
  const [open, setOpen] = useState(false);
  return <>
    <Button label="Show overlay" onClick={() => setOpen(true)} />
    <Overlay show={open} type="dark" opacity={0.45}
      onClick={() => setOpen(false)} />
  </>;
}
`;
export const foregroundCode = `
import { Modal } from '@apple-pie/slice';

<>
  <Overlay show={open} type="dark" onClick={closeDialog} />
  {open && <section style={{ position: 'fixed', inset: '20%', zIndex: 'var(--elevation-confirm)' }}>
    <Modal title="Project details" onClose={closeDialog}>
      Your project content
    </Modal>
  </section>}
</>
`;
