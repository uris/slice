export const usageCode = `
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
`;
export const activationCode = `
<>
    <ContentEditable
      name="Project title"
      value={title}
      isEditable={editing}
      onCommit={setTitle}
      onEditEnd={() => setEditing(false)}
    />
    <Button onClick={() => setEditing(true)}>Edit</Button>
</>
`;
export const persistenceCode = `
async function saveTitle(next: string, previous: string) {
    setTitle(next);
    try {
        await updateProject({ title: next });
    } catch {
        setTitle(previous);
        setError('Could not save the title. Try again.');
    }
}

<ContentEditable
    name="Project title"
    value={title}
    isEditable={editing}
    onCommit={saveTitle}
    onEditEnd={() => setEditing(false)}
/>
`;

export const clampCode = `
import { ContentEditable } from '@apple-pie/slice';
import { useState } from 'react';

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
`;
