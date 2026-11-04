import type { AvatarInfo } from '@apple-pie/slice';

export const participants: AvatarInfo[] = [
	{ id: 'john', first: 'John', last: 'Wick', image: '/images/jw-profile.png' },
	{ id: 'jane', first: 'Jane', last: 'Smith', backgroundColor: 'array-sky-label' },
	{ id: 'morgan', first: 'Morgan', last: 'Chen', backgroundColor: 'array-yellow-label' },
	{ id: 'sam', first: 'Sam', last: 'Rivera', image: '/images/profile-male-02.jpg' },
];

export const overflowParticipants: AvatarInfo[] = [
	...participants,
	...[
		'Alex Kim',
		'Taylor Brooks',
		'Casey Patel',
		'Jordan Lee',
		'Riley Shaw',
		'Avery Jones',
		'Quinn Davis',
		'Jamie Park',
		'Robin Lane',
		'Drew Morgan',
		'Cameron Reed',
	].map((name) => {
		const [first, last] = name.split(' ');
		return { id: name, first, last };
	}),
];
