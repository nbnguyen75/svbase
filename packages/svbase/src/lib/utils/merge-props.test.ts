import { describe, expect, test } from 'vitest';
import { mergeProps } from './merge-props.js';

describe('mergeProps', () => {
	test('later plain values win', () => {
		expect(mergeProps({ a: 1, b: 1 }, { a: 2 })).toEqual({ a: 2, b: 1 });
	});

	test('class strings concatenate with the later source first', () => {
		expect(mergeProps({ class: 'a' }, { class: 'b' })).toEqual({ class: 'b a' });
		expect(mergeProps({ class: 'a' }, {})).toEqual({ class: 'a' });
	});

	test('style objects shallow-merge and strings join', () => {
		expect(
			mergeProps({ style: { color: 'red', margin: 0 } }, { style: { color: 'blue' } })
		).toEqual({ style: { color: 'blue', margin: 0 } });
		expect(mergeProps({ style: 'color: red' }, { style: 'margin: 0' })).toEqual({
			style: 'color: red; margin: 0'
		});
	});

	test('handlers chain newest-first and veto on preventDefault', () => {
		const calls: Array<string> = [];
		const merged = mergeProps<{ onclick?: (event: Event) => void }>(
			{
				onclick: () => {
					calls.push('old');
				}
			},
			{
				onclick: (event) => {
					calls.push('new');
					event.preventDefault();
				}
			}
		);
		merged.onclick?.(new Event('click', { cancelable: true }));
		expect(calls).toEqual(['new']);
	});

	test('undefined never overwrites and falsy sources are skipped', () => {
		expect(mergeProps({ a: 1 }, { a: undefined })).toEqual({ a: 1 });
		expect(mergeProps(undefined, { a: 1 }, false)).toEqual({ a: 1 });
	});

	test('non-on* functions overwrite', () => {
		expect(mergeProps({ render: () => 'a' }, { render: () => 'b' }).render()).toBe('b');
	});
});
