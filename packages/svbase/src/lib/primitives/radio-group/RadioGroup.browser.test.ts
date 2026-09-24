import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import RadioGroupFixture from './radio-group.fixture.svelte';

afterEach(() => cleanup());

async function tabbables(screen: Awaited<ReturnType<typeof render>>) {
	return {
		small: screen.getByRole('radio', { name: 'Small' }),
		medium: screen.getByRole('radio', { name: 'Medium' }),
		large: screen.getByRole('radio', { name: 'Large' })
	};
}

test('renders an unchecked group with a single tab stop', async () => {
	const screen = await render(RadioGroupFixture);
	const radios = await tabbables(screen);
	await expect.element(screen.getByRole('radiogroup')).toBeInTheDocument();
	for (const radio of [radios.small, radios.medium, radios.large])
		await expect.element(radio).toHaveAttribute('aria-checked', 'false');
	expect(document.querySelector('[data-testid="large-dot"]')).toBeNull();
	await expect.element(radios.small).toHaveAttribute('tabindex', '0');
	await expect.element(radios.medium).toHaveAttribute('tabindex', '-1');
	await expect.element(radios.large).toHaveAttribute('tabindex', '-1');
});

test('click selects and moves the tab stop', async () => {
	const screen = await render(RadioGroupFixture);
	const radios = await tabbables(screen);
	await radios.large.click();
	await expect.element(radios.large).toHaveAttribute('aria-checked', 'true');
	await expect.element(radios.large).toHaveAttribute('data-checked', '');
	await expect.element(radios.small).toHaveAttribute('aria-checked', 'false');
	await expect.element(radios.large).toHaveAttribute('tabindex', '0');
	await expect.element(radios.small).toHaveAttribute('tabindex', '-1');
	expect(document.querySelector('[data-testid="large-dot"]')).not.toBeNull();
});

test('arrows move focus and selection, skipping disabled, with wrap', async () => {
	const screen = await render(RadioGroupFixture);
	const radios = await tabbables(screen);
	const small = await radios.small.findElement();
	small.focus();
	small.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
	await expect.element(radios.large).toHaveFocus();
	await expect.element(radios.large).toHaveAttribute('aria-checked', 'true');
	const large = await radios.large.findElement();
	large.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
	await expect.element(radios.small).toHaveFocus();
	await expect.element(radios.small).toHaveAttribute('aria-checked', 'true');
});

test('Home and End jump to the first and last enabled items', async () => {
	const screen = await render(RadioGroupFixture);
	const radios = await tabbables(screen);
	const small = await radios.small.findElement();
	small.focus();
	small.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
	await expect.element(radios.large).toHaveFocus();
	const large = await radios.large.findElement();
	large.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
	await expect.element(radios.small).toHaveFocus();
});

test('Enter never selects', async () => {
	const screen = await render(RadioGroupFixture);
	const radios = await tabbables(screen);
	const large = await radios.large.findElement();
	large.focus();
	// Real keydowns are cancelable; without it preventDefault is a no-op and
	// the veto chain cannot engage — same as native behavior.
	large.dispatchEvent(
		new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
	);
	await expect.element(radios.large).toHaveAttribute('aria-checked', 'false');
	await expect.element(radios.small).toHaveAttribute('tabindex', '0');
});

test('hidden inputs carry the form identity', async () => {
	await render(RadioGroupFixture);
	const inputs = document.querySelectorAll('input[name="size"]');
	expect(inputs.length).toBe(3);
	for (const input of inputs) {
		expect(input.getAttribute('type')).toBe('radio');
		expect(input.getAttribute('tabindex')).toBe('-1');
	}
});

test('has no axe violations', async () => {
	await render(RadioGroupFixture);
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
