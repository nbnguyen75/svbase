<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the panel element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
		/** The tab value this panel belongs to. */
		value: string;
		/** Overrides the generated id (trigger links to it). */
		id?: string;
	}
</script>

<script lang="ts">
	import { getTabsRootState, getTabIds } from './context.js';

	const root = getTabsRootState();

	let {
		value,
		id = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: ContentProps = $props();

	const open = $derived(root.value === value);
	const ids = $derived(getTabIds(root.rootId, value));
</script>

{#if open}
	<div
		{...rest}
		bind:this={ref}
		id={id ?? ids.panelId}
		role="tabpanel"
		aria-labelledby={ids.tabId}
		tabindex={0}
		data-state="open"
	>
		{@render children?.()}
	</div>
{/if}
