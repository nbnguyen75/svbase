import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import DialogFixture from './dialog.fixture.svelte';

afterEach(() => cleanup());

function openDialog() {
	return document.querySelector('[role="dialog"]');
}

test('opens with role, labelledby linkage, and initial focus inside', async () => {
	const screen = await render(DialogFixture);
	await screen.getByRole('button', { name: 'Open dialog' }).click();
	const dialog = screen.getByRole('dialog');
	await expect.element(dialog).toBeInTheDocument();
	await expect.element(dialog).toHaveAttribute('aria-modal', 'true');
	const title = screen.getByRole('heading', { name: 'Confirm action' });
	const labelledby = (await dialog.findElement()).getAttribute('aria-labelledby');
	expect(labelledby).toBe((await title.findElement()).getAttribute('id'));
	expect(document.activeElement?.textContent).toBe('Extra action');
});

test('Escape closes and returns focus to the trigger', async () => {
	const screen = await render(DialogFixture);
	const trigger = screen.getByRole('button', { name: 'Open dialog' });
	await trigger.click();
	await expect.element(screen.getByRole('dialog')).toBeInTheDocument();
	document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	await expect.poll(() => openDialog()).toBeNull();
	await expect.element(trigger).toHaveFocus();
});

test('Tab cycles inside the popup', async () => {
	const screen = await render(DialogFixture);
	const trigger = screen.getByRole('button', { name: 'Open dialog' });
	await trigger.click();
	const extra = screen.getByRole('button', { name: 'Extra action' });
	const close = screen.getByRole('button', { name: 'Close' });
	(await close.findElement()).focus();
	document.activeElement?.dispatchEvent(
		new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
	);
	await expect.element(extra).toHaveFocus();
});

test('overlay click closes', async () => {
	const screen = await render(DialogFixture);
	await screen.getByRole('button', { name: 'Open dialog' }).click();
	await expect.element(screen.getByRole('dialog')).toBeInTheDocument();
	const overlay = document.querySelector('div[data-state="open"]:not([role])');
	expect(overlay).not.toBeNull();
	overlay?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
	await expect.poll(() => openDialog()).toBeNull();
});

test('has no axe violations while open', async () => {
	const screen = await render(DialogFixture);
	await screen.getByRole('button', { name: 'Open dialog' }).click();
	await expect.element(screen.getByRole('dialog')).toBeInTheDocument();
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
