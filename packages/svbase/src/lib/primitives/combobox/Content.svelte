<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the content element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
		/** Overrides the generated id (input links to it). */
		id?: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { escapeKey } from '../../actions/index.js';
	import { composeHandlers } from '../../utils/compose-handlers.js';

	import { getComboboxRootState } from './context.js';

	const state = getComboboxRootState();

	let {
		id = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: ContentProps = $props();

	onMount(() => {
		const effective = id ?? state.defaultContentId;
		state.registerContentId(effective);
		return () => state.registerContentId(undefined);
	});

	/**
	 * Element registration lives in an effect (not `onMount`): `bind:this`
	 * into a `$bindable` prop flushes after mount, so only a reactive read
	 * observes it. Writes go to an untracked field — no update loop.
	 */
	$effect(() => {
		state.registerContent(ref);
		return () => state.registerContent(undefined);
	});

	function handleEscape(): void {
		if (!state.open) return;
		if (!state.freeInput) state.revertText();
		state.dismiss();
		state.focusInput();
	}

	function keepInputFocus(event: MouseEvent): void {
		// Prevent the mousedown focus shift: focus must stay in the textbox so
		// the menu is not blurred away before the option click completes.
		event.preventDefault();
	}

	function handleFocusOut(event: FocusEvent): void {
		if (!state.open) return;
		const next = event.relatedTarget;
		if (next instanceof Element && ref?.contains(next) === true) return;
		// Focus returning to the textbox is not a dismissal (it never left).
		const input = ref?.parentElement?.querySelector('input[role="combobox"]');
		if (next === input) return;
		if (!state.freeInput) state.revertText();
		state.dismiss();
	}
</script>

<!--
	Always mounted (even closed): the item registry must stay live so
	filtering, highlight, and the Empty part keep working. Closed hiding is
	`display: none` (inline, so consumer display rules can't accidentally
	reveal it) plus `hidden` until positioned.
-->
<div
	{...rest}
	bind:this={ref}
	id={id ?? state.defaultContentId}
	role="listbox"
	data-state={state.open ? 'open' : undefined}
	data-disabled={state.disabled ? '' : undefined}
	data-placement={state.position.placement}
	hidden={!state.position.positioned}
	style={`${typeof rest.style === 'string' ? rest.style : ''}${state.open ? '' : 'display: none;'}`}
	{@attach state.open && state.position.floating}
	{@attach escapeKey(handleEscape)}
	onmousedown={composeHandlers(rest.onmousedown, keepInputFocus)}
	onfocusout={composeHandlers(rest.onfocusout, handleFocusOut)}
>
	{@render children?.()}
</div>
