<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface ActionProps extends HTMLButtonAttributes {
		/** Delegated access to the action element. */
		ref?: HTMLElement | undefined;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { Button } from '../button/index.js';

	let {
		disabled = false,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: ActionProps = $props();
</script>

<Button {...rest} {disabled} bind:ref>
	{@render children?.()}
</Button>
