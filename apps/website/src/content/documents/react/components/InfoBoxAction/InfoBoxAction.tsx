import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import { Path } from '@/components/Path/Path';
import { Code, H1, H2, P } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import {
	type InfoBoxDocProp,
	InfoBoxEventsReference,
	InfoBoxPropsReference,
	infoBoxTrackedItems,
} from '../InfoBox/Reference';
import { SectionPreview } from '../InfoBox/UsagePreviews';
import { usageCode } from './code';
const props: InfoBoxDocProp[] = [
	{
		name: 'badge',
		type: 'BadgeProps',
		defaultValue: 'undefined',
		description: (
			<>
				Badge props, used when custom children, <Code>button</Code>, and <Code>chip</Code> are absent.
			</>
		),
	},
	{
		name: 'button',
		type: 'ButtonProps',
		defaultValue: 'undefined',
		description: (
			<>
				Button props, used before <Code>chip</Code> and <Code>badge</Code>. The inferred <Code>textSize</Code> is{' '}
				<Code>m</Code>; explicit props override it.
			</>
		),
	},
	{
		name: 'children',
		type: 'React.ReactNode',
		defaultValue: 'undefined',
		description: <>Custom action content. Non-null children take precedence over all shorthand controls.</>,
	},
	{
		name: 'chip',
		type: 'ChipProps',
		defaultValue: 'undefined',
		description: (
			<>
				Chip props, used before <Code>badge</Code>. The inferred <Code>textSize</Code> is <Code>m</Code>; explicit props
				override it.
			</>
		),
	},
	{
		name: 'contentGap',
		type: 'number | string',
		defaultValue: 'var(--spacing-xxl)',
		description: <>Left margin before the action, in addition to the row’s normal gap. Numbers are pixels.</>,
	},
];
export default function InfoBoxActionHeaderDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">InfoBoxAction component</H1>
			<P clipWidth>A trailing button, chip, badge, or custom control in an InfoBox.</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-infobox--action-button"
				components={[
					{
						label: 'InfoBoxAction',
						component: <SectionPreview section="action" />,
						code: { code: usageCode.trim(), filename: 'InfoBoxActionExample.tsx' },
					},
				]}
			/>
			<H2 id="usage">Usage</H2>
			<P>
				Place <Code>InfoBoxAction</Code> inside <Code openURL="/docs/react/info-box/">InfoBox</Code>. Each row accepts
				one such section. Section placement in JSX does not change its visual position.
			</P>
			<H2 id="behavior">Behavior</H2>
			<P>
				The action occupies the trailing position and stretches its wrapper to center the control vertically. Non-null
				custom children take precedence, followed by <Code>button</Code>, <Code>chip</Code>, then <Code>badge</Code>.
				Only one shorthand control is rendered.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				Action controls retain their own accessible names, keyboard support, and disabled state. A decorative chevron
				should be hidden from assistive technology. The parent row’s <Code>disabled</Code> prop does not disable
				independent action controls.
			</P>
			<InfoBoxPropsReference entries={props} />
			<InfoBoxEventsReference />
		</FlexBox>
	);
}
export const trackedItems = infoBoxTrackedItems('InfoBoxAction', props);
