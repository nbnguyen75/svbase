import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import SeparatorFixture from './separator.fixture.svelte';

afterEach(() => cleanup());

test('renders accessible separators with orientation', async () => {
	await render(SeparatorFixture);
	const separators = document.querySelectorAll('[role="separator"]');
	expect(separators.length).toBe(2);
	expect(separators[0]?.getAttribute('aria-orientation')).toBe('horizontal');
	expect(separators[1]?.getAttribute('aria-orientation')).toBe('vertical');
	expect(separators[0]?.getAttribute('data-orientation')).toBe('horizontal');
	expect(separators[1]?.getAttribute('data-orientation')).toBe('vertical');
});

test('has no axe violations', async () => {
	await render(SeparatorFixture);
	const results = await axe.run(document, {
		// Document-shell rules owned by the test harness page, not the component.
		rules: {
			'landmark-one-main': { enabled: false },
			'page-has-heading-one': { enabled: false },
			region: { enabled: false }
		}
	});
	expect(results.violations).toEqual([]);
});
