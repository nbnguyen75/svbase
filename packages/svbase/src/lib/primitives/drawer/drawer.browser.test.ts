import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import DrawerFixture from './drawer.fixture.svelte';

afterEach(() => cleanup());

test('opens edge-anchored on the right by default', async () => {
	const drawer = await render(DrawerFixture);
	await drawer.getByRole('button', { name: 'Open right drawer' }).click();
	const content = drawer.getByRole('dialog', { name: 'Right drawer' });
	await expect.element(content).toBeInTheDocument();
	const element = (await content.findElement()) as HTMLElement;
	expect(element.getAttribute('data-side')).toBe('right');
	expect(element.className).toContain('right-0');
});

test('controlled left drawer closes on Escape', async () => {
	const drawer = await render(DrawerFixture);
	await drawer.getByRole('button', { name: 'Open left drawer' }).click();
	await expect.element(drawer.getByText('Left open: yes')).toBeInTheDocument();
	const content = (await drawer
		.getByRole('dialog', { name: 'Left drawer' })
		.findElement()) as HTMLElement;
	expect(content.getAttribute('data-side')).toBe('left');
	content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	await expect.element(drawer.getByText('Left open: no')).toBeInTheDocument();
});

test('has no axe violations', async () => {
	await render(DrawerFixture);
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
