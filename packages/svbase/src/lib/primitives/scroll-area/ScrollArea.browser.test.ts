import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import ScrollAreaFixture from './scroll-area.fixture.svelte';

afterEach(() => cleanup());

function viewport() {
	const node = document.querySelector('[data-testid="viewport"]');
	if (!(node instanceof HTMLElement)) throw new Error('viewport missing');
	return node;
}

async function thumb() {
	await expect.poll(() => document.querySelector('[data-testid="thumb"]')).not.toBeNull();
	const node = document.querySelector('[data-testid="thumb"]');
	if (!(node instanceof HTMLElement)) throw new Error('thumb missing');
	return node;
}

function thumbTop(): number {
	const top = document
		.querySelector('[data-testid="thumb"]')
		?.getAttribute('style')
		?.match(/top:\s*([0-9.]+)%/)?.[1];
	const value = Number.parseFloat(top ?? '');
	if (Number.isNaN(value)) throw new Error(`unparseable thumb top: ${top}`);
	return value;
}

test('thumb sizes to the visible ratio', async () => {
	await render(ScrollAreaFixture);
	// 200px viewport over 600px content: thumb covers a third.
	const height = Number.parseFloat((await thumb()).style.height.replace('%', ''));
	expect(height).toBeCloseTo(100 / 3, 1);
	expect(viewport().getAttribute('tabindex')).toBe('0');
});

test('scrolling moves the thumb', async () => {
	await render(ScrollAreaFixture);
	viewport().scrollTop = 200;
	await expect.poll(() => thumbTop()).toBe(50);
	viewport().scrollTop = 400;
	await expect.poll(() => thumbTop()).toBe(100);
	viewport().scrollTop = 0;
	await expect.poll(() => thumbTop()).toBe(0);
});

test('thumb drag scrolls the content', async () => {
	await render(ScrollAreaFixture);
	const thumbEl = await thumb();
	const thumbRect = thumbEl.getBoundingClientRect();
	const startY = thumbRect.top + thumbRect.height / 2;
	thumbEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientY: startY }));
	// Drag halfway down the 200px viewport: half of the 400px overflow.
	thumbEl.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientY: startY + 50 }));
	thumbEl.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientY: startY + 50 }));
	expect(viewport().scrollTop).toBeGreaterThan(0);
});

test('track click jumps', async () => {
	await render(ScrollAreaFixture);
	const track = document.querySelector('[data-testid="scrollbar"]');
	if (!(track instanceof HTMLElement)) throw new Error('scrollbar missing');
	const rect = track.getBoundingClientRect();
	track.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientY: rect.top + 150 }));
	expect(viewport().scrollTop).toBeGreaterThan(0);
});

test('has no axe violations', async () => {
	await render(ScrollAreaFixture);
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
