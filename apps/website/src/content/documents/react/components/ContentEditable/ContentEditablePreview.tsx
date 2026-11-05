'use client';
import typeStyles from '@/components/Type/Type.module.css';
import { ContentEditable } from '@apple-pie/slice';
import { useState } from 'react';
import styles from './ContentEditablePreview.module.css';

export function ContentEditablePreview({
	variant = 'default',
}: Readonly<{
	variant?: 'default' | 'empty' | 'wrapped' | 'click';
}>) {
	const initial = () => {
		if (variant === 'empty') return '';
		if (variant === 'wrapped') return 'Bring the next round of ideas, milestones, and priorities together.';
		return 'Quarterly planning';
	};
	const [title, setTitle] = useState(initial);
	const [editing, setEditing] = useState(false);
	const [updated, setUpdated] = useState<Date | null>(null);
	return (
		<article className={styles.article}>
			<h5 className={`${typeStyles.h3} ${styles.title}`}>
				<ContentEditable
					name={'Project title'}
					value={title}
					placeholder={'Add a title'}
					clamp={1}
					isEditable={editing}
					onClick={() => setEditing(true)}
					onEditStart={() => setEditing(true)}
					onCommit={(next) => {
						setTitle(next);
						setUpdated(new Date());
					}}
					onEditEnd={() => setEditing(false)}
				/>
			</h5>
			<p className={styles.body}>
				Bring ideas, milestones, and priorities together. Keep the plan close to the work as it takes shape.
			</p>
			<time className={styles.timestamp} dateTime={updated?.toISOString() ?? '2026-11-03T09:30:00-08:00'}>
				{updated ? `Updated ${updated.toLocaleString()}` : 'Updated Nov 3, 2026 · 9:30 AM'}
			</time>
		</article>
	);
}
