<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface GroupProps extends HTMLAttributes<HTMLElement> {
		ref?: HTMLElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	let {
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: GroupProps = $props();
</script>

<div {...rest} bind:this={ref} role="group">
	{@render children?.()}
</div>
