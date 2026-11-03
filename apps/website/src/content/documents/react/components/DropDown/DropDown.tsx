import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { DropDownPreview } from './DropDownPreview';
import { typedCode, usageCode } from './code';
export function DropDownDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">DropDown component</H1>
			<P clipWidth>{'Offer a focused set of choices with native selection, optional labels, and typed option data.'}</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-dropdown--default"
				components={[
					{ label: 'Status selection', component: <DropDownPreview /> },
					{ label: 'Labeled selection', component: <DropDownPreview variant="labeled" /> },
					{ label: 'Bottom border', component: <DropDownPreview variant="bottom" /> },
				]}
			/>
			<H2 id="usage">Usage</H2>
			<P>
				{'Provide labeled '}
				<Code>{'options'}</Code>
				{' and a meaningful '}
				<Code>{'name'}</Code>
				{'. Use '}
				<Code>{'selectedIndex'}</Code>
				{' to initialize the visible choice.'}
			</P>
			<CodeBlock filename="DropDownExample.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Use typed values</H3>
			<P>
				{'For object-valued options, '}
				<Code>{'valueKey'}</Code>
				{' matches equivalent objects by a stable field.'}
			</P>
			<CodeBlock filename="DropDownExample2.tsx" language="tsx" code={typedCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				{'The native select is covered by a styled face. Initialize '}
				<Code>{'selectedIndex'}</Code>
				{' or '}
				<Code>{'selectedValue'}</Code>
				{
					' so the face matches its selection; without either, the face starts with a fixed prompt even when the native select has a first option.'
				}
			</P>
			<P>
				{'Selection is stored locally. Prop changes synchronize it, but the API is not strictly controlled. '}
				<Code>{'selectedValue'}</Code>
				{' takes precedence over '}
				<Code>{'selectedIndex'}</Code>
				{'; an unmatched value keeps the previous choice.'}
			</P>
			<P>
				<Code>{'placeholder'}</Code>
				{
					' styles index zero. To offer a prompt, include that first option yourself. Typed option values are callback metadata; native option values remain indexes.'
				}
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{'The native select provides standard keyboard interaction and uses '}
				<Code>{'name'}</Code>
				{' as its accessible label. The visible '}
				<Code>{'label'}</Code>
				{' is not currently associated with it; the chevron also needs decorative-icon handling.'}
			</P>
			<P>
				<Code>{'disabled'}</Code>
				{
					' currently blocks pointer-down but leaves the native select enabled for keyboard interaction. It also lacks a native form name, so do not rely on automatic form serialization yet.'
				}
			</P>
			<P>
				{
					'Wrapper attributes do not configure the inner select. The component does not currently disable its CSS transitions for reduced-motion preferences.'
				}
			</P>
			<H2 id="props">Props</H2>
			<P>All component props are optional. Color props accept Slice theme tokens or CSS colors.</P>
			<Definition id={'backgroundColor'}>
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>{'Background of the visible selection field.'}</P>
			<Definition id={'borderColor'}>
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>
				{
					'Outline or bottom-border color. The bottom border currently uses this value directly, including during error state.'
				}
			</P>
			<Definition id={'borderRadius'}>
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'8'}</DefaultVal>
			</Definition>
			<P>{'Corner radius in box mode; other border modes use zero radius.'}</P>
			<Definition id={'borderSize'}>
				<Prop>borderSize</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'1'}</DefaultVal>
			</Definition>
			<P>
				{'Legacy fallback for border thickness. '}
				<Code>{'borderWidth'}</Code>
				{' takes precedence.'}
			</P>
			<Definition id={'borderStyle'}>
				<Prop>borderStyle</Prop>
				<TypeDef>{"'bottom' | 'box' | 'none'"}</TypeDef>
				<DefaultVal>{'box'}</DefaultVal>
			</Definition>
			<P>{'Chooses a full box, bottom border, or no border. Non-box modes keep only bottom padding.'}</P>
			<Definition id={'borderWidth'}>
				<Prop>borderWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'borderSize (1)'}</DefaultVal>
			</Definition>
			<P>
				{'Border thickness in pixels. Takes priority over '}
				<Code>{'borderSize'}</Code>
				{', including an explicit zero.'}
			</P>
			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{
					'Applies disabled colors and blocks pointer-down on the native select. It does not currently disable keyboard selection.'
				}
			</P>
			<Definition id={'error'}>
				<Prop>error</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Uses the warning box-border color. The separate bottom-border path currently keeps '}
				<Code>{'borderColor'}</Code>
				{'.'}
			</P>
			<Definition id={'gap'}>
				<Prop>gap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'8'}</DefaultVal>
			</Definition>
			<P>{'Gap between the visible label, selected text, and chevron, in pixels.'}</P>
			<Definition id={'height'}>
				<Prop>height</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'auto'}</DefaultVal>
			</Definition>
			<P>{'Currently formats a CSS variable that is not consumed; it does not set the field height.'}</P>
			<Definition id={'iconColor'}>
				<Prop>iconColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>{'Chevron color. Disabled state uses the disabled text token.'}</P>
			<Definition id={'iconSize'}>
				<Prop>iconSize</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'20'}</DefaultVal>
			</Definition>
			<P>{'Chevron size in pixels.'}</P>
			<Definition id={'inline'}>
				<Prop>inline</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Uses inline-flex layout and horizontal '}
				<Code>{'spacing-xs'}</Code>
				{' margins.'}
			</P>
			<Definition id={'label'}>
				<Prop>label</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Visible label beside the selected text. The select’s accessible name currently comes from '}
				<Code>{'name'}</Code>
				{'.'}
			</P>
			<Definition id={'labelColor'}>
				<Prop>labelColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>{'Visible label color. Disabled state overrides it.'}</P>
			<Definition id={'name'}>
				<Prop>name</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'drop-down-select'}</DefaultVal>
			</Definition>
			<P>{'Accessible label for the native select. It is not currently forwarded as the select’s form name.'}</P>
			<Definition id={'options'}>
				<Prop>options</Prop>
				<TypeDef>{'DropDownOption<T>[]'}</TypeDef>
				<DefaultVal>{'[]'}</DefaultVal>
			</Definition>
			<P>
				{'Choice data shaped as '}
				<Code>{'{ label?: string; value?: T; alt?: string }'}</Code>
				{'. '}
				<Code>{'alt'}</Code>
				{' supports value matching. Native option values are render indexes, not these typed values.'}
			</P>
			<Definition id={'paddingBottom'}>
				<Prop>paddingBottom</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'var(--spacing-s)'}</DefaultVal>
			</Definition>
			<P>{'Bottom padding in pixels or CSS units, retained in every border mode.'}</P>
			<Definition id={'paddingLeft'}>
				<Prop>paddingLeft</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'var(--spacing-m)'}</DefaultVal>
			</Definition>
			<P>{'Left padding in box mode.'}</P>
			<Definition id={'paddingRight'}>
				<Prop>paddingRight</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'calc(var(--spacing-m) - var(--spacing-xs))'}</DefaultVal>
			</Definition>
			<P>{'Right padding in box mode, reduced for the chevron’s internal space.'}</P>
			<Definition id={'paddingTop'}>
				<Prop>paddingTop</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'var(--spacing-s)'}</DefaultVal>
			</Definition>
			<P>{'Top padding in box mode.'}</P>
			<Definition id={'placeholder'}>
				<Prop>placeholder</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				{'Uses placeholder styling for index zero. It does not create an option or change the fixed initial prompt.'}
			</P>
			<Definition id={'selectedIndex'}>
				<Prop>selectedIndex</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0 locally'}</DefaultVal>
			</Definition>
			<P>
				{'Synchronizes local selection when '}
				<Code>{'selectedValue'}</Code>
				{' is absent. Invalid indexes are ignored.'}
			</P>
			<Definition id={'selectedValue'}>
				<Prop>selectedValue</Prop>
				<TypeDef>{'T'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Preferred selection input. Matches by value identity, '}
				<Code>{'valueKey'}</Code>
				{', or case-insensitive label/alt text. Unmatched values leave the previous selection unchanged.'}
			</P>
			<Definition id={'textColor'}>
				<Prop>textColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>{'Selected-text color outside disabled state and index-zero placeholder styling.'}</P>
			<Definition id={'textSize'}>
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>{'Typography size for the label and selected text.'}</P>
			<Definition id={'validate'}>
				<Prop>validate</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{
					'Declared in the public type but not consumed. It does not validate selection and is currently forwarded to the outer wrapper.'
				}
			</P>
			<Definition id={'valueKey'}>
				<Prop>valueKey</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Property used to match object values with the same identity field, such as '}
				<Code>{'id'}</Code>
				{'.'}
			</P>
			<Definition id={'width'}>
				<Prop>width</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'100%'}</DefaultVal>
			</Definition>
			<P>{'Width of the outer field as a CSS string.'}</P>
			<Definition id={'spanAttributes'}>
				<Prop>...spanAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Native attributes and handlers apply to the outer wrapper, not the inner control. '}
				<Code>{'className'}</Code>
				{' is appended and '}
				<Code>{'style'}</Code>
				{
					' is merged; component CSS variables take priority. The wrapper is a span even though these attributes are currently typed for a div.'
				}
			</P>
			<H2 id="events">Events</H2>
			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(index: number, option: DropDownOption<T>) => void'}</TypeDef>
			</Definition>
			<P>{'Runs when a different index is chosen. Reports the render index and original typed option.'}</P>
			<Definition id={'onOption'}>
				<Method>onOption</Method>
				<TypeDef>{'(option: DropDownOption<T>) => void'}</TypeDef>
			</Definition>
			<P>
				{'Runs after '}
				<Code>{'onChange'}</Code>
				{' with the same selected option. Prop-driven synchronization does not emit either callback.'}
			</P>
			<Definition id="nativeEvents">
				<Method>...spanEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				Other native handlers apply to the outer wrapper. No Motion gesture or animation lifecycle callbacks are part of
				the documented component API.
			</P>
		</FlexDiv>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'DropDown component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderSize', title: 'borderSize', code: true },
			{ id: 'borderStyle', title: 'borderStyle', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'error', title: 'error', code: true },
			{ id: 'gap', title: 'gap', code: true },
			{ id: 'height', title: 'height', code: true },
			{ id: 'iconColor', title: 'iconColor', code: true },
			{ id: 'iconSize', title: 'iconSize', code: true },
			{ id: 'inline', title: 'inline', code: true },
			{ id: 'label', title: 'label', code: true },
			{ id: 'labelColor', title: 'labelColor', code: true },
			{ id: 'name', title: 'name', code: true },
			{ id: 'options', title: 'options', code: true },
			{ id: 'paddingBottom', title: 'paddingBottom', code: true },
			{ id: 'paddingLeft', title: 'paddingLeft', code: true },
			{ id: 'paddingRight', title: 'paddingRight', code: true },
			{ id: 'paddingTop', title: 'paddingTop', code: true },
			{ id: 'placeholder', title: 'placeholder', code: true },
			{ id: 'selectedIndex', title: 'selectedIndex', code: true },
			{ id: 'selectedValue', title: 'selectedValue', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'validate', title: 'validate', code: true },
			{ id: 'valueKey', title: 'valueKey', code: true },
			{ id: 'width', title: 'width', code: true },
			{ id: 'spanAttributes', title: '...spanAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onChange', title: 'onChange', code: true },
			{ id: 'onOption', title: 'onOption', code: true },
			{ id: 'nativeEvents', title: '...spanEvents', code: true },
		],
	},
];
export default DropDownDoc;
