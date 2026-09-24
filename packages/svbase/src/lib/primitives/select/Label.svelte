<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface LabelProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the label element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
		/** Overrides the generated id (group links to it). */
		id?: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { createId } from '../../utils/id.js';

	import { getSelectGroupState } from './group-context.js';

	const group = getSelectGroupState();

	let {
		id = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: LabelProps = $props();

	const fallbackId = createId('select-label');

	onMount(() => {
		group.registerLabelId(id ?? fallbackId);
		return () => group.registerLabelId(undefined);
	});
</script>

<div {...rest} bind:this={ref} id={id ?? fallbackId}>
	{@render children?.()}
</div>
