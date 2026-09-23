import { describe, expect, test } from 'vitest';
import { nextRovingTarget, type RovingEntry } from './roving.js';

function entries(): Array<RovingEntry> {
	return [
		{ value: 'a', disabled: false, element: undefined },
		{ value: 'b', disabled: true, element: undefined },
		{ value: 'c', disabled: false, element: undefined }
	];
}

describe('nextRovingTarget', () => {
	test('moves forward and backward', () => {
		expect(nextRovingTarget(entries(), 'a', 'ArrowDown', false)?.value).toBe('c');
		expect(nextRovingTarget(entries(), 'c', 'ArrowUp', false)?.value).toBe('a');
	});

	test('skips disabled entries and wraps around', () => {
		expect(nextRovingTarget(entries(), 'c', 'ArrowDown', false)?.value).toBe('a');
		expect(nextRovingTarget(entries(), 'a', 'ArrowUp', false)?.value).toBe('c');
	});

	test('swaps Left and Right in RTL', () => {
		expect(nextRovingTarget(entries(), 'a', 'ArrowRight', false)?.value).toBe('c');
		expect(nextRovingTarget(entries(), 'a', 'ArrowRight', true)?.value).toBe('c');
		expect(nextRovingTarget(entries(), 'c', 'ArrowLeft', false)?.value).toBe('a');
		expect(nextRovingTarget(entries(), 'c', 'ArrowLeft', true)?.value).toBe('a');
	});

	test('Home and End jump to the ends', () => {
		expect(nextRovingTarget(entries(), 'c', 'Home', false)?.value).toBe('a');
		expect(nextRovingTarget(entries(), 'a', 'End', false)?.value).toBe('c');
	});

	test('unknown keys, empty lists, and single entries yield nothing', () => {
		expect(nextRovingTarget(entries(), 'a', 'Enter', false)).toBeUndefined();
		expect(nextRovingTarget([], 'a', 'ArrowDown', false)).toBeUndefined();
		expect(
			nextRovingTarget(
				[{ value: 'a', disabled: false, element: undefined }],
				'a',
				'ArrowDown',
				false
			)
		).toBeUndefined();
	});

	test('unknown start value begins before the first entry', () => {
		expect(nextRovingTarget(entries(), 'zzz', 'ArrowDown', false)?.value).toBe('a');
		expect(nextRovingTarget(entries(), 'zzz', 'ArrowUp', false)?.value).toBe('c');
	});
});
