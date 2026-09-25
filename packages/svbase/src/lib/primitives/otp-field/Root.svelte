<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface RootProps {
		/** Fired with the next code whenever it changes. */
		onValueChange?: ((value: string) => void) | undefined;
		/** Initial code for uncontrolled usage. @default '' */
		defaultValue?: string;
		/** Current code (controlled). */
		value?: string;
		/** Segment count. Must be a positive integer. @default 6 */
		length?: number;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		/** Whether the code is display-only. @default false */
		readOnly?: boolean;
		children?: Snippet;
		/** Form field name (hidden input syncs the value). */
		name?: string;
	}
</script>

<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';

	import { setOtpState } from './context.js';

	let {
		defaultValue = '',
		value = $bindable(defaultValue),
		length = 6,
		disabled = false,
		readOnly = false,
		name = undefined,
		onValueChange = undefined,
		children
	}: RootProps = $props();

	// Plain reactive map: written imperatively, read from event handlers.
	const inputs = new SvelteMap<number, HTMLInputElement | undefined>();

	const size = $derived(Number.isInteger(length) && length > 0 ? length : 6);

	function normalize(candidate: string): string {
		return candidate.slice(0, size);
	}

	function commit(next: string): void {
		const normalized = normalize(next);
		if (normalized === value) return;
		onValueChange?.(normalized);
		value = normalized;
	}

	function charAt(index: number): string {
		return value.charAt(index);
	}

	function focusIndex(index: number): void {
		inputs.get(Math.max(0, Math.min(index, size - 1)))?.focus();
	}

	setOtpState({
		get value() {
			return value;
		},
		get length() {
			return size;
		},
		get disabled() {
			return disabled;
		},
		get readOnly() {
			return readOnly;
		},
		setChar(index: number, char: string) {
			if (disabled || readOnly) return;
			if (index < 0 || index >= size) return;
			const chars = value.split('');
			while (chars.length < index) chars.push('');
			chars[index] = char;
			commit(chars.join(''));
			focusIndex(Math.min(index + 1, size - 1));
		},
		clearChar(index: number) {
			if (disabled || readOnly) return;
			if (charAt(index) === '') {
				// Empty segment: back up and clear the previous one.
				if (index <= 0) return;
				const chars = value.split('');
				chars[index - 1] = '';
				commit(chars.join(''));
				focusIndex(index - 1);
				return;
			}
			const chars = value.split('');
			chars[index] = '';
			commit(chars.join(''));
		},
		pasteText(index: number, text: string) {
			if (disabled || readOnly) return;
			const chars = value.split('');
			let filled = 0;
			for (const char of text) {
				const target = index + filled;
				if (target >= size) break;
				chars[target] = char;
				filled += 1;
			}
			if (filled === 0) return;
			while (chars.length < size) chars.push('');
			commit(chars.join(''));
			focusIndex(Math.min(index + filled, size - 1));
		},
		focusIndex(index: number) {
			inputs.get(Math.max(0, Math.min(index, size - 1)))?.focus();
		},
		registerInput(index: number, element: HTMLInputElement | undefined) {
			if (element === undefined) inputs.delete(index);
			else inputs.set(index, element);
		}
	});
</script>

<!-- Root renders no element of its own — children only. -->
{@render children?.()}
{#if name !== undefined}
	<input type="hidden" {name} {value} disabled={disabled ? true : undefined} />
{/if}
