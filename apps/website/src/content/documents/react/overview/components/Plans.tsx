import { Button, Chip, RadioButtonList, Tab, TabBar } from '@apple-pie/slice';
import { useState } from 'react';
import css from '../Overview.module.css';
import { Block, Row, useNotice } from '../Shared';

export function Plans() {
	const [billing, setBilling] = useState('monthly');
	const [plan, setPlan] = useState('studio');
	const notice = useNotice();
	const price = billing === 'yearly' ? '19' : '24';
	return (
		<Block title="Room to grow" caption="YOUR MEMBERSHIP">
			<TabBar tabBarName="Billing period" value={billing} onChange={setBilling} tabWidth="fill">
				<Tab value="monthly" label="Monthly" />
				<Tab value="yearly" label="Yearly" />
			</TabBar>
			<Row>
				<div>
					<span className={css.metric}>${price}</span>
					<span className={css.muted}> / month</span>
				</div>
				<Chip label="Save 20% yearly" />
			</Row>
			<RadioButtonList
				label="Choose your plan"
				name="overview-plan"
				value={plan}
				onChange={setPlan}
				options={[
					{ value: 'solo', label: 'Solo · Just you and your ideas' },
					{ value: 'studio', label: 'Studio · Bring your whole team' },
				]}
			/>
			<div className={css.inset}>
				<p>Unlimited projects</p>
				<p>Shared libraries and guest reviews</p>
				<p>Everything in one creative home</p>
			</div>
			<Button
				label="Choose plan"
				variant="primary"
				onClick={() => notice(`${plan === 'studio' ? 'Studio' : 'Solo'} selected, billed ${billing}.`)}
			/>
		</Block>
	);
}
