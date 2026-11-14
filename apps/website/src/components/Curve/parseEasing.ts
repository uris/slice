import type { CurvePoint } from './Curve';

const numberPattern = /^[+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?$/i;

function readNumber(value: string): number {
	if (!numberPattern.test(value) || !Number.isFinite(Number(value))) {
		throw new Error(`Invalid curve easing number: ${value}`);
	}
	return Number(value);
}

/** Parse literal CSS easing values; variables and calculated expressions are not supported. */
export function parseEasing(value: string): { kind: 'bezier' | 'linear'; points: CurvePoint[] } {
	const match = /^(cubic-bezier|linear)\(([\s\S]*)\)$/i.exec(value.trim());
	if (!match) throw new Error('Curve expects a cubic-bezier(...) or linear(...) easing string.');
	const entries = match[2].split(',').map((entry) => entry.trim());
	if (match[1].toLowerCase() === 'cubic-bezier') {
		if (entries.length !== 4) throw new Error('cubic-bezier() requires four numbers.');
		const [x1, y1, x2, y2] = entries.map(readNumber);
		if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) {
			throw new Error('cubic-bezier() X control values must be between 0 and 1.');
		}
		return {
			kind: 'bezier',
			points: [
				{ x: 0, y: 0 },
				{ x: x1, y: y1 },
				{ x: x2, y: y2 },
				{ x: 1, y: 1 },
			],
		};
	}
	if (entries.length < 2) throw new Error('linear() requires at least two stops.');
	const stops: { x: number | undefined; y: number }[] = [];
	for (const entry of entries) {
		const tokens = entry.split(/\s+/);
		const outputs = tokens.filter((token) => !token.endsWith('%'));
		const positions = tokens.filter((token) => token.endsWith('%'));
		if (outputs.length !== 1 || positions.length > 2) throw new Error(`Invalid linear() stop: ${entry}`);
		const y = readNumber(outputs[0]);
		if (!positions.length) stops.push({ x: undefined, y });
		for (const position of positions) stops.push({ x: readNumber(position.slice(0, -1)) / 100, y });
	}
	stops[0].x ??= 0;
	stops[stops.length - 1].x ??= 1;
	let previous = Number.NEGATIVE_INFINITY;
	for (const stop of stops) {
		if (stop.x !== undefined) {
			stop.x = Math.max(previous, stop.x);
			previous = stop.x;
		}
	}
	let start = 0;
	while (start < stops.length - 1) {
		let end = start + 1;
		while (stops[end].x === undefined) end++;
		const from = stops[start].x ?? 0;
		const to = stops[end].x ?? 1;
		for (let index = start + 1; index < end; index++) {
			stops[index].x = from + ((to - from) * (index - start)) / (end - start);
		}
		start = end;
	}
	return { kind: 'linear', points: stops.map(({ x, y }) => ({ x: x ?? 0, y })) };
}
