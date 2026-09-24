<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TitleProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the title element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	let {
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: TitleProps = $props();
</script>

<div {...rest} bind:this={ref}>
	{@render children?.()}
</div>
