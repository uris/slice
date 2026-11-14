import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import { Curve } from '@/components/Curve';
import { GradientCanvas } from '@/components/GradientCanvas/GradientCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, H1, H2, H3, P, SpacerM } from '@/components/Type/Type';
import { FlexBox, Preset, motion } from '@apple-pie/slice';
import css from './Motion.module.css';
import { SpringMotionSquarePreview, SpringSquarePreview } from './MotionPreviews';
import {
	motionDefinitionsCode,
	motionPropsCode,
	springMotionSquareCode,
	springSquareCode,
	springSquareCssCode,
} from './code';

const curves = [
	{ name: 'Water', token: 'motion-water', duration: 'motion-water-duration', color: '#0091ff' },
	{ name: 'Magnet', token: 'motion-magnet', duration: 'motion-magnet-duration', color: '#db34f2' },
	{ name: 'Spring', token: 'motion-spring', duration: 'motion-spring-duration', color: '#ff375f' },
] as const;

export function MotionDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} width="fill">
			<Path />
			<H1 id="title">Motion</H1>
			<P clipWidth>
				Motion connects changes in state, directs attention, and helps people follow what happens next. Slice provides
				three timing curves for everyday feedback, larger movements, and moments of emphasis.
			</P>
			<H2 id="motion-curves">Slice motion</H2>
			<P>Slice provides three basic animation styles to cover most needs:</P>
			<TipBox inline noBorder>
				Click a curve to play its animation. Left to right represents elapsed time
			</TipBox>
			<GradientCanvas padding={'40px 0'}>
				<div className={css.curves}>
					{curves.map(({ name, token, duration, color }) => (
						<Curve
							key={token}
							values={motion[token]}
							duration={motion[duration]}
							strokeColor="var(--core-text-tertiary)"
							shapeColor={color}
							shapeRadius={12}
							label={`${name} easing`}
							width={125}
							height={125}
							shapeSize={24}
							strokeWidth={2}
							resetToTransparent={false}
							resetDelay={1000}
							curveName={name}
							curveToken={token}
						/>
					))}
				</div>
			</GradientCanvas>
			<H3>Water</H3>
			<P>
				This is the main animation style used in most components. Use for everyday state changes, such as hover colors
				and small shifts in position or opacity. Its smooth acceleration and deceleration make it a useful default when
				motion should support the interaction without drawing attention to itself.
			</P>
			<H3>Magnet</H3>
			<P>
				Magnet is used for larger movements, such as panels and drawers. Its distinct change in pace gives movement a
				more deliberate feel with a snap into place transition. Keep the destination clear and avoid moving unrelated
				elements at the same time.
			</P>
			<H3>Spring</H3>
			<P>
				Spring is used sparingly for emphasis, such as a completion indicator. It overshoots the destination before
				settling. A smaller change in scale or position produces a subtler bounce. Leave enough space for the overshoot.
			</P>

			<SpacerM />
			<P>
				Each preset above pairs an easing curve with a duration. The previews use the default theme values: Water at{' '}
				<Code>{motion['motion-water-duration']}</Code>, Magnet at <Code>{motion['motion-magnet-duration']}</Code>, and
				Spring at <Code>{motion['motion-spring-duration']}</Code>.
			</P>
			<H2 id="usage">Applying motion</H2>
			<H3>With Motion props</H3>
			<P>
				Components like FlexBox expose <Code>variants</Code>, <Code>animate</Code>, and <Code>transition</Code> to
				define states and how to move between them. Pass <Code>motionValues['transition-spring']</Code> to use Slice’s
				physics approximation of the Spring curve. This square scales up and rotates 90 degrees, then returns on the
				next click.
			</P>
			<TipBox inline noBorder>
				Click the square, or focus it and press Enter or Space, to toggle its size and rotation.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-flexbox--default"
				components={[
					{
						label: 'Spring with Motion props',
						code: {
							code: springMotionSquareCode.trim(),
							filename: 'SpringSquare.tsx',
						},
						component: <SpringMotionSquarePreview />,
					},
				]}
			/>
			<H3>With CSS tokens</H3>
			<P>
				Use the same size changes with a CSS transition. Pair <Code>--motion-spring</Code> with
				<Code>--motion-spring-duration</Code> and toggle a class to expand the square to <Code>scale(1.2)</Code>
				or return it to <Code>scale(1)</Code>. The same class change rotates it between <Code>0deg</Code> and
				<Code>90deg</Code>.
			</P>
			<TipBox inline noBorder>
				Click the square, or focus it and press Enter or Space, to toggle its size and rotation.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-flexbox--default"
				components={[
					{
						label: 'Spring with CSS tokens',
						component: <SpringSquarePreview />,
						code: [
							{
								code: springSquareCode.trim(),
								filename: 'CssSpringSquare.tsx',
								showFilename: true,
							},
							{
								language: 'css',
								filename: 'spring-square.css',
								code: springSquareCssCode.trim(),
								showFilename: true,
							},
						],
					},
				]}
			/>
			<H2 id="motion-props">Using motionValues and transition</H2>
			<P>
				The exported <Code>motionValues</Code> object contains timing presets. On components that expose a
				<Code>motionValues</Code> prop, that prop defines the animated states, while <Code>transition</Code>
				controls their timing and easing. Check the component’s reference for its supported variant names; these props
				are not available on every component.
			</P>
			<P>
				For example, <Code openURL="/docs/react/dot/">Dot</Code> uses <Code>initial</Code>, <Code>animate</Code>, and
				<Code>exit</Code>. Its transition settings merge with the current theme’s Water defaults, so changing only{' '}
				<Code>duration</Code> keeps the default easing. Motion’s <Code>transition.duration</Code> is in seconds.
			</P>
			<CodeBlock language="tsx" filename="ActivityIndicator.tsx" code={motionPropsCode.trim()} />
			<H2 id="accessibility">Reduced motion</H2>
			<P>
				Slice components automatically respect the system’s reduced-motion preference, reducing nonessential animation
				while keeping state changes visible.
			</P>
			<P>
				Custom components need to handle reduced motion explicitly. For CSS animations and transitions, use{' '}
				<Code>prefers-reduced-motion: reduce</Code>. For custom JavaScript animations, observe the same preference and
				show the final state immediately. Using Slice’s motion tokens alone does not add this behavior. Avoid using
				motion as the only signal that an action succeeded.
			</P>
			<H2 id="motion-definitions">Motion definitions</H2>
			<P>
				These are the default tokens exported as <Code>motion</Code> from <Code>@apple-pie/slice</Code>. For theme-aware
				JavaScript, read <Code>useTheme().current.motion</Code> instead of assuming the default values. The Spring token
				is a CSS <Code>linear()</Code> easing curve, rather than a physics spring configuration.
			</P>
			<CodeBlock language="tsx" filename="motion.ts" code={motionDefinitionsCode.trim()} wrap />
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Motion' },
	{ id: 'motion-curves', title: 'Slice motion' },
	{ id: 'usage', title: 'Applying motion' },
	{ id: 'motion-props', title: 'motionValues & transition' },
	{ id: 'accessibility', title: 'Reduced motion' },
	{ id: 'motion-definitions', title: 'Motion definitions' },
];
export default MotionDoc;
