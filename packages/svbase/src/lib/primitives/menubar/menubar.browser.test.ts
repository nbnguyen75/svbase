import axe from 'axe-core';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import MenubarFixture from './menubar.fixture.svelte';

afterEach(() => cleanup());

async function menuHidden(): Promise<void> {
	await vi.waitFor(() => {
		expect(document.querySelector('[role="menu"]')).toBe(null);
	});
}

interface ButtonScreen {
	getByRole: (role: string, options?: { name?: string }) => { findElement: () => Promise<Element> };
}

async function focusTrigger(screen: ButtonScreen, name: string): Promise<HTMLElement> {
	const element = (await screen.getByRole('menuitem', { name }).findElement()) as HTMLElement;
	element.focus();
	return element;
}

function press(element: HTMLElement, key: string): void {
	element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

test('arrows move focus between triggers', async () => {
	const screen = await render(MenubarFixture);
	const file = await focusTrigger(screen, 'File');
	press(file, 'ArrowRight');
	await expect.element(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
	const edit = (await screen.getByRole('menuitem', { name: 'Edit' }).findElement()) as HTMLElement;
	press(edit, 'ArrowLeft');
	await expect.element(screen.getByRole('menuitem', { name: 'File' })).toHaveFocus();
});

test('Enter opens the focused menu and Escape closes it', async () => {
	const screen = await render(MenubarFixture);
	const file = await focusTrigger(screen, 'File');
	press(file, 'Enter');
	const item = (await screen.getByRole('menuitem', { name: 'New' }).findElement()) as HTMLElement;
	item.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	await menuHidden();
});

test('moving focus while open switches menus', async () => {
	const screen = await render(MenubarFixture);
	const file = await focusTrigger(screen, 'File');
	press(file, 'Enter');
	await expect.element(screen.getByRole('menuitem', { name: 'New' })).toBeVisible();
	press(file, 'ArrowRight');
	await expect.element(screen.getByRole('menuitem', { name: 'Undo' })).toBeInTheDocument();
	expect(document.body.textContent).not.toContain('New');
});

test('clicking an item selects and closes the menu', async () => {
	const screen = await render(MenubarFixture);
	const file = await focusTrigger(screen, 'File');
	press(file, 'Enter');
	await screen.getByRole('menuitem', { name: 'Open' }).click();
	await expect.element(screen.getByText('Picked: open')).toBeInTheDocument();
});

test('has no axe violations', async () => {
	await render(MenubarFixture);
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
