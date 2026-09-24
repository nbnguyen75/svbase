import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import MenuFixture from './menu.fixture.svelte';

afterEach(() => cleanup());

async function openMenu(screen: Awaited<ReturnType<typeof render>>) {
	await screen.getByRole('button', { name: 'File' }).click();
	await expect.element(screen.getByRole('menu')).toBeInTheDocument();
}

test('opens and toggles with linkage', async () => {
	const screen = await render(MenuFixture);
	const trigger = screen.getByRole('button', { name: 'File' });
	await trigger.click();
	const menu = screen.getByRole('menu');
	await expect.element(menu).toBeInTheDocument();
	await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');
	const controls = (await trigger.findElement()).getAttribute('aria-controls');
	expect(controls).toBe((await menu.findElement()).getAttribute('id'));
	await trigger.click();
	await expect.poll(() => document.querySelector('[role="menu"]')).toBeNull();
	await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('click selects, closes, and returns focus', async () => {
	const screen = await render(MenuFixture);
	await openMenu(screen);
	const trigger = screen.getByRole('button', { name: 'File' });
	await screen.getByRole('menuitem', { name: 'New' }).click();
	await expect.poll(() => document.querySelector('[role="menu"]')).toBeNull();
	await expect.element(trigger).toHaveFocus();
});

test('arrows move focus and highlight, skipping disabled, with wrap', async () => {
	const screen = await render(MenuFixture);
	await openMenu(screen);
	const items = {
		newItem: screen.getByRole('menuitem', { name: 'New' }),
		open: screen.getByRole('menuitem', { name: 'Open' }),
		share: screen.getByRole('menuitem', { name: 'Share' })
	};
	const first = await items.newItem.findElement();
	first.focus();
	first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
	await expect.element(items.open).toHaveFocus();
	await expect.element(items.open).toHaveAttribute('data-highlighted', '');
	const openEl = await items.open.findElement();
	openEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
	const box = screen.getByRole('menuitemcheckbox', { name: 'Show sidebar' });
	await expect.element(box).toHaveFocus();
	await expect.element(box).toHaveAttribute('data-highlighted', '');
	const boxEl = await box.findElement();
	boxEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
	await expect.element(screen.getByRole('menuitemradio', { name: 'Option A' })).toHaveFocus();
	const optionAEl = await screen.getByRole('menuitemradio', { name: 'Option A' }).findElement();
	optionAEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
	await expect.element(screen.getByRole('menuitemradio', { name: 'Option B' })).toHaveFocus();
	const optionBEl = await screen.getByRole('menuitemradio', { name: 'Option B' }).findElement();
	optionBEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
	await expect.element(items.share).toHaveFocus();
	const shareEl = await items.share.findElement();
	shareEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
	await expect.element(items.newItem).toHaveFocus();
});

test('typeahead jumps to matches', async () => {
	const screen = await render(MenuFixture);
	await openMenu(screen);
	const first = await screen.getByRole('menuitem', { name: 'New' }).findElement();
	first.focus();
	first.dispatchEvent(new KeyboardEvent('keydown', { key: 'o', bubbles: true }));
	await expect.element(screen.getByRole('menuitem', { name: 'Open' })).toHaveFocus();
});

test('checkbox toggles without closing', async () => {
	const screen = await render(MenuFixture);
	await openMenu(screen);
	const box = screen.getByRole('menuitemcheckbox', { name: 'Show sidebar' });
	await expect.element(box).toHaveAttribute('aria-checked', 'false');
	await box.click();
	await expect.element(box).toHaveAttribute('aria-checked', 'true');
	expect(document.querySelector('[data-testid="sidebar-dot"]')).not.toBeNull();
	await expect.element(screen.getByRole('menu')).toBeInTheDocument();
});

test('radio selects without closing', async () => {
	const screen = await render(MenuFixture);
	await openMenu(screen);
	const optionB = screen.getByRole('menuitemradio', { name: 'Option B' });
	await optionB.click();
	await expect.element(optionB).toHaveAttribute('aria-checked', 'true');
	await expect
		.element(screen.getByRole('menuitemradio', { name: 'Option A' }))
		.toHaveAttribute('aria-checked', 'false');
	expect(document.querySelector('[data-testid="option-b-dot"]')).not.toBeNull();
	await expect.element(screen.getByRole('menu')).toBeInTheDocument();
});

test('submenu opens on hover; Escape closes one level', async () => {
	const screen = await render(MenuFixture);
	await openMenu(screen);
	const share = screen.getByRole('menuitem', { name: 'Share' });
	await share.hover();
	await expect.element(screen.getByRole('menuitem', { name: 'Email' })).toBeInTheDocument();
	await expect.element(share).toHaveAttribute('aria-expanded', 'true');
	document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	await expect.poll(() => document.body.textContent?.includes('Email') ?? false).toBe(false);
	await expect.element(screen.getByRole('menu')).toBeInTheDocument();
	document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	await expect.poll(() => document.querySelector('[role="menu"]')).toBeNull();
});

test('has no axe violations while open', async () => {
	const screen = await render(MenuFixture);
	await openMenu(screen);
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
