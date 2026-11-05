export const usageCode = `
import { useState } from 'react';
import { Button, Overlay } from '@apple-pie/slice';

function OverlayExample() {
  const [show, setShow] = useState(false);
  return <>
    <Button label="Show overlay" onClick={() => setShow(true)} />
    <Overlay show={show} onClick={() => setShow(false)} />
  </>;
}
`;
export const menuCode = `
function ProjectActions() {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  return <>
    <button type="button" onContextMenu={(event) => {
      event.preventDefault();
      setMenu({ x: event.clientX, y: event.clientY });
    }}>Project actions</button>
    <Overlay show={menu !== null}
      onPointerDown={() => setMenu(null)}
      onContextMenu={(event) => event.preventDefault()}>
      {menu && <div role="group" aria-label="Project actions"
        style={{ position: 'absolute', left: menu.x, top: menu.y,
          background: 'var(--core-surface-secondary)', padding: 16 }}
        onPointerDown={(event) => event.stopPropagation()}>
        <button type="button" onClick={myHandler}>Rename project</button>
        <button type="button" onClick={myHandler}>Duplicate project</button>
      </div>}
    </Overlay>
  </>;
}
`;
export const motionCode = `
<Overlay show={open} opacity={0.6}
  transition={{ duration: 0.3 }}
  motionValues={{
    initial: { opacity: 0 },
    animate: { opacity: 0.6 },
    exit: { opacity: 0 },
  }}
  onClick={myHandler}
/>
`;
