import { CodeBlock } from '@/components/CodeBlock';
import { GradientCanvas } from '@/components/GradientCanvas/GradientCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, H1, H2, P } from '@/components/Type/Type';
import { colorValueType } from '@/documents/react/design-system/colors/code';
import { FlexBox, Preset } from '@apple-pie/slice';
import colorWheel from '../../../../../assets/colors/color-wheel-all.svg';
import { ColorTableTemplate, colorColumns, colorTables } from './color-data';

export function ColorsDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Colors</H1>
			<P clipWidth>
				Colors guide the way users interpret information. They help connect to the brand expression, create hierarchy,
				and convey meaning.
			</P>
			<H2 id="core-color-groups">Core colors</H2>
			<P>
				Slice includes 14 core color groups with ramps for each one. Light and dark themes map values from these ramps
				to semantic tokens for surfaces, text, controls, and feedback. While you can always use individual vales from
				the ramps for custom accents, theme tokens are preferred and provide built in theme support.
			</P>
			<GradientCanvas
				height={400}
				opacity={1}
				caption={'Core Colors'}
				imageSrc={colorWheel}
				imageDescription={'core color groups'}
				imageWidth={'50%'}
			/>
			<TipBox inline noMargin>
				Click on each color to copy it's definition to the clipboard.
			</TipBox>
			<ColorTableTemplate
				id="core-color-midpoints"
				name="Base Colors"
				tableData={colorTables.coreColorMidpoints}
				columns={colorColumns}
				caption="Core color ramp light and dark accents"
			/>
			<ColorTableTemplate
				id="core-greys"
				name="Grey Scale"
				tableData={colorTables.coreGreys}
				columns={colorColumns}
				caption="Core grey light and dark values"
			/>
			<H2 id="theme">Theme tokens and values</H2>
			<P>
				Compare each theme token in light and dark appearances. Swatches show the base hex color and its opacity on a
				light or dark background. Select a swatch to copy its token, hex value, and opacity when below 100%, separated
				by commas.
			</P>
			<ColorTableTemplate
				id="theme-backgrounds"
				name="Backgrounds"
				tableData={colorTables.backgrounds}
				columns={colorColumns}
				caption="Background theme tokens"
			/>
			<ColorTableTemplate
				id="theme-fills"
				name="Fills"
				tableData={colorTables.fills}
				columns={colorColumns}
				caption="Fills"
			/>
			<ColorTableTemplate
				id="theme-outlines-and-borders"
				name="Outlines / Borders"
				tableData={colorTables.outlinesAndBorders}
				columns={colorColumns}
				caption="Outline and border theme tokens"
			/>
			<ColorTableTemplate
				id="theme-text"
				name="Text"
				tableData={colorTables.text}
				columns={colorColumns}
				caption="Text theme tokens"
			/>
			<ColorTableTemplate
				id="theme-buttons-and-badges"
				name="Buttons & Badges"
				tableData={colorTables.buttonsAndBadges}
				columns={colorColumns}
				caption="Button and badge theme tokens"
			/>
			<ColorTableTemplate
				id="theme-scroll-bars"
				name="Scroll Bars"
				tableData={colorTables.scrollBars}
				columns={colorColumns}
				caption="Scrollbar theme tokens"
			/>
			<ColorTableTemplate
				id="theme-messages-and-feedback"
				name="Feedback"
				tableData={colorTables.messagesAndFeedback}
				columns={colorColumns}
				caption="Feedback theme tokens"
			/>
			<ColorTableTemplate
				id="theme-icons"
				name="Icons"
				tableData={colorTables.icons}
				columns={colorColumns}
				caption="Icon theme tokens"
			/>
			<ColorTableTemplate
				id="theme-array"
				name="Special Array Colors"
				tableData={colorTables.array}
				columns={colorColumns}
				caption="Array theme tokens"
			/>
			<H2 id="color-value">
				Using the <Code style={{ fontSize: 28 }}>ColorValue</Code> type
			</H2>
			<P>
				Slice components that expose color props, like <Code>backgroundColor</Code> or <Code>textColor</Code> implement
				the <Code>ColorValue</Code> type. This means that you can use slice color tokens directly as well as other
				string color values.
			</P>
			<CodeBlock filename="Colors.tsx" language="typescript" code={colorValueType.trim()} />
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Colors' },
	{
		id: 'core-color-groups',
		title: 'Core Color Groups',
		items: [
			{ id: 'core-color-midpoints', title: 'Base Colors', code: true },
			{ id: 'core-greys', title: 'Grey Scale', code: true },
		],
	},
	{
		id: 'theme',
		title: 'Theme tokens and values',
		items: [
			{ id: 'theme-backgrounds', title: 'Backgrounds', code: true },
			{ id: 'theme-fills', title: 'Fills', code: true },
			{ id: 'theme-outlines-and-borders', title: 'Outlines & Borders', code: true },
			{ id: 'theme-text', title: 'Text', code: true },
			{ id: 'theme-buttons-and-badges', title: 'Buttons & Badges', code: true },
			{ id: 'theme-scroll-bars', title: 'Scroll Bars', code: true },
			{ id: 'theme-messages-and-feedback', title: 'Feedback', code: true },
			{ id: 'theme-icons', title: 'Icons', code: true },
			{ id: 'theme-array', title: 'Special Array Colors', code: true },
		],
	},
	{ id: 'color-value', title: 'Using the ColorValue Type' },
];
export default ColorsDoc;
