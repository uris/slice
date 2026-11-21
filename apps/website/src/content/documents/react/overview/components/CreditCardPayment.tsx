import {
	Button,
	Card,
	CardContent,
	CardFooter,
	CardTitle,
	CheckBox,
	InfoBox,
	InfoBoxAction,
	InfoBoxContent,
	InfoBoxImage,
	InfoBoxTitle,
	TextField,
} from '@apple-pie/slice';
import Image from 'next/image';
import { useId, useState } from 'react';
import image from '../../../../../assets/studio.png';
import css from '../Overview.module.css';

export function CreditCardPayment() {
	const [name, setName] = useState('');
	const [number, setNumber] = useState('');
	const [expiry, setExpiry] = useState('');
	const [security, setSecurity] = useState('');
	const [save, setSave] = useState(false);
	const [paid, setPaid] = useState(false);
	const formId = useId();
	const clear = () => {
		setName('');
		setNumber('');
		setExpiry('');
		setSecurity('');
		setSave(false);
		setPaid(false);
	};
	return (
		<Card role="group" aria-label="Payment Info" padding={20} className={css.card} style={{ width: '100%' }}>
			<CardTitle title="Payment Info" caption="CHECKOUT" />
			<CardContent>
				<div className={css.stack}>
					<InfoBox>
						<InfoBoxImage style={{ paddingTop: 0, borderRadius: 6, overflow: 'hidden' }}>
							<Image src={image} height={45} alt={'Studio'} />
						</InfoBoxImage>
						<InfoBoxTitle title="Studio · Monthly" />
						<InfoBoxContent text="A little space for everything you’re building." />
						<InfoBoxAction>
							<strong>$24.00</strong>
						</InfoBoxAction>
					</InfoBox>
					<form
						id={formId}
						className={css.stack}
						onSubmit={(event) => {
							event.preventDefault();
							setPaid(true);
							setName('');
							setNumber('');
							setExpiry('');
							setSecurity('');
							setSave(false);
						}}
					>
						<TextField
							variant="outlined"
							labelBackgroundColor="var(--card-background-color)"
							inline={false}
							textColorPlaceholder="core-text-secondary"
							label="Name on card"
							value={name}
							onChange={setName}
							placeholder="Maya Chen"
							inputAttributes={{ required: true, autoComplete: 'off' }}
						/>
						<TextField
							variant="outlined"
							labelBackgroundColor="var(--card-background-color)"
							inline={false}
							textColorPlaceholder="core-text-secondary"
							label="Card number"
							iconLeft={{ name: 'financial.credit-card' }}
							value={number}
							onChange={setNumber}
							placeholder="4242 4242 4242 4242"
							inputAttributes={{
								required: true,
								inputMode: 'numeric',
								autoComplete: 'off',
								pattern: '[0-9 ]{13,23}',
							}}
						/>
						<div className={css.paymentFields}>
							<TextField
								variant="outlined"
								labelBackgroundColor="var(--card-background-color)"
								inline={false}
								textColorPlaceholder="core-text-secondary"
								label="Expiry"
								value={expiry}
								onChange={setExpiry}
								placeholder="MM/YY"
								inputAttributes={{
									required: true,
									inputMode: 'numeric',
									autoComplete: 'off',
									pattern: '(0[1-9]|1[0-2])/[0-9]{2}',
								}}
							/>
							<TextField
								variant="outlined"
								labelBackgroundColor="var(--card-background-color)"
								inline={false}
								textColorPlaceholder="core-text-secondary"
								label="Security code"
								iconLeft={{ name: 'financial.credit-card-scan' }}
								value={security}
								onChange={setSecurity}
								placeholder="123"
								inputAttributes={{
									required: true,
									inputMode: 'numeric',
									autoComplete: 'off',
									pattern: '[0-9]{3,4}',
								}}
							/>
						</div>
						<div style={{ alignSelf: 'flex-start' }}>
							<CheckBox label="Save card for next time" checked={save} onChange={setSave} />
						</div>
						{paid && (
							<p role="status" className={css.muted}>
								Checkout preview complete.
							</p>
						)}
					</form>
				</div>
			</CardContent>
			<CardFooter stack="horizontal" align="edges">
				<Button label="Cancel" variant="secondary" onClick={clear} />
				<Button label="Pay $24.00" variant="primary" type="submit" form={formId} />
			</CardFooter>
		</Card>
	);
}
