<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the content element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
		/** Overrides the generated id (trigger links to it). */
		id?: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { escapeKey } from '../../actions/index.js';
	import { composeHandlers } from '../../utils/compose-handlers.js';

	import { getSelectRootState } from './context.js';

	type ContentKeyboardEvent = Parameters<NonNullable<ContentProps['onkeydown']>>[0];

	const state = getSelectRootState();

	let {
		id = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: ContentProps = $props();

	onMount(() => {
		const effective = id ?? state.defaultContentId;
		state.registerContentId(effective);
		if (state.consumeInitialFocus()) state.focusHighlighted();
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

	function handleKeys(event: ContentKeyboardEvent): void {
		if (state.disabled) return;
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp':
			case 'ArrowLeft':
			case 'ArrowRight':
			case 'Home':
			case 'End':
				event.preventDefault();
				state.moveHighlight(currentValue(), event.key, event.currentTarget as HTMLElement);
				return;
			case 'Enter':
			case ' ':
				event.preventDefault();
				commitHighlighted();
				return;
			case 'Tab':
				state.dismiss();
				return;
		}
		if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey)
			state.typeahead(event.key);
	}

	function currentValue(): string {
		const focused = document.activeElement;
		const current = state.entries.find((item) => item.element === focused);
		return current?.value ?? state.highlightedValue ?? '';
	}

	function commitHighlighted(): void {
		const highlighted = state.highlightedValue;
		if (highlighted === undefined) return;
		const entry = state.entries.find((item) => item.value === highlighted);
		if (!entry || entry.disabled) return;
		state.select(highlighted);
		state.closeMenu();
		state.focusTrigger();
	}

	function handleEscape(): void {
		if (!state.open) return;
		state.closeMenu();
		state.focusTrigger();
	}

	function handleFocusOut(event: FocusEvent): void {
		if (!state.open) return;
		const next = event.relatedTarget;
		if (next instanceof Element && ref?.contains(next) === true) return;
		state.dismiss();
	}
</script>

<!--
	Always mounted (even closed): the item registry must stay live so the
	Value display and closed-trigger keyboard nav keep working. Closed
	hiding is `display: none` (inline, so consumer display rules can't
	accidentally reveal it) plus `hidden` until positioned.
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
	onkeydown={composeHandlers(rest.onkeydown, handleKeys)}
	onfocusout={composeHandlers(rest.onfocusout, handleFocusOut)}
>
	{@render children?.()}
</div>
