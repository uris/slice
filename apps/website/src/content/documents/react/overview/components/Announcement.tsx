import {
	ButtonBar,
	type ButtonProps,
	Card,
	CardContent,
	CardFooter,
	CardTitle,
	FlexBox,
	Preset,
	TextArea,
} from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import { useState } from 'react';

export function Announcement() {
	const [message, setMessage] = useState('A new season of ideas. Our spring collection is almost here.');
	const { push } = useTipActions();

	const handleReset = () => {
		setMessage('A new season of ideas. Our spring collection is almost here.');
	};

	const handleClear = () => {
		setMessage('');
	};

	const formatButtons: ButtonProps[] = [
		{ iconLeft: 'editor.text-bold', round: true, tooltip: 'Bold', onToolTip: push },
		{ iconLeft: 'editor.text-italic', round: true, tooltip: 'Italic', onToolTip: push },
	];

	const alignButtons: ButtonProps[] = [
		{ iconLeft: 'editor.align-left', round: true, tooltip: 'Align Left', onToolTip: push },
		{ iconLeft: 'editor.align-center', round: true, tooltip: 'Align Center', onToolTip: push },
		{ iconLeft: 'editor.align-right', round: true, tooltip: 'Align Right', onToolTip: push },
	];

	const actionButtons: ButtonProps[] = [
		{ label: 'Clear', variant: 'secondary', onClick: handleClear },
		{ label: 'Publish', variant: 'primary' },
	];

	const topActions: ButtonProps[] = [{ iconLeft: 'arrows.import', round: true, tooltip: 'Download', onToolTip: push }];

	const resetButtons: ButtonProps[] = [{ iconLeft: 'arrows.refresh-cw', round: true, onClick: handleReset }];

	return (
		<Card>
			<CardTitle title={'News worth sharing'} caption={'Team announcement'} action={topActions} />
			<CardContent>
				<FlexBox preset={Preset.FillStart} gap={16} overflow={'visible'}>
					<FlexBox preset={Preset.RowBetween} role="group" aria-label="Announcement formatting">
						<FlexBox preset={Preset.Row} gap={8}>
							<ButtonBar buttons={formatButtons} />
							<ButtonBar buttons={alignButtons} />
						</FlexBox>
						<ButtonBar buttons={resetButtons} />
					</FlexBox>
					<TextArea value={message} onChange={setMessage} rows={3} />
				</FlexBox>
			</CardContent>
			<CardFooter stack={'horizontal'} actionButtons={actionButtons} />
		</Card>
	);
}
