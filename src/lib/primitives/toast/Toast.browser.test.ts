import axe from 'axe-core';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import ToastFixture from './toast.fixture.svelte';

afterEach(() => cleanup());

function toast(name: string) {
	const node = document.querySelector(`[data-testid="${name}"]`);
	if (!(node instanceof HTMLElement)) throw new Error(`toast ${name} missing`);
	return node;
}

test('renders live regions with title and description', async () => {
	await render(ToastFixture);
	const basic = toast('basic');
	expect(basic.getAttribute('role')).toBe('status');
	expect(basic.textContent).toContain('Saved');
	expect(basic.textContent).toContain('All changes saved.');
});

test('auto-dismisses after its duration', async () => {
	await render(ToastFixture);
	await expect.element(toast('fast')).toBeInTheDocument();
	await expect.poll(() => document.querySelector('[data-testid="fast"]')).toBeNull();
	expect(toast('basic')).toBeInTheDocument();
});

test('hover pauses the timer', async () => {
	await render(ToastFixture);
	const basic = toast('basic');
	basic.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
	await new Promise((resolve) => setTimeout(resolve, 1000));
	expect(toast('basic')).toBeInTheDocument();
	basic.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
	await expect.poll(() => document.querySelector('[data-testid="basic"]')).toBeNull();
});

test('swipe dismisses past the threshold', async () => {
	await render(ToastFixture);
	const basic = toast('basic');
	basic.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 100 }));
	basic.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 160 }));
	basic.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: 160 }));
	await expect.poll(() => document.querySelector('[data-testid="basic"]')).toBeNull();
});

test('close button dismisses', async () => {
	const screen = await render(ToastFixture);
	await screen.getByRole('button', { name: 'Dismiss' }).click();
	await expect.poll(() => document.querySelector('[data-testid="basic"]')).toBeNull();
});

test('sticky toasts never auto-dismiss', async () => {
	await render(ToastFixture);
	await new Promise((resolve) => setTimeout(resolve, 500));
	expect(toast('sticky')).toBeInTheDocument();
});

test('has no axe violations', async () => {
	await render(ToastFixture);
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
