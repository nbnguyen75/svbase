<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RootProps extends HTMLAttributes<HTMLDivElement> {
		/** Human-readable value for `aria-valuetext` (determinate only). */
		format?: ((value: number, max: number) => string) | undefined;
		/** Delegated access to the root element. */
		ref?: HTMLDivElement | undefined;
		/** Accessible name when no visible label is associated. */
		ariaLabel?: string | undefined;
		children?: Snippet;
		/**
		 * Current value. `undefined` renders an indeterminate bar (and omits
		 * `aria-valuenow`, which is the accessible indeterminate signal).
		 */
		value?: number;
		min?: number;
		max?: number;
	}
</script>

<script lang="ts">
	import { type ProgressStateValue, setProgressState } from './context.js';

	let {
		value = undefined,
		min = 0,
		max = 100,
		format = undefined,
		ariaLabel = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	const state = $derived<ProgressStateValue>(
		value === undefined ? 'indeterminate' : value >= max ? 'complete' : 'progressing'
	);

	setProgressState({
		get value() {
			return value;
		},
		get min() {
			return min;
		},
		get max() {
			return max;
		},
		get format() {
			return format;
		},
		get state() {
			return state;
		}
	});
</script>

<div
	{...rest}
	bind:this={ref}
	role="progressbar"
	aria-label={ariaLabel}
	aria-valuemin={min}
	aria-valuemax={max}
	aria-valuenow={value ?? undefined}
	aria-valuetext={value === undefined || !format ? undefined : format(value, max)}
	data-state={state}
>
	{@render children?.()}
</div>
