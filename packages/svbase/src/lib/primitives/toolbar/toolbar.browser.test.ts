import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import ToolbarFixture from './toolbar.fixture.svelte';

afterEach(() => cleanup());

test('buttons activate and disabled skips roving', async () => {
	const screen = await render(ToolbarFixture);
	await screen.getByRole('button', { name: 'Save' }).click();
	await expect.element(screen.getByText('Saved: 1')).toBeInTheDocument();
	const save = (await screen.getByRole('button', { name: 'Save' }).findElement()) as HTMLElement;
	save.focus();
	save.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
	// Cut is disabled: focus skips to the Help link.
	await expect.element(screen.getByRole('link', { name: 'Help' })).toHaveFocus();
});

test('single tab stop across buttons', async () => {
	const screen = await render(ToolbarFixture);
	const save = screen.getByRole('button', { name: 'Save' });
	await expect.element(save).toHaveAttribute('tabindex', '0');
});

test('search input keeps caret keys', async () => {
	const screen = await render(ToolbarFixture);
	const search = (await screen
		.getByRole('textbox', { name: 'Search' })
		.findElement()) as HTMLInputElement;
	search.focus();
	search.value = 'ab';
	search.dispatchEvent(new Event('input', { bubbles: true }));
	search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
	expect(search.value).toBe('ab');
	await expect.element(search).toHaveFocus();
});

test('has no axe violations', async () => {
	await render(ToolbarFixture);
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
