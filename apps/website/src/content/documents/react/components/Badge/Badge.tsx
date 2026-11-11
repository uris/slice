import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import {
	BadgeColorsExample,
	BadgeLabelExample,
	BadgeOverflowExample,
	BadgeUsageExample,
	BadgeZeroExample,
} from './UsagePreviews';
import { accessibilityCode, colorsCode, labelCode, overflowCode, usageCode, zeroCode } from './code';

export function BadgeDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>Badge component</H1>
			<P clipWidth>
				Keep small updates visible. Badge adds a compact count or label to notifications, tabs, and navigation.
			</P>
			<H2 id={'usage'}>Usage</H2>
			<P>
				Set <Code>count</Code> to a number or short label.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-badge--default"
				components={[
					{
						label: 'Basic usage',
						component: <BadgeUsageExample />,
						code: usageCode.trim(),
						codeFilename: 'BadgeExample.tsx',
					},
				]}
			/>
			<H3>Show an overflowing count</H3>
			<P>
				Numeric counts above <Code>99</Code> display as <Code>99+</Code>. Keep the full count in the accessible label.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-badge--default"
				components={[
					{
						label: 'Count above 99',
						component: <BadgeOverflowExample />,
						code: overflowCode.trim(),
						codeFilename: 'BadgeOverflow.tsx',
					},
				]}
			/>
			<H3>Keep zero visible</H3>
			<P>
				Set <Code>hideZero</Code> to false when an empty count is still useful.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-badge--default"
				components={[
					{
						label: 'Keep zero visible',
						component: <BadgeZeroExample />,
						code: zeroCode.trim(),
						codeFilename: 'BadgeZero.tsx',
					},
				]}
			/>
			<H3>Show a label</H3>
			<P>
				Use a short string for a status or category, with <Code>variant="light"</Code> for the alternate color preset.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-badge--default"
				components={[
					{
						label: 'Show a label',
						component: <BadgeLabelExample />,
						code: labelCode.trim(),
						codeFilename: 'BadgeLabel.tsx',
					},
				]}
			/>
			<H3>Choose your colors</H3>
			<P>
				Override <Code>backgroundColor</Code> and <Code>textColor</Code> independently. Any omitted color still comes
				from the selected <Code>variant</Code>.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-badge--default"
				components={[
					{
						label: 'Choose your colors',
						component: <BadgeColorsExample />,
						code: colorsCode.trim(),
						codeFilename: 'BadgeColors.tsx',
					},
				]}
			/>
			<H2 id={'behavior'}>Behavior</H2>
			<P>
				Numbers above 99 display as <Code>99+</Code>. Strings are not capped or parsed as numbers, so
				<Code>"120"</Code> stays <Code>120</Code> and <Code>"0"</Code> remains visible.
			</P>
			<P>
				Numeric zero is hidden by default. Missing counts, blank labels, and non-finite numbers are always hidden. Keep
				labels short: the badge grows to fit its content and does not wrap.
			</P>
			<H2 id={'accessibility'}>Accessibility</H2>
			<P>
				Badge uses <Code>role="status"</Code> with polite, atomic announcements. Add an <Code>aria-label</Code>
				to explain what the count means, especially when the visible count is capped.
			</P>
			<CodeBlock filename="BadgeAccessibility.tsx" language="tsx" code={accessibilityCode.trim()} />
			<P>
				Keep the badge mounted with <Code>{'hideZero={false}'}</Code> when announcing updates from zero. If the
				surrounding control already announces the count, use <Code>aria-live="off"</Code> to avoid duplicate
				announcements. Badge itself has no keyboard action; put actions on a labeled control. Choose custom colors with
				enough contrast to keep the label readable.
			</P>
			<H2 id={'props'}>Props</H2>
			<P>All props are optional. Color props accept Slice theme tokens or CSS colors.</P>
			<Definition id={'backgroundColor'}>
				<Prop>backgroundColor</Prop>
				<TypeDef>ColorValue</TypeDef>
				<DefaultVal>variant background</DefaultVal>
			</Definition>
			<P>
				Fill color. Overrides the variant background while preserving its text color unless textColor is also supplied.
			</P>
			<Definition id={'count'}>
				<Prop>count</Prop>
				<TypeDef>{'number | string | null'}</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>Number or short label to display. Null, undefined, blank strings, NaN, and infinite numbers render nothing.</P>
			<Definition id={'hideZero'}>
				<Prop>hideZero</Prop>
				<TypeDef>boolean</TypeDef>
				<DefaultVal>true</DefaultVal>
			</Definition>
			<P>Hides numeric zero. Set to false to show 0. String labels are unaffected.</P>
			<Definition id={'textColor'}>
				<Prop>textColor</Prop>
				<TypeDef>ColorValue</TypeDef>
				<DefaultVal>variant text</DefaultVal>
			</Definition>
			<P>
				Text color. Overrides the variant text while preserving its background unless backgroundColor is also supplied.
			</P>
			<Definition id={'variant'}>
				<Prop>variant</Prop>
				<TypeDef>{"'light' | 'dark'"}</TypeDef>
				<DefaultVal>dark</DefaultVal>
			</Definition>
			<P>
				Theme color preset. Dark uses <Code>core-badge-primary</Code> with light text; light uses{' '}
				<Code>core-badge-secondary</Code> with primary text.
			</P>
			<Definition id={'divAttributes'}>
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Native div attributes pass through, including id, className, style, data-* and aria-*. Class names are appended,
				styles are merged, and accessibility attributes can override the defaults. Children are not rendered.
			</P>
			<H2 id={'events'}>Events</H2>
			<P>
				Badge has no custom callbacks. Update its value through <Code>count</Code>.
			</P>
			<Definition id={'divEvents'}>
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>Native React handlers pass through to the badge and receive the standard event.</P>
		</FlexBox>
	);
}

export const badgeTrackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Badge component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'count', title: 'count', code: true },
			{ id: 'hideZero', title: 'hideZero', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'variant', title: 'variant', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [{ id: 'divEvents', title: '...divEvents', code: true }],
	},
];

export { BadgeDoc as default, badgeTrackedItems as trackedItems };
