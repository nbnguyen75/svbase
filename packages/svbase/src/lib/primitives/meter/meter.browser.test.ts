import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import MeterFixture from './meter.fixture.svelte';

afterEach(() => cleanup());

test('exposes meter semantics with percent fill', async () => {
	const screen = await render(MeterFixture);
	const meter = screen.getByRole('meter', { name: 'Upload progress' });
	await expect.element(meter).toHaveAttribute('aria-valuenow', '30');
	await expect.element(meter).toHaveAttribute('aria-valuemin', '0');
	await expect.element(meter).toHaveAttribute('aria-valuemax', '100');
	await expect.element(meter).toHaveAttribute('data-state', 'normal');
	await expect.element(screen.getByText('30')).toBeInTheDocument();
});

test('clamps out-of-range values', async () => {
	const screen = await render(MeterFixture);
	const meter = screen.getByRole('meter', { name: 'Overflowing gauge' });
	await expect.element(meter).toHaveAttribute('aria-valuenow', '100');
	await expect.element(meter).toHaveAttribute('data-state', 'high');
});

test('low band and optimum attribute surface', async () => {
	const screen = await render(MeterFixture);
	const meter = screen.getByRole('meter', { name: 'Low gauge' });
	await expect.element(meter).toHaveAttribute('data-state', 'low');
	await expect.element(meter).toHaveAttribute('data-optimum', '50');
});

test('has no axe violations', async () => {
	await render(MeterFixture);
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
