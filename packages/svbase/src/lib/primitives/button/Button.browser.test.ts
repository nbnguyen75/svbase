import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import ButtonFixture from './button.fixture.svelte';

afterEach(() => cleanup());

test('native button exposes type and fires clicks', async () => {
	const screen = await render(ButtonFixture);
	const button = screen.getByRole('button', { name: 'Press me' });
	await expect.element(button).toBeInTheDocument();
	await expect.element(button).toHaveAttribute('type', 'button');
	await button.click();
	await expect.element(screen.getByText('Clicks: 1')).toBeInTheDocument();
});

test('disabled button ignores forced interaction', async () => {
	const screen = await render(ButtonFixture);
	const button = screen.getByRole('button', { name: 'Cannot press' });
	await expect.element(button).toBeDisabled();
	await expect.element(button).toHaveAttribute('data-disabled', '');
	await button.click({ force: true });
	await expect.element(screen.getByText('Clicks: 0')).toBeInTheDocument();
});

test('non-native element activates with real keyboard', async () => {
	const screen = await render(ButtonFixture);
	const div = screen.getByRole('button', { name: 'Div button' });
	await expect.element(div).toHaveAttribute('tabindex', '0');
	const element = await div.findElement();
	element.focus();
	await expect.element(div).toHaveFocus();
	element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
	await expect.element(screen.getByText('Clicks: 1')).toBeInTheDocument();
	element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
	element.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }));
	await expect.element(screen.getByText('Clicks: 2')).toBeInTheDocument();
});

test('has no axe violations', async () => {
	await render(ButtonFixture);
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
