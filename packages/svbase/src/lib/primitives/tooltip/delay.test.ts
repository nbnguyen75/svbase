import { describe, expect, test, vi } from 'vitest';
import { markTooltipClosed, shouldSkipDelay } from './delay.js';

describe('tooltip skip delay', () => {
	test('opens instantly right after another tooltip closed', () => {
		markTooltipClosed(1000);
		expect(shouldSkipDelay(1200, 400)).toBe(true);
	});

	test('requires the full delay once the window lapses', () => {
		markTooltipClosed(1000);
		expect(shouldSkipDelay(2000, 400)).toBe(false);
	});

	test('a non-positive skip duration never skips', () => {
		markTooltipClosed(1000);
		expect(shouldSkipDelay(1001, 0)).toBe(false);
	});

	test('defaults to the current time', () => {
		vi.useFakeTimers();
		vi.setSystemTime(5000);
		markTooltipClosed();
		expect(shouldSkipDelay(5100, 400)).toBe(true);
		vi.useRealTimers();
	});
});
