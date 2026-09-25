<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface GroupProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		ref?: HTMLElement | undefined;
	}
</script>

<script lang="ts">
	import { setComboboxGroupState } from './group-context.js';

	let {
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: GroupProps = $props();

	let labelId = $state<string | undefined>(undefined);

	setComboboxGroupState({
		get labelId() {
			return labelId;
		},
		registerLabelId(id: string | undefined) {
			labelId = id;
		}
	});
</script>

<div {...rest} bind:this={ref} role="group" aria-labelledby={labelId}>
	{@render children?.()}
</div>
