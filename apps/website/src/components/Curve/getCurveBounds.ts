import type { CurvePoint } from './Curve';

/** Exact extrema of a cubic Bézier coordinate, including its endpoints. */
function cubicBounds(p0: number, p1: number, p2: number, p3: number): [number, number] {
	const a = -p0 + 3 * p1 - 3 * p2 + p3;
	const b = 2 * (p0 - 2 * p1 + p2);
	const c = p1 - p0;
	const roots: number[] = [];
	if (Math.abs(a) < 1e-12) {
		if (Math.abs(b) >= 1e-12) roots.push(-c / b);
	} else {
		const discriminant = b * b - 4 * a * c;
		if (discriminant >= 0) {
			const radical = Math.sqrt(discriminant);
			roots.push((-b + radical) / (2 * a), (-b - radical) / (2 * a));
		}
	}
	let min = Math.min(p0, p3);
	let max = Math.max(p0, p3);
	for (const t of roots) {
		if (t <= 0 || t >= 1) continue;
		const inverse = 1 - t;
		const value = inverse ** 3 * p0 + 3 * inverse ** 2 * t * p1 + 3 * inverse * t ** 2 * p2 + t ** 3 * p3;
		min = Math.min(min, value);
		max = Math.max(max, value);
	}
	return [min, max];
}

export function getCurveBounds(points: readonly CurvePoint[], kind?: 'bezier' | 'linear') {
	if (points.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
	if (kind === 'bezier') {
		const [start, first, second, end] = points;
		const [minX, maxX] = cubicBounds(start.x, first.x, second.x, end.x);
		const [minY, maxY] = cubicBounds(start.y, first.y, second.y, end.y);
		return { minX, maxX, minY, maxY };
	}
	let minX = points[0].x;
	let maxX = minX;
	let minY = points[0].y;
	let maxY = minY;
	for (const point of points) {
		minX = Math.min(minX, point.x);
		maxX = Math.max(maxX, point.x);
		minY = Math.min(minY, point.y);
		maxY = Math.max(maxY, point.y);
	}
	return { minX, maxX, minY, maxY };
}
