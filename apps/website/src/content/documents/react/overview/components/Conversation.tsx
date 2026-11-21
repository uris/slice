import {
	Attachment,
	Avatar,
	type ButtonProps,
	Card,
	CardContent,
	CardTitle,
	type FileItem,
	FlexBox,
	type FlexBoxProps,
	Preset,
	PromptInput,
	useLastUpdated,
	useTheme,
} from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import { tintFromColor } from '@apple-pie/slice/utils';
import { useCallback, useState } from 'react';
import { useNotice } from '../Shared';

const initialMessages = [
	{
		id: 'first-message',
		message: 'The new direction feels really good. Can we try a warmer cover?',
		sender: true,
		timestamp: Date.now() - 100000,
	},
	{
		id: 'second-message',
		message: 'The new direction feels really good. Can we try a warmer cover?',
		sender: false,
		timestamp: Date.now(),
	},
];

export function Conversation() {
	const { isDark } = useTheme();
	const bgColor = isDark ? 'core-surface-primary' : 'core-surface-secondary';
	const [messages, setMessages] = useState<UserMessageProps[]>(initialMessages);
	const [draft, setDraft] = useState('');
	const [files, setFiles] = useState<FileItem[]>([]);
	const notice = useNotice();
	const { push } = useTipActions();
	const resetButton: ButtonProps = {
		round: true,
		iconLeft: 'arrows.refresh-ccw',
		tooltip: 'Reset',
		onToolTip: push,
		onClick: () => setMessages(initialMessages),
	};
	const handleSendMessage = useCallback((message: string, attachments?: FileItem[]) => {
		const newMessage = { id: crypto.randomUUID(), message, sender: true, timestamp: Date.now(), attachments };
		setMessages((prev) => [...prev, newMessage]);
		setDraft('');
		setFiles([]);
	}, []);

	return (
		<Card>
			<CardTitle title="Lets chat ..." caption="Project Threads" action={[resetButton]} />
			<CardContent>
				<FlexBox preset={Preset.Column} width={'fill'} gap={16}>
					<FlexBox preset={Preset.Column} gap={16}>
						{messages.map((message) => {
							return <Message key={message.id} {...message} />;
						})}
					</FlexBox>
					<PromptInput
						inputName="Reply to the team"
						placeholder="Add to the conversation…"
						value={draft}
						attachments={files}
						onAttachmentsChange={setFiles}
						fileListProps={{ attachmentSize: 'xs', variant: 'attachments' }}
						pasteAttachmentThreshold={50}
						onChange={setDraft}
						onSubmit={(message, attachments) => {
							handleSendMessage(message, attachments);
							notice('Message added to this preview.');
						}}
						maxHeight={180}
						backgroundColor={bgColor}
					/>
				</FlexBox>
			</CardContent>
		</Card>
	);
}

interface UserMessageProps {
	id?: string;
	message?: string;
	sender?: boolean;
	attachments?: FileItem[];
	timestamp?: number;
}

function Message(props: Readonly<UserMessageProps>) {
	const { isDark } = useTheme();
	const { message, sender, attachments, id, timestamp } = props;
	const dateString = new Date(timestamp ?? '').toISOString();
	const { lastUpdated } = useLastUpdated(dateString);
	const justify = sender ? 'end' : 'start';
	const senderProps: Partial<FlexBoxProps> = {
		background: isDark ? 'core-fill-primary' : tintFromColor('core-surface-primary', -2),
		border: '1px solid var(--core-outline-primary)',
	};
	const baseProps: Partial<FlexBoxProps> = {
		border: '1px solid var(--core-outline-primary)',
	};
	const flexProps = sender ? senderProps : baseProps;

	return (
		<FlexBox preset={Preset.Row} justify={justify} align={'start'} width={'fill'} gap={8}>
			{sender && (
				<FlexBox preset={Preset.Column} padding={'12-0-0-0'}>
					<Avatar name={'Maya Chen'} image="/images/profile-pic-female-1.png" size={24} />
				</FlexBox>
			)}
			<FlexBox {...flexProps} preset={Preset.Column} maxWidth={'80%'} borderRadius={16} padding={16} gap={4}>
				{message}
				{attachments?.map((attachment) => {
					return (
						<Attachment
							orientation={'horizontal'}
							size={'xs'}
							key={`attachment.${id}.${attachment.id}`}
							content={attachment}
						/>
					);
				})}
				{timestamp && <span className="body-xs-regular core-text-tertiary">{lastUpdated}</span>}
			</FlexBox>
		</FlexBox>
	);
}
