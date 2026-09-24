import axe from 'axe-core';
import { tick } from 'svelte';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import SliderFixture from './slider.fixture.svelte';

afterEach(() => cleanup());

function thumb(name: string) {
	const node = document.querySelector(`[role="slider"][aria-label="${name}"]`);
	if (!(node instanceof HTMLElement)) throw new Error(`thumb ${name} missing`);
	return node;
}

test('keyboard steps with aria contract', async () => {
	await render(SliderFixture);
	const el = thumb('Volume');
	expect(el.getAttribute('aria-valuenow')).toBe('0');
	expect(el.getAttribute('aria-valuemin')).toBe('0');
	expect(el.getAttribute('aria-valuemax')).toBe('100');
	el.focus();
	el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
	await tick();
	expect(el.getAttribute('aria-valuenow')).toBe('1');
	el.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));
	await tick();
	expect(el.getAttribute('aria-valuenow')).toBe('11');
	el.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
	await tick();
	expect(el.getAttribute('aria-valuenow')).toBe('100');
	el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
	await tick();
	expect(el.getAttribute('aria-valuenow')).toBe('0');
	const committed = document.body.textContent ?? '';
	expect(committed).toContain('Committed: 0');
});

test('range thumbs move independently', async () => {
	await render(SliderFixture);
	const max = thumb('Max price');
	max.focus();
	max.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
	await tick();
	expect(max.getAttribute('aria-valuenow')).toBe('81');
	expect(thumb('Min price').getAttribute('aria-valuenow')).toBe('20');
});

test('disabled ignores keyboard', async () => {
	await render(SliderFixture);
	const el = thumb('Disabled');
	el.focus();
	el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
	await tick();
	expect(el.getAttribute('aria-valuenow')).toBe('30');
});

test('track drag jumps and commits', async () => {
	await render(SliderFixture);
	const track = document.querySelector('[data-testid="track-single"]');
	expect(track).not.toBeNull();
	const trackEl = track as HTMLElement;
	const rect = trackEl.getBoundingClientRect();
	expect(rect.width).toBe(200);
	trackEl.dispatchEvent(
		new PointerEvent('pointerdown', { bubbles: true, clientX: rect.left + 10, clientY: 10 })
	);
	trackEl.dispatchEvent(
		new PointerEvent('pointermove', { bubbles: true, clientX: rect.left + 150, clientY: 10 })
	);
	trackEl.dispatchEvent(
		new PointerEvent('pointerup', { bubbles: true, clientX: rect.left + 150, clientY: 10 })
	);
	await tick();
	const volume = thumb('Volume');
	expect(volume.getAttribute('aria-valuenow')).toBe('75');
	expect(document.body.textContent).toContain('Committed: 75');
});

test('has no axe violations', async () => {
	await render(SliderFixture);
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
