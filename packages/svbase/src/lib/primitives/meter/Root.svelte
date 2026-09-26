<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RootProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		ref?: HTMLElement | undefined;
		/** Current value. Clamped into range; NaN falls back to min. */
		value: number;
		/** Range minimum. @default 0 */
		min?: number;
		/** Range maximum. @default 100 */
		max?: number;
		/** Below this the state reads `low`. No band styling without it. */
		low?: number | undefined;
		/** Above this the state reads `high`. No band styling without it. */
		high?: number | undefined;
		/**
		 * Optimal value, exposed as `data-optimum` for consumer styling.
		 * Band evaluation beyond low/high stays consumer-side.
		 */
		optimum?: number | undefined;
		/** Human-readable value for `aria-valuetext` and the Value part. */
		format?: ((value: number, max: number) => string) | undefined;
		/** Accessible name when no visible label is associated. */
		ariaLabel?: string | undefined;
	}
</script>

<script lang="ts">
	import { clamp, valueToPercent } from '../../utils/slider-math.js';

	import { setMeterState } from './context.js';

	let {
		value,
		min = 0,
		max = 100,
		low = undefined,
		high = undefined,
		optimum = undefined,
		format = undefined,
		ariaLabel = undefined,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	const clamped = $derived(
		Number.isNaN(value) ? min : clamp(value, Math.min(min, max), Math.max(min, max))
	);
	const percent = $derived(valueToPercent(clamped, min, max));
	const formatted = $derived(format?.(clamped, max) ?? String(clamped));
	const band = $derived.by(() => {
		if (low !== undefined && clamped < low) return 'low';
		if (high !== undefined && clamped > high) return 'high';
		return 'normal';
	});

	setMeterState({
		get value() {
			return clamped;
		},
		get min() {
			return min;
		},
		get max() {
			return max;
		},
		get percent() {
			return percent;
		},
		get formatted() {
			return formatted;
		}
	});
</script>

<div
	{...rest}
	bind:this={ref}
	role="meter"
	aria-valuenow={clamped}
	aria-valuemin={min}
	aria-valuemax={max}
	aria-valuetext={format ? formatted : undefined}
	aria-label={ariaLabel}
	data-state={band}
	data-optimum={optimum}
>
	{@render children?.()}
</div>
