<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface CloseProps extends HTMLButtonAttributes {
		/** Delegated access to the close element. */
		ref?: HTMLElement | undefined;
		/** Whether user interaction is ignored (OR-ed with root). @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Underlying element tag, forwarded to Button. @default 'button' */
		element?: string;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { Button } from '../button/index.js';

	import { getDialogState } from './context.js';

	type CloseMouseEvent = Parameters<NonNullable<CloseProps['onclick']>>[0];

	const state = getDialogState();

	let {
		disabled: disabledProp = false,
		element = 'button',
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: CloseProps = $props();

	const disabled = $derived(disabledProp || state.disabled);

	function activate(): void {
		state.closeDialog();
	}
</script>

<Button
	{...rest}
	{element}
	{disabled}
	bind:ref
	data-state={state.open ? 'open' : 'closed'}
	onclick={composeHandlers(rest.onclick, activate)}
>
	{@render children?.()}
</Button>
