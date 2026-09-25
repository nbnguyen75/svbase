import axe from 'axe-core';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import ContextMenuFixture from './context-menu.fixture.svelte';

afterEach(() => cleanup());

interface TextScreen {
	getByText: (text: string) => { findElement: () => Promise<Element> };
}

async function rightClickOnText(
	screen: TextScreen,
	text: string,
	x: number,
	y: number
): Promise<void> {
	const target = (await screen.getByText(text).findElement()) as HTMLElement;
	target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: x, clientY: y }));
}

async function menuHidden(): Promise<void> {
	await vi.waitFor(() => {
		expect(document.querySelector('[role="menu"]')).toBe(null);
	});
}

test('right-click opens the menu near the cursor', async () => {
	const screen = await render(ContextMenuFixture);
	await rightClickOnText(screen, 'Right-click here', 120, 200);
	const menu = screen.getByRole('menu');
	await expect.element(menu).not.toHaveAttribute('hidden');
	const box = await menu.findElement().then((el: Element) => el.getBoundingClientRect());
	expect(Math.abs(box.left - 120)).toBeLessThan(160);
	expect(Math.abs(box.top - 200)).toBeLessThan(160);
});

test('clicking an item selects and closes', async () => {
	const screen = await render(ContextMenuFixture);
	await rightClickOnText(screen, 'Right-click here', 120, 200);
	await screen.getByRole('menuitem', { name: 'Cut' }).click();
	await expect.element(screen.getByText('Picked: cut')).toBeInTheDocument();
	await menuHidden();
});

test('Escape closes the menu', async () => {
	const screen = await render(ContextMenuFixture);
	await rightClickOnText(screen, 'Right-click here', 120, 200);
	const item = (await screen.getByRole('menuitem', { name: 'Cut' }).findElement()) as HTMLElement;
	item.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	await menuHidden();
});

test('disabled trigger area does not open', async () => {
	const screen = await render(ContextMenuFixture);
	await rightClickOnText(screen, 'Disabled area', 120, 200);
	expect(document.body.textContent).not.toContain('Never shown');
});

test('has no axe violations', async () => {
	await render(ContextMenuFixture);
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
