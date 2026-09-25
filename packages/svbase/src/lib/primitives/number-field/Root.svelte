<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface RootProps {
		/** Fired with the next value whenever it commits. */
		onValueChange?: ((value: number | null) => void) | undefined;
		/** Initial value for uncontrolled usage. @default null */
		defaultValue?: number | null;
		/** Current value, or `null` when empty (controlled). */
		value?: number | null;
		/** Range minimum. Unbounded when omitted. */
		min?: number | undefined;
		/** Range maximum. Unbounded when omitted. */
		max?: number | undefined;
		/** Step for arrows and steppers. @default 1 */
		step?: number;
		/** Step for PageUp/PageDown. @default 10 */
		largeStep?: number;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		/** Whether the value is display-only. @default false */
		readOnly?: boolean;
		children?: Snippet;
		/** Form field name (hidden input syncs the value). */
		name?: string;
	}
</script>

<script lang="ts">
	import { clamp } from '../../utils/slider-math.js';

	import { setNumberFieldState } from './context.js';

	let {
		defaultValue = null,
		value = $bindable(defaultValue),
		min = undefined,
		max = undefined,
		step = 1,
		largeStep = 10,
		disabled = false,
		readOnly = false,
		name = undefined,
		onValueChange = undefined,
		children
	}: RootProps = $props();

	// Plain field: written imperatively, read from event handlers —
	// never tracked, so no update loops.
	let inputEl: HTMLInputElement | undefined = undefined;

	function roundToStep(raw: number): number {
		const precision = Math.max(decimalPlaces(step), decimalPlaces(value ?? 0));
		const factor = 10 ** precision;
		return Math.round(raw * factor) / factor;
	}

	function decimalPlaces(candidate: number): number {
		const text = String(candidate);
		const dot = text.indexOf('.');
		return dot === -1 ? 0 : text.length - dot - 1;
	}

	function clampValue(candidate: number): number {
		return clamp(candidate, min ?? Number.NEGATIVE_INFINITY, max ?? Number.POSITIVE_INFINITY);
	}

	function commit(next: number | null): void {
		onValueChange?.(next);
		value = next;
	}

	function stepBy(amount: number): void {
		if (disabled || readOnly) return;
		const base = value ?? min ?? 0;
		commit(clampValue(roundToStep(base + amount)));
		focusInput();
	}

	function focusInput(): void {
		inputEl?.focus();
	}

	setNumberFieldState({
		get value() {
			return value;
		},
		get min() {
			return min;
		},
		get max() {
			return max;
		},
		get step() {
			return step;
		},
		get largeStep() {
			return largeStep;
		},
		get disabled() {
			return disabled;
		},
		get readOnly() {
			return readOnly;
		},
		increment() {
			stepBy(step);
		},
		decrement() {
			stepBy(-step);
		},
		commitText(text: string) {
			if (disabled || readOnly) return value;
			const trimmed = text.trim();
			if (trimmed === '') {
				commit(null);
				return null;
			}
			const parsed = Number(trimmed);
			if (!Number.isFinite(parsed)) return value;
			const next = clampValue(roundToStep(parsed));
			commit(next);
			return next;
		},
		focusInput() {
			inputEl?.focus();
		},
		registerInput(element: HTMLInputElement | undefined) {
			inputEl = element;
		}
	});
</script>

<!-- Root renders no element of its own — children only. -->
{@render children?.()}
{#if name !== undefined}
	<input
		type="hidden"
		{name}
		value={value === null ? '' : String(value)}
		disabled={disabled ? true : undefined}
	/>
{/if}
