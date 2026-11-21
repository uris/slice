import {
	Avatar,
	AvatarGroup,
	type AvatarInfo,
	Button,
	Card,
	CardContent,
	CardFooter,
	CardTitle,
	DialogBox,
	InfoBox,
	InfoBoxAction,
	InfoBoxContent,
	InfoBoxTitle,
	useTheme,
} from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import { type ModalComponentProps, getModal, modalActions } from '@apple-pie/slice/stores/modal';
import { tintFromColor } from '@apple-pie/slice/utils';
import { useEffect, useId, useState } from 'react';
import css from '../Overview.module.css';
import { Row, team, useNotice } from '../Shared';

const campaignPeople: AvatarInfo[] = [
	...team,
	{ id: 'jordan', first: 'Jordan', last: 'Lee', image: '/images/profile-pic-female-2.png' },
];

const initialCampaigns = [
	{
		id: 'spring',
		title: 'Spring launch',
		start: '1 Mar',
		end: '15 Apr',
		people: campaignPeople.slice(0, 4),
		started: true,
	},
	{
		id: 'summer',
		title: 'Summer collection',
		start: '1 Jun',
		end: '31 Jul',
		people: campaignPeople.slice(0, 5),
		started: true,
	},
	{
		id: 'newsletter',
		title: 'Studio newsletter',
		start: '1 Aug',
		end: '14 Aug',
		people: campaignPeople.slice(0, 2),
		started: false,
	},
];

function CampaignTeamDialog({
	people = [],
	project = '',
	onClose,
}: ModalComponentProps & { people?: AvatarInfo[]; project?: string }) {
	return (
		<DialogBox
			title={`${project} team`}
			dialogName={`${project} collaborators`}
			close
			onClose={onClose}
			minWidth={300}
			maxHeight={400}
		>
			<ul className={css.campaignTeam}>
				{people.map((person) => (
					<li key={person.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<Avatar
							name={`${person.first} ${person.last}`}
							image={person.image}
							size={40}
							backgroundColor="core-surface-primary"
						/>
						<span>
							{person.first} {person.last}
						</span>
					</li>
				))}
			</ul>
		</DialogBox>
	);
}

export function Workspace() {
	const [campaigns, setCampaigns] = useState(initialCampaigns);
	const modalId = useId();
	const notice = useNotice();
	const pushTip = useTipActions().push;
	const { isDark } = useTheme();
	useEffect(
		() => () => {
			if (getModal()?.id === modalId) modalActions.clear();
		},
		[modalId],
	);
	return (
		<Card role="group" aria-label="Marketing campaigns" className={css.card} padding={20} style={{ width: '100%' }}>
			<CardTitle title="Manage Campaigns" caption="Marketing" />
			<CardContent>
				<ul className={css.campaigns}>
					{campaigns.map((project) => (
						<li key={project.id} className={css.campaign}>
							<InfoBox
								backgroundColor="var(--card-background-color)"
								backgroundColorHover={tintFromColor('core-surface-primary', isDark ? 2 : -0.025)}
								onPress={() => notice(`${project.title} selected.`)}
							>
								<InfoBoxTitle>{project.title}</InfoBoxTitle>
								<InfoBoxContent style={{ paddingTop: 12, overflow: 'visible' }}>
									<Row>
										<AvatarGroup
											avatars={project.people}
											onClick={(event) => event.stopPropagation()}
											backgroundColor={'core-text-dark'}
											textColor={'core-text-light'}
											limit={3}
											size={40}
											borderWidth={0}
											outerBorderWidth={3}
											outerBorderColor="var(--card-background-color)"
											groupName={`${project.title} collaborators`}
											onToolTip={pushTip}
											onMore={({ source, all }) => {
												if (source === 'avatars')
													modalActions.show({
														id: modalId,
														component: CampaignTeamDialog,
														props: { people: all, project: project.title },
													});
											}}
										/>
									</Row>
								</InfoBoxContent>
								<InfoBoxAction
									contentGap={12}
									chip={{
										label: project.started ? 'Active' : 'Editing',
										textSize: 'm',
										paddingLeft: 12,
										paddingRight: 12,
										textColor: 'core-text-primary',
									}}
								/>
							</InfoBox>
						</li>
					))}
				</ul>
			</CardContent>
			<CardFooter>
				<Button
					label="Create new campaign"
					variant="primary"
					width="fill"
					onClick={() =>
						setCampaigns((current) => [
							...current,
							{
								id: crypto.randomUUID(),
								title: `New campaign ${current.length + 1}`,
								start: 'TBD',
								end: 'TBD',
								people: campaignPeople.slice(0, 2),
								started: false,
							},
						])
					}
				/>
			</CardFooter>
		</Card>
	);
}
