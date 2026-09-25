<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RootProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		ref?: HTMLElement | undefined;
		/** Disables every nested Field control. @default false */
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { setFieldsetState } from './context.js';

	let {
		disabled = false,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	setFieldsetState({
		get disabled() {
			return disabled;
		}
	});
</script>

<fieldset {...rest} bind:this={ref} disabled={disabled ? true : undefined}>
	{@render children?.()}
</fieldset>
