import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import AvatarFixture from './avatar.fixture.svelte';

afterEach(() => cleanup());

test('broken image shows the fallback with error status', async () => {
	const screen = await render(AvatarFixture);
	await expect.element(screen.getByText('AB')).toBeInTheDocument();
	await expect.element(screen.getByText('Broken status: error')).toBeInTheDocument();
	const broken = document.querySelector('img[alt="Broken avatar"]') as HTMLImageElement | null;
	expect(broken?.hidden).toBe(true);
});

test('loaded image shows with loaded status and hides the fallback', async () => {
	const screen = await render(AvatarFixture);
	const image = screen.getByRole('img', { name: 'Loaded avatar' });
	await expect.element(screen.getByText('Loaded status: loaded')).toBeInTheDocument();
	await expect.element(image).not.toHaveAttribute('hidden');
	expect(document.body.textContent).not.toContain('CD');
});

test('has no axe violations', async () => {
	await render(AvatarFixture);
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
