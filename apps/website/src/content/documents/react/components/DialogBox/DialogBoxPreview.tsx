'use client';
import { Button, DialogBox } from '@apple-pie/slice';
import { useState } from 'react';
import styles from '../_shared/LayerPreview.module.css';

export function DialogBoxPreview({ scroll = false }: Readonly<{ scroll?: boolean }>) {
	const [open, setOpen] = useState(true);
	if (!open) return <Button label="Open dialog" onClick={() => setOpen(true)} />;
	return (
		<DialogBox<string>
			minWidth={0}
			minHeight={0}
			maxHeight={scroll ? 240 : 300}
			style={{ width: '50%' }}
			onResolve={() => setOpen(false)}
			onReject={() => setOpen(false)}
			onClose={() => setOpen(false)}
		>
			<DialogBox.Title>{scroll ? 'Project details' : 'Archive project?'}</DialogBox.Title>
			<DialogBox.Content>
				{scroll ? (
					<div className={styles.scrollCopy}>
						{[
							'Bring upcoming milestones and open decisions into one shared plan. Keep notes close to the work so everyone has the context they need.',
							'Assign an owner to each decision and agree on the next useful step.',
						].map((paragraph) => (
							<span className={styles.copy} key={paragraph}>
								{paragraph}
							</span>
						))}
					</div>
				) : (
					<span className={styles.copy}>
						You can restore this project later. Its files and history will stay together.
					</span>
				)}
			</DialogBox.Content>
			<DialogBox.Actions>
				<Button label="Cancel" variant="outline" backgroundColor={'transparent'} onClick={() => setOpen(false)} />
				<Button variant={'solid'} label={scroll ? 'Done' : 'Archive'} onClick={() => setOpen(false)} />
			</DialogBox.Actions>
		</DialogBox>
	);
}
