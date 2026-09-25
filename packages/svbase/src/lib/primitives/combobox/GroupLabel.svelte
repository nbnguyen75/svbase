<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface GroupLabelProps extends HTMLAttributes<HTMLElement> {
		ref?: HTMLElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { createId } from '../../utils/id.js';

	import { getComboboxGroupState } from './group-context.js';

	let {
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: GroupLabelProps = $props();

	const group = getComboboxGroupState();
	const id = createId('combobox-group-label');

	onMount(() => {
		group.registerLabelId(id);
		return () => group.registerLabelId(undefined);
	});
</script>

<div {...rest} bind:this={ref} {id}>
	{@render children?.()}
</div>
