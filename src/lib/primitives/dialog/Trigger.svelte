<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface TriggerProps extends HTMLButtonAttributes {
		/** Delegated access to the trigger element (focus returns here). */
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

	type TriggerMouseEvent = Parameters<NonNullable<TriggerProps['onclick']>>[0];

	const state = getDialogState();

	let {
		disabled: disabledProp = false,
		element = 'button',
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: TriggerProps = $props();

	const disabled = $derived(disabledProp || state.disabled);

	/**
	 * Element registration lives in an effect (not `onMount`): `bind:this`
	 * into a `$bindable` prop flushes after mount, so only a reactive read
	 * observes it. Writes go to an untracked field — no update loop.
	 */
	$effect(() => {
		state.registerTrigger(ref);
		return () => state.registerTrigger(undefined);
	});

	function activate(): void {
		state.toggleDialog();
	}
</script>

<Button
	{...rest}
	{element}
	{disabled}
	bind:ref
	aria-haspopup="dialog"
	aria-expanded={state.open}
	aria-controls={state.open ? state.contentId : undefined}
	data-state={state.open ? 'open' : 'closed'}
	onclick={composeHandlers(rest.onclick, activate)}
>
	{@render children?.()}
</Button>
