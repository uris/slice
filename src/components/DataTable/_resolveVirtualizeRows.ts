/*
 * Decides whether row windowing should actually be active this render.
 *
 * `explicit` (the `virtualizeRows` prop) wins whenever it's set - `true`
 * always turns windowing on and `false` always turns it off, regardless of
 * row count, When `virtualizeRows` is left unse, row count decides:
 * datasets bigger than `threshold` are windowed automatically.
 */
export function resolveVirtualizeRows(explicit: boolean | undefined, rowCount: number, threshold: number): boolean {
	return explicit ?? rowCount > threshold;
}
