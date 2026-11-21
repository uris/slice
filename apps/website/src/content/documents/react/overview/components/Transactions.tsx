import { Card, CardContent, CardFooter, CardTitle, type ColumnDefinition, DataTable } from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import css from '../Overview.module.css';

type ReceiptItem = { name: string; quantity?: string; amount: string };

const receiptItems: ReceiptItem[] = [
	{ name: 'Studio subscription', quantity: '1x', amount: '$24.00' },
	{ name: 'Extra storage', amount: '$8.00' },
	{ name: 'Print samples', amount: '$18.00' },
	{ name: 'Tax', amount: '$4.00' },
];

const receiptColumns: ColumnDefinition<ReceiptItem>[] = [
	{ id: 'name', title: 'Description', sort: false },
	{ id: 'amount', title: 'Amount', sort: false, justify: 'end' },
];

export function Transactions() {
	const { push } = useTipActions();
	return (
		<Card
			role="group"
			aria-label="Receipt for transaction 1234"
			padding={20}
			className={css.card}
			style={{ width: '100%' }}
		>
			<CardTitle
				caption={'TRANSACTION 1234'}
				title={'14 Jan 2026'}
				action={[
					{ round: true, iconLeft: 'basic.receipt', tooltip: 'Print', onToolTip: push },
					{ round: true, iconLeft: 'arrows.import', tooltip: 'Download', onToolTip: push },
				]}
			/>
			<CardContent className={css.receiptTable}>
				<DataTable
					caption="Receipt for transaction 1234"
					backgroundColor={'transparent'}
					columnDefinitions={receiptColumns}
					tableData={receiptItems}
					borderStyle="row"
					colResize={false}
				/>
			</CardContent>
			<CardFooter stack="horizontal" align="edges">
				<strong className="body-xxl-bold" style={{ color: 'var(--core-text-primary)' }}>
					Total paid
				</strong>
				<strong className="body-xxl-bold" style={{ color: 'var(--core-text-primary)' }}>
					$54.00
				</strong>
			</CardFooter>
		</Card>
	);
}
