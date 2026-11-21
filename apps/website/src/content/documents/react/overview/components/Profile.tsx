import {
	Avatar,
	Button,
	Card,
	CardContent,
	CardFooter,
	CardImage,
	CardTitle,
	Icon,
	IconButton,
	PopMenu,
	PopMenuGroup,
	PopMenuItem,
	TextArea,
} from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import { type PushedPopMenu, getPopMenu, popMenuActions } from '@apple-pie/slice/stores/popMenu';
import { useEffect, useRef, useState } from 'react';
import css from '../Overview.module.css';
import { Row, useNotice } from '../Shared';

export function Profile() {
	const [following, setFollowing] = useState(false);
	const [liked, setLiked] = useState(false);
	const [commenting, setCommenting] = useState(false);
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState<string[]>([]);
	const owned = useRef<PushedPopMenu | null>(null);
	const notice = useNotice();
	const tip = useTipActions().push;
	useEffect(
		() => () => {
			if (owned.current && getPopMenu() === owned.current) popMenuActions.clear();
		},
		[],
	);
	const openMenu = (caller: HTMLButtonElement) => {
		const menu = (
			<PopMenu caller={caller}>
				<PopMenuGroup title="Maya Chen">
					<PopMenuItem
						label="Profile details"
						onClick={() => notice('Maya is a photographer based in San Francisco.')}
					/>
					<PopMenuItem label="View projects" onClick={() => notice('Maya has 8 active projects.')} />
				</PopMenuGroup>
			</PopMenu>
		);
		owned.current = menu;
		popMenuActions.push(menu);
	};
	return (
		<Card role="group" aria-label="Maya’s photo journal" padding={20} className={css.card} style={{ width: '100%' }}>
			<CardTitle>
				<Row>
					<Avatar name="Maya Chen" image="/images/profile-pic-female-1.png" size={40} />
					<div style={{ flex: 1 }}>
						<strong>Maya Chen</strong>
						<p className={css.small}>Photographer · San Francisco</p>
					</div>
					<IconButton
						icon="basic.more-horiz-fill"
						actionName="Profile actions"
						tooltip="More about Maya"
						onToolTip={tip}
						onClick={(event) => openMenu(event.currentTarget)}
					/>
				</Row>
			</CardTitle>
			<CardImage
				src="/images/studio.png"
				alt="A close-up of a golden sunflower with bright yellow petals"
				height={260}
			/>
			<CardContent>
				<div className={css.stack}>
					<div>
						<strong>A little sunshine, up close.</strong>
						<p className={css.muted}>
							I almost walked past this sunflower on my morning walk. Then the light caught its petals. One quiet
							minute, a close crop, and a reminder to slow down and look a little closer.
						</p>
					</div>
					<div className={css.postDetails}>
						<span>
							<Icon name="maps.pin" size={14} />
							Golden Gate Park
						</span>
						<span>
							<Icon name="electronics.watch" size={14} />
							Morning light
						</span>
						<span>
							<Icon name="images.camera" size={14} />
							50mm
						</span>
					</div>
					{comments.map((text, index) => (
						<p key={`${index}-${text}`} className={css.message}>
							{text}
						</p>
					))}
					{commenting && (
						<form
							className={css.stack}
							onSubmit={(event) => {
								event.preventDefault();
								if (!comment.trim()) return;
								setComments((current) => [...current, comment.trim()]);
								setComment('');
								setCommenting(false);
							}}
						>
							<TextArea
								rows={3}
								inputName="Comment on Maya’s photo"
								placeholder="Leave a little encouragement…"
								value={comment}
								onChange={setComment}
							/>
							<div style={{ display: 'flex', gap: 8, width: '100%' }}>
								<Button
									label="Cancel"
									variant="secondary"
									width="fill"
									onClick={() => {
										setComment('');
										setCommenting(false);
									}}
								/>
								<Button label="Post comment" variant="primary" width="fill" type="submit" disabled={!comment.trim()} />
							</div>
						</form>
					)}
				</div>
			</CardContent>
			<CardFooter stack="horizontal" align="edges">
				<div className={css.postStats}>
					<span aria-label={`${128 + Number(liked)} likes`}>
						<Icon name="basic.thumbs-up" size={16} />
						{128 + Number(liked)}
					</span>
					<span aria-label={`${comments.length} comments`}>
						<Icon name="chat.comment-2" size={16} />
						{comments.length}
					</span>
				</div>
				<div className={css.postActions}>
					<IconButton
						buttonSize={28}
						iconSize={18}
						backgroundColor="transparent"
						backgroundColorHover="transparent"
						backgroundColorSelected="transparent"
						icon="users.user-plus"
						actionName={following ? 'Following Maya' : 'Follow Maya'}
						toggle
						selected={following}
						onChange={setFollowing}
						tooltip={following ? 'Following Maya' : 'Follow Maya'}
						onToolTip={tip}
					/>
					<IconButton
						buttonSize={28}
						iconSize={18}
						backgroundColor="transparent"
						backgroundColorHover="transparent"
						backgroundColorSelected="transparent"
						icon="basic.thumbs-up"
						actionName={liked ? 'Unlike photo' : 'Like photo'}
						toggle
						selected={liked}
						onChange={setLiked}
						tooltip="Like photo"
						onToolTip={tip}
					/>
					<IconButton
						buttonSize={28}
						iconSize={18}
						backgroundColor="transparent"
						backgroundColorHover="transparent"
						backgroundColorSelected="transparent"
						icon="chat.comment-2"
						actionName="Comment on photo"
						toggle
						selected={commenting}
						onChange={setCommenting}
						tooltip="Comment"
						onToolTip={tip}
					/>
					<IconButton
						buttonSize={28}
						iconSize={18}
						backgroundColor="transparent"
						backgroundColorHover="transparent"
						backgroundColorSelected="transparent"
						icon="basic.share"
						actionName="Share photo"
						onClick={() => notice('Maya’s photo is ready to share in this preview.')}
						tooltip="Share"
						onToolTip={tip}
					/>
				</div>
			</CardFooter>
		</Card>
	);
}
