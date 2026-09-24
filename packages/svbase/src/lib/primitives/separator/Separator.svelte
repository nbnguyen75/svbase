<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
		/** Reading direction of the divider. @default 'horizontal' */
		orientation?: 'horizontal' | 'vertical';
		/** Delegated access to the separator element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	let {
		orientation = 'horizontal',
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: SeparatorProps = $props();
</script>

<div
	{...rest}
	bind:this={ref}
	role="separator"
	aria-orientation={orientation}
	data-orientation={orientation}
>
	{@render children?.()}
</div>
