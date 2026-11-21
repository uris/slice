import {
	Avatar,
	Button,
	Card,
	CardContent,
	CardFooter,
	CardTitle,
	CheckBox,
	ErrorSummary,
	FlexBox,
	InfoBox,
	InfoBoxAction,
	InfoBoxContent,
	InfoBoxImage,
	InfoBoxTitle,
	Preset,
	TextField,
} from '@apple-pie/slice';
import { useId, useState } from 'react';
import css from '../Overview.module.css';
import { useNotice } from '../Shared';

export function AccountAccess() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [remember, setRemember] = useState(true);
	const [knownPerson, setKnownPerson] = useState(true);
	const [error, setError] = useState(false);
	const formId = useId();
	const notice = useNotice();
	const cancel = () => {
		setPassword('');
		setEmail('');
		setRemember(true);
		setError(false);
		setKnownPerson(true);
	};
	return (
		<Card role="group" aria-label="Welcome back" padding={20} className={css.card} style={{ width: '100%' }}>
			<CardTitle title="Welcome back" caption="YOUR ACCOUNT" />
			<CardContent>
				<form
					id={formId}
					className={css.stack}
					onSubmit={(event) => {
						event.preventDefault();
						const invalid = (!knownPerson && !email.includes('@')) || password.length < 8;
						setError(invalid);
						if (!invalid) notice('Demo sign-in complete. No credentials were sent.');
					}}
				>
					{knownPerson ? (
						<InfoBox>
							<InfoBoxImage>
								<Avatar name="Jane Miller" image="/images/profile-pic-female-1.png" size={40} />
							</InfoBoxImage>
							<InfoBoxTitle title="Jane Miller" />
							<InfoBoxContent text="Product designer" />
							<InfoBoxAction
								contentGap={8}
								button={{
									label: 'Not Jane?',
									variant: 'secondary',
									onClick: () => {
										setKnownPerson(false);
										setPassword('');
										setError(false);
									},
								}}
							/>
						</InfoBox>
					) : (
						<TextField
							label="Email"
							value={email}
							onChange={setEmail}
							placeholder="you@studio.com"
							inputAttributes={{ autoComplete: 'username' }}
						/>
					)}
					{error && (
						<ErrorSummary
							entries={[
								{
									title: 'Please enter a valid password',
								},
							]}
						/>
					)}
					<TextField
						inputName="Password"
						inputType="password"
						value={password}
						onChange={setPassword}
						placeholder="Enter password"
						inputAttributes={{ autoComplete: 'current-password' }}
					/>
					<FlexBox preset={Preset.RowBetween} padding={'0-8'}>
						<CheckBox label="Remember me" checked={remember} onChange={setRemember} />
					</FlexBox>
				</form>
			</CardContent>
			<CardFooter stack="horizontal" align="edges">
				<Button label="Cancel" variant="secondary" onClick={cancel} />
				<Button label="Sign in" variant="primary" type="submit" form={formId} />
			</CardFooter>
		</Card>
	);
}
