import { CodeBlock } from '@/components/CodeBlock';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, H1, H2, P } from '@/components/Type/Type';
import { textStyles } from '@/documents/react/design-system/typography/code';
import { bodyStylesObject, getBaseBodyStyle, headingStyles } from '@/documents/react/design-system/typography/data';
import { FlexBox, Preset } from '@apple-pie/slice';
import css from './Typography.module.css';

export function TypeSizesDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Type Styles</H1>
			<P clipWidth>
				Slice text styles combine font size, weight, line height, and letter spacing into reusable presets. Use them to
				build a consistent hierarchy across page titles, content, and controls.
			</P>
			<H2 id="header-text">Titles & headers</H2>
			<P>
				Six heading styles, <Code>h1</Code> through <Code>h6</Code>, provide a scale for titles and section headings.
				Choose the HTML heading level for the document structure; use a class when its visual size needs to differ.
				Adding a heading class to a <Code>div</Code> changes its appearance without making it a semantic heading.
			</P>
			<FlexBox preset={Preset.Column} width={'fill'} margin={'32-0-0-0'} padding={'0-24'} gap={56}>
				{headingStyles.map((style, index) => {
					return (
						<div key={`token.${style.token}`} className={css.wrapper}>
							<div className={css.spec}>
								<span className={'body-s-medium'}>token: {style.token}</span>
								<span className={'body-s-medium'}>{style.styleString}</span>
							</div>
							<div className={css.variant}>
								<div style={{ ...style.styles, marginTop: 0 }}>h{index + 1} Header</div>
							</div>
						</div>
					);
				})}
			</FlexBox>
			<H2 id="body-text">Body text & labels</H2>
			<P>
				Body styles range from <Code>xs</Code> to <Code>xxl</Code>, each in <Code>regular</Code>, <Code>medium</Code>,
				and <Code>bold</Code> weights. Use regular for reading, medium for emphasis and labels, and bold for stronger
				emphasis. Sizes use <Code>rem</Code>; the pixel equivalents below assume a 16px root font size.
			</P>
			<FlexBox preset={Preset.Column} width={'fill'} margin={'32-0-0-0'} padding={'0-24'} gap={56}>
				{Object.entries(bodyStylesObject).map(([key, value]) => {
					const styleString = getBaseBodyStyle(value);
					return (
						<div key={`token.${key}`} className={css.wrapper}>
							<div className={css.spec}>
								<span className={'body-s-medium'}>body {key}</span>
								<span className={'body-s-medium'}>{styleString}</span>
							</div>
							<div className={css.variant}>
								{Object.entries(value).map(([token, styles]) => {
									return (
										<div className={css.entry} key={token} style={{ ...styles }}>
											<span className={css.weight}>{`Weight: ${styles.fontWeight}`}</span>
											{token}
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</FlexBox>
			<H2 id="using-text-styles">Using Slice text styles</H2>
			<P>
				Import <Code>@apple-pie/slice/styles.css</Code> once in your app and render content within a{' '}
				<Code>ThemeProvider</Code> scope. Apply a class such as <Code>body-s-regular</Code> or <Code>h2</Code> for a
				complete preset. Use individual CSS variables when you only need to change one property.
			</P>
			<CodeBlock wrap={true} filename="TextStyles.tsx" language="tsx" code={textStyles.trim()} />
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Type Styles' },
	{ id: 'header-text', title: 'Titles & headers' },
	{ id: 'body-text', title: 'Body text & labels' },
	{ id: 'using-text-styles', title: 'Using Slice text styles' },
];
export default TypeSizesDoc;
