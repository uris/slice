'use client';

import { Avatar, Button, type ToolTip } from '@apple-pie/slice';
import { tipActions } from '@apple-pie/slice/stores/tip';
import { useRef } from 'react';
import styles from '../_shared/LayerPreview.module.css';

function ProfileTrigger({ onToolTip }: { onToolTip: (tip: ToolTip | null) => void }) {
	const ref = useRef<HTMLButtonElement>(null);
	const show = () => onToolTip({ ref, payload: { label: 'View Maya’s profile and contact details.' } });
	return (
		<button
			ref={ref}
			type="button"
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 12,
				padding: '12px 16px',
				border: '1px solid var(--core-fill-primary)',
				borderRadius: 12,
				background: 'var(--core-surface-secondary)',
				color: 'var(--core-text-primary)',
				font: 'inherit',
				textAlign: 'left',
				cursor: 'pointer',
			}}
			onMouseEnter={show}
			onFocus={show}
			onMouseLeave={() => {
				if (document.activeElement !== ref.current) onToolTip(null);
			}}
			onBlur={() => {
				if (!ref.current?.matches(':hover')) onToolTip(null);
			}}
			onClick={() => onToolTip(null)}
		>
			<span aria-hidden="true">
				<Avatar name="Maya Chen" size={40} backgroundColor="array-sky" textColor="array-sky-label" />
			</span>
			<span style={{ lineHeight: 1.4 }}>
				<strong style={{ display: 'block' }}>Maya Chen</strong>
				<small style={{ color: 'var(--core-text-secondary)' }}>Product designer</small>
			</span>
		</button>
	);
}

export function TipPreview({ custom = false }: { custom?: boolean }) {
	return (
		<div className={styles.stage}>
			{custom ? (
				<ProfileTrigger onToolTip={tipActions.push} />
			) : (
				<Button label="Project details" tooltip="Your changes are saved automatically." onToolTip={tipActions.push} />
			)}
		</div>
	);
}
