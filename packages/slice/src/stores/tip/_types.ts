import type { ToolTip } from '../../components/sharedTypes';

export interface TipStore {
	tip: ToolTip | null;
	actions: {
		push: (tip: ToolTip | null) => void;
		clear: () => void;
	};
}
