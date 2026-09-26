<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface LabelProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		ref?: HTMLElement | undefined;
	}
</script>

<script lang="ts">
	let {
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: LabelProps = $props();
</script>

<span {...rest} bind:this={ref}>
	{@render children?.()}
</span>
