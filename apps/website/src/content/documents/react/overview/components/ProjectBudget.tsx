import {
	Button,
	Card,
	CardContent,
	CardFooter,
	CardTitle,
	PopMenu,
	PopMenuGroup,
	PopMenuItem,
	Slider,
	TextArea,
} from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import { type PushedPopMenu, getPopMenu, popMenuActions } from '@apple-pie/slice/stores/popMenu';
import { useEffect, useRef, useState } from 'react';
import css from '../Overview.module.css';
import { Row, useNotice } from '../Shared';

export function ProjectBudget() {
	const [amount, setAmount] = useState(2500);
	const [currency, setCurrency] = useState('USD');
	const [notes, setNotes] = useState('');
	const [saved, setSaved] = useState({ amount: 2500, currency: 'USD', notes: '' });
	const notice = useNotice();
	const pushTip = useTipActions().push;
	const ownedMenu = useRef<PushedPopMenu | null>(null);
	useEffect(
		() => () => {
			if (ownedMenu.current && getPopMenu() === ownedMenu.current) popMenuActions.clear();
		},
		[],
	);
	const openCurrencies = (caller: HTMLButtonElement) => {
		const menu = (
			<PopMenu caller={caller} name="Budget currency">
				<PopMenuGroup title="Currency">
					{[
						{ value: 'USD', label: 'USD — US Dollar' },
						{ value: 'EUR', label: 'EUR — Euro' },
						{ value: 'GBP', label: 'GBP — British Pound' },
					].map((option) => (
						<PopMenuItem
							key={option.value}
							label={option.label}
							toggle
							toggled={currency === option.value}
							autoDismiss
							onClick={() => setCurrency(option.value)}
						/>
					))}
				</PopMenuGroup>
			</PopMenu>
		);
		ownedMenu.current = menu;
		popMenuActions.push(menu);
	};
	return (
		<Card role="group" aria-label="Project budget" padding={20} className={css.card} style={{ width: '100%' }}>
			<CardTitle>
				<Row>
					<div>
						<div className={css.small}>PLAN YOUR PROJECT</div>
						<div className="body-xxl-regular">Project budget</div>
					</div>
					<Button
						variant="text"
						label={currency}
						iconRight="arrows.chevron-down"
						aria-label="Choose budget currency"
						tooltip="Currency"
						onToolTip={pushTip}
						aria-haspopup="menu"
						onClick={(event) => {
							if (event) openCurrencies(event.currentTarget);
						}}
					/>
				</Row>
			</CardTitle>
			<CardContent>
				<div className={css.stack}>
					<div className={css.budgetRow}>
						<strong>Budget</strong>
						<Slider
							aria-label="Project budget amount"
							trackColor={'core-fill-primary'}
							width="100%"
							min={50}
							max={10000}
							value={amount}
							step={50}
							onChange={(value) => setAmount(Math.round(value / 50) * 50)}
						/>
						<span className={css.amount}>
							{new Intl.NumberFormat('en-US', {
								style: 'currency',
								currency,
								maximumFractionDigits: 0,
							}).format(amount)}
						</span>
					</div>
					<TextArea
						inputName="Budget notes"
						placeholder="What will this budget cover?"
						rows={3}
						value={notes}
						onChange={setNotes}
						maxLength={300}
						showCharacters
					/>
				</div>
			</CardContent>
			<CardFooter>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
						gap: 8,
						width: '100%',
					}}
				>
					<Button
						label="Cancel"
						variant="secondary"
						width="fill"
						onClick={() => {
							setAmount(saved.amount);
							setCurrency(saved.currency);
							setNotes(saved.notes);
						}}
					/>
					<Button
						label="Save budget"
						variant="primary"
						width="fill"
						onClick={() => {
							setSaved({ amount, currency, notes });
							notice('Project budget saved for this preview.');
						}}
					/>
				</div>
			</CardFooter>
		</Card>
	);
}
