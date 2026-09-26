import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import DirectionFixture from './direction.fixture.svelte';

afterEach(() => cleanup());

test('rtl mirrors arrow navigation from the provider', async () => {
	const screen = await render(DirectionFixture);
	// No document-level direction: mirroring must come from the provider.
	// (The provider renders its own dir attribute for native layout; the
	// context additionally serves portaled subtrees that escape it.)
	expect(document.dir).toBe('');
	const alpha = (await screen.getByRole('tab', { name: 'Alpha' }).findElement()) as HTMLElement;
	alpha.focus();
	alpha.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
	const beta = screen.getByRole('tab', { name: 'Beta' });
	await expect.element(beta).toHaveFocus();
	await expect.element(screen.getByText('Selected: b')).toBeInTheDocument();
});

test('rtl wraps right arrow to the end', async () => {
	const screen = await render(DirectionFixture);
	const alpha = (await screen.getByRole('tab', { name: 'Alpha' }).findElement()) as HTMLElement;
	alpha.focus();
	alpha.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
	await expect.element(screen.getByRole('tab', { name: 'Gamma' })).toHaveFocus();
});

test('context drives mirroring even without the dir attribute', async () => {
	const screen = await render(DirectionFixture);
	// Strip the provider's own dir marker: closest('[dir]') and document.dir
	// now both miss, so only the context can still mirror.
	document.querySelector('[data-direction]')?.removeAttribute('dir');
	const alpha = (await screen.getByRole('tab', { name: 'Alpha' }).findElement()) as HTMLElement;
	alpha.focus();
	alpha.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
	await expect.element(screen.getByRole('tab', { name: 'Beta' })).toHaveFocus();
});

test('has no axe violations', async () => {
	await render(DirectionFixture);
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
