/** Form factor names used by Slice's viewport breakpoints. */
export enum FormFactor {
	Mobile = 'mobile',
	Tablet = 'tablet',
	Desktop = 'desktop',
	DesktopL = 'desktopL',
	DesktopXL = 'desktopXL',
}

export type BreakPoints = Record<FormFactor, number>;

/** Default minimum viewport widths in pixels. Shared defaults cannot be mutated. */
export const breakpoints: Readonly<BreakPoints> = Object.freeze({
	[FormFactor.Mobile]: 576,
	[FormFactor.Tablet]: 768,
	[FormFactor.Desktop]: 992,
	[FormFactor.DesktopL]: 1200,
	[FormFactor.DesktopXL]: 1400,
});
