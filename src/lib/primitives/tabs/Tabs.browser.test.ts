import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import TabsFixture from './tabs.fixture.svelte';

afterEach(() => cleanup());

test('auto-selects the first enabled tab with linked panel', async () => {
	const screen = await render(TabsFixture);
	const alpha = screen.getByRole('tab', { name: 'Alpha' });
	await expect.element(alpha).toHaveAttribute('aria-selected', 'true');
	await expect.element(alpha).toHaveAttribute('tabindex', '0');
	await expect.element(screen.getByText('Panel A')).toBeInTheDocument();
	expect(document.body.textContent).not.toContain('Panel B');
	const controls = (await alpha.findElement()).getAttribute('aria-controls');
	const panel = controls ? document.getElementById(controls) : null;
	expect(panel?.getAttribute('role')).toBe('tabpanel');
	expect(panel?.textContent).toContain('Panel A');
});

test('automatic mode selects on arrow move with wrap and skip', async () => {
	const screen = await render(TabsFixture);
	const alpha = screen.getByRole('tab', { name: 'Alpha' });
	const beta = screen.getByRole('tab', { name: 'Beta' });
	const alphaEl = await alpha.findElement();
	alphaEl.focus();
	alphaEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
	await expect.element(beta).toHaveFocus();
	await expect.element(beta).toHaveAttribute('aria-selected', 'true');
	await expect.element(screen.getByText('Panel B')).toBeInTheDocument();
	const betaEl = await beta.findElement();
	betaEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
	await expect.element(alpha).toHaveFocus();
	await expect.element(alpha).toHaveAttribute('aria-selected', 'true');
});

test('manual mode moves focus only until Enter', async () => {
	const screen = await render(TabsFixture);
	const one = screen.getByRole('tab', { name: 'One' });
	const two = screen.getByRole('tab', { name: 'Two' });
	const oneEl = await one.findElement();
	oneEl.focus();
	oneEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
	await expect.element(two).toHaveFocus();
	await expect.element(one).toHaveAttribute('aria-selected', 'true');
	await expect.element(screen.getByText('Panel One')).toBeInTheDocument();
});

test('manual mode selects on click', async () => {
	const screen = await render(TabsFixture);
	const two = screen.getByRole('tab', { name: 'Two' });
	await two.click();
	await expect.element(two).toHaveAttribute('aria-selected', 'true');
	await expect.element(screen.getByText('Panel Two')).toBeInTheDocument();
});

test('synthetic Enter never activates a native tab', async () => {
	// Native buttons activate only on trusted input; this locks in that our
	// code adds no synthetic activation path on top (see Toggle's Space test).
	const screen = await render(TabsFixture);
	const two = screen.getByRole('tab', { name: 'Two' });
	const twoEl = await two.findElement();
	twoEl.focus();
	twoEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
	await expect.element(two).toHaveAttribute('aria-selected', 'false');
	await expect
		.element(screen.getByRole('tab', { name: 'One' }))
		.toHaveAttribute('aria-selected', 'true');
});

test('Home and End jump to the ends', async () => {
	const screen = await render(TabsFixture);
	const alpha = screen.getByRole('tab', { name: 'Alpha' });
	const beta = screen.getByRole('tab', { name: 'Beta' });
	const alphaEl = await alpha.findElement();
	alphaEl.focus();
	alphaEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
	await expect.element(beta).toHaveFocus();
	const betaEl = await beta.findElement();
	betaEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
	await expect.element(alpha).toHaveFocus();
});

test('vertical orientation uses Up and Down, ignoring Left and Right', async () => {
	const screen = await render(TabsFixture);
	const up = screen.getByRole('tab', { name: 'Up tab' });
	const down = screen.getByRole('tab', { name: 'Down tab' });
	const upEl = await up.findElement();
	upEl.focus();
	upEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
	await expect.element(down).toHaveFocus();
	await expect.element(down).toHaveAttribute('aria-selected', 'true');
	const downEl = await down.findElement();
	downEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
	await expect.element(down).toHaveFocus();
	await expect.element(down).toHaveAttribute('aria-selected', 'true');
});

test('click selects', async () => {
	const screen = await render(TabsFixture);
	const beta = screen.getByRole('tab', { name: 'Beta' });
	await beta.click();
	await expect.element(beta).toHaveAttribute('aria-selected', 'true');
	await expect.element(screen.getByText('Panel B')).toBeInTheDocument();
});

test('has no axe violations', async () => {
	await render(TabsFixture);
	expect(document.querySelectorAll('[role="tablist"]').length).toBe(3);
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
