import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { LastUpdatedPreview } from './LastUpdatedPreview';
import { optionsCode, usageCode } from './code';

export function UseLastUpdatedDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>useLastUpdated hook</H1>
			<P clipWidth>
				Turn timestamps into readable labels such as “Just now” or “5 mins. ago”. Keep update times current without
				managing a refresh timer yourself.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/hooks-uselastupdated--demo"
				components={[{ label: 'useLastUpdated', component: <LastUpdatedPreview /> }]}
			/>
			<TipBox inline noBorder title="Tip:">
				Slide from now to two days ago to set the timestamp. Stop moving the slider and watch its label refresh every
				minute as time passes.
			</TipBox>
			<H2 id={'usage'}>Usage</H2>
			<P>
				Pass an ISO timestamp and render <Code>lastUpdated</Code>. In server-rendered apps (such as Next.js), use the
				hook in a component that runs on the client.
			</P>
			<CodeBlock filename="UpdatedAt.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Add a prefix and change the refresh interval</H3>
			<P>
				The second argument adds a prefix; include any space or punctuation you need. The third sets the refresh
				interval in minutes. This example refreshes every two minutes.
			</P>
			<CodeBlock filename="UpdatedAtWithPrefix.tsx" language="tsx" code={optionsCode.trim()} />
			<H2 id={'behavior'}>Behavior</H2>
			<P>
				Labels progress from <Code>Just now</Code> to minutes, hours, and days. At 15 days, the hook switches to a date
				formatted in US English using the current runtime’s time zone. The prefix applies to relative labels, but is
				omitted from that date.
			</P>
			<P>
				A missing or empty timestamp returns an empty string. An unparseable value returns <Code>Invalid date</Code>,
				preceded by the prefix if supplied. Future timestamps show <Code>Just now</Code> until time catches up.
			</P>
			<P>
				The hook formats a timestamp; it does not fetch new data or change the timestamp. Refreshes follow the
				configured interval, so labels do not necessarily change at the exact minute boundary. Background tabs may
				refresh later.
			</P>
			<H2 id={'lifecycle'}>Lifecycle</H2>
			<P>
				The initial label is calculated during rendering from the timestamp and current time. After mounting, the hook
				recalculates it and starts a timer when a timestamp is present. Changing any argument recalculates the label and
				replaces the timer; unmounting clears it.
			</P>
			<P>
				Server and client clocks or time zones can produce different initial labels. For a stable server-rendered
				placeholder, pass <Code>undefined</Code> until the component mounts, then supply the timestamp.
			</P>
			<H2 id={'parameters'}>Parameters</H2>
			<P>
				Argument order: <Code>useLastUpdated(timestamp, prefix?, interval?)</Code>.
			</P>
			<Definition id={'timestamp'}>
				<Prop>timestamp</Prop>
				<TypeDef>string | undefined</TypeDef>
			</Definition>
			<P>
				Required first argument. Pass an ISO date-time string with a time-zone offset or <Code>Z</Code> for an
				unambiguous instant. Pass <Code>undefined</Code> when no timestamp is available.
			</P>
			<Definition id={'prefix'}>
				<Prop>prefix</Prop>
				<TypeDef>string</TypeDef>
				<DefaultVal>''</DefaultVal>
			</Definition>
			<P>
				Optional text prepended to relative labels and invalid-date messages. To keep the default while setting
				interval, pass <Code>undefined</Code> as the second argument.
			</P>
			<Definition id={'interval'}>
				<Prop>interval</Prop>
				<TypeDef>number</TypeDef>
				<DefaultVal>1</DefaultVal>
			</Definition>
			<P>
				Optional refresh cadence in minutes. Use a finite number. Values below 1 use a one-minute cadence; fractions
				above 1 are supported.
			</P>
			<H2 id={'returns'}>Returns</H2>
			<P>Returns an object containing the formatted label and the supplied interval.</P>
			<Definition id={'lastUpdated'}>
				<Prop>lastUpdated</Prop>
				<TypeDef>string</TypeDef>
			</Definition>
			<P>The current label. Initially calculated from timestamp, or an empty string when timestamp is absent.</P>
			<Definition id={'timer'}>
				<Prop>timer</Prop>
				<TypeDef>number</TypeDef>
			</Definition>
			<P>
				The interval argument, defaulting to 1. This is a number of minutes, not a timer handle or countdown. It retains
				the supplied value even when the actual refresh cadence is clamped to one minute.
			</P>
		</FlexDiv>
	);
}

export const lastUpdatedTrackedItems: TrackedItem[] = [
	{ id: 'title', title: 'useLastUpdated hook' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'lifecycle', title: 'Lifecycle' },
	{
		id: 'parameters',
		title: 'Parameters',
		items: [
			{ id: 'timestamp', title: 'timestamp', code: true },
			{ id: 'prefix', title: 'prefix', code: true },
			{ id: 'interval', title: 'interval', code: true },
		],
	},
	{
		id: 'returns',
		title: 'Returns',
		items: [
			{ id: 'lastUpdated', title: 'lastUpdated', code: true },
			{ id: 'timer', title: 'timer', code: true },
		],
	},
];

export { UseLastUpdatedDoc as default, lastUpdatedTrackedItems as trackedItems };
