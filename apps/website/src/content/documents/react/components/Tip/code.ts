export const usageCode = `
import { Button } from '@apple-pie/slice';
import { tipActions } from '@apple-pie/slice/stores/tip';

export function ProjectButton() {
  return <Button
    label="Project details"
    tooltip="Your changes are saved automatically."
    onToolTip={tipActions.push}
  />;
}
`;

export const applicationCode = `
import { useRef } from 'react';
import { Tip, useToolTip } from '@apple-pie/slice';
import { useTip } from '@apple-pie/slice/stores/tip';

export function ApplicationTip() {
  const tip = useTip();
  const tipRef = useRef<HTMLDivElement>(null);
  const coords = useToolTip(tip, tipRef);

  return <Tip ref={tipRef} tip={tip} coords={coords} />;
}
`;

export const customCode = `
import { useRef } from 'react';
import { Avatar, type ToolTip } from '@apple-pie/slice';
import { tipActions } from '@apple-pie/slice/stores/tip';

function ProfileTrigger({ onToolTip }: {
  onToolTip?: (tip: ToolTip | null) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const show = () => onToolTip?.({
    ref,
    payload: { label: 'View Maya’s profile and contact details.' },
  });

  return <button
    ref={ref}
    type="button"
    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      border: '1px solid var(--core-fill-primary)', borderRadius: 12,
      background: 'var(--core-surface-secondary)', color: 'var(--core-text-primary)',
      font: 'inherit', textAlign: 'left', cursor: 'pointer' }}
    onMouseEnter={show}
    onFocus={show}
    onMouseLeave={() => {
      if (document.activeElement !== ref.current) onToolTip?.(null);
    }}
    onBlur={() => {
      if (!ref.current?.matches(':hover')) onToolTip?.(null);
    }}
    onClick={() => onToolTip?.(null)}
  >
    <span aria-hidden="true">
      <Avatar name="Maya Chen" size={40} backgroundColor="array-cyan" textColor="array-cyan-accent" />
    </span>
    <span style={{ lineHeight: 1.4 }}>
      <strong style={{ display: 'block' }}>Maya Chen</strong>
      <small style={{ color: 'var(--core-text-secondary)' }}>Product designer</small>
    </span>
  </button>;
}

<ProfileTrigger onToolTip={tipActions.push} />
`;

export const motionCode = `
<Tip tip={tip} coords={coords}
  motionValues={{ initial: { opacity: 0, y: 2 }, animate: { opacity: 1, y: 0 } }}
  transition={{ duration: 0.15 }} />
`;
