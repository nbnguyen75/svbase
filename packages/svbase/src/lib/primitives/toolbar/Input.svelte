<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';

	export interface InputProps extends Omit<
		HTMLInputAttributes,
		'value' | 'defaultValue' | 'children'
	> {
		inputRef?: HTMLInputElement | undefined;
		/** Applied to the input for native `<label for>` association. Falls back to a generated id. */
		id?: string | undefined;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { createId } from '../../utils/id.js';

	import { getToolbarState } from './context.js';

	let {
		id = undefined,
		disabled = false,
		readonly: readOnly = false,
		inputRef = $bindable<HTMLInputElement | undefined>(undefined),
		...rest
	}: InputProps = $props();

	const toolbar = getToolbarState();

	const fallbackId = createId('toolbar-input');
	const disabledEff = $derived(disabled || toolbar.disabled);

	onMount(() => {
		toolbar.register({
			get disabled() {
				return disabledEff;
			},
			focusable: true,
			get element() {
				return inputRef;
			}
		});
		return () => toolbar.unregister(inputRef);
	});
</script>

<!--
	Always tabbable (never roves away): arrow keys belong to caret movement
	here. Neighbors can still move focus INTO the input via roving.
-->
<input
	{...rest}
	bind:this={inputRef}
	id={id ?? fallbackId}
	type="text"
	readonly={readOnly ? true : undefined}
	disabled={disabledEff ? true : undefined}
	tabindex={0}
/>
