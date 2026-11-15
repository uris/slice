import type { Layers } from './types';

/**
 * Stacking order within a CSS stacking context
 */
export const layers: Layers = {
	'layer-below-surface': -100, // items hidden from view
	'layer-surface': 0, // default
	'layer-float': 100, // toolbars, fab buttons, etc.
	'layer-describe': 200, // tooltips, info, etc.
	'layer-status': 300, // status bars, toasts, etc.
	'layer-notify': 400, // alerts, and other critical status, etc.
	'layer-overlay': 500, // overlay covers, etc.
	'layer-confirm': 600, // confirmation dialogs, etc. requiring action to dismiss
};
