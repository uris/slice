import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMotionValue, visualElementStore } from 'motion/react';
import { Button } from 'src/components/Button/Button';
import { FlexBox } from 'src/components/FlexBox/FlexBox';
import { runFlexBoxPlay } from 'src/components/playHelpers';
import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { ElevationFixture } from '../../../documentation/_components/ElevationFixture';
import compositionCss from '../../../documentation/_components/LayoutComposition.module.css';
import { runElevationPlay } from '../../../documentation/_components/elevationPlay';
import { DraggablePanel } from '../DraggablePanel';
import { loadLayoutStylesLast } from '../playHelpers';
import { Preset } from './_types';

const loremIpsum =
	'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.';
const meta: Meta<typeof FlexBox> = {
	title: 'Components/FlexBox',
	component: FlexBox,
	argTypes: {
		justify: {
			control: { type: 'radio' },
			options: ['start', 'center', 'end', 'between', 'top', 'bottom'],
		},
		children: {
			options: ['Buttons', 'ShortText', 'LongText'],
			mapping: {
				Buttons: (
					<>
						<Button label="Button 1" variant={'solid'} />
						<Button label="Button 2" variant={'solid'} />
					</>
				),
				ShortText: 'This is some text',
				LongText: loremIpsum,
			},
		},
	},
	args: {
		children: undefined,
		preset: Preset.FillScroll,
		scrollY: undefined,
		scrollX: undefined,
		background: 'transparent',
		direction: undefined,
		align: undefined,
		justify: undefined,
		height: undefined,
		width: undefined,
		wrap: false,
		reverse: false,
		padding: 0,
		margin: 0,
		absolute: false,
		flex: undefined,
		className: undefined,
		gap: 16,
		variants: undefined,
		transition: undefined,
		animate: undefined,
		initial: undefined,
		exit: undefined,
	},
};

export default meta;

export const Default: StoryObj<typeof FlexBox> = {
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<FlexBox {...args}>
					Here's the latest • War with Iran: There could be more US casualties as part of the military operations
					against Iran, President Donald Trump acknowledged Sunday. Three American troops have been killed so far,
					according to the US military. Trump released a video touting the scale of the campaign and provided new
					details on his rationale for the attacks. • Uncertain future: Iranians are grappling with a profound shift in
					the nation’s history after Supreme Leader Ali Khamenei was killed in Saturday’s joint US-Israel attacks.
					Tehran formed a transitional council and has indicated a new supreme leader could be chosen soon. • Global
					impacts: The wave of violence has hindered the flow of oil and disrupted air travel. Oil futures surged Sunday
					in the first trades since the conflict began, while stock futures fell sharply. • Mapping the strikes: Israel
					struck “in the heart of Tehran” and Iran has attacked US bases, Israel and targets across the Middle East.
					Here’s where the strikes are taking place.
				</FlexBox>
			</FlexBox>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runFlexBoxPlay({ canvasElement, args });
	},
};

export const ExplicitOverflowClipsPanel: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => (
		<FlexBox
			data-testid="clip-container"
			width={300}
			height={160}
			direction="row"
			borderRadius={24}
			style={{ overflow: 'hidden' }}
		>
			<DraggablePanel isClosed={false} backgroundColor="#ff0000" sizeConstraints={{ initial: 400, min: 400, max: 500 }}>
				<span>Clipped panel</span>
			</DraggablePanel>
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const container = within(canvasElement).getByTestId('clip-container');
		await expect(getComputedStyle(container).overflowX).toBe('hidden');
		await expect(getComputedStyle(container).overflowY).toBe('hidden');
		await expect(getComputedStyle(container).borderRadius).toBe('24px');
	},
};
export const ExplicitOverflowAxes: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => (
		<FlexBox data-testid="clip-container" width={200} height={100} style={{ overflow: 'hidden', overflowY: 'auto' }}>
			Content
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const container = within(canvasElement).getByTestId('clip-container');
		await expect(getComputedStyle(container).overflowX).toBe('hidden');
		await expect(getComputedStyle(container).overflowY).toBe('auto');
	},
};

export const ExplicitZeroLayout: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => <FlexBox scrollBox padding={0} gap={0} maxWidth={0} data-testid="zero-layout" />,
	play: async ({ canvasElement }) => {
		const box = within(canvasElement).getByTestId('zero-layout');
		const style = getComputedStyle(box);
		expect(style.paddingRight).toBe('0px');
		expect(style.gap).toBe('0px');
		expect(style.maxWidth).toBe('0px');
	},
};
export const ScrollBoxDefaultInset: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => <FlexBox scrollBox data-testid="scroll-layout" />,
	play: async ({ canvasElement }) => {
		expect(getComputedStyle(within(canvasElement).getByTestId('scroll-layout')).paddingRight).toBe('4px');
	},
};
export const RowPresetAndOverrides: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => (
		<FlexBox preset={Preset.RowBetween} direction="column" reverse wrap gap={12} data-testid="layout">
			<span>One</span>
			<span>Two</span>
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const style = getComputedStyle(within(canvasElement).getByTestId('layout'));
		expect(style.flexDirection).toBe('column-reverse');
		expect(style.flexWrap).toBe('wrap');
		expect(style.justifyContent).toBe('space-between');
		expect(style.alignItems).toBe('center');
	},
};
export const ImmediateReducedMotion: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	beforeEach: () => {
		const original = window.matchMedia.bind(window);
		const media = spyOn(window, 'matchMedia').mockImplementation((query) =>
			query === '(prefers-reduced-motion: reduce)'
				? {
						matches: true,
						media: query,
						onchange: null,
						addEventListener() {},
						removeEventListener() {},
						addListener() {},
						removeListener() {},
						dispatchEvent: () => true,
					}
				: original(query),
		);
		return () => media.mockRestore();
	},
	render: () => (
		<FlexBox
			data-testid="motion-box"
			initial={{ opacity: 0 }}
			animate="visible"
			variants={{ visible: { opacity: 1, transition: { delay: 10, duration: 10, repeat: Number.POSITIVE_INFINITY } } }}
		/>
	),
	play: async ({ canvasElement }) => {
		await waitFor(() => expect(within(canvasElement).getByTestId('motion-box')).toHaveStyle({ opacity: '1' }));
	},
};

export const ChildrenKeepTheirHeightByDefault: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => (
		<FlexBox preset={Preset.FillScroll} height={80} width={200} data-testid="sizing-parent">
			<div style={{ height: 56 }} data-testid="plain-child">
				Plain child
			</div>
			{/* Visible overflow retains the CSS automatic minimum; explicitly allow shrinking below content. */}
			<FlexBox height={56} style={{ minHeight: 0 }} data-testid="nested-child">
				Nested child
			</FlexBox>
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const id of ['plain-child', 'nested-child']) {
			const child = canvas.getByTestId(id);
			expect(child.getBoundingClientRect().height).toBe(56);
			expect(getComputedStyle(child).flexShrink).toBe('0');
		}
		const parent = canvas.getByTestId('sizing-parent');
		expect(parent.scrollHeight).toBeGreaterThan(parent.clientHeight);
	},
};

export const ChildrenDoNotGrowByDefault: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => (
		<FlexBox height={200}>
			<FlexBox height={56} data-testid="sized-child">
				Child
			</FlexBox>
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const child = within(canvasElement).getByTestId('sized-child');
		expect(child.getBoundingClientRect().height).toBe(56);
		expect(getComputedStyle(child).flexGrow).toBe('0');
	},
};

export const NestedChildrenCanGrowIndependently: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => (
		<FlexBox growChildren height={200}>
			{/* Visible overflow retains the CSS automatic minimum; explicitly allow shrinking below content. */}
			<FlexBox height={56} style={{ minHeight: 0 }} data-testid="nested-child">
				<div style={{ height: 20 }} data-testid="grandchild">
					Content
				</div>
			</FlexBox>
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId('nested-child').getBoundingClientRect().height).toBe(200);
		expect(canvas.getByTestId('grandchild').getBoundingClientRect().height).toBe(20);
	},
};

export const NestedChildrenCanShrinkIndependently: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => (
		<FlexBox shrinkChildren height={40}>
			{/* Visible overflow retains the CSS automatic minimum; explicitly allow shrinking below content. */}
			<FlexBox height={56} style={{ minHeight: 0 }} data-testid="nested-child">
				<div style={{ height: 56 }} data-testid="grandchild">
					Content
				</div>
			</FlexBox>
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId('nested-child').getBoundingClientRect().height).toBe(40);
		expect(canvas.getByTestId('grandchild').getBoundingClientRect().height).toBe(56);
	},
};

export const ExplicitChildFlexOverridesParentDefaults: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => (
		<FlexBox height={200}>
			<FlexBox flex={1} data-testid="explicit-flex">
				Content
			</FlexBox>
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const child = within(canvasElement).getByTestId('explicit-flex');
		expect(child.getBoundingClientRect().height).toBe(200);
		expect(getComputedStyle(child).flexGrow).toBe('1');
		expect(getComputedStyle(child).flexShrink).toBe('1');
	},
};

export const DefaultOverflowIsVisible: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => <FlexBox data-testid="default-overflow" />,
	play: async ({ canvasElement }) => {
		const style = getComputedStyle(within(canvasElement).getByTestId('default-overflow'));
		expect(style.overflowX).toBe('visible');
		expect(style.overflowY).toBe('visible');
	},
};

export const ExplicitFalseScrollAxesClipDefault: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => <FlexBox scrollX={false} scrollY={false} data-testid="default-clipped" />,
	play: async ({ canvasElement }) => {
		const style = getComputedStyle(within(canvasElement).getByTestId('default-clipped'));
		expect(style.overflowX).toBe('hidden');
		expect(style.overflowY).toBe('hidden');
	},
};

export const ExplicitScrollAxesOverridePreset: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => <FlexBox scrollX scrollY={false} preset={Preset.FillScroll} data-testid="scroll-axes" />,
	play: async ({ canvasElement }) => {
		const style = getComputedStyle(within(canvasElement).getByTestId('scroll-axes'));
		expect(style.overflowX).toBe('auto');
		expect(style.overflowY).toBe('hidden');
	},
};

export const OverflowPropOverridesPresetAxes: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => <FlexBox overflow="visible" preset={Preset.FillScroll} data-testid="overflow-prop" />,
	play: async ({ canvasElement }) => {
		const box = within(canvasElement).getByTestId('overflow-prop');
		expect(getComputedStyle(box).overflowX).toBe('visible');
		expect(getComputedStyle(box).overflowY).toBe('visible');
		expect(box).not.toHaveAttribute('overflow');
	},
};

export const FillPresetUsesRemainingColumnHeight: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => (
		<FlexBox height={200}>
			<div style={{ height: 56 }}>Header</div>
			<FlexBox preset={Preset.FillScroll} data-testid="remaining-height">
				Content
			</FlexBox>
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).getByTestId('remaining-height').getBoundingClientRect().height).toBe(144);
	},
};

export const FillCenterAlignsAtTop: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => <FlexBox preset={Preset.FillCenter} data-testid="fill-center" />,
	play: async ({ canvasElement }) => {
		const style = getComputedStyle(within(canvasElement).getByTestId('fill-center'));
		expect(style.justifyContent).toBe('flex-start');
		expect(style.alignItems).toBe('center');
	},
};

export const FillCenterMiddleCentersBothAxes: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => <FlexBox preset={Preset.FillCenterMiddle} data-testid="fill-middle" />,
	play: async ({ canvasElement }) => {
		const style = getComputedStyle(within(canvasElement).getByTestId('fill-middle'));
		expect(style.justifyContent).toBe('center');
		expect(style.alignItems).toBe('center');
	},
};

export const DashSeparatedPadding: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => <FlexBox scrollBox padding="8-8-8-0" data-testid="dash-padding" />,
	play: async ({ canvasElement }) => {
		const style = getComputedStyle(within(canvasElement).getByTestId('dash-padding'));
		expect(style.paddingTop).toBe('8px');
		expect(style.paddingRight).toBe('8px');
		expect(style.paddingBottom).toBe('8px');
		expect(style.paddingLeft).toBe('0px');
	},
};

export const FillWrapPacksRowsAtTop: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => (
		<FlexBox preset={Preset.FillWrap} width={200} height={200} gap={10} data-testid="wrap-container">
			<div style={{ width: 80, height: 20 }} data-testid="first-item">
				One
			</div>
			<div style={{ width: 80, height: 40 }} data-testid="second-item">
				Two
			</div>
			<div style={{ width: 80, height: 30 }} data-testid="third-item">
				Three
			</div>
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const parent = canvas.getByTestId('wrap-container');
		const top = parent.getBoundingClientRect().top;
		expect(getComputedStyle(parent).flexWrap).toBe('wrap');
		expect(canvas.getByTestId('first-item').getBoundingClientRect().top - top).toBe(0);
		expect(canvas.getByTestId('second-item').getBoundingClientRect().top - top).toBe(0);
		expect(canvas.getByTestId('third-item').getBoundingClientRect().top - top).toBe(50);
	},
};

export const Elevation: StoryObj<typeof meta> = {
	tags: ['tests'],
	render: () => (
		<ElevationFixture>
			{(elevation) => (
				<FlexBox elevation={elevation} padding={24} background="core-surface-secondary">
					Panel content
				</FlexBox>
			)}
		</ElevationFixture>
	),
	play: async (context) => runElevationPlay(context, 0),
};

export const IndependentChildElevation: StoryObj<typeof meta> = {
	tags: ['tests'],
	render: () => (
		<FlexBox elevation={4} padding={32} gap={16} background="core-surface-secondary" data-testid="raised-panel">
			<Button label="Flat child" />
			<Button label="Raised child" elevation={1} />
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('raised-panel').style.boxShadow).toBe('var(--elevation-4)');
		await expect(getComputedStyle(canvas.getByRole('button', { name: 'Flat child' })).boxShadow).toBe('none');
		await expect(canvas.getByRole('button', { name: 'Raised child' }).style.boxShadow).toBe('var(--elevation-1)');
	},
};

export const ComposedLayoutOverrides: StoryObj<typeof meta> = {
	tags: ['tests'],
	beforeEach: loadLayoutStylesLast,
	render: () => (
		<div role="group" aria-label="Composed layout overrides" className={compositionCss.surface}>
			<span>First item</span>
			<span>Second item</span>
		</div>
	),
	play: async ({ canvasElement }) => {
		const surface = within(canvasElement).getByRole('group', { name: 'Composed layout overrides' });
		const style = getComputedStyle(surface);
		await expect(style.display).toBe('grid');
		await expect(style.flexDirection).toBe('row');
		await expect(style.justifyContent).toBe('space-between');
		await expect(style.alignItems).toBe('stretch');
		await expect(style.boxSizing).toBe('content-box');
		await expect(style.padding).toBe('12px');
		await expect(style.margin).toBe('8px');
	},
};

export const StaticByDefault: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: (args) => <FlexBox {...args} data-testid="static-box" />,
	args: {
		ref: fn(),
		initial: undefined,
		animate: undefined,
		exit: undefined,
		variants: undefined,
		transition: undefined,
		layout: undefined,
		drag: undefined,
		draggable: true,
		onClick: fn(),
		style: { opacity: 0.6 },
		padding: 12,
		children: 'Static layout',
	},
	play: async ({ canvasElement, args }) => {
		const box = within(canvasElement).getByTestId('static-box');
		await expect(box.tagName).toBe('DIV');
		await expect(args.ref).toHaveBeenCalledWith(box);
		await expect(getComputedStyle(box).opacity).toBe('0.6');
		await expect(getComputedStyle(box).transform).toBe('none');
		await expect(getComputedStyle(box).padding).toBe('12px');
		await expect(visualElementStore.has(box)).toBe(false);
		for (const name of ['animate', 'initial', 'variants', 'transition', 'layout', 'drag', 'whileHover']) {
			await expect(box).not.toHaveAttribute(name);
		}
		await userEvent.hover(box);
		await userEvent.click(box);
		await expect(args.onClick).toHaveBeenCalledTimes(1);
	},
};

export const AutomaticAnimation: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: (args) => <FlexBox {...args} data-testid="animated-box" />,
	args: {
		ref: fn(),
		initial: { opacity: 0, x: 0 },
		animate: 'visible',
		variants: { visible: { opacity: 1, x: 24 } },
		transition: { duration: 0 },
		onAnimationComplete: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const box = within(canvasElement).getByTestId('animated-box');
		await expect(box.tagName).toBe('DIV');
		await expect(args.ref).toHaveBeenCalledWith(box);
		await waitFor(() => expect(getComputedStyle(box).opacity).toBe('1'));
		await waitFor(() => expect(getComputedStyle(box).transform).toBe('matrix(1, 0, 0, 1, 24, 0)'));
		await waitFor(() => expect(args.onAnimationComplete).toHaveBeenCalled());
		await expect(visualElementStore.has(box)).toBe(true);
	},
};

function motionPropStory(args: StoryObj<typeof FlexBox>['args']): StoryObj<typeof FlexBox> {
	return {
		tags: ['tests'],
		args,
		render: (props) => <FlexBox {...props} data-testid="automatic-motion" />,
		play: async ({ canvasElement }) => {
			const box = within(canvasElement).getByTestId('automatic-motion');
			await expect(visualElementStore.has(box)).toBe(true);
			for (const name of ['initial', 'animate', 'exit', 'variants', 'transition', 'layout', 'whileHover']) {
				await expect(box).not.toHaveAttribute(name);
			}
		},
	};
}

export const InitialOnlyMotion = motionPropStory({ initial: false });
export const AnimateOnlyMotion = motionPropStory({ animate: { opacity: 1 } });
export const ExitOnlyMotion = motionPropStory({ exit: { opacity: 0 } });
export const TransitionOnlyMotion = motionPropStory({ transition: { duration: 0 } });
export const VariantsOnlyMotion = motionPropStory({ variants: { visible: { opacity: 1 } } });
export const LayoutMotion = motionPropStory({ layout: true });
export const GestureMotion = motionPropStory({ whileHover: { scale: 1.1 } });
export const MotionCallback = motionPropStory({ onUpdate: fn() });
export const TransformStyleMotion = motionPropStory({ style: { x: 24 } });

export const NativeStylesStayStatic: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => (
		<FlexBox
			data-testid="native-styles"
			style={{ opacity: 0.6, transform: 'translateX(12px)', transition: 'opacity 0.2s' }}
		/>
	),
	play: async ({ canvasElement }) => {
		const box = within(canvasElement).getByTestId('native-styles');
		await expect(visualElementStore.has(box)).toBe(false);
		await expect(getComputedStyle(box).transform).toBe('matrix(1, 0, 0, 1, 12, 0)');
		await expect(getComputedStyle(box).opacity).toBe('0.6');
	},
};

function MotionValueLayout() {
	const opacity = useMotionValue(0.4);
	return (
		<>
			<button type="button" onClick={() => opacity.set(0.7)}>
				Fade surface
			</button>
			<FlexBox data-testid="motion-value-layout" style={{ opacity }} />
		</>
	);
}
export const MotionValueStyles: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => <MotionValueLayout />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const box = canvas.getByTestId('motion-value-layout');
		await expect(visualElementStore.has(box)).toBe(true);
		await waitFor(() => expect(getComputedStyle(box).opacity).toBe('0.4'));
		await userEvent.click(canvas.getByRole('button', { name: 'Fade surface' }));
		await waitFor(() => expect(getComputedStyle(box).opacity).toBe('0.7'));
	},
};
