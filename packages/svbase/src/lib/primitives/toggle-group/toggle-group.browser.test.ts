import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import ToggleGroupFixture from './toggle-group.fixture.svelte';

afterEach(() => cleanup());

test('single mode selects and toggles off', async () => {
	const screen = await render(ToggleGroupFixture);
	await screen.getByRole('button', { name: 'Left' }).click();
	await expect.element(screen.getByText('Single: left')).toBeInTheDocument();
	await screen.getByRole('button', { name: 'Left' }).click();
	await expect.element(screen.getByText('Single: —')).toBeInTheDocument();
});

test('multiple mode accumulates values', async () => {
	const screen = await render(ToggleGroupFixture);
	await screen.getByRole('button', { name: 'Bold' }).click();
	await screen.getByRole('button', { name: 'Italic' }).click();
	await expect.element(screen.getByText('Multiple: bold,italic')).toBeInTheDocument();
	await screen.getByRole('button', { name: 'Bold' }).click();
	await expect.element(screen.getByText('Multiple: italic')).toBeInTheDocument();
});

test('arrows move focus with a single tab stop', async () => {
	const screen = await render(ToggleGroupFixture);
	const left = (await screen.getByRole('button', { name: 'Left' }).findElement()) as HTMLElement;
	left.focus();
	const center = screen.getByRole('button', { name: 'Center' });
	await expect.element(center).toHaveAttribute('tabindex', '-1');
	left.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
	await expect.element(center).toHaveFocus();
});

test('hidden input syncs single value for forms', async () => {
	const screen = await render(ToggleGroupFixture);
	await screen.getByRole('button', { name: 'Center' }).click();
	await expect.element(screen.getByText('Single: center')).toBeInTheDocument();
	const hidden = document.querySelector('input[name="align"]') as HTMLInputElement | null;
	expect(hidden?.value).toBe('center');
});

test('has no axe violations', async () => {
	await render(ToggleGroupFixture);
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
