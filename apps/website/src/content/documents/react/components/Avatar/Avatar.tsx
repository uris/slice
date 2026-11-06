import {CodeBlock} from '@/components/CodeBlock';
import {ComponentCanvas} from '@/components/ComponetCanvas/ComponentCanvas';
import type {TrackedItem} from '@/components/OnThisPage/OnThisPage';
import {Path} from '@/components/Path/Path';
import {Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef} from '@/components/Type/Type';
import {Avatar, FlexDiv, Preset} from '@apple-pie/slice';
import {infoCode, initialsCode, interactiveCode, lazyLoadCode, usageCode} from './code';

export function AvatarDoc() {
    return (
        <FlexDiv preset={Preset.Column} maxWidth={680} style={{minWidth: 420}}>
            <Path/>
            <H1 id={'title'}>Avatar component</H1>
            <P clipWidth>
                Put people at the center of your interface. Avatar brings a recognizable face or clear initials to
                profiles,
                conversation lists, and team spaces, with colors that fit your theme.
            </P>
            <H2 id={'usage'}>Usage</H2>
            <H3>Base Avatar</H3>
            <P>
                Import <Code>Avatar</Code> and give it a name and an image URL. The image fills the circular shape and
                stays
                centered. Use <Code>size</Code> to set its width and height.
            </P>
            <ComponentCanvas
                storybookUrl="https://react.slice-uikit.com/?path=/story/components-avatar--demo"
                components={[
                    {
                        label: 'Photo avatar',
                        component: <Avatar name={'John Wick'} size={40} image={'/images/jw-profile.png'}/>,
                        code: usageCode.trim(),
                    },
                ]}
            />

            <H3>Initials and theme colors</H3>
            <P>
                No photo yet? <Code>Avatar</Code> falls back to show initials if no image is provided or resolved. Theme
                color
                tokens keep the result consistent across light and dark themes. Choose a <Code>textSize</Code> token to
                set the
                size of the initials.
            </P>
            <ComponentCanvas
                storybookUrl="https://react.slice-uikit.com/?path=/story/components-avatar--demo"
                components={[
                    {
                        label: 'Initials fallback',
                        component: <Avatar name={'John Wick'} size={40} backgroundColor="array-sky-label"/>,
                        code: initialsCode.trim(),
                    },
                ]}
            />

            <H3>Open a profile</H3>
            <P>
                Add <Code>onClick</Code> to make the avatar an action. It becomes focusable and supports Enter and
                Space. Give
                the action a clear accessible label. A visible focus ring is included.
            </P>
            <CodeBlock filename="ProfileAvatar.tsx" language="tsx" code={interactiveCode.trim()}/>
            <H3>Carry typed data</H3>
            <P>
                Pass a user record or any application data through <Code>info</Code>. Avatar infers its type and returns
                the
                same value as the second argument to every event callback. You can also
                specify <Code>{'Avatar<User>'}</Code>
                or use <Code>{'AvatarProps<User>'}</Code> when declaring your own props. Because <Code>info</Code> is
                optional,
                check it before using its fields. Existing handlers that only need the event keep working.
            </P>
            <CodeBlock filename="AvatarWithInfo.tsx" language="tsx" code={infoCode.trim()}/>
            <H3>Load photos as needed</H3>
            <P>
                For long lists, enable <Code>lazyLoad</Code> to defer photos until they approach the viewport. Keep the
                default
                eager loading for prominent profile images.
            </P>
            <CodeBlock filename="ParticipantAvatar.tsx" language="tsx" code={lazyLoadCode.trim()}/>
            <H2 id={'behavior'}>Behavior</H2>
            <P>
                Names with multiple words use the first letter of the first and last words. A single name uses one
                letter. Names
                and emails are trimmed. When the name is empty, the first character of the email is used. Initials
                appear in
                uppercase. Without either value, the avatar is empty.
            </P>
            <P>
                Initials stay visible while a photo loads and if it fails to load. Photos fill the circle without
                stretching.
                Set <Code>lazyLoad</Code> for avatars in long lists to let the browser load nearby photos as needed.
            </P>
            <P>
                Hovering or focusing calls <Code>onToolTip</Code> with the name or email and an anchor ref. The tooltip
                clears
                once the avatar is neither hovered nor focused. Avatar does not display a tooltip itself; connect the
                callback
                to your tooltip UI if needed.
            </P>
            <H2 id={'accessibility'}>Accessibility</H2>
            <P>
                Avatars use an image role by default and a button role when clickable. The default accessible label
                is{' '}
                <Code>User Avatar - [name or email]</Code>, with <Code>Unknown User</Code> as the fallback. Override it
                with{' '}
                <Code>aria-label</Code> when a more specific description helps.
            </P>
            <H2 id={'props'}>Props</H2>
            <P>
                All Avatar props are optional. Color props accept <Code>ColorValue</Code>: a Slice theme token such as
                <Code>core-text-primary</Code>, or a CSS color such
                as <Code>#2563eb</Code> or <Code>var(--brand-color)</Code>.
                Defaults below include the effective theme colors.
            </P>
            <Definition id={'backgroundColor'}>
                <Prop>backgroundColor</Prop>
                <TypeDef>{'ColorValue'}</TypeDef>
                <DefaultVal>{'core-surface-secondary'}</DefaultVal>
            </Definition>
            <P>Fill behind the initials or image. Also remains visible when an image is transparent.</P>
            <Definition id={'borderColor'}>
                <Prop>borderColor</Prop>
                <TypeDef>{'ColorValue'}</TypeDef>
                <DefaultVal>{'core-outline-primary'}</DefaultVal>
            </Definition>
            <P>
                Inner border color at rest. Once a photo loads, the fallback background stays inside the border so
                transparent
                borders remain clear.
            </P>
            <Definition id={'borderColorHover'}>
                <Prop>borderColorHover</Prop>
                <TypeDef>{'ColorValue'}</TypeDef>
                <DefaultVal>{'core-outline-special'}</DefaultVal>
            </Definition>
            <P>Inner border color on pointer hover, whether or not the avatar is clickable.</P>
            <Definition id={'borderWidth'}>
                <Prop>borderWidth</Prop>
                <TypeDef>{'number'}</TypeDef>
                <DefaultVal>{'0'}</DefaultVal>
            </Definition>
            <P>Inner border width in pixels. Set a positive width to make normal and hover border colors visible.</P>
            <Definition id={'email'}>
                <Prop>email</Prop>
                <TypeDef>{'string'}</TypeDef>
                <DefaultVal>{'undefined'}</DefaultVal>
            </Definition>
            <P>
                Identity fallback when the trimmed name is empty. Uses the first character for initials and the full
                email for
                labels.
            </P>
            <Definition id={'image'}>
                <Prop>image</Prop>
                <TypeDef>{'string'}</TypeDef>
                <DefaultVal>{"''"}</DefaultVal>
            </Definition>
            <P>
                Photo URL displayed as a centered, cover-fitted image. Initials remain visible until the photo loads
                successfully. Omit it or pass an empty string to show initials only.
            </P>
            <Definition id={'info'}>
                <Prop>info</Prop>
                <TypeDef>T</TypeDef>
                <DefaultVal>undefined</DefaultVal>
            </Definition>
            <P>
                Optional application data passed unchanged as the second argument to every event callback, including
                native and
                capture events. T is inferred from this value and defaults to unknown. It is not forwarded to the DOM
                and does
                not affect the avatar's image, initials, or labels.
            </P>
            <Definition id={'lazyLoad'}>
                <Prop>lazyLoad</Prop>
                <TypeDef>boolean</TypeDef>
                <DefaultVal>false</DefaultVal>
            </Definition>
            <P>
                Opt into native browser lazy loading with loading="lazy". By default photos use loading="eager".
                Initials remain
                visible until the photo is ready.
            </P>
            <Definition id={'name'}>
                <Prop>name</Prop>
                <TypeDef>{'string'}</TypeDef>
                <DefaultVal>{'undefined'}</DefaultVal>
            </Definition>
            <P>Display name used for initials, the tooltip label, and the accessible label. Takes priority over
                email.</P>
            <Definition id={'outerBorderColor'}>
                <Prop>outerBorderColor</Prop>
                <TypeDef>{'ColorValue'}</TypeDef>
                <DefaultVal>{'core-surface-primary'}</DefaultVal>
            </Definition>
            <P>Outer ring color. Set outerBorderWidth above zero to show it.</P>
            <Definition id={'outerBorderWidth'}>
                <Prop>outerBorderWidth</Prop>
                <TypeDef>{'number'}</TypeDef>
                <DefaultVal>{'0'}</DefaultVal>
            </Definition>
            <P>Outer ring width in pixels. Useful for separating overlapping avatars in a group.</P>
            <Definition id={'size'}>
                <Prop>size</Prop>
                <TypeDef>{'number | string'}</TypeDef>
                <DefaultVal>{'34'}</DefaultVal>
            </Definition>
            <P>Width and height of the avatar. Numbers use pixels; strings accept CSS sizes such as 2.5rem.</P>
            <Definition id={'tabIndex'}>
                <Prop>tabIndex</Prop>
                <TypeDef>{'number'}</TypeDef>
                <DefaultVal>{'0'}</DefaultVal>
            </Definition>
            <P>
                Tab order for clickable avatars. Use -1 to remove the avatar from sequential keyboard navigation.
                Ignored when
                onClick is absent.
            </P>
            <Definition id={'textColor'}>
                <Prop>textColor</Prop>
                <TypeDef>{'ColorValue'}</TypeDef>
                <DefaultVal>{'core-text-primary'}</DefaultVal>
            </Definition>
            <P>Color of the initials.</P>
            <Definition id={'textSize'}>
                <Prop>textSize</Prop>
                <TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
                <DefaultVal>m</DefaultVal>
            </Definition>
            <P>
                Theme typography size for the initials. Independent of the avatar dimensions, with no layout measurement
                required.
            </P>
            <Definition id={'divAttributes'}>
                <Prop>...divAttributes</Prop>
                <TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
                <DefaultVal>{'undefined'}</DefaultVal>
            </Definition>
            <P>
                Additional attributes are forwarded to the outer div, including id, className, style, title, data-* and
                aria-*
                attributes. className is appended and style is merged with the component styles. Avatar owns its content
                and
                does not accept children.
            </P>
            <H2 id={'events'}>Events</H2>
            <P>
                Every callback receives the original event or tooltip as its first argument and <Code>info</Code> as its
                second
                argument. The second argument is <Code>undefined</Code> when no data is supplied, including when a
                tooltip is
                cleared with <Code>null</Code>. Native handlers retain their specific React event types.
            </P>
            <Definition id={'onClick'}>
                <Method>onClick</Method>
                <TypeDef>{'(e: React.MouseEvent<HTMLDivElement>, info: T | undefined) => void'}</TypeDef>
            </Definition>
            <P>
                Called on pointer click and on Enter or Space when focused. Supplying this callback enables button
                semantics,
                keyboard focus, and the pointer cursor. Keyboard activation dispatches a click, so the callback always
                receives
                a mouse event. Repeated keydown events do not trigger extra clicks.
            </P>
            <Definition id={'onKeyDown'}>
                <Method>onKeyDown</Method>
                <TypeDef>{'(e: React.KeyboardEvent<HTMLDivElement>, info: T | undefined) => void'}</TypeDef>
            </Definition>
            <P>
                Called before built-in keyboard activation. Call event.preventDefault() to stop Enter or Space from
                triggering
                onClick.
            </P>
            <Definition id={'onToolTip'}>
                <Method>onToolTip</Method>
                <TypeDef>{'(tip: ToolTip | null, info: T | undefined) => void'}</TypeDef>
            </Definition>
            <P>
                Called on pointer entry or focus with a ToolTip object containing payload.label (the trimmed name,
                email, or an
                empty string) and ref (the avatar anchor). Pointer entry also includes event. Called with null once both
                hover
                and focus end.
            </P>
            <P>
                Standard React div events such as <Code>onFocus</Code>, <Code>onBlur</Code>,
                and <Code>onMouseDown</Code>
                are also supported and receive <Code>info</Code> as their second argument. This also applies to capture
                handlers
                such as <Code>onClickCapture</Code>. Custom hover and focus handlers run alongside the internal tooltip
                handlers.
            </P>
        </FlexDiv>
    );
}

export const avatarTrackedItems: TrackedItem[] = [
    {id: 'title', title: 'Avatar component'},
    {id: 'usage', title: 'Usage'},
    {id: 'behavior', title: 'Behavior'},
    {id: 'accessibility', title: 'Accessibility'},
    {
        id: 'props',
        title: 'Props',
        items: [
            {id: 'backgroundColor', title: 'backgroundColor', code: true},
            {id: 'borderColor', title: 'borderColor', code: true},
            {id: 'borderColorHover', title: 'borderColorHover', code: true},
            {id: 'borderWidth', title: 'borderWidth', code: true},
            {id: 'email', title: 'email', code: true},
            {id: 'image', title: 'image', code: true},
            {id: 'info', title: 'info', code: true},
            {id: 'lazyLoad', title: 'lazyLoad', code: true},
            {id: 'name', title: 'name', code: true},
            {id: 'outerBorderColor', title: 'outerBorderColor', code: true},
            {id: 'outerBorderWidth', title: 'outerBorderWidth', code: true},
            {id: 'size', title: 'size', code: true},
            {id: 'tabIndex', title: 'tabIndex', code: true},
            {id: 'textColor', title: 'textColor', code: true},
            {id: 'textSize', title: 'textSize', code: true},
            {id: 'divAttributes', title: '...divAttributes', code: true},
        ],
    },
    {
        id: 'events',
        title: 'Events',
        items: [
            {id: 'onClick', title: 'onClick', code: true},
            {id: 'onKeyDown', title: 'onKeyDown', code: true},
            {id: 'onToolTip', title: 'onToolTip', code: true},
        ],
    },
];

export {AvatarDoc as default, avatarTrackedItems as trackedItems};
