'use client';

import { Avatar, AvatarGroup, type AvatarInfo, DialogBox } from '@apple-pie/slice';
import { type ModalComponentProps, modalActions } from '@apple-pie/slice/stores/modal';
import styles from './AvatarGroupPreview.module.css';
import { overflowParticipants } from './data';

function CollaboratorsDialog({ people = [], ...props }: ModalComponentProps & { people?: AvatarInfo[] }) {
	return (
		<DialogBox {...props} title="All collaborators" minWidth={300} maxHeight={300} borderWidth={0}>
			<ul className={styles.people}>
				{people.map((person) => (
					<li className={styles.person} key={person.id}>
						<Avatar
							name={`${person.first} ${person.last}`}
							image={person.image}
							backgroundColor={person.backgroundColor ?? 'core-fill-primary'}
							size={40}
						/>
						<span>
							{person.first} {person.last}
						</span>
					</li>
				))}
			</ul>
		</DialogBox>
	);
}

export function MoreAvatarsPreview() {
	return (
		<AvatarGroup
			groupName="Project collaborators"
			avatars={overflowParticipants}
			limit={5}
			size={44}
			borderWidth={0}
			onMore={({ source, all }) => {
				if (source !== 'avatars') return;
				modalActions.show({ component: CollaboratorsDialog, props: { people: all } });
			}}
		/>
	);
}
