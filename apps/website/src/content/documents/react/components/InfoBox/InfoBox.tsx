import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, H1, H2, H3, P } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import {
	type InfoBoxDocEvent,
	type InfoBoxDocProp,
	InfoBoxEventsReference,
	InfoBoxPropsReference,
	infoBoxTrackedItems,
} from './Reference';
import { ActionPreview, ProfilePreview, SimplePreview } from './UsagePreviews';
import { actionCode, compactCode, profileCode, simpleCode } from './code';
const props: InfoBoxDocProp[] = [
	{
		name: 'backgroundColor',
		type: 'ColorValue',
		defaultValue: 'core-surface-primary',
		description: <>Surface color; accepts a Slice token or CSS color.</>,
	},
	{
		name: 'backgroundColorHover',
		type: 'ColorValue',
		defaultValue: 'undefined',
		description: (
			<>
				Explicit hover color. Otherwise enabled pressable rows tint toward white by 2% in dark mode or black by 5% in
				light mode; static rows retain their surface color.
			</>
		),
	},
	{
		name: 'borderColor',
		type: 'ColorValue',
		defaultValue: 'core-outline-primary',
		description: <>Outer border color.</>,
	},
	{
		name: 'borderRadius',
		type: 'number | string',
		defaultValue: 'var(--corner-l)',
		description: <>Outer corner radius. Numbers are pixels.</>,
	},
	{
		name: 'borderWidth',
		type: 'number | string',
		defaultValue: '1',
		description: <>Outer border width. Numbers are pixels.</>,
	},
	{
		name: 'children',
		type: 'React.ReactNode',
		defaultValue: 'undefined',
		description: (
			<>
				One of each named section; fragments and conditional sections are supported. Custom content belongs inside a
				section.
			</>
		),
	},
	{
		name: 'disabled',
		type: 'boolean',
		defaultValue: 'false',
		description: <>Disables the main press target. Independent action controls use their own disabled state.</>,
	},
	{
		name: 'maxWidth',
		type: 'number | string',
		defaultValue: 'undefined',
		description: (
			<>
				Maximum width; numbers are pixels. Set <Code>style.width</Code> to fill the available width.
			</>
		),
	},
	{
		name: 'minWidth',
		type: 'number | string',
		defaultValue: 'undefined',
		description: <>Minimum width; numbers are pixels.</>,
	},
	{
		name: 'name',
		type: 'string',
		defaultValue: 'undefined',
		description: <>Application identifier passed to the press callback and used as the native main button name.</>,
	},
	{
		name: 'padding',
		type: 'number | string',
		defaultValue: 'calc(var(--spacing-m) - 4px)',
		description: <>Inner surface padding. Numbers are pixels; strings accept CSS shorthands.</>,
	},
];
const events: InfoBoxDocEvent[] = [
	{
		name: 'onClick',
		type: 'React.MouseEventHandler<HTMLButtonElement>',
		description: (
			<>
				Runs on main-button activation before <Code>onPress</Code>. Calling <Code>event.preventDefault()</Code> cancels{' '}
				<Code>onPress</Code>.
			</>
		),
	},
	{
		name: 'onPress',
		type: '(event: React.MouseEvent<HTMLButtonElement>, name: string | undefined, id: string | undefined) => void',
		description: (
			<>
				Runs when the main button is activated by pointer, Enter, or Space. Receives the event and the row’s{' '}
				<Code>name</Code> and <Code>id</Code>.
			</>
		),
	},
];
export default function InfoBoxDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">InfoBox component</H1>
			<P clipWidth>
				Present a profile, setting, or update in a compact row with an image, supporting text, and an optional action.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-infobox--default"
				components={[
					{
						label: 'Profile',
						component: <ProfilePreview />,
						code: { code: profileCode.trim(), filename: 'ProfileRow.tsx' },
					},
				]}
			/>
			<TipBox inline noBorder title="Tip:">
				Press the profile row to toggle its details. You can also focus it and press Enter or Space.
			</TipBox>
			<H2 id="usage">Usage</H2>
			<P>
				Compose <Code openURL="/docs/react/info-box-image/">InfoBoxImage</Code>,{' '}
				<Code openURL="/docs/react/info-box-title/">InfoBoxTitle</Code>,{' '}
				<Code openURL="/docs/react/info-box-content/">InfoBoxContent</Code>, and{' '}
				<Code openURL="/docs/react/info-box-action/">InfoBoxAction</Code>. Supply only the sections you need. In these
				snippets, <Code>openProfile</Code> and <Code>followUpdates</Code> are your application callbacks; replace the
				photo URL with your own asset.
			</P>
			<H3>Independent action</H3>
			<P>
				Use an action button when only the trailing control should respond. Omit the row’s <Code>onPress</Code> and{' '}
				<Code>onClick</Code> to keep its image and text static.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-infobox--action-button"
				components={[
					{
						label: 'Action button',
						component: <ActionPreview />,
						code: { code: actionCode.trim(), filename: 'ProfileAction.tsx' },
					},
				]}
			/>
			<H3>Without supporting text</H3>
			<P>
				Omitting <Code>InfoBoxContent</Code> centers the remaining sections vertically.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-infobox--no-content"
				components={[
					{
						label: 'Compact profile',
						component: <ActionPreview compact />,
						code: { code: compactCode.trim(), filename: 'CompactProfile.tsx' },
					},
				]}
			/>
			<H3>Text and action</H3>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-infobox--simple-info-box"
				components={[
					{
						label: 'Feature updates',
						component: <SimplePreview />,
						code: { code: simpleCode.trim(), filename: 'FeatureUpdates.tsx' },
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				Sections may appear in any JSX order, including inside fragments. The visual order is always image, title,
				content, then action. Duplicate sections and unsupported direct children throw an error; place custom content
				inside a named section.
			</P>
			<P>
				Title and content each truncate to one line. An empty text column is omitted. Use <Code>style.width</Code> for a
				full-width row and <Code>maxWidth</Code> to cap it.
			</P>
			<P>
				Providing <Code>onPress</Code> or <Code>onClick</Code> creates a button around the image and text. The trailing
				action remains separate, so activating it does not invoke the main press callback. Native wrapper events still
				follow normal bubbling.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				The main button takes its accessible name from its content; use <Code>aria-label</Code> or{' '}
				<Code>aria-labelledby</Code> when that content is insufficient. Tab focuses the button, Enter and Space activate
				it, and keyboard focus has a visible outline. Static rows have no added keyboard behavior.
			</P>
			<P>
				Keep controls inside <Code>InfoBoxAction</Code> when the row is pressable; image, title, and content belong
				inside the main button. Give meaningful images an <Code>alt</Code> description; leave decorative images empty.
				Decorative custom icons should use <Code>aria-hidden="true"</Code>. Hover transitions are disabled when reduced
				motion is requested.
			</P>
			<InfoBoxPropsReference entries={props} />
			<InfoBoxEventsReference entries={events} />
		</FlexBox>
	);
}
export const trackedItems = infoBoxTrackedItems('InfoBox', props, events);
