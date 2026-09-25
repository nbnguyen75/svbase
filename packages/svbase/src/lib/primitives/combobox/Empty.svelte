<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface EmptyProps extends HTMLAttributes<HTMLElement> {
		ref?: HTMLElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { getComboboxRootState } from './context.js';

	let {
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: EmptyProps = $props();

	const state = getComboboxRootState();
</script>

{#if state.open && state.visibleCount === 0}
	<div {...rest} bind:this={ref}>
		{@render children?.()}
	</div>
{/if}
