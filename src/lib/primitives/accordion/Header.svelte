<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface HeaderProps extends HTMLAttributes<HTMLHeadingElement> {
		/** Delegated access to the heading element. */
		ref?: HTMLHeadingElement | undefined;
		/** Heading level wrapping the trigger. @default 3 */
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		children?: Snippet;
	}
</script>

<script lang="ts">
	let {
		level = 3,
		ref = $bindable<HTMLHeadingElement | undefined>(undefined),
		children,
		...rest
	}: HeaderProps = $props();
</script>

<svelte:element this={`h${level}`} {...rest} bind:this={ref}>
	{@render children?.()}
</svelte:element>
