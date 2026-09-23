<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface DescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
		/** Delegated access to the description element. */
		ref?: HTMLParagraphElement | undefined;
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
		id = undefined,
		ref = $bindable<HTMLParagraphElement | undefined>(undefined),
		children,
		...rest
	}: DescriptionProps = $props();

	onMount(() => {
		const effective = id ?? state.defaultDescriptionId;
		state.registerDescriptionId(effective);
		return () => state.registerDescriptionId(undefined);
	});
</script>

<p {...rest} bind:this={ref} id={id ?? state.defaultDescriptionId}>
	{@render children?.()}
</p>
