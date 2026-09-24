import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import AccordionFixture from './accordion.fixture.svelte';

afterEach(() => cleanup());

test('single mode opens one panel at a time', async () => {
	const screen = await render(AccordionFixture);
	const first = screen.getByRole('button', { name: 'First' });
	const second = screen.getByRole('button', { name: 'Second' });
	await first.click();
	await expect.element(first).toHaveAttribute('aria-expanded', 'true');
	await expect.element(screen.getByText('First panel')).toBeInTheDocument();
	await second.click();
	await expect.element(second).toHaveAttribute('aria-expanded', 'true');
	await expect.element(first).toHaveAttribute('aria-expanded', 'false');
	expect(document.body.textContent).not.toContain('First panel');
	await expect.element(screen.getByText('Second panel')).toBeInTheDocument();
});

test('arrows move focus without opening, skipping disabled, with wrap', async () => {
	const screen = await render(AccordionFixture);
	const first = screen.getByRole('button', { name: 'First' });
	const second = screen.getByRole('button', { name: 'Second' });
	const firstEl = await first.findElement();
	firstEl.focus();
	firstEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
	await expect.element(second).toHaveFocus();
	await expect.element(second).toHaveAttribute('aria-expanded', 'false');
	await expect.element(first).toHaveAttribute('aria-expanded', 'false');
	const secondEl = await second.findElement();
	secondEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
	await expect.element(first).toHaveFocus();
});

test('Home and End jump across enabled triggers', async () => {
	const screen = await render(AccordionFixture);
	const first = screen.getByRole('button', { name: 'First' });
	const second = screen.getByRole('button', { name: 'Second' });
	const firstEl = await first.findElement();
	firstEl.focus();
	firstEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
	await expect.element(second).toHaveFocus();
	const secondEl = await second.findElement();
	secondEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
	await expect.element(first).toHaveFocus();
});

test('multiple mode keeps several panels open', async () => {
	const screen = await render(AccordionFixture);
	const one = screen.getByRole('button', { name: 'Multi one' });
	const two = screen.getByRole('button', { name: 'Multi two' });
	await one.click();
	await two.click();
	await expect.element(one).toHaveAttribute('aria-expanded', 'true');
	await expect.element(two).toHaveAttribute('aria-expanded', 'true');
	await expect.element(screen.getByText('Multi one panel')).toBeInTheDocument();
	await expect.element(screen.getByText('Multi two panel')).toBeInTheDocument();
});

test('trigger and panel link both ways', async () => {
	const screen = await render(AccordionFixture);
	const first = screen.getByRole('button', { name: 'First' });
	await first.click();
	const triggerEl = await first.findElement();
	const panelId = triggerEl.getAttribute('aria-controls');
	expect(panelId).toBeTruthy();
	const panel = panelId ? document.getElementById(panelId) : null;
	expect(panel?.getAttribute('role')).toBe('region');
	expect(panel?.getAttribute('aria-labelledby')).toBe(triggerEl.getAttribute('id'));
});

test('has no axe violations', async () => {
	await render(AccordionFixture);
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
