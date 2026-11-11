'use client';
import { ContentEditable } from '@apple-pie/slice';
import { useState } from 'react';

export function ContentEditableUsageExample() {
	const [title, setTitle] = useState('Quarterly planning');
	const [editing, setEditing] = useState(false);

	return (
		<ContentEditable
			name="Project title"
			value={title}
			isEditable={editing}
			onClick={() => setEditing(true)}
			onEditStart={() => setEditing(true)} // keyboard activation
			onCommit={setTitle}
			onEditEnd={() => setEditing(false)}
		/>
	);
}

export function ContentEditableClampExample() {
	const [title, setTitle] = useState('Quarterly planning: priorities, milestones, and decisions for the entire team');
	const [editing, setEditing] = useState(false);

	return (
		<ContentEditable
			name="Clamped project title"
			value={title}
			width={320}
			clamp={1}
			isEditable={editing}
			onClick={() => setEditing(true)}
			onEditStart={() => setEditing(true)}
			onCommit={setTitle}
			onEditEnd={() => setEditing(false)}
		/>
	);
}
