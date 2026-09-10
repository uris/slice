import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { FlexDiv } from '../../components/FlexDiv';
import { Spacer } from '../../components/Spacer';
import { TextArea } from '../../components/TextArea';
import { useLocalDB, useLocalDBError, useLocalDBValues, useManageLocalDB } from './localDBStore';

const STORE_NAME = 'storybook-localdb-messages';
const MAX_MESSAGES = 10;

export type StoreMessage = {
	id: string;
	message: string;
};

function LocalDBStoreDemo() {
	const [draft, setDraft] = useState('');
	const didInitialize = useRef(false);
	const { addStore, destroyStore } = useManageLocalDB();
	const { add, remove } = useLocalDB(STORE_NAME);
	const values = useLocalDBValues<StoreMessage>(STORE_NAME);
	const error = useLocalDBError(STORE_NAME);

	useEffect(() => {
		if (didInitialize.current) return;
		didInitialize.current = true;
		void addStore(STORE_NAME, { key: 'id' });
	}, [addStore]);

	const handleAdd = async () => {
		const message = { id: String(Date.now()), message: draft.trim() };
		if (!message.message) return;
		if (values.length >= MAX_MESSAGES) return;
		const result = await add(message);
		if (!result.ok) return;
		setDraft('');
	};

	const handleRemove = async (message: StoreMessage) => {
		await remove(message);
	};

	return (
		<FlexDiv absolute width={'fill'} height={'fill'} align={'center'} justify={'center'} padding={24}>
			<FlexDiv width={520} height={'auto'} direction={'column'} gap={12}>
				<h1>Local IndexedDB Store Demo</h1>
				Add up to {MAX_MESSAGES} short messages. The list is stored in IndexedDB called '{STORE_NAME}' and survives page
				refreshes. Note: inspect the browser dev tools to see the IndexedDB store.
				<FlexDiv width={'fill'} gap={8} align={'end'}>
					<TextArea
						name={'message'}
						value={draft}
						placeholder={'Type a message'}
						rows={3}
						onChange={(value) => setDraft(value)}
						resizable={false}
					/>
					<Button
						label={'Add to IndexedDB Store'}
						onClick={() => void handleAdd()}
						state={!draft.trim() || values.length >= MAX_MESSAGES ? 'disabled' : 'normal'}
					/>
				</FlexDiv>
				<h4>IndexedDB Store Entries</h4>
				{values.length > 0 && (
					<div>
						Entries: {values.length} (max of {MAX_MESSAGES})
					</div>
				)}
				{error && <div>Error: {error}</div>}
				<FlexDiv direction={'column'} gap={8}>
					{values.length === 0 ? (
						<div>No messages added yet.</div>
					) : (
						values.map((message) => (
							<FlexDiv
								key={String(message.id)}
								width={'fill'}
								justify={'between'}
								direction={'row'}
								align={'center'}
								gap={12}
								padding={'8px 8px 8px 16px'}
								border={'1px solid var(--core-outline-primary)'}
								background={'var(--core-surface-primary)'}
								borderRadius={4}
							>
								<div>
									Id: {message.id}, Message: {message.message}
								</div>
								<Button
									iconLeft={'trash bin'}
									round
									size={'medium'}
									destructive={true}
									onClick={() => void handleRemove(message)}
								/>
							</FlexDiv>
						))
					)}
				</FlexDiv>
				<Spacer size={24} />
				<Button label={'Destroy Store'} destructive={true} onClick={() => void destroyStore(STORE_NAME)} />
			</FlexDiv>
		</FlexDiv>
	);
}

const meta: Meta<typeof LocalDBStoreDemo> = {
	title: 'Stores/Local DB Store',
	component: LocalDBStoreDemo,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;

export const Demo: StoryObj<typeof LocalDBStoreDemo> = {};
