import type React from 'react';
import type { DialogBoxSectionProps } from './_types';

// The parent consumes these markers and places their children into its own layout.
// Reaching a marker's render means it was placed outside a supported direct slot.
function Title(_props: DialogBoxSectionProps): React.JSX.Element {
	throw new Error('DialogBox.Title must be a direct child of DialogBox (fragments are supported).');
}
function Content(_props: DialogBoxSectionProps): React.JSX.Element {
	throw new Error('DialogBox.Content must be a direct child of DialogBox (fragments are supported).');
}
function Actions(_props: DialogBoxSectionProps): React.JSX.Element {
	throw new Error('DialogBox.Actions must be a direct child of DialogBox (fragments are supported).');
}
Title.displayName = 'DialogBox.Title';
Content.displayName = 'DialogBox.Content';
Actions.displayName = 'DialogBox.Actions';

export const sections = { Title, Content, Actions };
