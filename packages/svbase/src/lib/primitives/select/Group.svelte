<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface GroupProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the group element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { createId } from '../../utils/id.js';

	import { setSelectGroupState } from './group-context.js';

	let {
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: GroupProps = $props();

	const groupId = createId('select-group');
	let labelId = $state<string | undefined>(undefined);

	setSelectGroupState({
		get groupId() {
			return groupId;
		},
		get labelId() {
			return labelId;
		},
		registerLabelId(id: string | undefined) {
			labelId = id;
		}
	});
</script>

<div {...rest} bind:this={ref} role="group" id={groupId} aria-labelledby={labelId ?? undefined}>
	{@render children?.()}
</div>
