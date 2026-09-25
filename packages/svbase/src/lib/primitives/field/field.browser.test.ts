import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import FieldFixture from './field.fixture.svelte';

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

test('label is associated and focuses the control', async () => {
	const screen = await render(FieldFixture);
	const input = screen.getByRole('textbox', { name: 'Username' });
	await expect.element(input).toBeInTheDocument();
	const label = screen.getByText('Username');
	await label.click();
	await expect.element(input).toHaveFocus();
});

test('required empty field stays valid until changed', async () => {
	const screen = await render(FieldFixture);
	const input = screen.getByRole('textbox', { name: 'Username' });
	const element = (await input.findElement()) as HTMLInputElement;
	element.focus();
	blurActive();
	await expect.element(input).not.toHaveAttribute('data-invalid');
	await expect.element(input).not.toHaveAttribute('aria-invalid');
});

test('required field cleared after typing is invalid on blur', async () => {
	const screen = await render(FieldFixture);
	const input = screen.getByRole('textbox', { name: 'Username' });
	await typeInto(input, 'abc');
	await typeInto(input, '');
	blurActive();
	await expect.element(input).toHaveAttribute('data-invalid', '');
	await expect.element(input).toHaveAttribute('aria-invalid', 'true');
	const describedBy = (await input.findElement()).getAttribute('aria-describedby') ?? '';
	expect(describedBy).toContain('description');
	expect(describedBy).toContain('error');
});

test('custom validator message shows in the error part', async () => {
	const screen = await render(FieldFixture);
	const input = screen.getByRole('textbox', { name: 'Bio' });
	await typeInto(input, 'short');
	blurActive();
	await expect.element(screen.getByText('Bio must be at least 10 characters.')).toBeInTheDocument();
});

test('onChange mode validates without blur', async () => {
	const screen = await render(FieldFixture);
	const input = screen.getByRole('textbox', { name: 'Nickname' });
	await typeInto(input, 'taken');
	await expect.element(screen.getByText('Name is taken.')).toBeInTheDocument();
	await typeInto(input, 'free');
	expect(document.body.textContent).not.toContain('Name is taken.');
});

test('disabled field skips validation', async () => {
	const screen = await render(FieldFixture);
	const input = screen.getByRole('textbox', { name: 'Disabled name' });
	const element = (await input.findElement()) as HTMLInputElement;
	element.focus();
	blurActive();
	await expect.element(input).not.toHaveAttribute('data-invalid');
});

test('standalone input works without a field', async () => {
	const screen = await render(FieldFixture);
	const input = screen.getByRole('textbox', { name: 'Standalone' });
	const element = await typeInto(input, 'hello');
	expect(element.value).toBe('hello');
	await expect.element(input).not.toHaveAttribute('aria-invalid');
});

test('has no axe violations', async () => {
	await render(FieldFixture);
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
