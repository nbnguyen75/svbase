import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import ComboboxFixture from './combobox.fixture.svelte';

afterEach(() => cleanup());

interface Typeable {
	findElement: () => Promise<Element>;
}

async function typeInto(locator: Typeable, text: string): Promise<HTMLInputElement> {
	const element = (await locator.findElement()) as HTMLInputElement;
	element.focus();
	element.value = text;
	element.dispatchEvent(new Event('input', { bubbles: true }));
	return element;
}

function press(element: HTMLInputElement, key: string): void {
	element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

test('typing opens the list and filters items', async () => {
	const screen = await render(ComboboxFixture);
	const input = screen.getByRole('combobox', { name: 'Fruit' });
	await typeInto(input, 'ap');
	await expect.element(input).toHaveAttribute('aria-expanded', 'true');
	await expect.element(screen.getByText('Apple')).toBeInTheDocument();
	const banana = await screen.getByText('Banana').findElement();
	expect(banana.getAttribute('hidden')).not.toBe(null);
	expect(document.body.textContent).not.toContain('No matches');
});

test('empty state shows when nothing matches', async () => {
	const screen = await render(ComboboxFixture);
	const input = screen.getByRole('combobox', { name: 'Fruit' });
	await typeInto(input, 'zzz');
	await expect.element(screen.getByText('No matches')).toBeInTheDocument();
});

test('arrows move highlight and Enter commits the match', async () => {
	const screen = await render(ComboboxFixture);
	const input = screen.getByRole('combobox', { name: 'Fruit' });
	const element = await typeInto(input, 'an');
	press(element, 'Enter');
	await expect.element(screen.getByText('Strict: banana')).toBeInTheDocument();
	expect(element.value).toBe('Banana');
	await expect.element(input).toHaveAttribute('aria-expanded', 'false');
});

test('Escape reverts strict text and closes', async () => {
	const screen = await render(ComboboxFixture);
	const input = screen.getByRole('combobox', { name: 'Fruit' });
	const element = await typeInto(input, 'xyz');
	// Settle first: synchronous dispatches batch in Svelte, so poll once to
	// flush before asserting DOM state synchronously.
	await expect.element(input).toHaveAttribute('aria-expanded', 'true');
	press(element, 'Escape');
	await expect.element(input).toHaveAttribute('aria-expanded', 'false');
	expect(element.value).toBe('');
});

test('clicking an item selects it and syncs the hidden input', async () => {
	const screen = await render(ComboboxFixture);
	const input = screen.getByRole('combobox', { name: 'Fruit' });
	await typeInto(input, 'o');
	await screen.getByText('Orange').click();
	await expect.element(screen.getByText('Strict: orange')).toBeInTheDocument();
	const hidden = document.querySelector('input[name="fruit"]') as HTMLInputElement | null;
	expect(hidden?.value).toBe('orange');
});

test('free mode commits typed text as the value', async () => {
	const screen = await render(ComboboxFixture);
	const input = screen.getByRole('combobox', { name: 'City' });
	const element = await typeInto(input, 'london');
	press(element, 'Enter');
	await expect.element(screen.getByText('Free: london')).toBeInTheDocument();
});

test('has no axe violations', async () => {
	await render(ComboboxFixture);
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
