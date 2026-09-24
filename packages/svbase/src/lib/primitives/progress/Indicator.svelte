<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface IndicatorProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the indicator element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { valueToPercent } from '../../utils/slider-math.js';

	import { getProgressState } from './context.js';

	const state = getProgressState();

	let {
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: IndicatorProps = $props();

	const percent = $derived(
		state.value === undefined ? undefined : valueToPercent(state.value, state.min, state.max)
	);
</script>

<div
	{...rest}
	bind:this={ref}
	data-state={state.state}
	style={`width: ${percent ?? 100}%;${typeof rest.style === 'string' ? rest.style : ''}`}
>
	{@render children?.()}
</div>
