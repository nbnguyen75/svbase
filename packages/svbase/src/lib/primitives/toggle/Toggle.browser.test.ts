import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import ToggleFixture from './toggle.fixture.svelte';

afterEach(() => cleanup());

test('click flips pressed state and aria', async () => {
	const screen = await render(ToggleFixture);
	const toggle = screen.getByRole('button', { name: 'Airplane' });
	await expect.element(toggle).toHaveAttribute('aria-pressed', 'false');
	await toggle.click();
	await expect.element(toggle).toHaveAttribute('aria-pressed', 'true');
	await expect.element(toggle).toHaveAttribute('data-pressed', '');
});

test('synthetic Space leaves a native toggle alone', async () => {
	// Synthetic keyboard events never trigger native button activation (that
	// requires trusted user input, which real browsers handle themselves).
	// This locks in that our non-native Space path stays scoped: it must not
	// flip native buttons either.
	const screen = await render(ToggleFixture);
	const toggle = screen.getByRole('button', { name: 'Airplane' });
	const element = await toggle.findElement();
	element.focus();
	await expect.element(toggle).toHaveFocus();
	element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
	element.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }));
	await expect.element(toggle).toHaveAttribute('aria-pressed', 'false');
});
