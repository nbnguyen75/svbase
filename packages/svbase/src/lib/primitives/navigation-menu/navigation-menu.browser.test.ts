import axe from 'axe-core';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import NavigationMenuFixture from './navigation-menu.fixture.svelte';

afterEach(() => cleanup());

interface ButtonScreen {
	getByRole: (role: string, options?: { name?: string }) => { findElement: () => Promise<Element> };
}

async function hover(screen: ButtonScreen, name: string): Promise<HTMLElement> {
	const element = (await screen.getByRole('menuitem', { name }).findElement()) as HTMLElement;
	element.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
	return element;
}

async function unhover(element: HTMLElement): Promise<void> {
	element.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
}

async function noOpenMenu(): Promise<void> {
	await vi.waitFor(() => {
		expect(document.querySelector('[role="menu"]')).toBe(null);
	});
}

test('hover opens the menu after the intent delay', async () => {
	const screen = await render(NavigationMenuFixture);
	await hover(screen, 'Products');
	await expect.element(screen.getByRole('menuitem', { name: 'Overview' })).toBeInTheDocument();
});

test('hovering away closes after the close delay', async () => {
	const screen = await render(NavigationMenuFixture);
	const trigger = await hover(screen, 'Products');
	await expect.element(screen.getByRole('menuitem', { name: 'Overview' })).toBeInTheDocument();
	await unhover(trigger);
	await noOpenMenu();
});

test('arrows move focus and Enter opens', async () => {
	const screen = await render(NavigationMenuFixture);
	const products = (await screen
		.getByRole('menuitem', { name: 'Products' })
		.findElement()) as HTMLElement;
	products.focus();
	products.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
	const company = screen.getByRole('menuitem', { name: 'Company' });
	await expect.element(company).toHaveFocus();
	const companyEl = (await company.findElement()) as HTMLElement;
	companyEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
	await expect.element(screen.getByRole('menuitem', { name: 'About' })).toBeInTheDocument();
});

test('clicking an item selects and closes the menu', async () => {
	const screen = await render(NavigationMenuFixture);
	await hover(screen, 'Products');
	await screen.getByRole('menuitem', { name: 'Pricing' }).click();
	await expect.element(screen.getByText('Picked: pricing')).toBeInTheDocument();
	await noOpenMenu();
});

test('has no axe violations', async () => {
	await render(NavigationMenuFixture);
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
