import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { Fragment } from 'react';
import { TipPreview } from './TipPreview';
import { applicationCode, customCode, motionCode, usageCode } from './code';

const tipProps = [
	{
		name: 'backgroundColor',
		type: 'ColorValue',
		defaultValue: 'core-surface-secondary',
		description: 'Tooltip background.',
	},
	{ name: 'border', type: 'boolean', defaultValue: 'true', description: 'Shows a 1px border.' },
	{ name: 'borderColor', type: 'ColorValue', defaultValue: 'core-outline-primary', description: 'Border color.' },
	{
		name: 'borderRadius',
		type: 'number | string',
		defaultValue: 'corner-xs (4px)',
		description: 'Corner radius. Numbers use pixels; CSS lengths pass through.',
	},
	{
		name: 'coords',
		type: '{ x: number; y: number }',
		defaultValue: 'undefined',
		description: 'Viewport position returned by useToolTip. Undefined hides the tip and cancels timers.',
	},
	{
		name: 'hideDelay',
		type: 'number',
		defaultValue: '2500',
		description: 'Visible lifetime in milliseconds, overridden by tip.payload.duration.',
	},
	{
		name: 'padding',
		type: 'number | string',
		defaultValue: '4px 8px',
		description: 'Inner spacing. Explicit zero is respected.',
	},
	{
		name: 'showDelay',
		type: 'number',
		defaultValue: '500',
		description: 'Delay before showing a new request, in milliseconds. Separate from the reveal animation duration.',
	},
	{
		name: 'textColor',
		type: 'ColorValue',
		defaultValue: 'core-text-primary',
		description: 'Text color. Accepts Slice tokens or CSS colors.',
	},
	{ name: 'textSize', type: "'xs' | 's' | 'm' | 'l' | 'xl'", defaultValue: 's', description: 'Body typography size.' },
	{
		name: 'tip',
		type: 'ToolTip | null',
		defaultValue: 'undefined',
		description: 'Request received through onToolTip. Pass null to clear.',
	},
	{
		name: 'divAttributes',
		type: 'React.HTMLAttributes<HTMLDivElement>',
		defaultValue: 'undefined',
		description:
			'Native div attributes target the permanently mounted wrapper. Classes are appended and styles merged. Content, ARIA semantics, animation, native color, drag, and animation-start handlers are component-managed or excluded.',
	},
];

export function TipDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Tip component</H1>
			<P clipWidth>Add a short hint beside an action without pulling people away from their work.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Slice components handle tooltip activation and cleanup for you.{' '}
				<Code openURL="/docs/react/button/">Button</Code>, <Code openURL="/docs/react/icon-button/">IconButton</Code>,{' '}
				<Code openURL="/docs/react/toggle-button/">ToggleButton</Code>, and{' '}
				<Code openURL="/docs/react/chip/">Chip</Code> handle hover and focus and supply the hint label and
				source-element ref through <Code>onToolTip</Code>.
			</P>
			<P>
				Add a <Code>tooltip</Code> label and connect <Code>onToolTip</Code> to <Code>tipActions.push</Code>. The shared{' '}
				<Code>Tip</Code> handles positioning, timing, and dismissal.
			</P>
			<TipBox inline noBorder>
				Hover or focus Project details. Press Escape or click to dismiss.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-tip--keyboard-and-association"
				components={[
					{
						label: 'Button tooltip',
						component: <TipPreview />,
						code: usageCode.trim(),
						codeFilename: 'ProjectButton.tsx',
					},
				]}
			/>
			<H3>Set up the shared Tip</H3>
			<P>
				Mount <Code>ApplicationTip</Code> once in your app shell. It reads the shared tip data and uses{' '}
				<Code>useToolTip</Code> to position the hint beside its source element.
			</P>
			<CodeBlock language="tsx" filename="ApplicationTip.tsx" code={applicationCode.trim()} />
			<H2 id="custom-components">Tooltips for your own components</H2>
			<P>
				Expose the same <Code>onToolTip</Code> callback. Send a <Code>ToolTip</Code> containing the label and a ref to
				your element; send <Code>null</Code> when the interaction ends or the control is clicked.
			</P>
			<P>
				Support both hover and focus. Clear on leave or blur only when neither remains. Connect your component to{' '}
				<Code>tipActions.push</Code> to use the shared <Code>Tip</Code>.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-tip--keyboard-and-association"
				components={[
					{
						label: 'Profile button tooltip',
						component: <TipPreview custom />,
						code: customCode.trim(),
						codeFilename: 'ProfileTrigger.tsx',
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				The wrapper stays mounted while hidden so <Code>useToolTip</Code> can measure it. A nonempty{' '}
				<Code>tip.payload.label</Code> and finite <Code>coords</Code> schedule display. Position follows the source
				element, flips above when needed, and stays within the viewport.
			</P>
			<P>
				Tips appear after <Code>showDelay</Code> (500ms), fade in over 150ms, and hide instantly. <Code>hideDelay</Code>{' '}
				sets the visible lifetime (2500ms); <Code>tip.payload.duration</Code> overrides it. Moving the source element
				does not restart timers.
			</P>
			<P>
				Clearing the tip, expiry, Escape, or a click cancels pending work and hides the hint. A new request can show it
				again.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				<Code>Tip</Code> uses <Code>role="tooltip"</Code> and associates the visible hint with its source through{' '}
				<Code>aria-describedby</Code>, preserving existing descriptions. Escape dismisses without moving focus.
			</P>
			<P>
				Custom triggers must support keyboard focus as well as hover. Tips contain descriptive text; use a menu or
				dialog for interactive content. Reduced-motion preferences disable animation while retaining the show delay and
				lifetime.
			</P>
			<H2 id="props">Props</H2>
			<P>All component props are optional.</P>
			{tipProps.map(({ name, type, defaultValue, description }) => (
				<Fragment key={name}>
					<Definition id={name}>
						<Prop>{name === 'divAttributes' ? '...divAttributes' : name}</Prop>
						<TypeDef>{type}</TypeDef>
						<DefaultVal>{defaultValue}</DefaultVal>
					</Definition>
					<P>{description}</P>
				</Fragment>
			))}
			<H2 id="motion">Motion</H2>
			<Definition id="motionValues">
				<Prop>motionValues</Prop>
				<TypeDef>Variants</TypeDef>
				<DefaultVal>opacity 0 → 1</DefaultVal>
			</Definition>
			<P>
				Overrides the <Code>initial</Code> and <Code>animate</Code> states. Each reveal resets its initial state. Exit
				variants are not used because removal is immediate.
			</P>
			<Definition id="transition">
				<Prop>transition</Prop>
				<TypeDef>Transition</TypeDef>
				<DefaultVal>150ms; Water easing</DefaultVal>
			</Definition>
			<P>
				Customizes reveal timing and easing. Hiding always stops animation and changes visibility immediately. Reduced
				motion overrides custom movement and animation delays.
			</P>
			<CodeBlock language="tsx" code={motionCode.trim()} />
			<H2 id="events">Events</H2>
			<P>
				Native wrapper handlers are forwarded. Document-level click and Escape handling remains active while a valid
				request exists.
			</P>
			<H2 id="ref">Ref</H2>
			<Definition id="componentRef">
				<Prop>ref</Prop>
				<TypeDef>React.Ref&lt;HTMLDivElement&gt;</TypeDef>
			</Definition>
			<P>
				Points to the mounted wrapper, including while hidden. Pass the same ref to <Code>useToolTip</Code>. Missing or
				removed anchors produce undefined coordinates.
			</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Tip component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'custom-components', title: 'Tooltips for your own components' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: tipProps.map(({ name }) => ({
			id: name,
			title: name === 'divAttributes' ? '...divAttributes' : name,
			code: true,
		})),
	},
	{ id: 'motion', title: 'Motion', items: ['motionValues', 'transition'].map((id) => ({ id, title: id, code: true })) },
	{ id: 'events', title: 'Events' },
	{ id: 'ref', title: 'Ref', items: [{ id: 'componentRef', title: 'ref', code: true }] },
];
export default TipDoc;
