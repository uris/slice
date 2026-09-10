import { FlexDiv, Label } from 'src';
import { typeStyles } from '../../../src/theme/type/type';
import css from './TypeSizes.module.css';

export function TypeSizes(props: Readonly<{ filter: string; sample?: string }>) {
	const { filter = '', sample = 'It is not daily increase but daily decrease, hack away the unessential.' } = props;
	const types = [];
	const matchingTypes = Object.keys(typeStyles).filter((key) => key.startsWith(filter));
	for (const type of matchingTypes) {
		const typeStyle = type as keyof typeof typeStyles;
		const cssProps = typeStyles[typeStyle];
		types.push({ name: type, props: cssProps });
	}

	return (
		<FlexDiv width={'fill'} height={'fit'} align={'start'} justify={'start'}>
			{types.map((entry) => {
				return (
					<div className={css.wrapper} key={entry.name}>
						<Label
							padding={'4px 8px'}
							color={'var(--core-text-disabled)'}
							backgroundColor={'var(--core-surface-secondary)'}
						>
							{`${entry.name}: Size: ${entry.props.fontSize}, Weight: ${entry.props.fontWeight}, Line Height: ${entry.props.lineHeight}, Letter Spacing: ${entry.props.letterSpacing}`}
						</Label>
						<div className={`${css.sample} ${entry.name}`}>{sample}</div>
					</div>
				);
			})}
		</FlexDiv>
	);
}
