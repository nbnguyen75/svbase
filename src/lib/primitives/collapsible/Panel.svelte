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
		/** Overrides the generated id (also used for `aria-controls`). */
		id?: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { getCollapsibleState } from './context.js';

	const state = getCollapsibleState();

	let {
		keepMounted = false,
		id = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: PanelProps = $props();

	onMount(() => {
		if (id) state.registerPanelId(id);
		return () => state.registerPanelId(undefined);
	});
</script>

{#if state.open || keepMounted}
	<div
		{...rest}
		bind:this={ref}
		id={id ?? state.panelId}
		data-state={state.open ? 'open' : 'closed'}
		data-disabled={state.disabled ? '' : undefined}
		hidden={!state.open ? true : undefined}
	>
		{@render children?.()}
	</div>
{/if}
