'use client';

import { Avatar, AvatarGroup, type AvatarGroupMore, Modal } from '@apple-pie/slice';
import { useRef, useState } from 'react';
import styles from './AvatarGroupPreview.module.css';
import { overflowParticipants } from './data';

export function MoreAvatarsPreview() {
	const dialog = useRef<HTMLDialogElement>(null);
	const [people, setPeople] = useState<Extract<AvatarGroupMore, { source: 'avatars' }> | null>(null);

	function handleMore(details: AvatarGroupMore) {
		if (details.source !== 'avatars') return;
		setPeople(details);
		dialog.current?.showModal();
	}

	return (
		<>
			<AvatarGroup
				avatars={overflowParticipants}
				limit={5}
				size={44}
				borderWidth={0}
				outerBorderColor="core-surface-primary-tint"
				role="group"
				aria-label="Project collaborators"
				onMore={handleMore}
			/>
			<dialog ref={dialog} className={styles.dialog} aria-label="All collaborators">
				<Modal
					title="All collaborators"
					minWidth={0}
					maxWidth={420}
					maxHeight={520}
					onClose={() => dialog.current?.close()}
					backgroundColor={'core-surface-primary-tint'}
				>
					{people && (
						<ul className={styles.people}>
							{people.all.map((person) => (
								<li className={styles.person} key={person.id}>
									<Avatar
										name={`${person.first} ${person.last}`}
										image={person.image}
										backgroundColor={person.backgroundColor}
										size={40}
									/>
									<span>
										{person.first} {person.last}
									</span>
								</li>
							))}
						</ul>
					)}
				</Modal>
			</dialog>
		</>
	);
}
