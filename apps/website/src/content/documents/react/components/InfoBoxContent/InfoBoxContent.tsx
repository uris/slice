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
		name: 'children',
		type: 'React.ReactNode',
		defaultValue: 'undefined',
		description: (
			<>
				Custom supporting content, used instead of <Code>text</Code> when non-null.
			</>
		),
	},
	{ name: 'text', type: 'string', defaultValue: 'undefined', description: <>Supporting row text.</> },
];
export default function InfoBoxContentHeaderDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">InfoBoxContent component</H1>
			<P clipWidth>Supporting text beneath the InfoBox title.</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-infobox--default"
				components={[
					{
						label: 'InfoBoxContent',
						component: <SectionPreview section="content" />,
						code: { code: usageCode.trim(), filename: 'InfoBoxContentExample.tsx' },
					},
				]}
			/>
			<H2 id="usage">Usage</H2>
			<P>
				Place <Code>InfoBoxContent</Code> inside <Code openURL="/docs/react/info-box/">InfoBox</Code>. Each row accepts
				one such section. Section placement in JSX does not change its visual position.
			</P>
			<H2 id="behavior">Behavior</H2>
			<P>
				Content appears beneath the title, uses the secondary text color, and truncates to one line. Its presence aligns
				the row sections to the top.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>Keep supporting text concise and use noninteractive content when the parent row is pressable.</P>
			<InfoBoxPropsReference entries={props} />
			<InfoBoxEventsReference />
		</FlexBox>
	);
}
export const trackedItems = infoBoxTrackedItems('InfoBoxContent', props);
