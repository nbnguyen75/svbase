import axe from 'axe-core';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import PreviewCardFixture from './preview-card.fixture.svelte';

afterEach(() => cleanup());

async function cardOpen(): Promise<void> {
	await vi.waitFor(() => {
		expect(document.querySelector('[role="dialog"]')).not.toBe(null);
	});
}

async function cardClosed(): Promise<void> {
	await vi.waitFor(() => {
		expect(document.querySelector('[role="dialog"]')).toBe(null);
	});
}

async function hoverTrigger(): Promise<HTMLElement> {
	const screen = await render(PreviewCardFixture);
	const trigger = (await screen.getByText('@ada').findElement()) as HTMLElement;
	trigger.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
	return trigger;
}

test('hover opens the card after the intent delay', async () => {
	await hoverTrigger();
	await cardOpen();
	const card = document.querySelector('[role="dialog"]') as HTMLElement;
	expect(card.textContent).toContain('Ada Lovelace');
});

test('hovering away closes after the close delay', async () => {
	const trigger = await hoverTrigger();
	await cardOpen();
	trigger.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
	await cardClosed();
});

test('focus opens immediately', async () => {
	const screen = await render(PreviewCardFixture);
	const trigger = (await screen.getByText('@ada').findElement()) as HTMLElement;
	trigger.focus();
	await cardOpen();
});

test('Escape closes the card', async () => {
	const trigger = await hoverTrigger();
	await cardOpen();
	const card = document.querySelector('[role="dialog"]') as HTMLElement;
	card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	await cardClosed();
	trigger.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
});

test('has no axe violations', async () => {
	await render(PreviewCardFixture);
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
