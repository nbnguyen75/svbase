import { describe, expect, test } from 'vitest';
import { FloatingPosition } from './position.svelte.js';

describe('FloatingPosition', () => {
	test('starts unpositioned with defaults', () => {
		const position = new FloatingPosition();
		expect(position.positioned).toBe(false);
		expect(position.placement).toBe('bottom');
		expect(position.x).toBe(0);
		expect(position.y).toBe(0);
	});

	test('update applies options without nodes and stays unpositioned', () => {
		const position = new FloatingPosition({ placement: 'top', offset: 8 });
		position.update({ placement: 'left' });
		expect(position.positioned).toBe(false);
	});

	test('constructing and updating never touches the DOM', () => {
		expect(() => {
			const position = new FloatingPosition({ placement: 'top', flip: false });
			position.update({ offset: 4, shiftPadding: 2 });
		}).not.toThrow();
	});

	test('virtual anchor without floating stays unpositioned', () => {
		const position = new FloatingPosition();
		expect(() => {
			position.setVirtualAnchor(100, 200);
		}).not.toThrow();
		expect(position.positioned).toBe(false);
		position.clearVirtualAnchor();
		expect(position.positioned).toBe(false);
	});
});
