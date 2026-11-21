import css from '../Overview.module.css';
import { AccountAccess } from './AccountAccess';
import { Announcement } from './Announcement';
import { CameraCheck } from './CameraCheck';
import { Conversation } from './Conversation';
import { CreditCardPayment } from './CreditCardPayment';
import { DangerZone } from './DangerZone';
import { Deliverables } from './Deliverables';
import { Devices } from './Devices';
import { FirstProject } from './FirstProject';
import { Invitations } from './Invitations';
import { Plans } from './Plans';
import { Preferences } from './Preferences';
import { Profile } from './Profile';
import { ProjectBudget } from './ProjectBudget';
import { ProjectMenus } from './ProjectMenus';
import { TaskDetails } from './TaskDetails';
import { Transactions } from './Transactions';
import { VideoReview } from './VideoReview';
import { VoiceNote } from './VoiceNote';
import { Workspace } from './Workspace';

// Each block owns its own state; the components page always shows the full board.
const blocks = [
	{ id: 'workspace', component: Workspace },
	{ id: 'payment', component: CreditCardPayment },
	{ id: 'menus', component: ProjectMenus },
	{ id: 'budget', component: ProjectBudget },
	{ id: 'profile', component: Profile },
	{ id: 'account', component: AccountAccess },
	{ id: 'conversation', component: Conversation },
	{ id: 'preferences', component: Preferences },
	{ id: 'files', component: Deliverables },
	{ id: 'team', component: Invitations },
	{ id: 'plans', component: Plans },
	{ id: 'transactions', component: Transactions },
	{ id: 'announcement', component: Announcement },
	{ id: 'voice', component: VoiceNote },
	{ id: 'tasks', component: TaskDetails },
	{ id: 'video', component: VideoReview },
	{ id: 'devices', component: Devices },
	{ id: 'camera', component: CameraCheck },
	{ id: 'new-project', component: FirstProject },
	{ id: 'danger', component: DangerZone },
];

export function ComponentsOverview() {
	return (
		<div className={css.board}>
			{blocks.map(({ id, component: Component }) => (
				<section key={id} className={css.tile} data-overview-block={id}>
					<Component />
				</section>
			))}
		</div>
	);
}
