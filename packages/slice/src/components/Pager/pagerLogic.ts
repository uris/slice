/** Invalid counts produce an empty pager; fractional counts use whole pages. */
export function normalizePageCount(pages: number): number {
	return Number.isFinite(pages) ? Math.max(0, Math.floor(pages)) : 0;
}

export function clampPageIndex(index: number, pages: number): number {
	return pages > 0 && Number.isFinite(index) ? Math.min(pages - 1, Math.max(0, Math.floor(index))) : 0;
}

export function getDotScale(
	index: number,
	selectedIndex: number,
	scale: number,
	factor: number,
	minimum: number,
): number {
	return Math.max(minimum, scale * factor ** Math.abs(index - selectedIndex));
}

export function getVisiblePageCount(pages: number, maximum?: number): number {
	return maximum !== undefined && Number.isFinite(maximum) && maximum > 0
		? Math.min(pages, Math.max(1, Math.floor(maximum)))
		: pages;
}

/** Center selection after a trigger; endpoints limit how many pages can be revealed. */
export function getPageWindowStart(
	previousStart: number,
	previousIndex: number,
	index: number,
	pages: number,
	visible: number,
	showMoreOn?: number,
): number {
	const lastStart = Math.max(0, pages - visible);
	let start = Math.min(lastStart, Math.max(0, previousStart));
	if (visible === 0 || visible >= pages || pages < 5) return 0;
	const defaultTrigger = Math.max(1, visible - 1);
	const trigger =
		showMoreOn !== undefined && Number.isInteger(showMoreOn) && showMoreOn >= 1 && showMoreOn < visible
			? showMoreOn
			: defaultTrigger;
	const reachedTrigger =
		(index > previousIndex && index >= start + trigger - 1) ||
		(index < previousIndex && index <= start + visible - trigger);
	if (reachedTrigger || index < start || index >= start + visible) {
		start = index - Math.floor(visible / 2);
	}
	return Math.min(lastStart, Math.max(0, start));
}

/** Opacity keeps fading independently of the minimum visual dot size. */
export function getDotOpacity(index: number, selectedIndex: number, factor: number): number {
	return factor ** Math.abs(index - selectedIndex);
}
