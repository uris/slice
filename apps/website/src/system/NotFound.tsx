'use client';

import { Button, FlexDiv, Preset } from '@apple-pie/slice';
import { useWindow } from '@apple-pie/slice/hooks';

export default function NotFound() {
	const { height } = useWindow();
	return (
		<FlexDiv preset={Preset.Window} height={height} justify={'center'} align={'center'} direction={'column'}>
			<p>404 old jedi mind trick ...</p>
			<h1>This is not the page I'm looking for ...</h1>
			<Button
				label={'Move along ...'}
				size={'large'}
				variant={'text'}
				labelSize={'l'}
				underline
				labelColor={'var(--core-link-primary)'}
				iconLeft={'home'}
				iconColor={'var(--core-link-primary)'}
				onClick={() => {
					window.open('/', '_top');
				}}
			/>
		</FlexDiv>
	);
}
