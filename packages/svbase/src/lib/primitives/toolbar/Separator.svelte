<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface SeparatorProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		ref?: HTMLElement | undefined;
		/** Separator orientation. @default 'horizontal' */
		orientation?: 'horizontal' | 'vertical';
	}
</script>

<script lang="ts">
	let {
		orientation = 'horizontal',
		ref = $bindable<HTMLElement | undefined>(undefined),
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
