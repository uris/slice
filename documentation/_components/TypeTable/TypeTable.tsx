import { DataTable } from 'src';
import {headingStyles, bodyStyles, typeDataColumnDefinitions} from '../../_data/typeData';
import type { TypeDataRow } from '../../_data/typeData';

// storybook/mdx needs the typed table to render properly
const TypedDataTable = DataTable<TypeDataRow>;

export function TypeTableHeadings() {
	return (
		<TypedDataTable
			width={'100%'}
			height={'auto'}
			headerSticky={true}
			freezeColumn={true}
			borderStyle={'row'}
			borderRadius={0}
			colResize={true}
			candyStripeBackgroundColor={'var(--core-surface-primary)'}
			backgroundColor={'var(--core-surface-primary)'}
			backgroundColorHoverRow={'var(--core-surface-primary-tint)'}
			headerBackgroundColor={'var(--core-surface-secondary)'}
			borderColor={'var(--core-outline-primary)'}
			columnDefinitions={typeDataColumnDefinitions}
			tableData={headingStyles}
		/>
	);
}

export function TypeTableBody() {
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
			columnDefinitions={typeDataColumnDefinitions}
			tableData={bodyStyles}
		/>
	);
}
