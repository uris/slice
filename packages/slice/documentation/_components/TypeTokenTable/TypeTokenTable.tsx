import { DataTable } from 'src';
import { typeTokenColumnDefinitions } from '../../_data/typeTokenData';
import type { TypeTokenRow } from '../../_data/typeTokenData';

// storybook/mdx needs the typed table to render properly
const TypedDataTable = DataTable<TypeTokenRow>;

export function TypeTokenTable(props: Readonly<{ tokens: TypeTokenRow[] }>) {
	const { tokens } = props;

	return (
		<TypedDataTable
			width={'100%'}
			height={'auto'}
			headerSticky={true}
			freezeColumn={true}
			borderStyle={'row'}
			borderRadius={0}
			colResize={false}
			candyStripeBackgroundColor={'var(--core-surface-primary)'}
			backgroundColor={'var(--core-surface-primary)'}
			backgroundColorHoverRow={'var(--core-surface-primary-tint)'}
			headerBackgroundColor={'var(--core-surface-secondary)'}
			borderColor={'var(--core-outline-primary)'}
			columnDefinitions={typeTokenColumnDefinitions}
			tableData={tokens}
		/>
	);
}
