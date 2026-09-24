<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the panel element. */
		ref?: HTMLDivElement | undefined;
		/**
		 * Keep the panel in the DOM while closed (with the `hidden`
		 * attribute) instead of unmounting it.
		 * @default false
		 */
		keepMounted?: boolean;
		children?: Snippet;
		/** Overrides the generated id (trigger links to it). */
		id?: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { getAccordionItemState } from './context.js';

	const item = getAccordionItemState();

	let {
		keepMounted = false,
		id = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: PanelProps = $props();

	onMount(() => {
		if (id) item.registerPanelId(id);
		return () => item.registerPanelId(undefined);
	});
</script>

{#if item.open || keepMounted}
	<div
		{...rest}
		bind:this={ref}
		id={id ?? item.panelId}
		role="region"
		aria-labelledby={item.triggerId}
		data-state={item.open ? 'open' : 'closed'}
		data-disabled={item.disabled ? '' : undefined}
		hidden={!item.open ? true : undefined}
	>
		{@render children?.()}
	</div>
{/if}
