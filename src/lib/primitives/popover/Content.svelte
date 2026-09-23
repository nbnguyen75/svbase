<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the content element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
		/** Overrides the generated id (trigger links to it). */
		id?: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { escapeKey } from '../../actions/index.js';

	import { getPopoverState } from './context.js';

	const state = getPopoverState();

	let {
		id = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: ContentProps = $props();

	onMount(() => {
		const effective = id ?? state.defaultContentId;
		state.registerContentId(effective);
		return () => state.registerContentId(undefined);
	});

	/**
	 * Element registration lives in an effect (not `onMount`): `bind:this`
	 * into a `$bindable` prop flushes after mount, so only a reactive read
	 * observes it. Writes go to an untracked field — no update loop.
	 */
	$effect(() => {
		state.registerContent(ref);
		return () => state.registerContent(undefined);
	});
</script>

{#if state.open}
	<div
		{...rest}
		bind:this={ref}
		id={id ?? state.defaultContentId}
		data-state="open"
		data-disabled={state.disabled ? '' : undefined}
		data-placement={state.position.placement}
		hidden={!state.position.positioned}
		{@attach state.position.floating}
		{@attach escapeKey(() => state.closePopover())}
	>
		{@render children?.()}
	</div>
{/if}
