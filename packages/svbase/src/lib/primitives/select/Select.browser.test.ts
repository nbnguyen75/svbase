import axe from 'axe-core';
import { tick } from 'svelte';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import SelectFixture from './select.fixture.svelte';

afterEach(() => cleanup());

function trigger() {
	const node = document.querySelector('[data-testid="fruit-trigger"]');
	if (!(node instanceof HTMLElement)) throw new Error('trigger missing');
	return node;
}

test('opens with first item highlighted and linked ids', async () => {
	const screen = await render(SelectFixture);
	trigger().click();
	const listbox = screen.getByRole('listbox');
	await expect.element(listbox).toBeInTheDocument();
	const triggerEl = trigger();
	expect(triggerEl.getAttribute('aria-expanded')).toBe('true');
	expect(triggerEl.getAttribute('aria-controls')).toBe(
		(await listbox.findElement()).getAttribute('id')
	);
	const apple = screen.getByRole('option', { name: 'Apple' });
	await expect.element(apple).toHaveAttribute('tabindex', '0');
	await expect.element(apple).toHaveAttribute('data-highlighted', '');
});

test('click selects, syncs form value, closes, and refocuses', async () => {
	const screen = await render(SelectFixture);
	trigger().click();
	await expect.element(screen.getByRole('listbox')).toBeInTheDocument();
	await screen.getByRole('option', { name: 'Banana' }).click();
	await expect.poll(() => document.querySelector('[data-state="open"]')).toBeNull();
	expect(trigger().textContent).toContain('Banana');
	expect(document.querySelector('input[name="fruit"]')?.getAttribute('value')).toBe('banana');
	await expect.element(trigger()).toHaveFocus();
});

test('arrows highlight without selecting; Enter commits', async () => {
	const screen = await render(SelectFixture);
	trigger().click();
	await expect.element(screen.getByRole('listbox')).toBeInTheDocument();
	const apple = await screen.getByRole('option', { name: 'Apple' }).findElement();
	apple.focus();
	apple.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
	const banana = screen.getByRole('option', { name: 'Banana' });
	await expect.element(banana).toHaveFocus();
	await expect.element(banana).toHaveAttribute('data-highlighted', '');
	expect(trigger().textContent).toContain('Pick a fruit');
	const bananaEl = await banana.findElement();
	bananaEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
	await expect.poll(() => document.querySelector('[data-state="open"]')).toBeNull();
	expect(trigger().textContent).toContain('Banana');
});

test('closed trigger arrows and typeahead select directly', async () => {
	const screen = await render(SelectFixture);
	await expect.element(screen.getByRole('combobox')).toBeInTheDocument();
	const triggerEl = trigger();
	triggerEl.focus();
	triggerEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
	await tick();
	expect(trigger().textContent).toContain('Apple');
	triggerEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true }));
	await tick();
	expect(trigger().textContent).toContain('Banana');
	expect(document.querySelector('input[name="fruit"]')?.getAttribute('value')).toBe('banana');
});

test('Escape closes and refocuses; outside press closes', async () => {
	const screen = await render(SelectFixture);
	const triggerEl = trigger();
	triggerEl.click();
	await expect.element(screen.getByRole('listbox')).toBeInTheDocument();
	document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	await expect.poll(() => document.querySelector('[data-state="open"]')).toBeNull();
	await expect.element(trigger()).toHaveFocus();
	trigger().click();
	await expect.element(screen.getByRole('listbox')).toBeInTheDocument();
	document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
	await expect.poll(() => document.querySelector('[data-state="open"]')).toBeNull();
});

test('group label links to its group', async () => {
	const screen = await render(SelectFixture);
	trigger().click();
	await expect.element(screen.getByRole('listbox')).toBeInTheDocument();
	const group = document.querySelector('[role="group"]');
	expect(group).not.toBeNull();
	const labelledby = group?.getAttribute('aria-labelledby');
	expect(labelledby).toBeTruthy();
	const label = labelledby ? document.getElementById(labelledby) : null;
	expect(label?.textContent).toContain('Citrus');
});

test('has no axe violations while open', async () => {
	const screen = await render(SelectFixture);
	trigger().click();
	await expect.element(screen.getByRole('listbox')).toBeInTheDocument();
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
