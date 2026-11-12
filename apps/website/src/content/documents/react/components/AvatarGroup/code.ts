export const usageCode = `
import { AvatarGroup } from '@apple-pie/slice';

export function AvatarGroupUsageExample() {
	const participants = [
		{ id: 'john', first: 'John', last: 'Wick', image: '/images/jw-profile.png' },
		{ id: 'jane', first: 'Jane', last: 'Smith' },
		{ id: 'morgan', email: 'morgan@example.com' },
	];

	return <AvatarGroup avatars={participants} />;
}
`;

export const spacingCode = `
import { AvatarGroup } from '@apple-pie/slice';

export function AvatarGroupSpacingExample() {
	const participants = [
		{ id: 'john', first: 'John', last: 'Wick', image: '/images/jw-profile.png' },
		{ id: 'jane', first: 'Jane', last: 'Smith' },
		{ id: 'morgan', email: 'morgan@example.com' },
	];

	return (
        <AvatarGroup
            avatars={participants}
            size={44}
            overlap={24}
            gap={0}
        />
    );
}
`;

export const colorsCode = `
import { AvatarGroup } from '@apple-pie/slice';

export function AvatarGroupColorsExample() {
	return (
		<AvatarGroup
			avatars={[
				{ id: 'jane', first: 'Jane', last: 'Smith', backgroundColor: 'array-cyan-accent' },
				{ id: 'morgan', first: 'Morgan', last: 'Chen', textColor: '#ffffff', backgroundColor: '#2563eb' },
			]}
			backgroundColor="core-surface-secondary"
			borderWidth={1}
			borderColor="transparent"
			outerBorderColor="core-surface-primary"
		/>
	);
}
`;

export const tooltipCode = `
<AvatarGroup avatars={participants} onToolTip={handleTooltip} />
`;

export const accessibilityCode = `
<AvatarGroup
    avatars={participants}
    groupName="Project collaborators"
/>
`;

export const recordCode = `
import type { ColorValue } from '@apple-pie/slice';

type AvatarInfo = {
    backgroundColor?: ColorValue;
    email?: string;
    first?: string;
    id?: string | number;
    image?: string;
    last?: string;
    textColor?: ColorValue;
};
`;

export const lazyLoadCode = `
<AvatarGroup avatars={participants} lazyLoad />
`;

export const typographyCode = `
import { AvatarGroup } from '@apple-pie/slice';

export function AvatarGroupTypographyExample() {
	const participants = [
		{ id: 'john', first: 'John', last: 'Wick', image: '/images/jw-profile.png' },
		{ id: 'jane', first: 'Jane', last: 'Smith' },
		{ id: 'morgan', email: 'morgan@example.com' },
	];

	return <AvatarGroup avatars={participants} size={48} textSize="l" />;
}
`;

export const moreCode = `
import { modalActions } from '@apple-pie/slice/stores/modal';

<AvatarGroup
    avatars={participants}
    limit={5}
    onMore={({ source, all }) => {
        if (source !== 'avatars') return;
        modalActions.show({
            component: CollaboratorsDialog,
            props: { people: all },
        });
    }}
/>
`;

export const childrenCode = `
import { Avatar, AvatarGroup } from '@apple-pie/slice';

export function TeamAvatars({ onOpenProfile }: { onOpenProfile: (id: string) => void }) {
    return (
        <AvatarGroup size={40} borderWidth={1}>
            <Avatar name="Jane Smith" onClick={() => onOpenProfile('jane')} />
            <Avatar name="Morgan Chen" backgroundColor="array-yellow-accent" />
            <Avatar name="Alex Kim" size={48} borderWidth={0} />
        </AvatarGroup>
    );
}
`;
