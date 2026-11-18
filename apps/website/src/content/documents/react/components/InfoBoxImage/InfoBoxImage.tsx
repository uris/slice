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
		name: 'alt',
		type: 'string',
		defaultValue: "''",
		description: (
			<>
				Text alternative for <Code>src</Code>. Empty means decorative.
			</>
		),
	},
	{
		name: 'children',
		type: 'React.ReactNode',
		defaultValue: 'undefined',
		description: (
			<>
				Custom leading content, such as an <Code openURL="/docs/react/avatar/">Avatar</Code>. Takes precedence over the
				image and icon props.
			</>
		),
	},
	{
		name: 'height',
		type: 'number | string',
		defaultValue: 'undefined',
		description: (
			<>
				Height attribute for the image rendered by <Code>src</Code>. Does not size custom children or icons.
			</>
		),
	},
	{
		name: 'iconName',
		type: 'SliceIcon',
		defaultValue: 'undefined',
		description: <>Fallback icon when neither custom children nor an image source is supplied.</>,
	},
	{
		name: 'iconSize',
		type: 'number',
		defaultValue: 'undefined',
		description: <>Fallback icon size in pixels; omitted values use the Icon default.</>,
	},
	{
		name: 'iconStrokeColor',
		type: 'ColorValue',
		defaultValue: 'undefined',
		description: <>Fallback icon stroke color; omitted values use the Icon default.</>,
	},
	{
		name: 'iconStrokeWidth',
		type: 'number',
		defaultValue: 'undefined',
		description: <>Fallback icon stroke width; omitted values use the Icon default.</>,
	},
	{
		name: 'src',
		type: 'string',
		defaultValue: 'undefined',
		description: <>Image URL, used before the fallback icon.</>,
	},
	{
		name: 'width',
		type: 'number | string',
		defaultValue: 'undefined',
		description: (
			<>
				Width attribute for the image rendered by <Code>src</Code>. Does not size custom children or icons.
			</>
		),
	},
];
export default function InfoBoxImageHeaderDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">InfoBoxImage component</H1>
			<P clipWidth>An image, avatar, or icon at the leading edge of an InfoBox.</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-infobox--default"
				components={[
					{
						label: 'InfoBoxImage',
						component: <SectionPreview section="image" />,
						code: { code: usageCode.trim(), filename: 'InfoBoxImageExample.tsx' },
					},
				]}
			/>
			<H2 id="usage">Usage</H2>
			<P>
				Place <Code>InfoBoxImage</Code> inside <Code openURL="/docs/react/info-box/">InfoBox</Code>. Each row accepts
				one such section. Section placement in JSX does not change its visual position.
			</P>
			<H2 id="behavior">Behavior</H2>
			<P>
				The image section occupies the leading position and does not shrink. Custom children take precedence over src,
				then iconName. Dimensions apply to the built-in image only; size an <Code>Avatar</Code> through its own{' '}
				<Code>size</Code> prop.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				Provide <Code>alt</Code> for meaningful images. For custom children, configure their own text alternatives. Hide
				purely decorative custom icons from assistive technology.
			</P>
			<InfoBoxPropsReference entries={props} />
			<InfoBoxEventsReference />
		</FlexBox>
	);
}
export const trackedItems = infoBoxTrackedItems('InfoBoxImage', props);
