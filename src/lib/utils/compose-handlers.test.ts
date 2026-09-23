import { describe, expect, test } from 'vitest';
import { composeHandlers } from './compose-handlers.js';

describe('composeHandlers', () => {
	test('calls handlers in order and skips nullish entries', () => {
		const order: Array<string> = [];
		const handler = composeHandlers<Event>(
			() => {
				order.push('first');
			},
			undefined,
			null,
			false,
			() => {
				order.push('second');
			}
		);
		handler(new Event('click'));
		expect(order).toEqual(['first', 'second']);
	});

	test('stops the chain once the default is prevented', () => {
		const order: Array<string> = [];
		const handler = composeHandlers<Event>(
			(event) => {
				order.push('first');
				event.preventDefault();
			},
			() => {
				order.push('second');
			}
		);
		handler(new Event('click', { cancelable: true }));
		expect(order).toEqual(['first']);
	});

	test('an empty composition never throws', () => {
		const handler = composeHandlers<Event>();
		expect(() => handler(new Event('click'))).not.toThrow();
	});
});
