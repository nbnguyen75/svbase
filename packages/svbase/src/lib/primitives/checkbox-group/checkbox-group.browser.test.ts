import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import CheckboxGroupFixture from './checkbox-group.fixture.svelte';

afterEach(() => cleanup());

test('items toggle into the group value', async () => {
	const screen = await render(CheckboxGroupFixture);
	await screen.getByRole('checkbox', { name: /Cheese/ }).click();
	await expect.element(screen.getByText('Toppings: cheese')).toBeInTheDocument();
	await screen.getByRole('checkbox', { name: /Pepperoni/ }).click();
	await expect.element(screen.getByText('Toppings: cheese,pepperoni')).toBeInTheDocument();
});

test('parent checks and unchecks all with mixed state', async () => {
	const screen = await render(CheckboxGroupFixture);
	await screen.getByRole('checkbox', { name: /Cheese/ }).click();
	const parent = screen.getByRole('checkbox', { name: /All toppings/ });
	const parentEl = (await parent.findElement()) as HTMLElement;
	expect(parentEl.getAttribute('aria-checked')).toBe('mixed');
	await parent.click();
	await expect.element(screen.getByText('Toppings: cheese,pepperoni')).toBeInTheDocument();
	await parent.click();
	await expect.element(screen.getByText('Toppings: —')).toBeInTheDocument();
});

test('hidden inputs sync each value for forms', async () => {
	const screen = await render(CheckboxGroupFixture);
	await screen.getByRole('checkbox', { name: /All toppings/ }).click();
	await expect.element(screen.getByText('Toppings: cheese,pepperoni')).toBeInTheDocument();
	const hidden = Array.from(document.querySelectorAll('input[name="topping"]')).map(
		(input) => (input as HTMLInputElement).value
	);
	expect(hidden.sort()).toEqual(['cheese', 'pepperoni']);
});

test('has no axe violations', async () => {
	await render(CheckboxGroupFixture);
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
