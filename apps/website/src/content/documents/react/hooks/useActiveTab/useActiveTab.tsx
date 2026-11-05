import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { ActiveTabPreview } from './ActiveTabPreview';
import { focusCode, usageCode } from './code';

export function UseActiveTabDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>useActiveTab hook</H1>
			<P clipWidth>
				Know when your page is visible and when it has focus. Use that state to adapt background work and keep your
				interface in step with the user.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/hooks-useactivetab--demo"
				components={[{ label: 'useActiveTab', component: <ActiveTabPreview /> }]}
			/>
			<TipBox inline noBorder title="Tip:">
				Switch tabs, or fully cover this window with another and move it away. Coverage detection depends on your
				browser and OS. Each indicator waits 500ms before switching on; the hook itself updates immediately. These
				switches display state and cannot be toggled.
			</TipBox>
			<H2 id={'usage'}>Usage</H2>
			<P>
				Call <Code>useActiveTab()</Code> at the top level of a component or custom hook. In server-rendered apps (such
				as Next.js), use it in a component that runs on the client.
			</P>
			<CodeBlock filename="TabStatus.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Require visibility and focus</H3>
			<P>
				A visible page can still be unfocused. Combine <Code>isActiveTab</Code> and <Code>isTabFocused</Code> when both
				matter.
			</P>
			<CodeBlock filename="FocusStatus.tsx" language="tsx" code={focusCode.trim()} />
			<H2 id={'behavior'}>Behavior</H2>
			<P>
				<Code>isActiveTab</Code> means the document is visible; it does not require focus. <Code>isTabFocused</Code>{' '}
				reports whether focus is within the document.
			</P>
			<P>
				The hook updates on document visibility changes and window focus or blur. It reports state only: your
				application decides whether to pause work, refresh data, or resume an animation.
			</P>
			<P>
				Visibility follows the browser’s report. It does not measure how much of a window is covered or whether someone
				is paying attention.
			</P>
			<H2 id={'lifecycle'}>Lifecycle</H2>
			<P>
				The server and initial client render return <Code>isActiveTab: false</Code>, <Code>isTabFocused: false</Code>,
				and <Code>visibilityState: 'hidden'</Code>. After mounting, the hook reads the current document state. These
				initial values are a starting snapshot, not a confirmed hidden page.
			</P>
			<P>
				Each hook instance attaches its own listeners and removes them on unmount. Repeated browser events with
				unchanged visibility and focus preserve the returned object. Without a document, the initial values remain in
				place.
			</P>
			<H2 id={'parameters'}>Parameters</H2>
			<P>None</P>
			<H2 id={'returns'}>Returns</H2>
			<P>
				Returns a <Code>UseActiveTabReturn</Code> object. The values below are the initial snapshot before the first
				effect runs.
			</P>
			<Definition id={'isActiveTab'}>
				<Prop>isActiveTab</Prop>
				<TypeDef>boolean</TypeDef>
				<DefaultVal>false</DefaultVal>
			</Definition>
			<P>
				True when <Code>document.visibilityState</Code> is <Code>'visible'</Code>, even if another window has focus.
			</P>
			<Definition id={'isTabFocused'}>
				<Prop>isTabFocused</Prop>
				<TypeDef>boolean</TypeDef>
				<DefaultVal>false</DefaultVal>
			</Definition>
			<P>
				The result of <Code>document.hasFocus()</Code>. Independent of the visibility flag.
			</P>
			<Definition id={'visibilityState'}>
				<Prop>visibilityState</Prop>
				<TypeDef>DocumentVisibilityState</TypeDef>
				<DefaultVal>'hidden'</DefaultVal>
			</Definition>
			<P>
				The browser-reported document visibility: <Code>'visible'</Code> or <Code>'hidden'</Code>.
			</P>
		</FlexDiv>
	);
}

export const activeTabTrackedItems: TrackedItem[] = [
	{ id: 'title', title: 'useActiveTab hook' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'lifecycle', title: 'Lifecycle' },
	{ id: 'parameters', title: 'Parameters' },
	{
		id: 'returns',
		title: 'Returns',
		items: [
			{ id: 'isActiveTab', title: 'isActiveTab', code: true },
			{ id: 'isTabFocused', title: 'isTabFocused', code: true },
			{ id: 'visibilityState', title: 'visibilityState', code: true },
		],
	},
];

export { UseActiveTabDoc as default, activeTabTrackedItems as trackedItems };
