<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface LinkProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		ref?: HTMLElement | undefined;
		/** Destination URL. */
		href?: string | undefined;
	}
</script>

<script lang="ts">
	let {
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: LinkProps = $props();
</script>

<a {...rest} bind:this={ref} role="menuitem">
	{@render children?.()}
</a>
