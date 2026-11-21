import image from '@/src/assets/studio.png';
import {
	Button,
	type ButtonProps,
	Card,
	CardContent,
	CardTitle,
	DialogBox,
	FlexBox,
	InfoBox,
	InfoBoxAction,
	InfoBoxContent,
	InfoBoxImage,
	InfoBoxTitle,
	Preset,
	TextField,
	useTheme,
} from '@apple-pie/slice';
import { type ModalComponentProps, getModal, modalActions } from '@apple-pie/slice/stores/modal';
import { tintFromColor } from '@apple-pie/slice/utils';
import Image from 'next/image';
import { useCallback, useEffect, useId, useState } from 'react';
import { useNotice } from '../Shared';

const initialWorkspaces = [
	{ id: 'fieldnotes', title: 'Fieldnotes', text: 'Research interviews and field reports' },
	{ id: 'studio', title: 'Studio North', text: 'Brand assets and client projects' },
	{ id: 'launch', title: 'Launch Archive', text: 'Past launches and campaign files' },
];

function DeleteConfirmation({
	workspaceName = '',
	onDelete,
	onClose,
}: ModalComponentProps & { workspaceName?: string; onDelete?: () => void }) {
	const [name, setName] = useState('');
	const canDelete = name === workspaceName;
	const { isDark } = useTheme();
	return (
		<DialogBox
			title={`Delete ${workspaceName}?`}
			dialogName={`Delete ${workspaceName}`}
			close={false}
			onClose={onClose}
			maxWidth={360}
			actionsBorderWidth={1}
			actionsBorderColor={'core-fill-primary'}
			actionsBackgroundColor={tintFromColor('core-surface-secondary', isDark ? -5 : -2)}
		>
			<DialogBox.Content>
				<FlexBox preset={Preset.Column} width={'fill'} padding={'0-0-16-0'} overflow={'visible'}>
					<p style={{ color: 'var(--core-text-secondary)' }}>
						Enter the workspace name to confirm deleting all of it's content.
					</p>
					<TextField value={name} placeholder={`Type in '${workspaceName}' to delete`} onChange={setName} />
				</FlexBox>
			</DialogBox.Content>
			<DialogBox.Actions>
				<Button width={'fill'} id={'cancel'} label={'Cancel'} variant={'secondary'} onClick={() => onClose?.()} />
				<Button
					width={'fill'}
					id={'delete'}
					label="Delete"
					iconLeft={'basic.trash'}
					disabled={!canDelete}
					variant={'primary'}
					destructive
					onClick={() => onDelete?.()}
				/>
			</DialogBox.Actions>
		</DialogBox>
	);
}

export function DangerZone() {
	const modalId = useId();
	const [workspaces, setWorkspaces] = useState(initialWorkspaces);
	const notice = useNotice();
	useEffect(
		() => () => {
			if (getModal()?.id === modalId) modalActions.clear();
		},
		[modalId],
	);

	// remove
	const removeWorkspace = useCallback(
		(workspaceId: string, name: string) => {
			setWorkspaces((current) => current.filter(({ id }) => id !== workspaceId));
			notice(`Removed ${name} from this preview.`);
			modalActions.show(null);
		},
		[notice],
	);

	// handle click delete
	const handleClickDelete = useCallback(
		(space: any) => {
			modalActions.show({
				id: modalId,
				component: DeleteConfirmation,
				props: {
					workspaceName: space.title,
					onDelete: () => removeWorkspace(space.id, space.title),
				},
			});
		},
		[modalId, removeWorkspace],
	);

	const resetButton: Partial<ButtonProps> = {
		round: true,
		iconLeft: 'arrows.refresh-ccw',
		onClick: () => setWorkspaces(initialWorkspaces),
		borderWidth: 0,
	};

	return (
		<Card>
			<CardTitle
				title="Delete a workspace"
				caption="WORKSPACE SETTINGS"
				text="Remove a workspace when you no longer need its projects or files."
				action={[resetButton]}
			/>
			<CardContent>
				<FlexBox preset={Preset.Column} width={'fill'} gap={16}>
					{workspaces.length === 0 && <p>No workspaces left to delete.</p>}
					{workspaces.map((workspace) => {
						return (
							<InfoBox
								backgroundColor={'transparent'}
								key={`workspace.${workspace.id}`}
								minWidth={'100%'}
								maxWidth={'100%'}
							>
								<InfoBoxImage style={{ paddingTop: 0, borderRadius: 6, overflow: 'hidden' }}>
									<Image src={image} height={45} alt="" />
								</InfoBoxImage>
								<InfoBoxTitle title={workspace.title} />
								<InfoBoxContent text={workspace.text} />
								<InfoBoxAction>
									<Button
										round
										borderWidth={0}
										iconLeft={'basic.trash'}
										destructive
										aria-label={`Delete ${workspace.title}`}
										onClick={() => handleClickDelete(workspace)}
									/>
								</InfoBoxAction>
							</InfoBox>
						);
					})}
				</FlexBox>
			</CardContent>
		</Card>
	);
}
