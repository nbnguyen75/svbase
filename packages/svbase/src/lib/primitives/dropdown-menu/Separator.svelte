<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the separator element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	let {
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: SeparatorProps = $props();
</script>

<div {...rest} bind:this={ref} role="separator">
	{@render children?.()}
</div>
