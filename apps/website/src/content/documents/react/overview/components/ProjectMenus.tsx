import { PopMenu, PopMenuGroup, PopMenuItem, type PopMenuSubMenuProps, useTheme } from '@apple-pie/slice';
import { useState } from 'react';
import css from '../Overview.module.css';
import { useNotice } from '../Shared';

export function ProjectMenus() {
	const [favorite, setFavorite] = useState(true);
	const [notifications, setNotifications] = useState(false);
	const [pinned, setPinned] = useState(false);
	const [showDetails, setShowDetails] = useState(true);
	const [compact, setCompact] = useState(false);
	const notice = useNotice();
	const { isDark } = useTheme();
	const bgColor = isDark ? 'core-surface-secondary' : 'core-surface-primary';
	const folders = ({ caller, level, dismissAll }: PopMenuSubMenuProps) => (
		<PopMenu
			caller={caller}
			level={level}
			elevation={0}
			name="Move project to folder"
			borderColor="core-outline-primary"
			backgroundColor={bgColor}
			minWidth={180}
			dismissAll={dismissAll}
		>
			<PopMenuGroup title="Move to folder">
				<PopMenuItem
					icon="documents.folder"
					label="Personal"
					onClick={() => notice('Project moved to Personal in this preview.')}
				/>
				<PopMenuItem
					icon="documents.folder"
					label="Studio"
					onClick={() => notice('Project moved to Studio in this preview.')}
				/>
				<PopMenuItem icon="basic.archive" label="Archive" onClick={() => notice('Project archived in this preview.')} />
			</PopMenuGroup>
		</PopMenu>
	);
	return (
		<div className={css.menuPair} role="group" aria-label="Project menu examples">
			<PopMenu inline name="Project actions" elevation={0} backgroundColor={bgColor} borderColor="core-outline-primary">
				<PopMenuGroup title="Spring launch">
					<PopMenuItem
						icon="arrows.external-link"
						label="Open project"
						gap={8}
						textSize="s"
						tabIndex={0}
						onClick={() => notice('Project opened in this preview.')}
					/>
					<PopMenuItem
						icon="basic.copy"
						label="Duplicate"
						gap={8}
						textSize="s"
						tabIndex={0}
						onClick={() => notice('Project duplicated in this preview.')}
					/>
					<PopMenuItem
						icon="documents.folder"
						label="Move to folder"
						gap={8}
						textSize="s"
						tabIndex={0}
						subMenu={folders}
					/>
				</PopMenuGroup>
				<PopMenuGroup title="Quick settings">
					<PopMenuItem
						icon="basic.star"
						label="Favorite"
						gap={8}
						textSize="s"
						tabIndex={0}
						toggle
						toggled={favorite}
						onClick={(_, item) => setFavorite(Boolean(item.toggled))}
					/>
					<PopMenuItem
						icon="alerts.bell"
						label="Notifications"
						gap={8}
						textSize="s"
						tabIndex={0}
						toggle
						toggled={notifications}
						onClick={(_, item) => setNotifications(Boolean(item.toggled))}
					/>
					<PopMenuItem
						icon="maps.pin"
						label="Pin project"
						gap={8}
						textSize="s"
						tabIndex={0}
						toggle
						toggled={pinned}
						onClick={(_, item) => setPinned(Boolean(item.toggled))}
					/>
				</PopMenuGroup>
			</PopMenu>
			<PopMenu
				inline
				name="Project preferences"
				elevation={0}
				backgroundColor={bgColor}
				borderColor="core-outline-primary"
			>
				<PopMenuGroup title="Your workspace">
					<PopMenuItem
						icon="users.user-plus"
						label="Invite people"
						gap={8}
						textSize="s"
						tabIndex={0}
						onClick={() => notice('Invite people from the team example.')}
					/>
					<PopMenuItem
						icon="basic.share"
						label="Share project"
						gap={8}
						textSize="s"
						tabIndex={0}
						onClick={() => notice('Project ready to share in this preview.')}
					/>
					<PopMenuItem
						icon="security.eye"
						label="Preview"
						gap={8}
						textSize="s"
						tabIndex={0}
						onClick={() => notice('Preview opened in this example.')}
					/>
				</PopMenuGroup>
				<PopMenuGroup title="View options">
					<PopMenuItem
						icon="security.eye"
						label="Show details"
						gap={8}
						textSize="s"
						tabIndex={0}
						toggle
						toggled={showDetails}
						onClick={(_, item) => setShowDetails(Boolean(item.toggled))}
					/>
					<PopMenuItem
						icon="grid.grid"
						label="Compact view"
						gap={8}
						textSize="s"
						tabIndex={0}
						toggle
						toggled={compact}
						onClick={(_, item) => setCompact(Boolean(item.toggled))}
					/>
					<PopMenuItem icon="users.user-plus" label="Transfer owner" gap={8} textSize="s" disabled />
				</PopMenuGroup>
			</PopMenu>
		</div>
	);
}
