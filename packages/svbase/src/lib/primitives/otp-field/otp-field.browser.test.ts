import axe from 'axe-core';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import OtpFieldFixture from './otp-field.fixture.svelte';

afterEach(() => cleanup());

interface SegmentScreen {
	getByRole: (role: string, options?: { name?: string }) => { findElement: () => Promise<Element> };
}

async function segment(screen: SegmentScreen, name: string): Promise<HTMLInputElement> {
	return (await screen.getByRole('textbox', { name }).findElement()) as HTMLInputElement;
}

async function typeChar(element: HTMLInputElement, char: string): Promise<void> {
	element.focus();
	element.value = char;
	element.dispatchEvent(new Event('input', { bubbles: true }));
}

function press(element: HTMLInputElement, key: string): void {
	element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

function inputs(): NodeListOf<HTMLInputElement> {
	return document.querySelectorAll('input:not([type="hidden"])');
}

test('typing advances focus and commits the code', async () => {
	const screen = await render(OtpFieldFixture);
	const first = await segment(screen, 'Digit 1');
	await typeChar(first, '1');
	const second = inputs()[1] as HTMLInputElement;
	expect(document.activeElement).toBe(second);
});

test('backspace on an empty segment backs up and clears', async () => {
	const screen = await render(OtpFieldFixture);
	const first = await segment(screen, 'Digit 1');
	await typeChar(first, '5');
	const second = inputs()[1] as HTMLInputElement;
	expect(document.activeElement).toBe(second);
	press(second, 'Backspace');
	expect(document.activeElement).toBe(first);
	await vi.waitFor(() => {
		expect(first.value).toBe('');
	});
});

test('paste distributes across segments', async () => {
	const screen = await render(OtpFieldFixture);
	const first = await segment(screen, 'Digit 1');
	first.focus();
	const data = new DataTransfer();
	data.setData('text', '7890');
	first.dispatchEvent(
		new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: data })
	);
	const all = inputs();
	await vi.waitFor(() => {
		expect((all[0] as HTMLInputElement).value).toBe('7');
	});
	expect((all[3] as HTMLInputElement).value).toBe('0');
	expect(document.activeElement).toBe(all[3]);
});

test('hidden input syncs the value for forms', async () => {
	const screen = await render(OtpFieldFixture);
	const first = await segment(screen, 'Digit 1');
	await typeChar(first, '4');
	const hidden = document.querySelector('input[name="code"]') as HTMLInputElement | null;
	await vi.waitFor(() => {
		expect(hidden?.value).toBe('4');
	});
});

test('has no axe violations', async () => {
	await render(OtpFieldFixture);
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
