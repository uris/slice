export const usageCode = `import { Tip } from '@apple-pie/slice';

export function TipExample() {
 return (
<Tip
  tip={{ payload: { label: 'Your changes are saved automatically.' } }}
  coords={{ x: 24, y: 48 }}
/>
 );
}
`;
export const positionedCode = `
import { useRef, useState } from 'react';
import { Button, Tip, type ToolTip, useToolTip } from '@apple-pie/slice';

function ProjectTip() {
  const [tip, setTip] = useState<ToolTip | null>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const coords = useToolTip(tip, tipRef);
  return <>
    <Button label="Project details" tooltip="Your changes are saved automatically."
      onToolTip={setTip} />
    <Tip ref={tipRef} tip={tip} coords={coords} />
  </>;
}
`;
export const tipCode = `
type ToolTip = {
  type?: ToolTipType;
  payload?: { label: string; duration?: number };
  ref?: React.RefObject<any> | null;
  event?: MouseEvent | React.MouseEvent<any>;
};
`;
