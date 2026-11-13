import { CodeBlock } from '@/components/CodeBlock';
import { FunnelSans } from '@/components/FunnelSans/FunnelSans';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, H1, H2, P } from '@/components/Type/Type';
import { fontCssCode } from '@/documents/react/design-system/typography/code';
import { FlexBox, Preset } from '@apple-pie/slice';

export function TypeFaceDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Typeface</H1>
			<P clipWidth>
				Slice uses Funnel Sans to give headings, body text, and controls a consistent voice. Its variable weights let
				you build hierarchy without switching typefaces.
			</P>
			<H2 id="funnel-sans">Funnel Sans typeface</H2>
			<P>
				Designed by NORD ID and Kristian Möller for Funnel, Funnel Sans combines square and circular letterforms for a
				distinctive, open appearance. Explore the letterforms below, switch between normal and italic, and adjust the
				weight to compare how the same text feels.
			</P>
			<FunnelSans />
			<H2 id="language-support">Language support</H2>
			<P>
				Funnel Sans supports 458 languages worldwide, covering all continents. Visit{' '}
				<a
					target={'_blank'}
					rel={'noreferrer'}
					href={'https://fonts.google.com/specimen/Funnel+Sans/glyphs?query=funnel+sans'}
				>
					Glyphs & Language
				</a>{' '}
				on Google Fonts for the full language and character coverage.
			</P>
			<H2 id="licensing">Licensing</H2>
			<P>
				Funnel Sans is licensed under the{' '}
				<a href={'https://github.com/Dicotype/Funnel/blob/main/OFL.txt'} target={'_blank'} rel={'noreferrer'}>
					SIL Open Font License 1.1
				</a>
				. It permits use in personal and commercial projects. If you bundle or redistribute the font, include its
				copyright notice and license; read the full license for its conditions.
			</P>
			<H2 id="custom-font">Bring your own font</H2>
			<P>
				Slice typography uses the <Code>--slice-font-family</Code> CSS variable. If your app needs a different font,
				load it in the app and set that variable at the root. Theme typography will use that family while keeping the
				existing sizes, weights, and spacing. Choose a font that supports the weights you use, and check the result in
				labels, inputs, and longer passages.
			</P>
			<CodeBlock wrap={true} filename="fonts.css" language="css" code={fontCssCode.trim()} />
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Typeface' },
	{ id: 'funnel-sans', title: 'Funnel Sans typeface' },
	{ id: 'language-support', title: 'Language support' },
	{ id: 'licensing', title: 'Licensing' },
	{ id: 'custom-font', title: 'Bring your own font' },
];
export default TypeFaceDoc;
