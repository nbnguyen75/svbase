<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface TriggerProps extends HTMLButtonAttributes {
		/** Delegated access to the trigger element. */
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

	import { getCollapsibleState } from './context.js';

	type TriggerMouseEvent = Parameters<NonNullable<TriggerProps['onclick']>>[0];

	const state = getCollapsibleState();

	let {
		disabled: disabledProp = false,
		element = 'button',
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: TriggerProps = $props();

	const disabled = $derived(disabledProp || state.disabled);

	function activate(): void {
		state.toggle();
	}
</script>

<Button
	{...rest}
	{element}
	{disabled}
	bind:ref
	aria-expanded={state.open}
	aria-controls={state.open ? state.panelId : undefined}
	data-state={state.open ? 'open' : 'closed'}
	onclick={composeHandlers(rest.onclick, activate)}
>
	{@render children?.()}
</Button>
