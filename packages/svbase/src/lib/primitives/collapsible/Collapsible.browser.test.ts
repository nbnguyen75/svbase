import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import CollapsibleFixture from './collapsible.fixture.svelte';

afterEach(() => cleanup());

test('closed by default and toggles on click', async () => {
	const screen = await render(CollapsibleFixture);
	const trigger = screen.getByRole('button', { name: 'Details' });
	await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
	await expect.element(trigger).toHaveAttribute('data-state', 'closed');
	expect(document.body.textContent).not.toContain('Hidden content');
	await trigger.click();
	await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');
	await expect.element(trigger).toHaveAttribute('data-state', 'open');
	const panelId = (await trigger.findElement()).getAttribute('aria-controls');
	expect(panelId).toBeTruthy();
	expect(document.getElementById(panelId ?? '')?.textContent).toContain('Hidden content');
	await expect.element(trigger).toHaveAttribute('data-state', 'open');
	await trigger.click();
	await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
	expect(document.body.textContent).not.toContain('Hidden content');
});

test('defaultOpen renders the panel with matching linkage', async () => {
	const screen = await render(CollapsibleFixture);
	const trigger = screen.getByRole('button', { name: 'Open by default' });
	await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');
	await expect.element(screen.getByText('Visible content')).toBeInTheDocument();
	const panelId = (await trigger.findElement()).getAttribute('aria-controls');
	const panel = panelId ? document.getElementById(panelId) : null;
	expect(panel?.getAttribute('data-state')).toBe('open');
	expect(panel?.hasAttribute('hidden')).toBe(false);
});

test('has no axe violations', async () => {
	await render(CollapsibleFixture);
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
