import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { SpacerExample } from './Preview';
import { usageCode } from './code';

export default function SpacerDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Spacer component</H1>
			<P clipWidth>Reserve a fixed square of empty space using the theme spacing grid.</P>
			<H2 id="usage">Usage</H2>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-spacer--default"
				components={[
					{
						label: 'Spacing sizes',
						component: <SpacerExample />,
						code: usageCode,
						codeFilename: 'SpacerExample.tsx',
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				The default square is 8px on each side. It does not shrink in flex layouts, and its dimensions take priority
				over conflicting <Code>style</Code> values. Use a parent’s <Code>gap</Code> for regular spacing between repeated
				items.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>Spacer has no status or interactive semantics. Keep it empty and avoid adding focus or click behavior.</P>
			<H2 id="props">Props</H2>
			<Definition id="size">
				<Prop>size</Prop>
				<TypeDef>{"'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'h'"}</TypeDef>
				<DefaultVal>s</DefaultVal>
			</Definition>
			<P>
				Spacing token for both dimensions: 2, 4, 8, 16, 24, 32, 64, or 128px by default. Custom theme spacing tokens are
				respected.
			</P>
			<Definition id="divAttributes">
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Native attributes apply to the root div. <Code>className</Code> is forwarded and <Code>style</Code> is merged;
				component dimensions take priority. Native children are forwarded; leave the spacer empty for predictable
				layout.
			</P>
			<H2 id="events">Events</H2>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>Standard div event handlers apply to the root.</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Spacer component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'size', title: 'size', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{ id: 'events', title: 'Events', items: [{ id: 'nativeEvents', title: '...divEvents', code: true }] },
];
