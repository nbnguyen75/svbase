import { describe, expect, test } from 'vitest';
import {
	clamp,
	pushThumbValues,
	ratioToValue,
	roundValueToStep,
	valuesEqual,
	valueToPercent
} from './slider-math.js';

describe('clamp', () => {
	test('bounds values', () => {
		expect(clamp(-5, 0, 100)).toBe(0);
		expect(clamp(150, 0, 100)).toBe(100);
		expect(clamp(50, 0, 100)).toBe(50);
	});
});

describe('roundValueToStep', () => {
	test('rounds to the step grid without float dust', () => {
		expect(roundValueToStep(4.6, 0, 1)).toBe(5);
		expect(roundValueToStep(0.30000000000000004, 0, 0.1)).toBe(0.3);
		expect(roundValueToStep(7, 5, 5)).toBe(5);
	});

	test('ignores non-positive steps', () => {
		expect(roundValueToStep(4.6, 0, 0)).toBe(4.6);
	});
});

describe('valueToPercent', () => {
	test('maps the range to 0–100', () => {
		expect(valueToPercent(25, 0, 100)).toBe(25);
		expect(valueToPercent(0, -50, 50)).toBe(50);
		expect(valueToPercent(5, 5, 5)).toBe(0);
	});
});

describe('ratioToValue', () => {
	test('converts, steps, and clamps', () => {
		expect(ratioToValue(0.5, 0, 100, 1)).toBe(50);
		expect(ratioToValue(0.456, 0, 100, 5)).toBe(45);
		expect(ratioToValue(2, 0, 100, 1)).toBe(100);
		expect(ratioToValue(Number.NaN, 0, 100, 1)).toBe(0);
	});
});

describe('valuesEqual', () => {
	test('compares element-wise', () => {
		expect(valuesEqual([1, 2], [1, 2])).toBe(true);
		expect(valuesEqual([1, 2], [1, 3])).toBe(false);
		expect(valuesEqual([1], [1, 2])).toBe(false);
	});
});

describe('pushThumbValues', () => {
	test('sets a single value with step and clamp', () => {
		expect(pushThumbValues([50], 0, 53, 0, 100, 5, 0)).toEqual([55]);
		expect(pushThumbValues([50], 0, 200, 0, 100, 1, 0)).toEqual([100]);
	});

	test('pushes neighbors apart to honor minSteps', () => {
		expect(pushThumbValues([20, 30, 80], 0, 28, 0, 100, 1, 10)).toEqual([28, 38, 80]);
		expect(pushThumbValues([20, 30, 80], 2, 25, 0, 100, 1, 10)).toEqual([5, 15, 25]);
	});

	test('leaves roomy neighbors alone', () => {
		expect(pushThumbValues([20, 50, 80], 1, 55, 0, 100, 1, 10)).toEqual([20, 55, 80]);
	});
});
