import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { usageCode } from '@/documents/Avatar/code';
import { Avatar, FlexDiv, Preset } from '@apple-pie/slice';

export function AvatarDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>Avatar component</H1>
			<P clipWidth>
				Renders a user profile image or fallback initials. Use it for identity surfaces where an image may or may not be
				available.
			</P>
			<ComponentCanvas
				name={'Avatar'}
				components={
					<Avatar
						name={'John Wick'}
						size={40}
						frame={40}
						borderWidth={1}
						borderColor={'transparent'}
						borderColorHover={'core-link-primary'}
						backgroundColor={'array-sky-label'}
						image={'/images/jw-profile.png'}
						onClick={() => null}
					/>
				}
			/>
			<H2 id={'usage'}>Usage</H2>
			<P>
				There's a <Code>Avatar</Code> component for every HTML and SVG element, for instance motion.div, motion.circle
				etc. It extends standard React components with animation props that run at up to 120fps - without triggering
				React re-renders.
			</P>
			<CodeBlock filename="code.ts" language="tsx" code={usageCode.trim()} />
			<H3>Behavior</H3>
			<P>
				There's a component for every HTML and SVG element, for instance motion.div, motion.circle etc. It extends
				standard React components with animation props that run at up to 120fps - without triggering React re-renders.
			</P>
			<P>
				There's a component for every HTML and SVG element, for instance motion.div, motion.circle etc. It extends
				standard React components with animation props that run at up to 120fps - without triggering React re-renders.
			</P>
			<H2 id={'props'}>Props</H2>
			<Definition id={'borderColor'}>
				<Prop>borderColor</Prop>
				<TypeDef>string</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>There's a component for every HTML and SVG element, for instance motion.div, motion.circle etc. It extends.</P>
			<Definition id={'backgroundColor'}>
				<Prop>borderColor</Prop>
				<TypeDef>string</TypeDef>
				<DefaultVal>core-outline-primary</DefaultVal>
			</Definition>
			<P>There's a component for every HTML and SVG element, for instance motion.div, motion.circle etc. It extends.</P>
			<H2 id={'events'}>Events</H2>
			<Definition id={'onClick'}>
				<Method>onClick</Method>
				<TypeDef>{'(e: MouseEvent<HTMLDivElement>) => void'}</TypeDef>
			</Definition>
			<P>There's a component for every HTML and SVG element, for instance motion.div, motion.circle etc. It extends.</P>
			<Definition id={'onToolTip'}>
				<Method>onToolTip</Method>
				<TypeDef>{'(tip: Tip) => void'}</TypeDef>
			</Definition>
			<P>There's a component for every HTML and SVG element, for instance motion.div, motion.circle etc. It extends.</P>
		</FlexDiv>
	);
}
