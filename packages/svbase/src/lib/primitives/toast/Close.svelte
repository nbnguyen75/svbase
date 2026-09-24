<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface CloseProps extends HTMLButtonAttributes {
		/** Delegated access to the close element. */
		ref?: HTMLElement | undefined;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { Button } from '../button/index.js';

	import { getToastRootState } from './root-context.js';

	type CloseMouseEvent = Parameters<NonNullable<CloseProps['onclick']>>[0];

	const state = getToastRootState();

	let {
		disabled = false,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: CloseProps = $props();

	function activate(): void {
		state.closeToast();
	}
</script>

<Button {...rest} {disabled} bind:ref onclick={composeHandlers(rest.onclick, activate)}>
	{@render children?.()}
</Button>
