export function clamp(value: number, min: number, max: number): number {
	if (value < min) return min;
	if (value > max) return max;
	return value;
}

export function roundValueToStep(value: number, min: number, step: number): number {
	if (step <= 0) return value;
	const rounded = Math.round((value - min) / step) * step + min;
	// Avoid float dust (e.g. 0.1 + 0.2).
	const precision = step.toString().split('.')[1]?.length ?? 0;
	return Number(rounded.toFixed(precision));
}

/** 0–100 percent of `value` within `[min, max]`. */
export function valueToPercent(value: number, min: number, max: number): number {
	if (max <= min) return 0;
	return ((value - min) / (max - min)) * 100;
}

/** Value for a 0–1 track ratio, stepped and clamped. */
export function ratioToValue(ratio: number, min: number, max: number, step: number): number {
	if (!Number.isFinite(ratio)) return min;
	return clamp(roundValueToStep(min + ratio * (max - min), min, step), min, max);
}

export function valuesEqual(a: Array<number>, b: Array<number>): boolean {
	return a.length === b.length && a.every((item, index) => item === b[index]);
}

/**
 * Sets one thumb and pushes neighbors apart to honor `minSteps`, cascading
 * in the drag direction (Base UI `push` behavior). Pure and unit-tested.
 */
export function pushThumbValues(
	values: Array<number>,
	index: number,
	next: number,
	min: number,
	max: number,
	step: number,
	minSteps: number
): Array<number> {
	const result = [...values];
	result[index] = clamp(roundValueToStep(next, min, step), min, max);
	for (let i = index; i < result.length - 1; i += 1) {
		// Loop bounds guarantee these exist; fallbacks satisfy the checker.
		const current = result[i] ?? min;
		const following = result[i + 1] ?? max;
		if (following - current < minSteps) result[i + 1] = Math.min(current + minSteps, max);
	}
	for (let i = index; i > 0; i -= 1) {
		const current = result[i] ?? min;
		const previous = result[i - 1] ?? min;
		if (current - previous < minSteps) result[i - 1] = Math.max(current - minSteps, min);
	}
	return result;
}
