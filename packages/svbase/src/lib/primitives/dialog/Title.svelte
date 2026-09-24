<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
		/** Delegated access to the title element. */
		ref?: HTMLHeadingElement | undefined;
		/** Heading level. @default 2 */
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		children?: Snippet;
		/** Overrides the generated id (popup links to it). */
		id?: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { getDialogState } from './context.js';

	const state = getDialogState();

	let {
		level = 2,
		id = undefined,
		ref = $bindable<HTMLHeadingElement | undefined>(undefined),
		children,
		...rest
	}: TitleProps = $props();

	onMount(() => {
		const effective = id ?? state.defaultTitleId;
		state.registerTitleId(effective);
		return () => state.registerTitleId(undefined);
	});
</script>

<svelte:element this={`h${level}`} {...rest} bind:this={ref} id={id ?? state.defaultTitleId}>
	{@render children?.()}
</svelte:element>
