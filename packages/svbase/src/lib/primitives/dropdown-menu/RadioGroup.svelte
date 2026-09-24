<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface RadioGroupProps {
		/** Fired with the next value whenever selection changes. */
		onValueChange?: ((value: string) => void) | undefined;
		/** Initially selected value for uncontrolled usage. */
		defaultValue?: string;
		children?: Snippet;
		/** Selected item value (controlled). */
		value?: string;
	}
</script>

<script lang="ts">
	import { setMenuRadioGroupState } from './radio-context.js';

	let {
		defaultValue = undefined,
		value = $bindable(defaultValue),
		onValueChange = undefined,
		children
	}: RadioGroupProps = $props();

	function select(itemValue: string): void {
		onValueChange?.(itemValue);
		value = itemValue;
	}

	setMenuRadioGroupState({
		get value() {
			return value;
		},
		select
	});
</script>

{@render children?.()}
