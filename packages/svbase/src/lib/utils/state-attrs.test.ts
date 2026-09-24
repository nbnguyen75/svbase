import { describe, expect, test } from 'vitest';
import { getCheckableDataAttributes } from './state-attrs.js';

const base = { checked: false, disabled: false, readOnly: false, required: false };

describe('getCheckableDataAttributes', () => {
	test('unchecked by default', () => {
		expect(getCheckableDataAttributes(base)).toEqual({ 'data-unchecked': '' });
	});

	test('checked', () => {
		expect(getCheckableDataAttributes({ ...base, checked: true })).toEqual({
			'data-checked': ''
		});
	});

	test('indeterminate wins over checked', () => {
		expect(getCheckableDataAttributes({ ...base, checked: true, indeterminate: true })).toEqual({
			'data-indeterminate': ''
		});
	});

	test('state flags', () => {
		expect(
			getCheckableDataAttributes({ ...base, disabled: true, readOnly: true, required: true })
		).toEqual({
			'data-unchecked': '',
			'data-disabled': '',
			'data-readonly': '',
			'data-required': ''
		});
	});
});
