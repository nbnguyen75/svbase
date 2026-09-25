import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import FormFixture from './form.fixture.svelte';

afterEach(() => cleanup());

interface Typeable {
	findElement: () => Promise<Element>;
}

async function typeInto(locator: Typeable, text: string): Promise<void> {
	const element = (await locator.findElement()) as HTMLInputElement;
	element.focus();
	element.value = text;
	element.dispatchEvent(new Event('input', { bubbles: true }));
}

function blurActive(): void {
	(document.activeElement as HTMLElement | null)?.blur();
}

test('submit collects values and reports no errors when valid', async () => {
	const screen = await render(FormFixture);
	await typeInto(screen.getByRole('textbox', { name: 'Email' }), 'a@b.co');
	await typeInto(screen.getByRole('textbox', { name: 'Nick' }), 'ab');
	await screen.getByRole('button', { name: 'Save' }).click();
	await expect
		.element(screen.getByText('Result: {"email":"a@b.co","nick":"ab"}'))
		.toBeInTheDocument();
	await expect.element(screen.getByText('Errors: {}')).toBeInTheDocument();
});

test('invalid submit focuses the first invalid control and reports errors', async () => {
	const screen = await render(FormFixture);
	await typeInto(screen.getByRole('textbox', { name: 'Email' }), 'a@b.co');
	await screen.getByRole('button', { name: 'Save' }).click();
	const nick = screen.getByRole('textbox', { name: 'Nick' });
	await expect.element(nick).toHaveFocus();
	await expect.element(nick).toHaveAttribute('data-invalid', '');
	expect(document.body.textContent).toContain('"nick"');
	expect(document.activeElement).toBe(await nick.findElement());
});

test('reset clears field state', async () => {
	const screen = await render(FormFixture);
	// Type an invalid value into email only, so it is dirty: blurring it later
	// revalidates to the same verdict (no error unmount, no layout shift
	// swallowing the Reset click). Nick stays pristine — submit still flags
	// its empty required value, and nothing blurs it afterwards.
	await typeInto(screen.getByRole('textbox', { name: 'Email' }), 'not-an-email');
	// Blur explicitly so the email error mounts with no click in flight:
	// a blur-induced mount would otherwise shift layout and swallow the Save click.
	blurActive();
	await screen.getByRole('button', { name: 'Save' }).click();
	const nick = screen.getByRole('textbox', { name: 'Nick' });
	await expect.element(nick).toHaveAttribute('data-invalid', '');
	await screen.getByRole('button', { name: 'Reset' }).click();
	await expect.element(nick).not.toHaveAttribute('data-invalid');
});

test('has no axe violations', async () => {
	await render(FormFixture);
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
