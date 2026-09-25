<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface LegendProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		ref?: HTMLElement | undefined;
	}
</script>

<script lang="ts">
	let {
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: LegendProps = $props();
</script>

<legend {...rest} bind:this={ref}>
	{@render children?.()}
</legend>
