import type { Elevations } from './_types';

/**
 * Elevation levels for UI component types
 */
export const elevations: Elevations = {
	'elevation-below-surface': -100, // items hidden from view
	'elevation-surface': 0, // default
	'elevation-float': 100, // toolbars, fab buttons, etc.
	'elevation-describe': 200, // tooltips, info, etc.
	'elevation-status': 300, // status bars, toasts, etc.
	'elevation-notify': 400, // alerts, and other critical status, etc.
	'elevation-overlay': 500, // overlay covers, etc.
	'elevation-confirm': 600, // conformation dialogs, etc. requiring action to dismiss
};
