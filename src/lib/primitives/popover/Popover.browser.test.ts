import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import PopoverFixture from './popover.fixture.svelte';

afterEach(() => cleanup());

test('click toggles with linkage and real position', async () => {
	const screen = await render(PopoverFixture);
	const trigger = screen.getByRole('button', { name: 'Options' });
	await trigger.click();
	await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');
	await expect.element(screen.getByText('Popover body')).toBeInTheDocument();
	const bodyNode = await screen.getByText('Popover body').findElement();
	const content = bodyNode.closest('div[data-placement]');
	if (!(content instanceof HTMLElement)) throw new Error('popover content missing');
	const controls = (await trigger.findElement()).getAttribute('aria-controls');
	expect(controls).toBe(content.getAttribute('id'));
	expect(content.getAttribute('data-placement')).toBe('bottom');
	expect(content.style.left).not.toBe('');
	expect(content.style.top).not.toBe('');
	await trigger.click();
	expect(document.body.textContent).not.toContain('Popover body');
	await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('outside press and Escape close', async () => {
	const screen = await render(PopoverFixture);
	const trigger = screen.getByRole('button', { name: 'Options' });
	await trigger.click();
	await expect.element(screen.getByText('Popover body')).toBeInTheDocument();
	document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
	await expect.poll(() => document.body.textContent?.includes('Popover body') ?? false).toBe(false);
	await trigger.click();
	await expect.element(screen.getByText('Popover body')).toBeInTheDocument();
	document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	await expect.poll(() => document.body.textContent?.includes('Popover body') ?? false).toBe(false);
});

test('flips when there is no room below', async () => {
	const screen = await render(PopoverFixture);
	const trigger = screen.getByRole('button', { name: 'Pinned bottom' });
	await trigger.click();
	const flippedNode = await screen.getByText('Flipped content').findElement();
	const content = flippedNode.closest('div[data-placement]');
	if (!(content instanceof HTMLElement)) throw new Error('flipped content missing');
	expect(content.getAttribute('data-placement')).toBe('top');
	const contentRect = content.getBoundingClientRect();
	const triggerRect = (await trigger.findElement()).getBoundingClientRect();
	expect(contentRect.bottom).toBeLessThanOrEqual(triggerRect.top + 1);
});

test('has no axe violations while open', async () => {
	const screen = await render(PopoverFixture);
	await screen.getByRole('button', { name: 'Options' }).click();
	await expect.element(screen.getByText('Popover body')).toBeInTheDocument();
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
