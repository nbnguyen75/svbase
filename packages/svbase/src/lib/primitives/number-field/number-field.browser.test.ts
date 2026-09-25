import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import NumberFieldFixture from './number-field.fixture.svelte';

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

function blurActive(): void {
	(document.activeElement as HTMLElement | null)?.blur();
}

function press(element: HTMLInputElement, key: string): void {
	element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

test('typing and blurring commits clamped values', async () => {
	const screen = await render(NumberFieldFixture);
	const input = screen.getByRole('spinbutton', { name: 'Clamped' });
	await typeInto(input, '150');
	blurActive();
	await expect.element(screen.getByText('Clamped: 100')).toBeInTheDocument();
});

test('invalid text reverts to the last value', async () => {
	const screen = await render(NumberFieldFixture);
	const input = screen.getByRole('spinbutton', { name: 'Age' });
	const element = await typeInto(input, 'abc');
	blurActive();
	await expect.element(screen.getByText('Age: —')).toBeInTheDocument();
	expect(element.value).toBe('');
});

test('arrows step and page keys jump', async () => {
	const screen = await render(NumberFieldFixture);
	const input = screen.getByRole('spinbutton', { name: 'Age' });
	const element = await typeInto(input, '30');
	blurActive();
	press(element, 'ArrowUp');
	await expect.element(screen.getByText('Age: 31')).toBeInTheDocument();
	press(element, 'PageDown');
	await expect.element(screen.getByText('Age: 21')).toBeInTheDocument();
	press(element, 'Home');
	await expect.element(screen.getByText('Age: 0')).toBeInTheDocument();
});

test('stepper buttons increment within bounds', async () => {
	const screen = await render(NumberFieldFixture);
	await screen.getByRole('button', { name: 'Increment' }).click();
	await expect.element(screen.getByText('Age: 1')).toBeInTheDocument();
	await screen.getByRole('button', { name: 'Decrement' }).click();
	await expect.element(screen.getByText('Age: 0')).toBeInTheDocument();
});

test('has no axe violations', async () => {
	await render(NumberFieldFixture);
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
