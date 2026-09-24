import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import TooltipFixture from './tooltip.fixture.svelte';

afterEach(() => cleanup());

test('hover opens after the delay with describedby linkage', async () => {
	const screen = await render(TooltipFixture);
	const trigger = screen.getByText('Hover me');
	expect(document.body.textContent).not.toContain('Helpful hint');
	await trigger.hover();
	await expect.element(screen.getByText('Helpful hint')).toBeInTheDocument();
	const describedby = (await trigger.findElement()).getAttribute('aria-describedby');
	expect(describedby).toBeTruthy();
	const tip = describedby ? document.getElementById(describedby) : null;
	expect(tip?.getAttribute('role')).toBe('tooltip');
});

test('leaving closes, and focus opens immediately', async () => {
	const screen = await render(TooltipFixture);
	const trigger = screen.getByText('Hover me');
	await trigger.hover();
	await expect.element(screen.getByText('Helpful hint')).toBeInTheDocument();
	await trigger.unhover();
	await expect.poll(() => document.body.textContent?.includes('Helpful hint') ?? false).toBe(false);
	const triggerEl = await trigger.findElement();
	triggerEl.focus();
	await expect.element(screen.getByText('Helpful hint')).toBeInTheDocument();
	triggerEl.blur();
	await expect.poll(() => document.body.textContent?.includes('Helpful hint') ?? false).toBe(false);
});

test('skips the delay right after another tooltip closed', async () => {
	const screen = await render(TooltipFixture);
	const first = screen.getByText('Hover me');
	const second = screen.getByText('Second');
	await first.hover();
	await expect.element(screen.getByText('Helpful hint')).toBeInTheDocument();
	await first.unhover();
	await expect.poll(() => document.body.textContent?.includes('Helpful hint') ?? false).toBe(false);
	const start = Date.now();
	await second.hover();
	await expect.element(screen.getByText('Second hint')).toBeInTheDocument();
	// Second tooltip waits 2000ms without the skip — generous upper bound.
	expect(Date.now() - start).toBeLessThan(1000);
});

test('has no axe violations while open', async () => {
	const screen = await render(TooltipFixture);
	await screen.getByText('Hover me').hover();
	await expect.element(screen.getByText('Helpful hint')).toBeInTheDocument();
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
