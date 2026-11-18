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
				Custom title content, used instead of <Code>title</Code> when non-null.
			</>
		),
	},
	{ name: 'title', type: 'string', defaultValue: 'undefined', description: <>Primary row text.</> },
];
export default function InfoBoxTitleHeaderDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">InfoBoxTitle component</H1>
			<P clipWidth>The primary text section of an InfoBox row.</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-infobox--default"
				components={[
					{
						label: 'InfoBoxTitle',
						component: <SectionPreview section="title" />,
						code: { code: usageCode.trim(), filename: 'InfoBoxTitleExample.tsx' },
					},
				]}
			/>
			<H2 id="usage">Usage</H2>
			<P>
				Place <Code>InfoBoxTitle</Code> inside <Code openURL="/docs/react/info-box/">InfoBox</Code>. Each row accepts
				one such section. Section placement in JSX does not change its visual position.
			</P>
			<H2 id="behavior">Behavior</H2>
			<P>
				The title appears above content regardless of JSX order. It uses bold body text in the primary text color and
				truncates to one line.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>This section renders a div, not a heading. Its text contributes to the accessible name of a pressable row.</P>
			<InfoBoxPropsReference entries={props} />
			<InfoBoxEventsReference />
		</FlexBox>
	);
}
export const trackedItems = infoBoxTrackedItems('InfoBoxTitle', props);
