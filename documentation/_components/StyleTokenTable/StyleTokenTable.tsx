import { DataTable } from 'src';
import type { ColumnDefinition } from 'src';
import type { StyleTokenRow } from '../../_data/otherStyleData';

// storybook/mdx needs the typed table to render properly
const TypedDataTable = DataTable<StyleTokenRow>;

export function StyleTokenTable(
	props: Readonly<{ tokens: StyleTokenRow[]; columnDefinitions: ColumnDefinition<StyleTokenRow>[] }>,
) {
	const { tokens, columnDefinitions } = props;

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
			columnDefinitions={columnDefinitions}
			tableData={tokens}
		/>
	);
}
