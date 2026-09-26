<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TrackProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		ref?: HTMLElement | undefined;
	}
</script>

<script lang="ts">
	let {
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: TrackProps = $props();
</script>

<div {...rest} bind:this={ref}>
	{@render children?.()}
</div>
