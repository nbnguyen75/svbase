import { describe, expect, test } from 'vitest';
import { createId, generateId } from './id.js';

describe('generateId', () => {
	test('is unique across many calls', () => {
		const ids = new Set(Array.from({ length: 500 }, () => generateId('test')));
		expect(ids.size).toBe(500);
	});

	test('uses the given prefix', () => {
		expect(generateId('dialog').startsWith('dialog-')).toBe(true);
	});
});

describe('createId', () => {
	test('prefers an explicit override', () => {
		expect(createId('dialog', 'custom')).toBe('custom');
	});

	test('generates when no override is given', () => {
		expect(createId('dialog').startsWith('dialog-')).toBe(true);
	});
});
