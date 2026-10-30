export type ActiveTabStore = {
	isActiveTab: boolean;
	isTabFocused: boolean;
	visibilityState: DocumentVisibilityState;
	actions: {
		initialize: () => () => void;
	};
};
