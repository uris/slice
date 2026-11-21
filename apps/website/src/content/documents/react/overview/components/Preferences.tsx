import { Button, CheckBox, Switch } from '@apple-pie/slice';
import { useState } from 'react';
import css from '../Overview.module.css';
import { Block, Row, useNotice } from '../Shared';

export function Preferences() {
	const [email, setEmail] = useState(true);
	const [push, setPush] = useState(false);
	const [digest, setDigest] = useState(true);
	const notice = useNotice();
	return (
		<Block title="Make it yours" caption="PREFERENCES">
			<Row>
				<div>
					<strong>Email notifications</strong>
					<p className={css.muted}>Comments and project updates</p>
				</div>
				<Switch name="Email notifications" checked={email} onChange={(_, v) => setEmail(v)} />
			</Row>
			<Row>
				<div>
					<strong>Push notifications</strong>
					<p className={css.muted}>A nudge when it matters</p>
				</div>
				<Switch name="Push notifications" checked={push} onChange={(_, v) => setPush(v)} />
			</Row>
			<CheckBox label="Send me the Friday roundup" checked={digest} onChange={setDigest} />
			<Button
				label="Save preferences"
				variant="secondary"
				onClick={() => notice('Preferences saved for this preview.')}
			/>
		</Block>
	);
}
