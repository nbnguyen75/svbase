<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ArrowProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the arrow element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { getPreviewCardState } from './context.js';

	const state = getPreviewCardState();

	let {
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: ArrowProps = $props();
</script>

<div
	{...rest}
	bind:this={ref}
	data-placement={state.position.placement}
	{@attach state.position.arrow}
>
	{@render children?.()}
</div>
