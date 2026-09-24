<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface OverlayProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the overlay element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../../utils/compose-handlers.js';

	import { getDialogState } from './context.js';

	type OverlayMouseEvent = Parameters<NonNullable<OverlayProps['onclick']>>[0];

	const state = getDialogState();

	let {
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: OverlayProps = $props();

	function dismiss(event: OverlayMouseEvent): void {
		// Only backdrop itself dismisses; content clicks bubble past.
		if (event.target !== event.currentTarget) return;
		if (!state.disablePointerDismissal) state.closeDialog();
	}
</script>

{#if state.open}
	<div
		{...rest}
		bind:this={ref}
		data-state="open"
		data-disabled={state.disabled ? '' : undefined}
		onclick={composeHandlers(rest.onclick, dismiss)}
	>
		{@render children?.()}
	</div>
{/if}
