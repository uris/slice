/** Deterministic comparison for default field sorting; missing values stay last in either direction. */
export function compareValues(a: unknown, b: unknown, direction: 'asc' | 'desc'): number {
	if (Object.is(a, b)) return 0;
	const missingA = a == null || (typeof a === 'number' && Number.isNaN(a));
	const missingB = b == null || (typeof b === 'number' && Number.isNaN(b));
	if (missingA && missingB) return 0;
	if (missingA) return 1;
	if (missingB) return -1;
	const multiplier = direction === 'desc' ? -1 : 1;
	if (typeof a === 'number' && typeof b === 'number') return (a - b) * multiplier;
	if (a instanceof Date && b instanceof Date) return (a.getTime() - b.getTime()) * multiplier;
	return String(a).localeCompare(String(b), undefined, { numeric: true }) * multiplier;
}
