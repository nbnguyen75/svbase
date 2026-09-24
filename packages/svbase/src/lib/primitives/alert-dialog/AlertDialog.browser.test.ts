import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import AlertDialogFixture from './alert-dialog.fixture.svelte';

afterEach(() => cleanup());

function openAlert() {
	return document.querySelector('[role="alertdialog"]');
}

test('uses the alertdialog role and ignores overlay clicks', async () => {
	const screen = await render(AlertDialogFixture);
	await screen.getByRole('button', { name: 'Delete item' }).click();
	const alert = screen.getByRole('alertdialog');
	await expect.element(alert).toBeInTheDocument();
	const overlay = document.querySelector('div[data-state="open"]:not([role])');
	expect(overlay).not.toBeNull();
	overlay?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
	await expect.element(alert).toBeInTheDocument();
});

test('Escape still closes an alert dialog', async () => {
	const screen = await render(AlertDialogFixture);
	const trigger = screen.getByRole('button', { name: 'Delete item' });
	await trigger.click();
	await expect.element(screen.getByRole('alertdialog')).toBeInTheDocument();
	document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	await expect.poll(() => openAlert()).toBeNull();
	await expect.element(trigger).toHaveFocus();
});
