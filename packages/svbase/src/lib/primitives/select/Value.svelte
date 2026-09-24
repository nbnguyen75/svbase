<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ValueProps extends HTMLAttributes<HTMLSpanElement> {
		/** Delegated access to the value element. */
		ref?: HTMLSpanElement | undefined;
		/** Shown when nothing is selected. */
		placeholder?: string;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { getSelectRootState } from './context.js';

	const state = getSelectRootState();

	let {
		placeholder = undefined,
		ref = $bindable<HTMLSpanElement | undefined>(undefined),
		children,
		...rest
	}: ValueProps = $props();

	const label = $derived.by(() => {
		if (state.value === null) return placeholder ?? '';
		const entry = state.entries.find((item) => item.value === state.value);
		return entry?.label ?? state.value;
	});
</script>

<span {...rest} bind:this={ref} data-placeholder={state.value === null ? '' : undefined}>
	{#if children}{@render children()}{:else}{label}{/if}
</span>
