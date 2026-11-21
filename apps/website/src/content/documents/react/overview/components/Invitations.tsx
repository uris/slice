import {
	Avatar,
	Button,
	Card,
	CardContent,
	CardFooter,
	CardTitle,
	type ErrorMessage,
	FlexBox,
	InfoBox,
	InfoBoxAction,
	InfoBoxContent,
	InfoBoxImage,
	InfoBoxTitle,
	Preset,
	RadioButton,
	RadioButtonList,
	TextField,
} from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import { classNames } from '@apple-pie/slice/utils';
import { useCallback, useState } from 'react';
import { Members, useNotice } from '../Shared';

type MemberType = { email: string; name: string; role: string; pending?: boolean };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Invitations() {
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [role, setRole] = useState('Viewer');
	const [invited, setInvited] = useState<MemberType[]>([]);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const [init, setInit] = useState<boolean>(false);
	const notice = useNotice();
	const { push } = useTipActions();

	// delete invited user
	const handleDelete = useCallback((email: string) => {
		setInvited((prev) => {
			return prev.filter((i) => i.email !== email);
		});
	}, []);

	// rest the form
	const clearForm = useCallback(() => {
		setEmail('');
		setName('');
		setRole('Viewer');
		setErrors([]);
		setInit(false);
	}, []);

	// validate form and set errors
	const checkForm = useCallback(() => {
		const errorMessages: ErrorMessage[] = [];
		if (!emailRegex.test(email.trim())) {
			errorMessages.push({ id: 'email', fieldName: 'email', title: 'Please enter a valid email' });
		}
		if (name.length < 3) {
			errorMessages.push({ id: 'name', fieldName: 'name', title: 'Please enter a valid name' });
		}
		setErrors(errorMessages);
		return errorMessages;
	}, [email, name]);

	// handle value changes
	const handleChangeValue = useCallback(
		(fieldName: string, value: string) => {
			if (init) checkForm();
			if (fieldName === 'email') setEmail(value);
			if (fieldName === 'name') setName(value);
		},
		[init, checkForm],
	);

	// handle invite click
	const updateInvited = useCallback(() => {
		const errorMessages: ErrorMessage[] = checkForm();
		if (errorMessages.length > 0) {
			notice('Please make the necessary corrections');
			setInit(true);
		} else {
			setInvited((prev) => {
				return [...prev, { name, email, role, pending: true }];
			});
			clearForm();
			notice('Invitation added to this preview.');
		}
	}, [name, email, role, notice, clearForm, checkForm]);

	// check for field error
	const getError = useCallback(
		(fieldName: string) => {
			const error = errors.filter((error) => error.fieldName === fieldName);
			return error?.[0] ? error[0].title : undefined;
		},
		[errors],
	);

	return (
		<Card>
			<CardTitle
				title="Northern Sutdio Project Team"
				caption="Invite Team Members"
				action={[
					{
						round: true,
						tooltip: 'Reset card',
						iconLeft: 'arrows.refresh-ccw',
						onClick: () => {
							clearForm();
							setInvited([]);
						},
						onToolTip: push,
					},
				]}
			/>
			<CardContent>
				<Members />
				{invited?.length > 0 && (
					<FlexBox preset={Preset.Column} width={'fill'} gap={8} padding={'8-0-0-0'}>
						<span className={classNames('body-s-regular', 'core-test-tertiary')} style={{ paddingLeft: 16 }}>
							Pending
						</span>
						{invited.map((invitation) => {
							const { email, name, role, pending } = invitation;
							return (
								<InfoBox key={email} minWidth={'100%'} maxWidth={'100%'}>
									<InfoBoxImage>
										<Avatar size={40} name={name} textColor={'core-text-primary'} />
									</InfoBoxImage>
									<InfoBoxTitle title={invitation.name} />
									<InfoBoxContent text={`${email} - ${role}`} />
									<InfoBoxAction>
										<FlexBox preset={Preset.Row} gap={8}>
											<Button
												iconStrokeWidth={1.5}
												round
												iconLeft={'basic.trash'}
												borderWidth={0}
												destructive
												onClick={() => handleDelete(email)}
											/>
										</FlexBox>
									</InfoBoxAction>
								</InfoBox>
							);
						})}
					</FlexBox>
				)}
			</CardContent>
			<CardFooter>
				<form
					style={{ width: '100%' }}
					onSubmit={(e) => {
						e.preventDefault();
						updateInvited();
					}}
				>
					<FlexBox preset={Preset.Column} width={'fill'} gap={8} overflow={'visible'}>
						<TextField
							placeholder="Enter full name"
							backgroundColorBlurred={'core-surface-primary'}
							value={name}
							onChange={(val) => handleChangeValue('name', val)}
							error={init && !!getError('name')}
							errorMessage={getError('name')}
						/>
						<TextField
							placeholder="Enter email"
							backgroundColorBlurred={'core-surface-primary'}
							value={email}
							onChange={(val) => handleChangeValue('email', val)}
							error={init && !!getError('email')}
							errorMessage={getError('email')}
						/>
						<FlexBox padding={'0-16'}>
							<RadioButtonList
								direction={'row'}
								radioGroup={'access-level'}
								value={role}
								defaultValue={role}
								onChange={(value) => setRole(value)}
							>
								<RadioButton radioGroup={'access-level'} value="Viewer" label={'View only'} />
								<RadioButton radioGroup={'access-level'} value="Editor" label={'View and edit'} />
							</RadioButtonList>
						</FlexBox>
						<FlexBox
							preset={Preset.Row}
							width={'fill'}
							padding={'16-0-0-0'}
							margin={'16-0-0-0'}
							style={{ borderTop: '1px solid var(--core-outline-primary)' }}
							gap={16}
						>
							<Button width={'fill'} label="Cancel" variant="secondary" onClick={clearForm} />
							<Button
								iconRight={'basic.send'}
								iconSize={16}
								iconStrokeWidth={1.5}
								type="submit"
								width={'fill'}
								label="Send invitation"
								variant="primary"
							/>
						</FlexBox>
					</FlexBox>
				</form>
			</CardFooter>
		</Card>
	);
}
