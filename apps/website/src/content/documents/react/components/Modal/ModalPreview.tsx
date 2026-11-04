'use client';
import { Button, Modal } from '@apple-pie/slice';
import { useState } from 'react';
import styles from '../_shared/LayerPreview.module.css';
export function ModalPreview({ scroll = false }: { scroll?: boolean }) {
	const [open, setOpen] = useState(true);
	if (!open) return <Button label="Open dialog" onClick={() => setOpen(true)} />;
	return (
		<Modal<string>
			title={scroll ? 'Project details' : 'Archive project?'}
			minWidth={0}
			minHeight={180}
			maxHeight={scroll ? 240 : 300}
			style={{ width: '100%' }}
			onResolve={() => setOpen(false)}
			onReject={() => setOpen(false)}
			onClose={() => setOpen(false)}
			actions={[
				{ id: 'cancel', label: 'Cancel', promise: 'reject' },
				{ id: 'archive', label: scroll ? 'Done' : 'Archive', value: 'archive', primary: true },
			]}
		>
			{scroll ? (
				<div className={styles.scrollCopy}>
					{[
						'Bring upcoming milestones and open decisions into one shared plan.',
						'Keep notes close to the work so everyone has the context they need.',
						'Assign an owner to each decision and agree on the next useful step.',
						'Review progress together and make room for priorities to change.',
						'Capture what you learned before moving into the next stage.',
						'Your team can return to the project history whenever they need it.',
					].map((paragraph) => (
						<p className={styles.copy} key={paragraph}>
							{paragraph}
						</p>
					))}
				</div>
			) : (
				<p className={styles.copy}>You can restore this project later. Its files and history will stay together.</p>
			)}
		</Modal>
	);
}
