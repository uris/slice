export const galleryCode = `
import { IconButton, SliceIcons } from '@apple-pie/slice';
import { useClipboard } from '@apple-pie/slice/hooks';
import { tipActions } from '@apple-pie/slice/stores/tip';

export default function IconGroup() {
    const { copy } = useClipboard({ watchPermissions: false });
    const icons = Object.values(SliceIcons.basic);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, 40px)', gridAutoRows: '40px', justifyContent: 'center', justifyItems: 'center', alignItems: 'center', gap: 8, width: '100%' }}>
            {icons.map(name => (
                <IconButton
                    key={name}
                    icon={name}
                    iconSize={20}
                    buttonSize={40}
                    actionName={\`Copy \${name}\`}
                    tooltip={name}
                    onToolTip={tipActions.push}
                    onClick={() => { void copy(name); }}
                />
            ))}
        </div>
    );
}
`;

export const colorsCode = `
import { Icon } from '@apple-pie/slice';
import { coreColors } from '@apple-pie/slice/theme/colors';

const primeColors = Object.keys(coreColors).filter(token => /^core-[a-z]+-500$/.test(token));

export default function IconColors() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, 40px)', gridAutoRows: '40px', justifyContent: 'center', justifyItems: 'center', alignItems: 'center', gap: 24, width: '100%' }}>
            {primeColors.map(token => (
                <Icon key={token} name="basic.heart" size={32}
                    strokeColor={\`var(--\${token})\`} iconName={\`Heart in \${token}\`} />
            ))}
        </div>
    );
}
`;

export const sizesCode = `
import { FlexBox, Icon } from '@apple-pie/slice';

export default function IconSizes() {
    const sizes = [16, 24, 32];
    const strokes = [1, 1.5, 2];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 40px)', gridAutoRows: '40px', justifyContent: 'center', justifyItems: 'center', alignItems: 'center', gap: 24, width: '100%', maxWidth: 360 }}>
            {strokes.flatMap(stroke => sizes.map(size => (
                <FlexBox key={\`\${stroke}-\${size}\`} width="fill" height={40} align="center" justify="center">
                    <Icon name="basic.heart" size={size} stroke={stroke}
                        iconName={\`Heart, \${size}px, stroke \${stroke}\`} />
                </FlexBox>
            )))}
        </div>
    );
}
`;
