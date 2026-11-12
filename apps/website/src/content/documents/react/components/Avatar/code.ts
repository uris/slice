export const usageCode = `
import { Avatar } from '@apple-pie/slice';

function UserAvatar() {
    return (
        <Avatar 
            name="John Wick"
            image="/images/jw-profile.png"
            size={40}
        />
    );
}
`;

export const initialsCode = `
<Avatar
    name="Jane Smith"
    textSize="l"
    backgroundColor="array-cyan-accent"
/>
`;

export const interactiveCode = `
<Avatar name="Jane Smith" onClick={openProfile} />
`;

export const lazyLoadCode = `
<Avatar name="Jane Smith" image="/images/jane-profile.png" lazyLoad />
`;

export const infoCode = `
const user = { id: 'user-42', name: 'Jane Smith' };

<Avatar
    name={user.name}
    info={user}
    onClick={(_event, info) => {
        if (info) openProfile(info.id);
    }}
/>
`;
