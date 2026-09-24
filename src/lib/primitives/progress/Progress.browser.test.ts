import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import ProgressFixture from './progress.fixture.svelte';

afterEach(() => cleanup());

function bars() {
	return [...document.querySelectorAll('[role="progressbar"]')];
}

test('determinate exposes values and fill width', async () => {
	await render(ProgressFixture);
	const [determinate] = bars();
	expect(determinate?.getAttribute('aria-valuenow')).toBe('30');
	expect(determinate?.getAttribute('aria-valuemin')).toBe('0');
	expect(determinate?.getAttribute('aria-valuemax')).toBe('100');
	expect(determinate?.getAttribute('data-state')).toBe('progressing');
});

test('indeterminate omits valuenow', async () => {
	await render(ProgressFixture);
	const [, indeterminate] = bars();
	expect(indeterminate?.hasAttribute('aria-valuenow')).toBe(false);
	expect(indeterminate?.getAttribute('data-state')).toBe('indeterminate');
});

test('complete at max', async () => {
	await render(ProgressFixture);
	const [, , complete] = bars();
	expect(complete?.getAttribute('aria-valuenow')).toBe('100');
	expect(complete?.getAttribute('data-state')).toBe('complete');
});

test('has no axe violations', async () => {
	await render(ProgressFixture);
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
