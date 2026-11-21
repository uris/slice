import { Avatar, Button, CheckBox, ContentEditable, DoneCheck, DraggablePanel, DropDown } from '@apple-pie/slice';
import { useRef, useState } from 'react';
import css from '../Overview.module.css';
import { Block, Row } from '../Shared';

export function TaskDetails() {
	const [title, setTitle] = useState('Polish the final details');
	const [editing, setEditing] = useState(false);
	const [priority, setPriority] = useState('normal');
	const [checks, setChecks] = useState([true, false, false]);
	const [saved, setSaved] = useState(false);
	const container = useRef<HTMLDivElement>(null);
	return (
		<Block title="Task inspector" caption="A LITTLE MORE FOCUS">
			<div className={css.inspector} ref={container}>
				<DraggablePanel
					isClosed={false}
					drags="left"
					dragHandle={false}
					containerRef={container}
					sizeConstraints={{ initial: 280, min: 200, max: 400 }}
					resizeHandleLabel="Resize task inspector"
				>
					<div className={css.stack} style={{ padding: 12 }}>
						<ContentEditable
							value={title}
							isEditable={editing}
							onDoubleClick={() => setEditing(true)}
							onCommit={setTitle}
							onEditEnd={() => setEditing(false)}
							name="Task title"
						/>
						<Button label="Edit title" variant="text" iconLeft="editor.edit" onClick={() => setEditing(true)} />
						<DropDown
							label="Priority"
							value={priority}
							onChange={setPriority}
							options={[
								{ value: 'normal', label: 'Normal priority' },
								{ value: 'high', label: 'High priority' },
							]}
						/>
						{['Gather references', 'Review with Maya', 'Share the final files'].map((label, i) => (
							<CheckBox
								key={label}
								label={label}
								checked={checks[i]}
								onChange={(v) => {
									setChecks((current) => current.map((checked, index) => (index === i ? v : checked)));
									setSaved(false);
								}}
							/>
						))}
						<Row>
							<Avatar name="Alex Morgan" image="/images/profile-pic-male-1.png" size={28} />
							<small className={css.muted}>Assigned to Alex</small>
						</Row>
						<Button label={saved ? 'Changes saved' : 'Save task'} variant="secondary" onClick={() => setSaved(true)} />
						{saved && <DoneCheck statusLabel="Task saved" size={20} />}
					</div>
				</DraggablePanel>
			</div>
		</Block>
	);
}
