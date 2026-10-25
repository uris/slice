/** Convert Slice's explicit CSS curves without importing the React Native runtime. */
export function easing(css: string): (progress: number) => number {
	if (css.startsWith('cubic-bezier(')) {
		const [x1, y1, x2, y2] = css.slice(13, -1).split(',').map(Number);
		const sample = (t: number, a: number, b: number) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
		return (progress) => {
			if (progress <= 0) return 0;
			if (progress >= 1) return 1;
			let low = 0;
			let high = 1;
			for (let i = 0; i < 30; i++) {
				const middle = (low + high) / 2;
				if (sample(middle, x1, x2) < progress) low = middle;
				else high = middle;
			}
			return sample((low + high) / 2, y1, y2);
		};
	}
	if (!css.startsWith('linear(')) throw new Error(`Unsupported Slice easing: ${css}`);
	const points = css
		.slice(7, -1)
		.split(',')
		.map((entry, index, entries) => {
			const [value, percent] = entry.trim().split(/\s+/).map(Number.parseFloat);
			return { value, position: percent === undefined ? index / (entries.length - 1) : percent / 100 };
		});
	return (progress) => {
		if (progress <= 0) return points[0].value;
		for (let i = 1; i < points.length; i++) {
			const left = points[i - 1];
			const right = points[i];
			if (progress <= right.position)
				return (
					left.value + ((right.value - left.value) * (progress - left.position)) / (right.position - left.position)
				);
		}
		return points[points.length - 1].value;
	};
}
