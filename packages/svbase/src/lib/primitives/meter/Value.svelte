<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ValueProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		ref?: HTMLElement | undefined;
	}
</script>

<script lang="ts">
	import { getMeterState } from './context.js';

	const state = getMeterState();

	let {
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: ValueProps = $props();
</script>

<span {...rest} bind:this={ref}>
	{#if children}
		{@render children?.()}
	{:else}
		{state.formatted}
	{/if}
</span>
